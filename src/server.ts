import { AuthService } from "./services/authService.js";
import createApp from "./app.js";
import { UserModel } from "./models/userModel.js";
import { JwtProvider } from "./utils/jwt/jwtProvider.js";
import { RefreshStorage } from "./models/refreshModel.js";

const accessSecret = "my-secret";
const refreshSecret = "refresh-secret";

const authService = new AuthService(
  new UserModel(),
  new JwtProvider(accessSecret, refreshSecret),
  new RefreshStorage()
);

createApp({ authService: authService });
