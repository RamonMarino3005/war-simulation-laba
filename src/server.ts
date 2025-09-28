import { AuthService } from "./services/authService.js";
import createApp from "./app.js";
import { JwtProvider } from "./utils/jwt/jwtProvider.js";
import { RefreshStorage } from "./models/refreshModel.mjs";
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
import { ArmyUnitModel } from "./models/armyUnitModel.js";
import { ArmyUnitService } from "./services/armyUnitService.js";
import { ArmyUnitMiddleware } from "./middlewares/armyUnitMiddlewares.js";
import { StrategyModel } from "./models/strategyModel.js";
import { StrategyService } from "./services/strategyService.js";
import { StrategyMiddleware } from "./middlewares/strategyMiddleware.js";
import { BattleModel } from "./models/battleModel.js";
import { BattleService } from "./services/Battle/battleService.js";
import { BattleMiddleware } from "./middlewares/battleMiddleware.js";

const accessSecret = "my-secret";
const refreshSecret = "refresh-secret";

/** Initialize dependencies */

// JWT and Refresh Token Storage
const jwtProvider = new JwtProvider<Payload>(accessSecret, refreshSecret);
const refreshStorage = new RefreshStorage();

// Models
const userModel = new UserModel(db);
const armyModel = new ArmyModel(db);
const unitTypeModel = new UnitTypeModel(db);
const armyUnitModel = new ArmyUnitModel(db);
const strategyModel = new StrategyModel(db);
const battleModel = new BattleModel(db);

// Services
const authService = new AuthService(userModel, jwtProvider, refreshStorage);
const userService = new UserService(userModel);
const armyService = new ArmyService(armyModel);
const unitTypeService = new UnitTypeService(unitTypeModel);
const strategyService = new StrategyService(strategyModel);
const armyUnitService = new ArmyUnitService(
  armyUnitModel,
  armyService,
  unitTypeService
);
const battleService = new BattleService(
  battleModel,
  armyService,
  strategyService,
  armyUnitService,
  unitTypeService
);

// Middlewares
const authMiddlewares = new AuthMiddleware(authService);
const armyMiddlewares = new ArmyMiddleware();
const unitTypeMiddlewares = new UnitTypeMiddleware();
const parameterValidators = new ParameterValidators();
const armyUnitMiddlewares = new ArmyUnitMiddleware();
const strategyMiddlewares = new StrategyMiddleware();
const battleMiddlewares = new BattleMiddleware();

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
      armyUnitService,
      strategyService,
      battleService,
      authMiddlewares,
      armyMiddlewares,
      unitTypeMiddlewares,
      parameterValidators,
      armyUnitMiddlewares,
      battleMiddlewares,
      strategyMiddlewares,
    });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
})();
