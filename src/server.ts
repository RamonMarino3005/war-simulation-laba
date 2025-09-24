import { AuthService } from "./services/authService.js";
import createApp from "./app.js";
import { JwtProvider } from "./utils/jwt/jwtProvider.js";
import { RefreshStorage } from "./models/refreshModel.js";
import { db } from "./db/index.js";
import { UserModel } from "./models/userModel.js";
import { testConnection } from "./db/helpers.js";

const accessSecret = "my-secret";
const refreshSecret = "refresh-secret";

// Initialize dependencies
const userModel = new UserModel(db);
const jwtProvider = new JwtProvider(accessSecret, refreshSecret);
const refreshStorage = new RefreshStorage();
const authService = new AuthService(userModel, jwtProvider, refreshStorage);

(async () => {
  try {
    // Start and initialize the database
    await db.init();

    // Test database connection
    testConnection(db);

    // create root admin user
    await authService.createRootAdmin();

    // Start the app
    createApp({ authService });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
})();
