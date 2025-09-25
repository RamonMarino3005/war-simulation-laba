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

dotenv.config();

export const createApp = ({
  authService,
  userService,
  armyService,
  authMiddlewares,
  armyMiddlewares,
  parameterValidators,
}: {
  authService: IAuthService;
  userService: IUserService;
  armyService: IArmyService;
  authMiddlewares: IAuthMiddleware;
  armyMiddlewares: IArmyMiddleware;
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

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};
export default createApp;
