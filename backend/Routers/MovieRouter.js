const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./../Database/Connection");
const { saveMovieValidation } = require("./../Common/Validation");

router.get("/", saveMovieValidation, (req, res, next) => {

});
router.get("/:id", saveMovieValidation, (req, res, next) => {

});
router.post("/", saveMovieValidation, (req, res, next) => {

});
router.put("/:id", saveMovieValidation, (req, res, next) => {

});
router.delete("/:id", saveMovieValidation, (req, res, next) => {

});

module.exports = router;
