import { Request, Response } from "express";
import { StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyService } from "types/services/IStrategyService.js";

/**
 * Controller responsible for managing strategies.
 * Provides endpoints to create, retrieve, update, and delete strategies.
 */
export class StrategyController {
  constructor(private strategyService: IStrategyService) {}

  /**
   * Get all strategies.
   *
   * @route GET /strategy
   * @returns {Strategy[]} 200 - List of all strategies
   * @returns {object} 400 - Error message if retrieval fails
   */
  getAllStrategies = async (req: Request, res: Response) => {
    try {
      const strategies = await this.strategyService.getAllStrategies();
      res.status(200).json(strategies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get a strategy by its ID.
   *
   * @route GET /strategy/:strategyId
   * @param {number} strategyId - ID of the strategy
   * @returns {Strategy} 200 - Strategy details
   * @returns {object} 404 - Strategy not found
   * @returns {object} 400 - Error message if retrieval fails
   */
  getStrategyById = async (req: Request, res: Response) => {
    const strategyId = Number(req.params.strategyId);

    try {
      const strategy = await this.strategyService.getStrategyById(strategyId);
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      res.status(200).json(strategy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Create a new strategy.
   *
   * @route POST /strategy
   * @body {StrategyFields} strategyData - Strategy data
   * @returns {Strategy} 201 - Created strategy
   * @returns {object} 400 - Error message if creation fails
   */
  addStrategy = async (req: Request, res: Response) => {
    const strategyData = req.validatedBody as StrategyFields;
    try {
      const newStrategy = await this.strategyService.addStrategy(strategyData);
      res.status(201).json(newStrategy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Update an existing strategy.
   *
   * @route PUT /strategy/:strategyId
   * @param {number} strategyId - ID of the strategy
   * @body {Partial<StrategyFields>} updateData - Fields to update
   * @returns {Strategy} 200 - Updated strategy
   * @returns {object} 400 - Error message if update fails
   */
  updateStrategy = async (req: Request, res: Response) => {
    const strategyId = Number(req.params.strategyId);
    const updateData = req.validatedBody as Partial<StrategyFields>;

    try {
      const updatedStrategy = await this.strategyService.updateStrategy(
        strategyId,
        updateData
      );
      res.status(200).json(updatedStrategy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Delete a strategy by its ID.
   *
   * @route DELETE /strategy/:strategyId
   * @param {number} strategyId - ID of the strategy
   * @returns {void} 204 - Successfully deleted
   * @returns {object} 400 - Error message if deletion fails
   */
  removeStrategy = async (req: Request, res: Response) => {
    const strategyId = Number(req.params.strategyId);
    try {
      let result = await this.strategyService.removeStrategy(strategyId);
      if (!result) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      res.status(204).send({
        status: "success",
        message: "Strategy deleted successfully",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
