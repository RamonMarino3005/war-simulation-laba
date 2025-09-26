import express from "express";
import { createAuthRouter } from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { createUserRouter } from "./routes/userRoutes.js";
import { IAuthService } from "types/services/IAuthService.js";
import { IUserService } from "types/services/IUserService.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { createArmyRouter } from "./routes/gameRoutes/armyRoutes.js";
import { IArmyService } from "types/services/IArmyService.js";
import { IArmyMiddleware } from "types/middlewares/IArmyMiddleware.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";
import { createUnitTypeRouter } from "./routes/gameRoutes/unitTypesRoutes.js";
import { IUnitTypeMiddleware } from "types/middlewares/IUnitTypeMiddleware.js";

dotenv.config();

export const createApp = ({
  authService,
  userService,
  armyService,
  unitTypeService,
  authMiddlewares,
  armyMiddlewares,
  unitTypeMiddlewares,
  parameterValidators,
}: {
  authService: IAuthService;
  userService: IUserService;
  armyService: IArmyService;
  unitTypeService: IUnitTypeService;
  authMiddlewares: IAuthMiddleware;
  armyMiddlewares: IArmyMiddleware;
  unitTypeMiddlewares: IUnitTypeMiddleware;
  parameterValidators: IParameterValidators;
}) => {
  const PORT = process.env.PORT || 3000;

  const app = express();

  app.disable("x-powered-by");

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    next();
  });

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.use("/auth", createAuthRouter(authService, authMiddlewares));
  app.use(
    "/users",
    createUserRouter(userService, authMiddlewares, parameterValidators)
  );
  app.use(
    "/army",
    createArmyRouter(
      armyService,
      authMiddlewares,
      armyMiddlewares,
      parameterValidators
    )
  );
  app.use(
    "/unit-types",
    createUnitTypeRouter(
      unitTypeService,
      authMiddlewares,
      unitTypeMiddlewares,
      parameterValidators
    )
  );

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};
export default createApp;
