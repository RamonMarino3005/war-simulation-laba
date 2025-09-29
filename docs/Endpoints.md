# Endpoints API Documentation

# Table of Contents

- [Endpoints API Documentation](#endpoints-api-documentation)
    - [User Endpoints (api/users)](#users-endpoints-apiusers)
    - [Army Endpoints (api/army)](#army-enpoints-apiarmy)
    - [ArmyUnit Endpoints (api/army-units)](#armyunit-endpoints-apiarmyunits)
    - [Battle Endpointsw (api/battles)](#battle-endpoints-apibattles)
    - [Strategy Endpoints (api/strategy)](#strategy-endpoints-apistrategy)
    - [UnitType Endpoints (api/unit-types)](#unittype-endpoints-apiunit-types)

### Users endpoints `(api/users)`

| Method | Endpoint       | Description                               | Successful Response Code | Error Response Code               |
|--------|----------------|-------------------------------------------|--------------------------|-----------------------------------|
| GET    | /users         | Returns a list of all users               | 200                      | 404                               |
| GET    | /users/:id     | Returns details about a specific user     | 200                      | 401 if unauthenticated.  Else 400 |
| POST   | /users         | Creates a new user                        | 201                      | 404                               |
| PUT    | /users/:id     | Updates an existing user                  | 201                      | 400 if incorrect params. Else 404 |
| DELETE | /users/:id     | Deletes an existing user                  | 200                      | 200                               |

### Details
TODO

### Army endpoints `(api/army)`

| Method | Endpoint           | Description                               | Successful Response Code | Error Response Code               |
|--------|--------------------|-------------------------------------------|--------------------------|-----------------------------------|
| GET    | /army              | Returns a list of all armies              | 200                      | 404                               |
| GET    | /army/:id          | Returns details about a specific army     | 200                      | 400 if incorrect params. Else 404 |
| POST   | /army              | Creates a new army                        | 201                      | 404                               |
| PUT    | /army/:id          | Updates an existing army                  | 201                      | 400 if incorrect params. Else 404 |
| GET    | /army/user/:userId | Gets all armies owned by a user           | 200                      | 400 if incorrect params. Else 404 | 
| DELETE | /army/:id          | Deletes an existing army                  | 200                      | 200                               |

### Details
TODO

### ArmyUnit endpoints `(api/army-units)`

| Method | Endpoint                | Description                               | Successful Response Code | Error Response Code               |
|--------|-------------------------|-------------------------------------------|--------------------------|-----------------------------------|
| GET    | /:armyId/units/:unitId  | Returns all units of a type in an Army    | 200                      | 404                               |
| GET    | /:armyId                | Returns all units inside an army          | 200                      | 400 if incorrect params. Else 404 |
| POST   | /armyUnit               | Creates a new armyUnit                    | 201                      | 400 if incorrect params. Else 404 |
| PUT    | /:armyId/update/:unitId | Updates an existing armyUnit              | 201                      | 400 if incorrect params. Else 404 |
| DELETE | /armyUnit/:id           | Deletes an existing armyUnit              | 200                      | 200                               |

### Details
TODO


### Battle endpoints `(api/battles)`

| Method | Endpoint                   | Description                             | Successful Response Code | Error Response Code               |
|--------|----------------------------|-----------------------------------------|--------------------------|-----------------------------------|
| GET    | /battles                   | Returns a list of all battles           | 200                      | 404                               |                               
| GET    | /battles/:battleId         | Returns a specific battle               | 200                      | 400 if incorrect params. Else 404 |
| GET    | /battles/army/:armyId      | Returns all battles of an army          | 200                      | 400 if incorrect params. Else 404 |
| GET    | /battles/report/:battleId  | Returns a report of an specific battle  | 200                      | 400 if incorrect params. Else 404 |
| POST   | /battles                   | Creates a new battle                    | 201                      | 404                               |
| DELETE | /battles/:id               | Deletes an existing battle              | 200                      | 200                               |

### Details
TODO



### Strategy endpoints `(api/strategy)`

| Method | Endpoint       | Description                                | Successful Response Code  | Error Response Code               |
|--------|----------------|--------------------------------------------|---------------------------|-----------------------------------|
| GET    | /strategy      | Returns a list of all strategies           | 200                       | 404                               |
| GET    | /strategy/:id  | Returns details about a specific strategy  | 200                       | 400 if incorrect params. Else 404 |
| POST   | /strategy      | Creates a new strategy                     | 201                       | 404                               |
| PUT    | /strategy/:id  | Updates an existing strategy               | 201                       | 400 if incorrect params. Else 404 |
| DELETE | /strategy/:id  | Deletes an existing strategy               | 200                       | 400 if incorrect params. Else 404 |

### Details
TODO



### UnitTypes endpoints `(api/unit-types)`

| Method | Endpoint                       | Description                                | Successful Response Code | Error Response Code               |
|--------|--------------------------------|--------------------------------------------|--------------------------|-----------------------------------|
| GET    | /unit-types                    | Returns a list of all unit-types           | 200                      | 404                               |
| GET    | /unit-types/:id                | Returns details about a specific unit-type | 200                      | 400 if incorrect params. Else 404 |
| GET    | /unit-types/effectiveness      | Returns all effectiveness relsationships   | 201                      | 404                               |
| GET    | /unit-types/effectiveness/:id  | Returns a unit-type's effectiveness rels.  | 201                      | 400 if incorrect params. Else 404 |
| PUT    | /unit-types/effectiveness/:id  | Updates a unit-type's effectiveness rels.  | 201                      | 400 if incorrect params. Else 404 |
| POST   | /unit-types                    | Creates a new unit-type                    | 201                      | 404                               |
| PUT    | /unit-types/:id                | Updates a unit-type                        | 201                      | 400 if incorrect params. Else 404 |
| DELETE | /unit-types/:id                | Deletes an existing unit-type              | 200                      | 200                               |

### Details
TODO

