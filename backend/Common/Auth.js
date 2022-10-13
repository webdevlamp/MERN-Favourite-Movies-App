const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const Config = require("./Config");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, Config.jwtSecret || "favourite-movies-app", (err, user) => {
        if(err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
  } else {
    res.sendStatus(401);
  }
};

const decodeJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, Config.jwtSecret || "favourite-movies-app", (err, user) => {
        if(err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJWT,
  decodeJWT
};