import { Strategy, StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyModel } from "types/models/IStrategyModel.js";
import { IStrategyService } from "types/services/IStrategyService.js";

export class StrategyService implements IStrategyService {
  constructor(private strategyModel: IStrategyModel) {}

  async getAllStrategies(): Promise<Strategy[]> {
    return this.strategyModel.findAll();
  }

  async getStrategyById(id: number): Promise<Strategy | null> {
    return this.strategyModel.findById(id);
  }

  async addStrategy(data: StrategyFields): Promise<Strategy> {
    return this.strategyModel.create(data);
  }

  async updateStrategy(
    id: number,
    data: Partial<StrategyFields>
  ): Promise<Strategy | null> {
    const updatedStrategy = await this.strategyModel.update(id, data);
    if (!updatedStrategy) {
      throw new Error("Strategy not found");
    }

    return updatedStrategy;
  }

  async removeStrategy(id: number): Promise<Strategy | null> {
    const removedStrategy = await this.strategyModel.delete(id);
    if (!removedStrategy) {
      throw new Error("Strategy not found");
    }

    return removedStrategy;
  }
}
