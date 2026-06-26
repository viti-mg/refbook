# Database Approach

## Database Strategy

### Primary Database: PostgreSQL
- **Self-hosted** on VPS with Dockploy
- **Full control** over database configuration and optimization
- **Mature ecosystem** with excellent tooling support
- **ACID compliance** for data integrity
- **Scalability** for future growth

### Local Databases
- **Mobile**: SQLite for offline storage
- **Web**: IndexedDB for offline storage
- **Sync engine** handles local ↔ server synchronization

## Database Design Principles

### 1. Multi-Sport Flexibility
- **Template-driven schema**: Core schema supports multiple sports
- **Extensible design**: Easy to add new sports and features
- **Configuration over code**: Sport-specific rules in templates

### 2. Audit Trail
- **Comprehensive logging**: All actions logged with timestamps
- **User attribution**: Track who performed each action
- **Version tracking**: Support for optimistic concurrency

### 3. Data Integrity
- **Foreign key constraints**: Maintain referential integrity
- **Transaction support**: Complex operations in transactions
- **Validation**: Database-level and application-level validation

### 4. Performance
- **Strategic indexing**: Optimize query performance
- **Connection pooling**: Efficient database connections
- **Query optimization**: Efficient data access patterns

## Schema Management

### Drizzle ORM
- **Type-safe**: Full TypeScript support
- **Schema definition**: Declarative schema definitions
- **Migrations**: Built-in migration system
- **Query builder**: Intuitive query syntax

### Migration Strategy
- **Version control**: Migrations tracked in git
- **Automated**: Migrations run as part of deployment
- **Rollback support**: Ability to rollback migrations
- **Data preservation**: Migrations preserve existing data

### Seeding
- **Development data**: Seed data for development
- **Test data**: Seed data for testing
- **Template data**: Default sport templates
- **Demo data**: Demo data for showcasing

## Database Tables

### Better Auth Tables (Managed by Better Auth)
- **users**: User accounts and profiles
- **sessions**: User sessions and tokens
- **accounts**: Linked accounts (OAuth, etc.)
- **verification_tokens**: Email verification tokens

### Application Tables (Custom Schema)
- **organizations**: Organization management
- **organization_members**: Organization membership
- **competitions**: Competitions
- **competition_templates**: Sport templates
- **cards**: Cards given during competitions
- **disqualifications**: Player disqualifications
- **appeals**: Protests and appeals
- **audit_log**: Action audit trail
- **sync_queue**: Offline sync queue (server-side)

## Relationship Design

### Core Relationships
- **Users → Organizations**: Many-to-many through organization_members
- **Organizations → Competitions**: One-to-many
- **Competitions → Cards**: One-to-many
- **Competitions → Disqualifications**: One-to-many
- **Competitions → Appeals**: One-to-many
- **Users → Audit Log**: One-to-many (who performed actions)

### Template Relationships
- **Competition Templates → Competitions**: One-to-many
- **Competition Templates → Template Settings**: One-to-many

## Data Consistency

### Transaction Management
- **Complex operations**: Multiple related operations in transactions
- **Error handling**: Rollback on errors
- **Isolation**: Appropriate isolation levels

### Conflict Resolution
- **Optimistic concurrency**: Version-based conflict detection
- **Conflict logging**: Track conflicts for analysis
- **User resolution**: User chooses conflict resolution

### Data Validation
- **Database constraints**: NOT NULL, UNIQUE, CHECK constraints
- **Foreign keys**: Referential integrity
- **Application validation**: Zod schemas for runtime validation

## Performance Optimization

### Indexing Strategy
- **Primary keys**: All tables have primary keys
- **Foreign keys**: Foreign keys indexed
- **Query optimization**: Indexes for common query patterns
- **Composite indexes**: For multi-column queries

### Query Optimization
- **Efficient queries**: Optimized query patterns
- **Batch operations**: Batch inserts and updates
- **Connection pooling**: Efficient connection management
- **Query caching**: Cache frequently accessed data

### Data Archival
- **Old data**: Archive old competition data
- **Audit logs**: Archive old audit logs
- **Performance**: Maintain performance with large datasets

## Backup and Recovery

### Backup Strategy
- **Regular backups**: Automated daily backups
- **Point-in-time recovery**: PITR capability
- **Backup testing**: Regular backup restoration testing
- **Off-site storage**: Backup copies stored off-site

### Recovery Procedures
- **Documented procedures**: Clear recovery procedures
- **Testing**: Regular recovery testing
- **RTO/RPO**: Defined recovery objectives
- **Monitoring**: Backup monitoring and alerting

## Security

### Data Security
- **Encryption**: Data encrypted at rest and in transit
- **Access control**: Database access controls
- **Audit logging**: Database access logging
- **Regular updates**: Regular security updates

### Connection Security
- **SSL/TLS**: Encrypted database connections
- **Connection limits**: Rate limiting and connection limits
- **IP whitelisting**: Database access from trusted IPs only
- **Authentication**: Strong database authentication

## Monitoring

### Performance Monitoring
- **Query performance**: Monitor slow queries
- **Connection pool**: Monitor connection pool usage
- **Database size**: Monitor database growth
- **Index usage**: Monitor index effectiveness

### Health Monitoring
- **Database uptime**: Monitor database availability
- **Replication lag**: Monitor replication lag (if used)
- **Disk space**: Monitor disk space usage
- **Memory usage**: Monitor memory usage

## Future Considerations

### Scaling
- **Read replicas**: Add read replicas for scaling reads
- **Sharding**: Consider sharding for very large datasets
- **Connection pooling**: Advanced connection pooling
- **Caching**: Add caching layer (Redis)

### Advanced Features
- **Full-text search**: PostgreSQL full-text search
- **JSON columns**: Use JSON columns for flexible data
- **Partitioning**: Table partitioning for large tables
- **Materialized views**: Materialized views for complex queries
