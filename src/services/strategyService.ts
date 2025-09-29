import { Strategy, StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyModel } from "types/models/IStrategyModel.js";
import { IStrategyService } from "types/services/IStrategyService.js";

/**
 * Service responsible for managing strategies.
 * Provides methods to create, read, update, and delete strategies.
 */
export class StrategyService implements IStrategyService {
  constructor(private strategyModel: IStrategyModel) {}

  /**
   * Retrieves all strategies from the system.
   *
   * @returns Array of Strategy objects
   */
  async getAllStrategies(): Promise<Strategy[]> {
    return this.strategyModel.findAll();
  }

  /**
   * Retrieves a strategy by its ID.
   *
   * @param id - ID of the strategy
   * @returns The strategy if found, otherwise null
   */
  async getStrategyById(id: number): Promise<Strategy | null> {
    return this.strategyModel.findById(id);
  }

  /**
   * Adds a new strategy to the system.
   *
   * @param data - Strategy data to create
   * @returns The newly created Strategy
   */
  async addStrategy(data: StrategyFields): Promise<Strategy> {
    return this.strategyModel.create(data);
  }

  /**
   * Updates an existing strategy.
   *
   * @param id - ID of the strategy to update
   * @param data - Partial data to update the strategy
   * @returns The updated Strategy
   * @throws Error if the strategy is not found
   */
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

  /**
   * Removes a strategy from the system.
   *
   * @param id - ID of the strategy to remove
   * @returns The removed Strategy
   * @throws Error if the strategy is not found
   */
  async removeStrategy(id: number): Promise<Strategy | null> {
    const removedStrategy = await this.strategyModel.delete(id);
    if (!removedStrategy) {
      throw new Error("Strategy not found");
    }

    return removedStrategy;
  }
}
