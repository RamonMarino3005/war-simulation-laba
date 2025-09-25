import express from "express";
import { createAuthRouter } from "./routes/authRoutes.js";
import { AuthService } from "services/authService.js";
import dotenv from "dotenv";
import { AuthMiddleware } from "middlewares/authMiddlewares.js";
import { UserService } from "./services/userService.js";
import { createUserRouter } from "./routes/userRoutes.js";

dotenv.config();

export const createApp = ({
  authService,
  userService,
  authMiddlewares,
}: {
  authService: AuthService;
  userService: UserService;
  authMiddlewares: AuthMiddleware;
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

  console.log("Auth Service in app.ts:");
  app.use("/auth", createAuthRouter(authService, authMiddlewares));
  app.use("/users", createUserRouter(userService, authMiddlewares));
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};
export default createApp;
