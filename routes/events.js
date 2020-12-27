const express = require("express");
const router = express.Router();
const axios = require("axios");
const Events = require("models/Events");

router.get("/eventfeed", (req, res, next) => {
  res.render("eventfeed");
});

router.post("/showevents", async (req, res, next) => {
  try {
    res.locals.events = await Events.find()
      .sort({ date: -1 })
      .limit(5);
    res.render("showrecipes");
  } catch (error) {
    next(error);
  }
});

router.post("/showeventssearch", async (req, res, next) => {
  try {
    res.locals.events = await Events.find()
      .sort({ date: -1 })
      .limit(5);
    res.render("searchpage");
  } catch (error) {
    next(error);
  }
});


module.exports = router;
