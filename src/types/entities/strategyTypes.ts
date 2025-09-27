export type Strategy = {
  id: number;
  name: string;
  offensive_bonus?: number;
  defensive_bonus?: number;
};

export type StrategyFields = Omit<Strategy, "id">;
