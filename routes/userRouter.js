const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const upload = require("../utils/multerConfig");
const userRouter = express.Router();

userRouter.get(
  "/view-profile",
  authenticate.checkAuth,
  userController.viewProfile
);
userRouter.put(
  "/edit-profile/:id",
  authenticate.checkAuth,
  userController.editProfile
);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.put("/reset-password/:token", userController.resetPassword);
userRouter.post(
  "/create-task",
  authenticate.checkAuth,
  userController.createTask
);
userRouter.put(
  "/update-task/:taskId",
  authenticate.checkAuth,
  userController.updateTask
);
userRouter.delete(
  "/delete-task/:taskId",
  authenticate.checkAuth,
  userController.deleteTask
);

userRouter.get("/view-tasks", authenticate.checkAuth, userController.viewTasks);

userRouter.get(
  "/view-task/:taskId",
  authenticate.checkAuth,
  userController.viewTaskById
);

userRouter.put(
  "/complete-task/:taskId",
  authenticate.checkAuth,
  upload.single("pdfFile"),
  userController.taskCompleted
);

userRouter.put(
  "/share-task/:taskId",
  authenticate.checkAuth,
  userController.taskShared
);

module.exports = userRouter;
