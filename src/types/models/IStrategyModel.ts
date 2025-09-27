import { Strategy, StrategyFields } from "types/entities/strategyTypes.js";

export interface IStrategyModel {
  findAll(): Promise<Strategy[]>;
  findById(id: number): Promise<Strategy | null>;
  create(data: StrategyFields): Promise<Strategy>;
  update(id: number, data: Partial<StrategyFields>): Promise<Strategy | null>;
  delete(id: number): Promise<Strategy | null>;
}
