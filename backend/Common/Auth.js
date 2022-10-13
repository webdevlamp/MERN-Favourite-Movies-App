const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const Config = require("./Config");

/**
 * To perform JWT based authentication
 */
 const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer") || !authHeader.split(" ")[1]) {
    return res.status(401).json({ msg: null, err: "Please provide the valid token." });
  }
  const theToken = authHeader.split(' ')[1];
  try {
    jwt.verify(theToken, Config.jwtSecret);
  } catch(err) {
    return res.status(401).json({ msg: null, err });
  }
  next();
};

/**
 * To decode JWT token
 * @returns 
 */
const decodeJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer") || !authHeader.split(" ")[1]) {
    throw "Please provide the valid token.";
  }
  const theToken = authHeader.split(' ')[1];
  try {
    return jwt.verify(theToken, Config.jwtSecret);
  } catch(err) {
    throw err;
  }
  next();
};

module.exports = {
  authenticateJWT,
  decodeJWT
};