## ERD Diagram

![ERD DIAGRAM](./ERD_warSim.png)

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
