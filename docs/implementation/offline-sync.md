# Offline Sync Implementation

## Overview

The offline sync system ensures that the RefBook application works seamlessly without internet connectivity while maintaining data consistency when connection is restored.

## Architecture

### Sync Components
- **Local Storage**: SQLite (mobile) or IndexedDB (web)
- **Sync Queue**: Queue for offline actions
- **Sync Engine**: Core synchronization logic
- **Conflict Resolution**: Version-based conflict detection
- **Network Monitor**: Connection status monitoring

### Data Flow
```
User Action → Local Storage → Sync Queue → Network Check
                                                    ↓
                                              Online: Send to API Server
                                              Offline: Queue Action
                                                    ↓
                                              Connection Restored
                                                    ↓
                                              Replay Queue → API Server
                                                    ↓
                                              Conflict Resolution
                                                    ↓
                                              Update Local State
```

## Local Storage Implementation

### Mobile (SQLite)
```typescript
// Database schema mirrors API Server schema
interface LocalDatabase {
  competitions: Competition[];
  cards: Card[];
  disqualifications: Disqualification[];
  appeals: Appeal[];
  sync_queue: SyncQueueItem[];
  last_sync: timestamp;
}

// SQLite operations
const db = await openDatabase({
  name: 'refbook.db',
  location: 'default'
});

// CRUD operations
async function createLocalCard(card: Card) {
  await db.executeSql(
    'INSERT INTO cards (id, competition_id, card_type, ...) VALUES (?, ?, ?, ...)',
    [card.id, card.competition_id, card.card_type, ...]
  );
}
```

### Web (IndexedDB)
```typescript
// IndexedDB setup
const db = await openDB('refbook', 1, {
  upgrade(db) {
    db.createObjectStore('competitions', { keyPath: 'id' });
    db.createObjectStore('cards', { keyPath: 'id' });
    db.createObjectStore('sync_queue', { keyPath: 'id' });
  }
});

// CRUD operations
async function createLocalCard(card: Card) {
  await db.put('cards', card);
}
```

## Sync Queue Implementation

### Queue Structure
```typescript
interface SyncQueueItem {
  id: string;
  action_type: 'create' | 'update' | 'delete';
  entity_type: 'competition' | 'card' | 'disqualification' | 'appeal';
  entity_id: string;
  data: any;
  version: number;
  created_at: Date;
  retry_count: number;
  last_retry: Date;
}
```

### Queue Operations
```typescript
class SyncQueue {
  async enqueue(item: SyncQueueItem) {
    await localDb.put('sync_queue', item);
  }

  async dequeue(): Promise<SyncQueueItem[]> {
    return await localDb.getAll('sync_queue');
  }

  async removeItem(id: string) {
    await localDb.delete('sync_queue', id);
  }

  async updateRetryCount(id: string, count: number) {
    const item = await localDb.get('sync_queue', id);
    item.retry_count = count;
    item.last_retry = new Date();
    await localDb.put('sync_queue', item);
  }
}
```

## Sync Engine

### Sync Strategy
```typescript
class SyncEngine {
  private queue: SyncQueue;
  private networkMonitor: NetworkMonitor;

  async sync() {
    if (!this.networkMonitor.isOnline()) {
      return; // Skip if offline
    }

    const items = await this.queue.dequeue();
    
    for (const item of items) {
      try {
        await this.processItem(item);
        await this.queue.removeItem(item.id);
      } catch (error) {
        await this.handleSyncError(item, error);
      }
    }
  }

  private async processItem(item: SyncQueueItem) {
    switch (item.action_type) {
      case 'create':
        return await this.createOnServer(item);
      case 'update':
        return await this.updateOnServer(item);
      case 'delete':
        return await this.deleteOnServer(item);
    }
  }

  private async createOnServer(item: SyncQueueItem) {
    const result = await trpc[item.entity_type].create.mutate(item.data);
    await this.updateLocalState(item.entity_type, result);
  }

  private async updateOnServer(item: SyncQueueItem) {
    const result = await trpc[item.entity_type].update.mutate({
      id: item.entity_id,
      version: item.version,
      updates: item.data
    });
    await this.updateLocalState(item.entity_type, result);
  }
}
```

## Conflict Resolution

### Optimistic Concurrency
```typescript
async function updateWithConflictResolution(
  entity_type: string,
  id: string,
  version: number,
  updates: any
) {
  try {
    const result = await trpc[entity_type].update.mutate({
      id,
      version,
      updates
    });
    return { success: true, data: result };
  } catch (error) {
    if (error.code === 'CONFLICT') {
      return {
        success: false,
        conflict: {
          serverState: error.current_state,
          clientChanges: updates
        }
      };
    }
    throw error;
  }
}
```

### Conflict Resolution UI
```typescript
function ConflictResolution({ conflict, onResolve }) {
  return (
    <Dialog>
      <DialogContent>
        <h2>Conflict Detected</h2>
        <p>This data was modified by another device</p>
        
        <div className="diff-view">
          <div className="server-state">
            <h3>Server Version</h3>
            <DataView data={conflict.serverState} />
          </div>
          
          <div className="client-changes">
            <h3>Your Changes</h3>
            <DataView data={conflict.clientChanges} />
          </div>
        </div>
        
        <div className="actions">
          <Button onClick={() => onResolve('overwrite')}>
            Overwrite Server
          </Button>
          <Button onClick={() => onResolve('reload')}>
            Reload Server Version
          </Button>
          <Button onClick={() => onResolve('cancel')}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Network Monitoring

### Connection Status
```typescript
class NetworkMonitor {
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private handleOnline() {
    this.isOnline = true;
    this.notifyListeners(true);
    this.triggerSync();
  }

  private handleOffline() {
    this.isOnline = false;
    this.notifyListeners(false);
  }

  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  onStatusChange(callback: (online: boolean) => void) {
    this.listeners.add(callback);
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  private triggerSync() {
    syncEngine.sync();
  }
}
```

## Optimistic UI Updates

### Implementation
```typescript
function useOptimisticUpdate(entity_type: string) {
  const queryClient = useQueryClient();

  const update = async (id: string, updates: any) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries([entity_type]);

    // Snapshot previous value
    const previousData = queryClient.getQueryData([entity_type]);

    // Optimistically update to the new value
    queryClient.setQueryData([entity_type], (old) => ({
      ...old,
      ...updates
    }));

    // Add to sync queue
    await syncQueue.enqueue({
      action_type: 'update',
      entity_type,
      entity_id: id,
      data: updates,
      version: previousData.version
    });

    // Return rollback function
    return () => {
      queryClient.setQueryData([entity_type], previousData);
    };
  };

  return { update };
}
```

## TanStack Pacer Integration

### Batching Operations
```typescript
import { pacer } from '@tanstack/pacer';

const batchedSync = pacer.batch({
  fn: async (items: SyncQueueItem[]) => {
    // Process multiple items in a single batch
    return await Promise.all(
      items.map(item => syncEngine.processItem(item))
    );
  },
  delay: 1000, // Wait 1 second to collect more items
  maxItems: 10 // Maximum 10 items per batch
});

// Use batched sync
async function syncWithBatching() {
  const items = await syncQueue.dequeue();
  if (items.length > 0) {
    await batchedSync(items);
  }
}
```

### Rate Limiting
```typescript
const rateLimitedSync = pacer.throttle({
  fn: syncEngine.sync,
  delay: 5000 // Maximum one sync every 5 seconds
});

// Use rate-limited sync
networkMonitor.onStatusChange((online) => {
  if (online) {
    rateLimitedSync();
  }
});
```

## Offline Indicators

### UI Components
```typescript
function OfflineIndicator() {
  const isOnline = useNetworkStatus();
  const pendingSync = usePendingSyncCount();

  if (isOnline && pendingSync === 0) {
    return null;
  }

  return (
    <div className={`offline-indicator ${isOnline ? 'syncing' : 'offline'}`}>
      {isOnline ? (
        <span>Syncing {pendingSync} items...</span>
      ) : (
        <span>Offline - {pendingSync} items pending sync</span>
      )}
    </div>
  );
}
```

## Error Handling

### Retry Logic
```typescript
class SyncEngine {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async handleSyncError(item: SyncQueueItem, error: Error) {
    item.retry_count++;
    
    if (item.retry_count >= this.maxRetries) {
      // Max retries reached, notify user
      this.notifyUserOfError(item, error);
      return;
    }

    // Exponential backoff
    const delay = this.retryDelay * Math.pow(2, item.retry_count);
    setTimeout(() => {
      this.sync();
    }, delay);

    await this.queue.updateRetryCount(item.id, item.retry_count);
  }

  private notifyUserOfError(item: SyncQueueItem, error: Error) {
    // Show error to user
    toast.error(`Failed to sync ${item.entity_type}: ${error.message}`);
  }
}
```

## Performance Optimization

### Delta Sync
```typescript
async function syncWithDelta() {
  const lastSync = await localDb.get('last_sync');
  
  // Only sync changes since last sync
  const changes = await trpc.sync.getChanges.mutate({
    since: lastSync
  });

  // Apply changes locally
  for (const change of changes) {
    await applyLocalChange(change);
  }

  // Update last sync timestamp
  await localDb.put('last_sync', new Date());
}
```

### Compression
```typescript
async function compressSyncData(data: any) {
  const compressed = pako.deflate(JSON.stringify(data));
  return compressed;
}

async function decompressSyncData(compressed: any) {
  const decompressed = pako.inflate(compressed);
  return JSON.parse(new TextDecoder().decode(decompressed));
}
```

## Testing Strategy

### Unit Tests
- Sync queue operations
- Conflict resolution logic
- Network monitoring
- Optimistic updates

### Integration Tests
- Offline to online transitions
- Sync with API Server
- Conflict resolution scenarios
- Error handling and retry logic

### E2E Tests
- Complete offline workflow
- Sync after connection restoration
- Conflict resolution UI
- Multiple device sync

## Monitoring

### Sync Metrics
- Sync success rate
- Average sync time
- Conflict rate
- Queue size over time

### Logging
- Sync operations logged
- Conflicts logged with details
- Errors logged with stack traces
- Performance metrics logged

## Security Considerations

### Data Security
- Encrypted local storage
- Secure sync endpoints
- Authentication for sync
- Data validation

### Privacy
- Local data privacy
- Secure data transmission
- Compliance with regulations
- User control over data

## Future Enhancements

### Post-MVP Features
- **Background sync**: Background sync on mobile
- **Selective sync**: Choose what to sync
- **Sync scheduling**: Schedule sync for specific times
- **Compression**: Better compression for large datasets
- **Incremental sync**: More efficient delta sync
- **Conflict prediction**: Predict potential conflicts
- **Merge strategies**: Advanced conflict resolution
- **Sync analytics**: Detailed sync analytics
