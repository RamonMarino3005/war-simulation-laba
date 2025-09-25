import { Request, Response } from "express";
import { ArmyFields } from "types/entities/armyTypes.js";
import { IArmyService } from "types/services/IArmyService.js";

export class ArmyController {
  constructor(private armyService: IArmyService) {}

  getAllArmies = async (req: Request, res: Response) => {
    try {
      const armies = await this.armyService.getAllArmies();
      res.status(200).json(armies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getArmyById = async (req: Request, res: Response) => {
    const armyId = req.params.id;
    try {
      const army = await this.armyService.getArmyById(armyId);
      if (army) {
        res.status(200).json(army);
      } else {
        res.status(404).json({ error: "Army not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  createArmy = async (req: Request, res: Response) => {
    const { userId } = req.session;
    const { name } = req.validatedBody as { name: string };

    console.log("Creating Army with name:", name);
    try {
      const createdArmy = await this.armyService.createArmy(userId, name);
      res.status(201).json(createdArmy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateArmy = async (req: Request, res: Response) => {
    const { userId } = req.session;
    const { id: armyId } = req.params;
    const updateArmy = req.validatedBody as ArmyFields;

    console.log("Updating Army with data:", updateArmy);
    console.log("User ID:", userId);
    console.log("Army ID:", armyId);
    try {
      const result = await this.armyService.updateArmy(
        userId,
        armyId,
        updateArmy
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteArmy = async (req: Request, res: Response) => {
    const { userId } = req.session;
    const { id: armyId } = req.params;

    console.log("Deleting Army ID:", armyId);
    console.log("User ID:", userId);
    try {
      const result = await this.armyService.deleteArmy(userId, armyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getArmiesByUser = async (req: Request, res: Response) => {
    const { userId } = req.session;
    const { userId: paramUserId } = req.params;

    if (userId !== paramUserId && req.session.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const armies = await this.armyService.getArmiesByUser(paramUserId);
      res.status(200).json(armies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
