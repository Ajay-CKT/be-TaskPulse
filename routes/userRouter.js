const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const userRouter = express.Router();

userRouter.put(
  "/edit-profile/:id",
  authenticate.checkAuth,
  userController.editProfile
);

module.exports = userRouter;
