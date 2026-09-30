const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/admin.controller");
const { verifyJWT, checkRole } = require("../middlewares/auth.middleware");

router.get("/stats", verifyJWT, checkRole("admin"), getAdminStats);

module.exports = router;
