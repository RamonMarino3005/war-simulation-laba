# WarSim

## Table of contents

- [**Overview**](#overview)
- [**Manual Setup**](#manual-setup)
- [**Docker Setup**](#docker-setup)

## Overview

This API is part of the LABA internship from Solvd.

**WarSim** is a battle simulation game where players can build armies and clash in combat.
Players command armies composed of soldiers and weaponry, each with unique attributes and capabilities.

The simulation determines the outcome of battles based on:

- Troop Strength – The number of soldiers and their combat experience.
- Weapon Effectiveness – Damage, range, and special properties of the arsenal.
- Strategic Decisions – Formations, tactics, and adaptive maneuvers during battle.

This API provides all the endpoints necessary to manage, control, and analyze large-scale virtual warfare, such as:

- Create and manage armies, soldiers, and weaponry.
- Configure combat parameters and strategies.
- Simulate battles and retrieve detailed results.

ERD Diagram:
![ERD DIAGRAM](./docs/ERD_warSim.png)

## Setup
## Docker Setup

This project uses **Docker** and **Docker Compose** to run both the PostgreSQL database, Redis and the Node.js application.

### 1. Prerequisites

Make sure the following are installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

### 2. Environment Variables

The application requires certain environment variables to run. You are not required to provide them, as these are set for you directly in `docker-compose.yml`. However, it is recommended for security.

```yaml
# Database service
POSTGRES_USER: warsimuser
POSTGRES_PASSWORD: mypassword
POSTGRES_DB: warsimapp

# App service
DB_USER: warsimuser
DB_PASSWORD: mypassword
DB_NAME: warsimapp
DB_HOST: db
DB_PORT: 5432
ADMIN_EMAIL: admin@war-simulation.com
ADMIN_PASSWORD: adminpassword
```
You should change the credentials for security, always keeping `USER`, `PASSWORD`, `DB NAME` the same across both services.

### 3. Build and Start Containers

From the project root, run:

```bash
docker-compose up
```

This command will:

&nbsp;&nbsp;&nbsp;**1.** Pull required images (node:22-slim for the app, postgres:16 for the database).

&nbsp;&nbsp;&nbsp;**2.** Build your Node.js application container.

&nbsp;&nbsp;&nbsp;**3.** Start both the db and app services.

&nbsp;&nbsp;&nbsp;**4.** Wait for the database to pass the healthcheck before starting the app.

Or, rebuild first, then run: 

```bash
docker-compose up --build
```

### 4. Stop Containers

To stop and remove the running containers while keeping database data:

```bash
docker-compose down
```

The PostgreSQL data is persisted in the db_data volume, so it is safe to restart.

### 5. Rebuild from scratch

If you need to rebuild the images from scratch:

```bash
docker-compose build --no-cache
docker-compose up
```

Or, force remove all app data from docker:

```bash
docker-compose down -v
```
Then, build docker again: 


### 6. Notes & Tips

- The database initialization script init.sql is automatically executed on first container startup.
- The app requires ADMIN_EMAIL and ADMIN_PASSWORD to create the first admin user.
- The db service includes a healthcheck to ensure the database is ready before the app starts.
- Docker volumes:
&nbsp;&nbsp;&nbsp;db_data → persists PostgreSQL data between container restarts.


## Manual Setup

This section explains how to run the project manually on your local machine, without using Docker.

---

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/) (v16 recommended)

---

### 2. Prepare Your PostgreSQL User

The app will automatically create the database and tables on startup. You **do not need to create them manually**, but you must provide a PostgreSQL user with **CREATE DATABASE privileges**.

- This user will be used by the app to connect to PostgreSQL.
- Make sure the PostgreSQL server is running.

---

### 3. Set Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database connection
DB_USER=warsimuser         # PostgreSQL user with CREATE DATABASE privileges
DB_PASSWORD=mypassword     # Password for the user
DB_NAME=warsimapp          # Name of the database the app will create
DB_HOST=localhost          # PostgreSQL host (default: localhost)
DB_PORT=5432               # PostgreSQL port (default: 5432)
ADMIN_EMAIL="admin@war-simulation.com"
ADMIN_PASSWORD="adminpassword"
```

The app will use these values to connect to PostgreSQL, create the database if it does not exist, initialize the tables and the credentials for the root Admin user: 

### 4. Install Dependencies

```bash
npm install
```

### 5. Initialize and Start the Application

On startup, the app will automatically create the database, tables, and the first admin user.

You can start the application using either of the following methods:

**Option 1: Build and then run**
```bash
npm run build
npm start
```

**Option 2: Build and run in a single step**
```bash
npm run serve
```

- The app will start on http://localhost:3000
- Make sure your PostgreSQL server is running before starting the app.

### 6. Notes

- If you change database credentials, update your .env file accordingly.
- The DB_USER must have privileges to create a database, otherwise the app cannot initialize the database.
- For production, use strong passwords.


## Sumary of relationships

- **User** owns one or many **Armies**.

- **Army** is composed of multiple **ArmyUnits**.

- **ArmyUnit** references a specific **UnitType** and stores its quantity.

- **UnitType** defines the characteristics (health, strength, defense, cost) of a type of unit (infantry, artillery, tank).

- **UnitEffectiveness** defines how one **UnitType** performs against another.

- **Battle** is fought between multiple Armies through the **BattleArmy** join entity.

- **BattleArmy** links an **Army** to a **Battle**, assigns a **Strategy**, and records role (attacker/defender), outcome, and casualties.

- **Strategy** provides offensive and defensive bonuses that affect a **BattleArmy**.

### The relationships are as follows

**User** → **Army** (one-to-many)

**Army** → **ArmyUnit** (one-to-many)

**ArmyUnit** → **UnitType** (many-to-one)

**UnitType** → **UnitEffectiveness** (self-referencing many-to-many)

**Battle** → **BattleArmy** (one-to-many)

**Army** → **BattleArmy** (one-to-many)

**Strategy** → **BattleArmy** (one-to-many)

**BattleArmy** → **Battle** (many-to-one)

**BattleArmy** → **Army** (many-to-one)

**BattleArmy** → **Strategy** (many-to-one)
