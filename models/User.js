'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

const userSchema = Schema( {
  name: String,
  username: String,
  passphrase: String,
  userevents: [String],
  email: String, 
  age: String, 
  zip: String,
  hours: Number,
  fillhrs: Number,
  link: String,
  pImage: String,
  isOrganization: Boolean,
  background: String
} );

module.exports = mongoose.model('Userteam1', userSchema );
