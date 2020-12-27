"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const id = 0
//var userSchema = mongoose.Schema( {any:{}})

const eventSchema = Schema({
  nameEvent: String,
  date: Date,
  sTime: String,
  duration: Number,
  location: String,
  zip: String,
  maxpeople: Number,
  description: String,
  signed_up_people: [String],
  authorId: Schema.Types.ObjectId,
  author: String,
  reported: Number,
  reports: String,
  tag: String
});

module.exports = mongoose.model("EventsTeam1", eventSchema);
