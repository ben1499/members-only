const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/login", user_controller.login_get);

router.post("/login", user_controller.login_post);

router.get("/logout", user_controller.logout);

module.exports = router;
