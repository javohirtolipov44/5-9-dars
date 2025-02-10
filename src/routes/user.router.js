import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouter = Router();
const controller = new userController();

userRouter.post("/auth/register", (req, res) => {
  controller.signUpController(req, res);
});

userRouter.post("/auth/login", (req, res) => {
  controller.loginController(req, res);
});

userRouter.get("/auth/profile", (req, res) => {
  controller.authProfileController(req, res);
});

userRouter.put("/auth/profile", (req, res) => {
  controller.putAuthProfileController(req, res);
});

userRouter.post("/auth/change-password", (req, res) => {
  controller.changePasswordController(req, res);
});

userRouter.get("/auth/check-email/:email", (req, res) => {
  controller.checkEmailController(req, res);
});

userRouter.get("/auth/logout", (req, res) => {
  controller.logOutController(req, res);
});

userRouter.delete("/auth/delete", (req, res) => {
  controller.deleteProfileController(req, res);
});

export default userRouter;
