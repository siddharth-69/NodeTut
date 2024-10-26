const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/auth");

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

module.exports = router;