const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Config = require("./../Common/Config");
const db = require("./../Database/Connection");
const { signupValidation, loginValidation } = require("./../Common/Validation");


router.post("/signup", signupValidation, (req, res, next) => {
  db.query(`SELECT id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)});`,
    (err, result) => {
      // return with validation errors
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      if(result.length) {
        return res.status(409).send({error: "This user is already in use!"});
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).send({error: err});
          } else {
            // has hashed pw => add to database
            db.query(`INSERT INTO users (name, email, password) VALUES ('${req.body.name}', ${db.escape(req.body.email)}, ${db.escape(hash)})`,
              (err, result) => {
                if(err) {
                  throw err;
                  return res.status(400).send({error: err});
                }
                const token = jwt.sign({ id: result.insertId }, Config.jwtSecret || "favourite-movies-app",{ expiresIn: Config.jwtSecretExpiresIn || "1h" });
                return res.status(201).send({token, data: { name: req.body.name } });
              }
            );
          }
        });
      }
    }
  );
});
router.post("/login", loginValidation, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // return with validation errors
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      
      // user does not exists
      if(err) {
        throw err;
        return res.status(400).send({error: err});
      }
      if(!result.length) {
        return res.status(401).send({error: "Email or password is incorrect!"});
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          // wrong password
          if(bErr) {
            throw bErr;
            return res.status(401).send({error: "Email or password is incorrect!"});
          }
          if(bResult) {
            const token = jwt.sign({ id: result[0].id }, Config.jwtSecret || "favourite-movies-app", { expiresIn: Config.jwtSecretExpiresIn || "1h" });
            db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`);
            return res.status(200).send({token, data: { name: result[0].name} });
          }
          return res.status(401).send({
            error: "Username or password is incorrect!",
          });
        }
      );
    }
  );
});
router.post("/get-user", signupValidation, (req, res, next) => {
  if(
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.status(422).json({
      message: "Please provide the token",
    });
  }
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query(
    "SELECT * FROM users where id=?",
    decoded.id,
    function (error, results, fields) {
      if(error) throw error;
      return res.send({
        error: false,
        data: results[0],
        message: "Fetch Successfully.",
      });
    }
  );
});
module.exports = router;