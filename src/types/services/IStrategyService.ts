import { Strategy, StrategyFields } from "types/entities/strategyTypes.js";

export interface IStrategyService {
  getAllStrategies(): Promise<Strategy[]>;
  getStrategyById(id: number): Promise<Strategy | null>;
  addStrategy(data: StrategyFields): Promise<Strategy>;
  updateStrategy(
    id: number,
    data: Partial<StrategyFields>
  ): Promise<Strategy | null>;
  removeStrategy(id: number): Promise<Strategy | null>;
}
