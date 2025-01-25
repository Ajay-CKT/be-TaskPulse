const express = require("express");
const authenticate = require("../middlewares/authenticate");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

adminRouter.get(
  "/get-all-profiles",
  authenticate.checkAuth,
  authenticate.allowedRoles(["admin"]),
  adminController.getAllProfiles
);

module.exports = adminRouter;
