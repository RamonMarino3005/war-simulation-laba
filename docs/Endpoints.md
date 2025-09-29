# Endpoints API Documentation

# Table of Contents

- [Endpoints API Documentation](#endpoints-api-documentation)
    - [User Endpoints (api/users)](#users-endpoints-apiusers)
    - [Army Endpoints (api/army)](#army-endpoints-apiarmy)
    - [ArmyUnit Endpoints (api/army-units)](#armyunit-endpoints-apiarmy-units)
    - [Battle Endpoints (api/battles)](#battle-endpoints-apibattles)
    - [Strategy Endpoints (api/strategy)](#strategy-endpoints-apistrategy)
    - [UnitType Endpoints (api/unit-types)](#unittypes-endpoints-apiunit-types)

### Users endpoints `(api/users)`

| Method | Endpoint       | Description                               | Successful Response Code | Error Response Code               |   Admin Only   |
|--------|----------------|-------------------------------------------|--------------------------|-----------------------------------|----------------|
| GET    | /users         | Returns a list of all users               | 200                      | 404                               |      Yes       |
| GET    | /users/:id     | Returns details about a specific user     | 200                      | 401 if unauthenticated.  Else 400 |      No        |
| DELETE | /users/:id     | Deletes an existing user                  | 200                      | 200                               |      Yes       |
<br>

## Detailed User Endpoints
<br>

// Returns all users
### GET api/users (ADMIN only)
 
**Request**
```
localhost:3000/api/users   
Authorization: Bearer ...
```
**Response Body**
```json
[
  {
    "user_id": "30f0c967-469e-47ad-b367-aafcd525babc",
    "username": "root_admin",
    "email": "admin@war-simulation.com",
    "role": "admin"
  },
  {
    "user_id": "bfab74a4-54d7-4e1c-accb-3268c5438eec",
    "username": "RamonMarino",
    "email": "ramonmarino@outlook.com",
    "role": "user"
  }
]
```
<br>
<br>

// GET user by ID. Access: ADMIN + User itself
### GET api/users/:id

**Request**
```
api/users/30f0c967-469e-47ad-b367-aafcd525babc
Authorization: Bearer ...
```

**Response Body**
```json
{
  "user_id": "30f0c967-469e-47ad-b367-aafcd525babc",
  "username": "root_admin",
  "email": "admin@war-simulation.com",
  "role": "admin"
}
```
<br>
<br>

// Create new user. (register)
### POST api/users

**Request**
```
localhost:3000/api/users
Authorization: Bearer ...
```

```json
{
    "username": "TestUser",
    "email": "test@example.com",
    "password": "12345678"
}
```

**Response Body**

```json
{
  "user_id": "c60ecc83-e045-47d7-aeb0-eb669afa6c43",
  "username": "TestUser",
  "email": "test@example.com",
  "role": "user"
}
```
<br>
<br>

// DELETE user
### DELETE api/users/:id (ADMIN only)

**Request**
```
localhost:3000/api/users/c60ecc83-e045-47d7-aeb0-eb669afa6c43`
Authorization: Bearer ...
```

**Response Body**

```json
{
  "status": "success",
  "message":" User deleted successfully"
}
```

### Army endpoints `(api/army)`

| Method | Endpoint           | Description                               | Successful Response Code | Error Response Code               |   Admin Only    |
|--------|--------------------|-------------------------------------------|--------------------------|-----------------------------------|-----------------|
| GET    | /army              | Returns a list of all armies              | 200                      | 404                               |       No        |
| GET    | /army/:id          | Returns details about a specific army     | 200                      | 400 if incorrect params. Else 404 |       No        |
| POST   | /army              | Creates a new army                        | 201                      | 404                               |       No        |
| PUT    | /army/:id          | Updates an existing army                  | 201                      | 400 if incorrect params. Else 404 |       No        |
| GET    | /army/user/:userId | Gets all armies owned by a user           | 200                      | 400 if incorrect params. Else 404 |       No        |
| DELETE | /army/:id          | Deletes an existing army                  | 200                      | 200                               |       No        |

## Detailed Army Endpoints
<br>
<br>

// GET all armies
### GET api/army

**Request**
```
localhost:3000/api/army
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": "20c5755d-d2b5-458e-85c1-3afd1ad6215e",
    "name": "Test's Army",
    "resources": 20000,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  },
  {
    "id": "cd32e523-f21a-446e-b608-c5428db23786",
    "name": "Test's Second Army",
    "resources": 18450,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  },
  {
    "id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "name": "Test's Third Army",
    "resources": 6650,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  }
]
```
<br>
<br>

// GET army by ID
### GET api/army/:armyId

**Request**
```
localhost:3000/api/army/1ab59607-3ea1-461c-821b-c6bf9b150c28
Authorization: Bearer ...
```
Request Body: 
```json
{
  "id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "name": "Test's Third Army",
  "resources": 6650,
  "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
}
```
<br>
<br>

// GET all armies owned by a user.
### GET api/army/user/:userId

**Request**
```
localhost:3000/api/army/user/30f0c967-469e-47ad-b367-aafcd525babc`
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": "cd32e523-f21a-446e-b608-c5428db23786",
    "name": "Test's Second Army",
    "resources": 18450,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  },
  {
    "id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "name": "Test's First Army",
    "resources": 6650,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  },
  {
    "id": "20c5755d-d2b5-458e-85c1-3afd1ad6215e",
    "name": "test's updated",
    "resources": 40000,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  },
  {
    "id": "47a945da-49b1-4cd3-955a-4cdd1551f623",
    "name": "Test's Final Army",
    "resources": 20000,
    "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
  }
]
```
<br>
<br>

// UPDATE army by ID
### PUT api/army/:armyId

**Request**
```
localhost:3000/api/army/1ab59607-3ea1-461c-821b-c6bf9b150c28`
Authorization: Bearer ...
```

Request Body:
```json
{
    "name": "Test's updated",
    "resources": 40000
}
```

**Response Body**
```json
{
  "id": "20c5755d-d2b5-458e-85c1-3afd1ad6215e",
  "name": "Test's updated",
  "resources": 40000,
  "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
}
```
<br>
<br>

// CREATE new army
### POST api/army

**Request**
```
localhost:3000/api/army
Authorization: Bearer ...
```
Request Body:
```json
{
    "name": "Test's Final Army"
}
```
**Response Body**
```
{
  "id": "5558f06e-051b-4ef1-808c-2df512b38405",
  "name": "Test's Final Army",
  "resources": 20000,
  "owner_id": "30f0c967-469e-47ad-b367-aafcd525babc"
}
```
<br>
<br>

// DELETE army
### DELETE api/army/:armyId

**Request**
```
localhost:3000/api/army/1ab59607-3ea1-461c-821b-c6bf9b150c28
Authorization: Bearer ...
```

**Response Body**
```json
{
  "status": "success",
  "message":" Army deleted successfully"
}
```

<br>
<br>

### ArmyUnit endpoints `(api/army-units)`

| Method | Endpoint                | Description                               | Successful Response Code | Error Response Code               |   Admin Only   |
|--------|-------------------------|-------------------------------------------|--------------------------|-----------------------------------|----------------|
| GET    | /:armyId/units/:unitId  | Returns all units of a type in an Army    | 200                      | 404                               |      No        |
| GET    | /:armyId                | Returns all units inside an army          | 200                      | 400 if incorrect params. Else 404 |      No        |
| POST   | /armyUnit               | Creates a new armyUnit                    | 201                      | 400 if incorrect params. Else 404 |      Yes       |
| PUT    | /:armyId/update/:unitId | Updates an existing armyUnit              | 201                      | 400 if incorrect params. Else 404 |      Yes       |
| DELETE | /armyUnit/:id           | Deletes an existing armyUnit              | 200                      | 200                               |      Yes       |
<br>

## Detailed ArmyUnit Endpoints
<br>

// GET all units in an army
### GET api/army-units/:armyId
**Request**

```
localhost:3000/api/army-units/1ab59607-3ea1-461c-821b-c6bf9b150c28
Authorization: Bearer ...
```

**Response Body**
```json
{
  "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "units": [
    {
      "unit_type_id": 3,
      "quantity": 50,
      "type": "tank",
      "base_health": 200,
      "strength": 30,
      "defense": 20,
      "cost": 300
    },
    {
      "unit_type_id": 1,
      "quantity": 30,
      "type": "infantry",
      "base_health": 100,
      "strength": 10,
      "defense": 70,
      "cost": 100
    }
  ]
}
```
<br>
<br>

// GET single unit information from an army
### GET api/army-units/:armyId/units/:unitId
**Request**
```
localhost:3000/api/army-units/1ab59607-3ea1-461c-821b-c6bf9b150c28/units/1
Authorization: Bearer ...
```

**Response Body**
```json
{
  "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "unit": {
    "unit_type_id": 1,
    "quantity": 30,
    "type": "infantry",
    "base_health": 100,
    "strength": 10,
    "defense": 70,
    "cost": 100
  }
}
```
<br>
<br>

// UPDATE unit data inside an army (quantity field only)
### PUT api/army-units/:armyId/update/:unitId
**Request**
```
localhost:3000/api/army-units/1ab59607-3ea1-461c-821b-c6bf9b150c28/update/1
Authorization: Bearer ...
```
Request Body:
```json
{
    "quantity": 10 // Increase By
}
```

**Response Body**
```json
{
  "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "unit_type_id": 1,
  "quantity": 20
}
```
<br>
<br>

// ADD unit to army. If already exists, add more units
### POST api/army-units/:armyId

**Request**
```
localhost:3000/api/army-units/1ab59607-3ea1-461c-821b-c6bf9b150c28
Authorization: Bearer ...
```

Request Body:
```json
#optional. default quantity: 1
{
    "quantity": 10 
}
```

**Response Body**
```json
{
  "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "unit_type_id": 3,
  "quantity": 10 // Or more, if unit already existed in army.
}
```
<br>
<br>

// DELETE all units of a type from the army
### DELETE api/army-unit/:armyId/remove-unit/:unitId
**Request**

```
localhost:3000/api/army-unit/1ab59607-3ea1-461c-821b-c6bf9b150c28/remove-unit/1
Authorization: Bearer ...
```

**Response Body**
```
// Deleted entry
{
  "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
  "unit_type_id": 3,
  "quantity": 80
}
```

<br>
<br>

### Battle endpoints `(api/battles)`

| Method | Endpoint                   | Description                             | Successful Response Code | Error Response Code               |   Admin Only   |
|--------|----------------------------|-----------------------------------------|--------------------------|-----------------------------------|----------------|
| GET    | /battles                   | Returns a list of all battles           | 200                      | 404                               |      No        |  
| GET    | /battles/:battleId         | Returns a specific battle               | 200                      | 400 if incorrect params. Else 404 |      No        |
| GET    | /battles/army/:armyId      | Returns all battles of an army          | 200                      | 400 if incorrect params. Else 404 |      No        |
| GET    | /battles/report/:battleId  | Returns a report of an specific battle  | 200                      | 400 if incorrect params. Else 404 |      No        |
| POST   | /battles                   | Creates a new battle                    | 201                      | 404                               |      No        |
| DELETE | /battles/:id               | Deletes an existing battle              | 200                      | 200                               |      Yes       |
<br>

## Detailed battle Endpoints
<br>

// GET all battles
### GET api/battles

**Request**

```
localhost:3000/api/battles
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": "1a343459-b9c2-4fdb-8897-14484a11061c",
    "date": "2025-09-29T00:00:00.000Z",
    "location": "Buenos Aires"
  },
  {
    "id": "7acd50e8-d6a2-4cd4-ad55-9cef0d8656fb",
    "date": "2025-09-29T00:00:00.000Z",
    "location": "Buenos Aires"
  }
]
```
<br>
<br>

// GET battle by ID
### GET api/battles/:battleId

**Request**
```
localhost:3000/api/users/30f0c967-469e-47ad-b367-aafcd525babc
Authorization: Bearer ...
```

**Response Body**
```json
{
  "id": "1a343459-b9c2-4fdb-8897-14484a11061c",
  "date": "2025-09-29T00:00:00.000Z",
  "location": "Buenos Aires"
}
```
<br>
<br>

// GET battle report of a specified battle
### GET api/battles/report/:battleId

**Request**
```
localhost:3000/api/battles/report/1a343459-b9c2-4fdb-8897-14484a11061c
Authorization: Bearer ...
```

**Response Body**
```json
{
  "battleId": "1a343459-b9c2-4fdb-8897-14484a11061c",
  "date": "2025-09-29T00:00:00.000Z",
  "location": "Buenos Aires",
  "winner": {
    "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "name": "Ramon's Third Army",
    "role": "defender"
  },
  "armies": [
    {
      "army_id": "cd32e523-f21a-446e-b608-c5428db23786",
      "name": "Ramon's Second Army",
      "army_owner": "root_admin",
      "strategy": "Balanced",
      "starting_strength": 400,
      "final_strength": 0,
      "casualties": 40,
      "role": "attacker",
      "outcome": "lost"
    },
    {
      "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
      "name": "Ramon's Third Army",
      "army_owner": "root_admin",
      "strategy": "Balanced",
      "starting_strength": 1800,
      "final_strength": 1770,
      "casualties": 1,
      "role": "defender",
      "outcome": "won"
    }
  ]
}
```
<br>
<br>

// GET all battles of an army 
### GET api/battles/army/:armyId

**Request**
```
localhost:3000/api/battles/army/cd32e523-f21a-446e-b608-c5428db23786
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": "1a343459-b9c2-4fdb-8897-14484a11061c",
    "date": "2025-09-29T00:00:00.000Z",
    "location": "Buenos Aires",
    "battle_id": "1a343459-b9c2-4fdb-8897-14484a11061c",
    "army_id": "cd32e523-f21a-446e-b608-c5428db23786",
    "strategy_id": 3,
    "role": "attacker",
    "outcome": "lost",
    "starting_strength": 400,
    "final_strength": 0,
    "casualties": 40
  },
  {
    "id": "7acd50e8-d6a2-4cd4-ad55-9cef0d8656fb",
    "date": "2025-09-29T00:00:00.000Z",
    "location": "Buenos Aires",
    "battle_id": "7acd50e8-d6a2-4cd4-ad55-9cef0d8656fb",
    "army_id": "cd32e523-f21a-446e-b608-c5428db23786",
    "strategy_id": 3,
    "role": "attacker",
    "outcome": "lost",
    "starting_strength": 400,
    "final_strength": 0,
    "casualties": 40
  }
]
```
<br>
<br>

// Start Battle
### POST api/battles

**Request**
```
localhost:3000/api/battles
Authorization: Bearer ...
```
Request Body:
```json
{
    "attackerArmyId": "cd32e523-f21a-446e-b608-c5428db23786",
    "defenderArmyId": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "location": "Buenos Aires",
    "attackerStrategy": 3,
    "defenderStrategy": 3
}
```

// Returns Battle Report
**Response Body**

```json

  "battleId": "1a343459-b9c2-4fdb-8897-14484a11061c",
  "date": "2025-09-29T00:00:00.000Z",
  "location": "Buenos Aires",
  "winner": {
    "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "name": "Ramon's Third Army",
    "role": "defender"
  },
  "attackerStats": {
    "casualties": 40,
    "starting_strength": 400,
    "final_strength": 0,
    "army_id": "cd32e523-f21a-446e-b608-c5428db23786",
    "name": "Ramon's Second Army"
  },
  "defenderStats": {
    "casualties": 1,
    "starting_strength": 1800,
    "final_strength": 1770,
    "army_id": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
    "name": "Ramon's Third Army"
  },
  "total_rounds": 3,
  "rounds": [
    {
      "round": 1,
      "actions": [
        {
          "attackerArmyId": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
          "defenderArmyId": "cd32e523-f21a-446e-b608-c5428db23786",
          "unitType": "tank",
          "targetType": "infantry",
          "damage": 2700,
          "casualties": 15
        }
      ]
    },
    {
      "round": 2,
      "actions": [
        {
          "attackerArmyId": "cd32e523-f21a-446e-b608-c5428db23786",
          "defenderArmyId": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
          "unitType": "infantry",
          "targetType": "tank",
          "damage": 125,
          "casualties": 1
        },
        {
          "attackerArmyId": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
          "defenderArmyId": "cd32e523-f21a-446e-b608-c5428db23786",
          "unitType": "tank",
          "targetType": "infantry",
          "damage": 2655,
          "casualties": 16
        }
      ]
    },
    {
      "round": 3,
      "actions": [
        {
          "attackerArmyId": "1ab59607-3ea1-461c-821b-c6bf9b150c28",
          "defenderArmyId": "cd32e523-f21a-446e-b608-c5428db23786",
          "unitType": "tank",
          "targetType": "infantry",
          "damage": 2655,
          "casualties": 9
        }
      ]
    }
  ]
}
```

<br>
<br>

// DELETE Battle
### DELETE api/battles/:battleId (ADMIN only)

**Request**  
```
localhost:3000/api/battles/7acd50e8-d6a2-4cd4-ad55-9cef0d8656fb
Authorization: Bearer ...
```

**Response Body**
> ```json
> {
>   status: 'success',
>   message:" Battle deleted successfully"
> }
> ```
<br>
<br>



### Strategy endpoints `(api/strategy)`

| Method | Endpoint       | Description                                | Successful Response Code  | Error Response Code               |   Admin Only   |
|--------|----------------|--------------------------------------------|---------------------------|-----------------------------------|----------------|
| GET    | /strategy      | Returns a list of all strategies           | 200                       | 404                               |      No        |
| GET    | /strategy/:id  | Returns details about a specific strategy  | 200                       | 400 if incorrect params. Else 404 |      No        |
| POST   | /strategy      | Creates a new strategy                     | 201                       | 404                               |      Yes       |
| PUT    | /strategy/:id  | Updates an existing strategy               | 201                       | 400 if incorrect params. Else 404 |      Yes       |
| DELETE | /strategy/:id  | Deletes an existing strategy               | 200                       | 400 if incorrect params. Else 404 |      Yes       |
<br>

## Detailed Strategy Endpoints
<br>

// Get all strategies
### GET api/strategy

**Request**  

```
localhost:3000/api/strategy
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": 1,
    "name": "Aggressive",
    "offensive_bonus": 1.5,
    "defensive_bonus": 0.5
  },
  {
    "id": 2,
    "name": "Defensive",
    "offensive_bonus": 0.5,
    "defensive_bonus": 1.5
  },
  {
    "id": 3,
    "name": "Balanced",
    "offensive_bonus": 1,
    "defensive_bonus": 1
  },
  {
    "id": 4,
    "name": "Guerilla Tactics",
    "offensive_bonus": 1.2,
    "defensive_bonus": 0.8
  },
  {
    "id": 5,
    "name": "Blitzkrieg",
    "offensive_bonus": 1.3,
    "defensive_bonus": 0.7
  }
]
```
<br>
<br>

### GET api/strategy/:strategyId

**Request**
```
localhost:3000/api/strategy/3
Authorization: Bearer ...
```

**Response Body**
```json
  {
    "id": 3,
    "name": "Balanced",
    "offensive_bonus": 1,
    "defensive_bonus": 1
  }
```
<br>
<br>

// Create new strategy
### POST api/strategy (ADMIN only)

**Request**
```
localhost:3000/api/strategy
Authorization: Bearer ...
```
Request Body:
```json
{
    "name": "Custom Strategy 2",
    "offensive_bonus": 1.3,
    "defensive_bonus": 0.9
}
```

**Response Body**

```json
{
  "id": 47,
  "name": "Custom Strategy 2",
  "offensive_bonus": 1.3,
  "defensive_bonus": 0.9
}
```
<br>
<br>

// Update strategy
### PUT api/strategy/:strategyId (ADMIN only)

**Request**
```
localhost:3000/api/strategy/4
Authorization: Bearer ...
```
Request Body:
```json
{
    "name": "Updated Strategy"
}
```

**Response Body**

```json
{
  "id": 4,
  "name": "Updated Strategy",
  "offensive_bonus": 1.2,
  "defensive_bonus": 0.8
}
```
<br>
<br>

// Delete strategy
### DELETE api/strategy/:strategyId (ADMIN only)

**Request**
```
localhost:3000/api/strategy/47
Authorization: Bearer ...
```

**Response Body**
```json
{
  "status": "success",
  "message": "Strategy deleted successfully"
}
```
<br>
<br>



### UnitTypes endpoints `(api/unit-types)`

| Method | Endpoint                       | Description                                | Successful Response Code | Error Response Code               |Admin Only |
|--------|--------------------------------|--------------------------------------------|--------------------------|-----------------------------------|-----------|
| GET    | /unit-types                    | Returns a list of all unit-types           | 200                      | 404                               |    No     |
| GET    | /unit-types/:id                | Returns details about a specific unit-type | 200                      | 400 if incorrect params. Else 404 |    No     |
| GET    | /unit-types/effectiveness      | Returns all effectiveness relsationships   | 201                      | 404                               |    No     |
| GET    | /unit-types/effectiveness/:id  | Returns a unit-type's effectiveness rels.  | 201                      | 400 if incorrect params. Else 404 |    No     |
| PUT    | /unit-types/effectiveness/:id  | Updates a unit-type's effectiveness rels.  | 201                      | 400 if incorrect params. Else 404 |    Yes    |
| POST   | /unit-types                    | Creates a new unit-type                    | 201                      | 404                               |    Yes    |
| PUT    | /unit-types/:id                | Updates a unit-type                        | 201                      | 400 if incorrect params. Else 404 |    Yes    |
| DELETE | /unit-types/:id                | Deletes an existing unit-type              | 200                      | 200                               |    Yes    |
<br>

## Detailed UnitType Endpoints
<br>

### GET api/unit-types
**Request**

```
localhost:3000/api/unit-types
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "id": 2,
    "type": "artillery",
    "base_health": 80,
    "strength": 20,
    "defense": 3,
    "cost": 100
  },
  {
    "id": 3,
    "type": "tank",
    "base_health": 200,
    "strength": 30,
    "defense": 20,
    "cost": 300
  },
  {
    "id": 1,
    "type": "infantry",
    "base_health": 100,
    "strength": 10,
    "defense": 70,
    "cost": 100
  }
]
```
<br>
<br>

### GET api/unit-types/:unitId
**Request**
```
localhost:3000/api/army-units/2
Authorization: Bearer ...
```

**Response Body**
```json
  {
    "id": 2,
    "type": "artillery",
    "base_health": 80,
    "strength": 20,
    "defense": 3,
    "cost": 100
  }
```
<br>
<br>

### GET api/unit-types/effectiveness

**Request**
```
localhost:3000/api/unit-types/effectiveness
Authorization: Bearer ...
```

**Response Body**
```json
[
  {
    "attacker_unit_id": 1,
    "defender_unit_id": 1,
    "modifier": 1
  },
  {
    "attacker_unit_id": 1,
    "defender_unit_id": 2,
    "modifier": 0.7
  },
  {
    "attacker_unit_id": 1,
    "defender_unit_id": 3,
    "modifier": 0.5
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 1,
    "modifier": 1.2
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 2,
    "modifier": 1
  },
  {
    "attacker_unit_id": 3,
    "defender_unit_id": 1,
    "modifier": 1.5
  },
  {
    "attacker_unit_id": 3,
    "defender_unit_id": 3,
    "modifier": 1
  },
  {
    "attacker_unit_id": 3,
    "defender_unit_id": 2,
    "modifier": 0.17
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 3,
    "modifier": 0.27
  }
]
```
<br>
<br>

### GET api/unit-types/effectiveness/:unitId

**Request**  
```
localhost:3000/api/unit-types/effectiveness/2
Authorization: Bearer ...
```
  
**Response Body**

```json
[
  {
    "attacker_unit_id": 1,
    "defender_unit_id": 2,
    "modifier": 0.7
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 1,
    "modifier": 1.2
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 2,
    "modifier": 1
  },
  {
    "attacker_unit_id": 2,
    "defender_unit_id": 3,
    "modifier": 0.27
  },
  {
    "attacker_unit_id": 3,
    "defender_unit_id": 2,
    "modifier": 0.17
  }
]
```

<br>
<br>

### PUT api/unit-types/effectiveness/:unitId (ADMIN only)
**Request**
```
localhost:3000/api/unit-types/effectiveness/2
Authorization: Bearer ...
```

Request Body:
```json
[{
        "against": "artillery",
        "attacker_modifier": 0.17,
        "defender_modifier": 0.27
}]
```

**Response Body**
```json
{
  "message": "Effectiveness updated successfully"
}
```
<br>
<br>


### PUT api/unit-types/:unitId (ADMIN only)
**Request**  
```
localhost:3000/api/unit-types
Authorization: Bearer ...
```
Request Body:
```json
{
    "type": "infantry",
    "defense": 70,
    "cost": 100
}
```

**Response Body**
```json
{
  "id": 1,
  "type": "infantry",
  "base_health": 100,
  "strength": 10,
  "defense": 70,
  "cost": 100
}
```
<br>
<br>

### POST api/unit-types (ADMIN only)
**Request**

```
localhost:3000/api/unit-types
Authorization: Bearer ...
```

Request Body:
```json
{
    "type": "Misil 2",
    "base_health": 150,
    "strength": 50,
    "defense": 30,
    "cost": 100,
    "wrong_field": "test",
    "effectiveness": [
        {
            "against": "infantry",
            "attacker_modifier": 1.2,
            "defender_modifier": 0.8
        },
        {
            "against": "tank",
            "attacker_modifier": 0.5,
            "defender_modifier": 1.5
        }
    ]
}
```
**Response Body**
```json
{
  "id": 26,
  "type": "Misil 2",
  "base_health": 150,
  "strength": 50,
  "defense": 30,
  "cost": 100
}
```
<br>
<br>

### DELETE api/unit-type/:unitId (ADMIN only)

**Request**
```
localhost:3000/api/army/1
Authorization: Bearer ...
```

**Response Body**
```json
{
  "status": "success",
  "message":" UnitType deleted successfully"
}
```


