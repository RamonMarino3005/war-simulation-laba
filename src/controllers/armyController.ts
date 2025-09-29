import { Request, Response } from "express";
import { ArmyFields } from "types/entities/armyTypes.js";
import { IArmyService } from "types/services/IArmyService.js";

/**
 * Controller for handling Army-related HTTP requests.
 *
 * Provides endpoints for creating, retrieving, updating, and deleting armies,
 * as well as fetching armies by user.
 */
export class ArmyController {
  constructor(private armyService: IArmyService) {}

  /**
   * Retrieves all armies.
   *
   * @route GET /armies
   * @param req - Express request object
   * @param res - Express response object
   * @returns 200 with a list of armies, or 400 with an error message
   */
  getAllArmies = async (req: Request, res: Response) => {
    try {
      const armies = await this.armyService.getAllArmies();
      res.status(200).json(armies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves a single army by ID.
   *
   * @route GET /armies/:id
   * @param req - Express request containing `id` as a route parameter
   * @param res - Express response object
   * @returns 200 with the army data, 404 if not found, or 400 on error
   */
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

  /**
   * Creates a new army for the authenticated user.
   *
   * @route POST /armies
   * @param req - Express request containing the validated body `{ name: string }`
   * @param res - Express response object
   * @returns 201 with the created army, or 400 on error
   */
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

  /**
   * Updates an existing army.
   *
   * @route PUT /armies/:id
   * @param req - Express request containing `id` in params and `ArmyFields` in the validated body
   * @param res - Express response object
   * @returns 200 with the updated army, or 400 on error
   */
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

  /**
   * Deletes an existing army.
   *
   * @route DELETE /armies/:id
   * @param req - Express request containing `id` in params
   * @param res - Express response object
   * @returns 200 with deletion result, or 400 on error
   */
  deleteArmy = async (req: Request, res: Response) => {
    const { userId } = req.session;
    const { id: armyId } = req.params;

    try {
      const result = await this.armyService.deleteArmy(userId, armyId);
      if (!result) {
        return res.status(404).json({ error: "Army not found" });
      }

      res.status(200).json({
        status: "success",
        message: "Army deleted successfully",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves all armies for a specific user.
   *
   * Only accessible by the user themselves or an admin.
   *
   * @route GET /users/:userId/armies
   * @param req - Express request containing `userId` in session and as route parameter
   * @param res - Express response object
   * @returns 200 with a list of armies, 403 if forbidden, or 400 on error
   */
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
