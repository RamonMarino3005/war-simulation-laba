import express from "express";
import { createAuthRouter } from "./routes/authRoutes.js";
import { AuthService } from "services/authService.js";

export const createApp = ({ authService }: { authService: AuthService }) => {
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

  app.use("/auth", createAuthRouter(authService));

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};
export default createApp;
