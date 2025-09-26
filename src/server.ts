import { AuthService } from "./services/authService.js";
import createApp from "./app.js";
import { JwtProvider } from "./utils/jwt/jwtProvider.js";
import { RefreshStorage } from "./models/refreshModel.js";
import { db } from "./db/index.js";
import { UserModel } from "./models/userModel.js";
import { testConnection } from "./db/helpers.js";
import { AuthMiddleware } from "./middlewares/authMiddlewares.js";
import { UserService } from "./services/userService.js";
import { Payload } from "types/services/IAuthService.js";
import { ArmyService } from "./services/armyService.js";
import { ArmyModel } from "./models/armyModel.js";
import { ArmyMiddleware } from "./middlewares/armyMiddlewares.js";
import { ParameterValidators } from "./middlewares/parameterValidators.js";
import { UnitTypeModel } from "./models/unitTypeModel.js";
import { UnitTypeService } from "./services/unitTypeService.js";
import { UnitTypeMiddleware } from "./middlewares/unitTypeMiddleware.js";

const accessSecret = "my-secret";
const refreshSecret = "refresh-secret";

// Initialize dependencies

const userModel = new UserModel(db);
const armyModel = new ArmyModel(db);
const unitTypeModel = new UnitTypeModel(db);

const jwtProvider = new JwtProvider<Payload>(accessSecret, refreshSecret);
const refreshStorage = new RefreshStorage();
const authService = new AuthService(userModel, jwtProvider, refreshStorage);

const userService = new UserService(userModel);
const armyService = new ArmyService(armyModel);
const unitTypeService = new UnitTypeService(unitTypeModel);

const authMiddlewares = new AuthMiddleware(authService);
const armyMiddlewares = new ArmyMiddleware();
const unitTypeMiddlewares = new UnitTypeMiddleware();
const parameterValidators = new ParameterValidators();

(async () => {
  try {
    // Start and initialize the database
    await db.init();

    // Test database connection
    testConnection(db);

    // create root admin user
    await authService.createRootAdmin();

    // Start the app
    createApp({
      authService,
      userService,
      armyService,
      unitTypeService,
      authMiddlewares,
      armyMiddlewares,
      unitTypeMiddlewares,
      parameterValidators,
    });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
})();
