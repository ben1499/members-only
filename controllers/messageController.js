const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")

const Message = require("../models/message");

exports.index_get = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({}).populate("user").exec();

  res.render("index", {
    messages: allMessages
  });
})

exports.message_post = [
  body('title')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Title must be specified"),
  body('content')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Content must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const allMessages = await Message.find({}).populate("user").exec();

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      user: req.user
    })

    if (!errors.isEmpty()) {
      res.render("index", {
        message: message,
        messages: allMessages,
        errors: errors.array()
      })
    } else {
      await message.save();
      res.redirect("/");
    }
  })
]

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.body.messageid).exec();

  if (message === null) {
    res.redirect("/")
  } else {
    await Message.findByIdAndDelete(req.body.messageid);
    res.redirect("/");
  }
})