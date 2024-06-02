const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

// router.get('/', function(req, res, next) {
  //   res.render('index', { title: 'Express' });
  // });
  
/* GET home page. */
router.get("/", message_controller.index_get);

router.post("/", message_controller.message_post)

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/login", user_controller.login_get);

router.post("/login", user_controller.login_post);

router.get("/member-form", user_controller.member_form_get);

router.post("/member-form", user_controller.member_form_post);

router.get("/logout", user_controller.logout);

module.exports = router;
