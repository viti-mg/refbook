# Ubiquitous Language

## Competition lifecycle

| Term              | Definition                                                            | Aliases to avoid            |
| ----------------- | --------------------------------------------------------------------- | -------------------------- |
| **Competition**   | A single sporting event or match that a referee manages               | Match, event, game         |
| **Template**      | Configuration file defining sport-specific rules and available actions | Configuration, config file |
| **Card**          | Disciplinary action displayed fullscreen to participants              | Disciplinary card, penalty |
| **Card Type**     | Category of card (yellow, red, blue) defined in templates             | card_type, card category   |
| **Action**        | Any referee action logged during a competition                        | Event, activity, log entry |
| **Action Type**   | Category of action (goal, substitution, false start) defined in templates | action_type, event type    |
| **Disqualification** | Formal action removing a participant from competition              | DQ, removal, elimination   |

## People

| Term         | Definition                                                    | Aliases to avoid        |
| ------------ | ------------------------------------------------------------- | ----------------------- |
| **Referee**  | Primary user who manages competitions and logs actions        | User, official, operator |
| **User**     | Authentication identity in the system (technical context only) | Account, login          |

## Technical domain

| Term              | Definition                                                    | Aliases to avoid           |
| ----------------- | ------------------------------------------------------------- | ------------------------- |
| **API Server**    | Server hosting tRPC router for client-server communication    | Server, backend           |
| **Database**      | Persistent data storage (PostgreSQL server, SQLite/IndexedDB local) | DB, data store          |
| **Sync**          | Process of synchronizing local data with server database       | Synchronization, data sync |
| **Sync Queue**    | Queue storing offline actions for later server synchronization  | Offline queue, action queue |
| **Offline-First** | Architecture where application works without internet connectivity | Offline, offline-capable |

## Development process

| Term            | Definition                                                      | Aliases to avoid                 |
| --------------- | --------------------------------------------------------------- | -------------------------------- |
| **MVP**         | Minimum Viable Product - initial simplified version of application | Initial release, version 1       |
| **PRD**         | Product Requirements Document defining feature requirements    | Requirements doc, specification  |
| **Vertical Slice** | End-to-end implementation cutting through all application layers | Tracer bullet, feature slice     |
| **TDD**         | Test-Driven Development - tests written before implementation    | Test-first development            |

## Relationships

- A **Competition** is created from exactly one **Template**
- A **Competition** has zero or more **Cards**
- A **Competition** has zero or more **Actions**
- A **Card** belongs to exactly one **Competition**
- An **Action** belongs to exactly one **Competition**
- A **Referee** manages zero or more **Competitions**
- A **Template** defines available **Card Types** and **Action Types**
- A **Card** is of exactly one **Card Type**
- An **Action** is of exactly one **Action Type**
- **Cards** and **Actions** are stored in the **Database**
- Offline changes are queued in the **Sync Queue** and processed by **Sync**

## Example dialogue

> **Dev:** "When a **Referee** creates a **Competition**, do they select a **Template** first?"
> 
> **Domain expert:** "Yes. The **Template** defines which **Card Types** and **Action Types** are available. For example, the football **Template** includes yellow and red **Card Types**, while athletics has the same **Card Types** but different **Action Types** like false starts."
> 
> **Dev:** "So if a **Referee** logs a **Card**, does it automatically create an **Action** too?"
> 
> **Domain expert:** "No, they're separate. A **Card** is specifically for disciplinary actions and has fullscreen display requirements. An **Action** is broader - it includes goals, substitutions, and other sport-specific events. However, you can reference a **Card** within an **Action** if needed."
> 
> **Dev:** "What happens if the **Referee** is offline when they create the **Competition**?"
> 
> **Domain expert:** "The **Competition** is stored locally in the **Database** and the creation is added to the **Sync Queue**. When connectivity returns, the **Sync** process replays the queue to the **API Server**. If there are conflicts, the **Referee** resolves them manually."