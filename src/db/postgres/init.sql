-- ==========================
-- Users
-- ==========================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    password_hash VARCHAR NOT NULL
);

-- ==========================
-- Army
-- ==========================
CREATE TABLE IF NOT EXISTS army (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    resources INT,
    owner_id UUID NOT NULL REFERENCES users(user_id)
);

-- ==========================
-- Unit Types (the blueprint for units)
-- ==========================
CREATE TABLE IF NOT EXISTS unitType (
    id SERIAL PRIMARY KEY,
    type VARCHAR CHECK (type IN ('infantry', 'artillery', 'tank')) UNIQUE NOT NULL,
    base_health INT NOT NULL,
    strength INT NOT NULL,
    defense INT NOT NULL,
    cost INT NOT NULL
);

-- ==========================
-- Army Units (instances of unit types in an army)
-- ==========================
CREATE TABLE IF NOT EXISTS armyUnit (
    army_id UUID REFERENCES army(id) ON DELETE CASCADE,
    unit_type_id INT REFERENCES unitType(id) ON DELETE CASCADE,
    health INT NOT NULL,
    PRIMARY KEY (army_id, unit_type_id)
);

-- ==========================
-- Strategy
-- ==========================
CREATE TABLE IF NOT EXISTS strategy (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    offensive_bonus FLOAT,
    defensive_bonus FLOAT
);

-- ==========================
-- Battle
-- ==========================
CREATE TABLE IF NOT EXISTS battle (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    location VARCHAR
);

-- ==========================
-- BattleArmy (participation of armies in battles)
-- ==========================
CREATE TABLE IF NOT EXISTS battleArmy (
    battle_id UUID REFERENCES battle(id) ON DELETE CASCADE,
    army_id UUID REFERENCES army(id) ON DELETE CASCADE,
    strategy_id INT REFERENCES strategy(id),
    role VARCHAR CHECK (role IN ('attacker', 'defender')),
    outcome VARCHAR CHECK (outcome IN ('won', 'lost', 'drew')),
    starting_strength INT,
    final_strength INT,
    moral_effect INT,
    casualties INT,
    PRIMARY KEY (battle_id, army_id)
);

-- ==========================
-- Unit Effectiveness (matchups)
-- ==========================
CREATE TABLE IF NOT EXISTS unitEffectiveness (
    attacker_unit_id INT REFERENCES unitType(id) ON DELETE CASCADE,
    defender_unit_id INT REFERENCES unitType(id) ON DELETE CASCADE,
    modifier FLOAT NOT NULL,
    PRIMARY KEY (attacker_unit_id, defender_unit_id)
);

-- =====================================
-- Seed: strategy
-- =====================================
INSERT INTO strategy (name, offensive_bonus, defensive_bonus)
VALUES
  ('Aggressive', 10, 0),
  ('Defensive', 0, 10),
  ('Balanced', 5, 5),
  ('Guerilla Tactics', 7, 3),
  ('Blitzkrieg', 12, 2)
ON CONFLICT (name) DO NOTHING;

-- =====================================
-- Seed: unitType
-- =====================================
INSERT INTO unitType (type, base_health, strength, defense, cost)
VALUES
  ('infantry', 100, 10, 5, 50),
  ('artillery', 80, 20, 3, 100),
  ('tank', 200, 30, 20, 300)
ON CONFLICT (type) DO NOTHING;

-- =====================================
-- Seed: unitEffectiveness
-- =====================================
INSERT INTO unitEffectiveness (attacker_unit_id, defender_unit_id, modifier)
VALUES
  -- Infantry attacks
  (1, 1, 1.0),
  (1, 2, 0.7),
  (1, 3, 0.5),
  -- Artillery attacks
  (2, 1, 1.2),
  (2, 2, 1.0),
  (2, 3, 0.8),
  -- Tank attacks
  (3, 1, 1.5),
  (3, 2, 1.3),
  (3, 3, 1.0)
ON CONFLICT (attacker_unit_id, defender_unit_id) DO NOTHING;
