const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const userRouter = express.Router();

userRouter.get(
  "/view-profile",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
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
  authenticate.allowedRoles(["user"]),
  userController.createTask
);
userRouter.put(
  "/update-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.updateTask
);
userRouter.delete(
  "/delete-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.deleteTask
);

userRouter.get(
  "/view-tasks",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.viewTasks
);

userRouter.get(
  "/view-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.viewTaskById
);

userRouter.put(
  "/complete-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.taskCompleted
);

userRouter.put(
  "/share-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.taskShared
);

module.exports = userRouter;
