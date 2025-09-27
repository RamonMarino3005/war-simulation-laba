import { Request, Response } from "express";
import { StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyService } from "types/services/IStrategyService.js";

export class StrategyController {
  constructor(private strategyService: IStrategyService) {}

  getAllStrategies = async (req: Request, res: Response) => {
    try {
      const strategies = await this.strategyService.getAllStrategies();
      res.status(200).json(strategies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

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

  addStrategy = async (req: Request, res: Response) => {
    const strategyData = req.validatedBody as StrategyFields;
    try {
      const newStrategy = await this.strategyService.addStrategy(strategyData);
      res.status(201).json(newStrategy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

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

  removeStrategy = async (req: Request, res: Response) => {
    const strategyId = Number(req.params.strategyId);
    try {
      await this.strategyService.removeStrategy(strategyId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
