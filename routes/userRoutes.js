const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  listUsers
} = require("../controllers/UserController");

const router = express.Router();

router.post("/register", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/list", listUsers);

module.exports = router;
