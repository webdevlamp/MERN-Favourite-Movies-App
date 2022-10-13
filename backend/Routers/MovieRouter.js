const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticateJWT, decodeJWT } = require("./../Common/Auth");
const db = require("./../Database/Connection");
const { saveMovieValidation } = require("./../Common/Validation");

/**
 * Route to get all movies and related data for logged in user
 */
router.get("/", async (req, res, next) => {
  const decoded = decodeJWT(req, res, next);
  return res.status(200).send(await getMoviesByUserId(decoded.id));
});

const getMoviesByUserId = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`
        SELECT m.id, m.name, m.rating, m.genre, m.releasedate, m.cast
        FROM movies m 
        WHERE m.user_id = ?
        ORDER BY m.id DESC
      `, id, (error, results, fields) => {
      if(error) throw error;
      results.map((result) => {
        result.cast = JSON.parse(result.cast);
        result.cast = result.cast.join(', ');
        return result;
      })
      resolve(results);
    });
  });
}

/**
 * Route to get specific movie and related data for logged in user
 */
router.get("/:id", (req, res, next) => {
  const decoded = decodeJWT(req, res, next);
  db.query(`
    SELECT m.id, m.name, m.rating, m.genre, m.releasedate, GROUP_CONCAT( mc.name SEPARATOR ',' ) as "cast" 
    FROM movies m 
    LEFT JOIN movie_cast mc ON mc.movie_id = m.id 
    WHERE m.user_id = ? AND m.id = ?
    GROUP BY m.id
    ORDER BY m.id DESC
  `, [decoded.id, req.params.id], (error, results, fields) => {
    if(error) throw error;
    if(results.length > 0) {
      return res.status(200).send({ data: results[0], msg: "Your favourite movie has successfully been fetched!" });
    } else {
      return res.status(400).send({ error: "Can not fetch your favourite movie." });
    }
  });
});

/**
 * Route to perform create action for move and related data
 */
router.post("/", saveMovieValidation, (req, res, next) => {

  const decoded = decodeJWT(req, res, next);
  db.query(`SELECT id, name FROM movies WHERE LOWER(name) = LOWER(${db.escape(req.body.name)}) AND user_id = ${decoded.id};`,
    (err, result) => {
      // return with validation errors
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      if(result.length) {
        return res.status(409).send({ error: "This movie is already added to your favourites list!" });
      } else {
        let castArr = [];
        if(req.body.cast != null) {
          castArr = req.body.cast.split(',');
        }
        db.query(`INSERT INTO movies (name, rating, genre, cast, releasedate, user_id) VALUES (${db.escape(req.body.name)}, ${req.body.rating}, ${db.escape(req.body.genre)}, ${db.escape(JSON.stringify(castArr))}, ${db.escape(req.body.releasedate)}, ${db.escape(decoded.id)})`, 
          (err, result) => {
            if(err) {
              return res.status(400).send({ error: err });
            }
            let tempData = {
              "id": result.insertId,
              "name": req.body.name || '',
              "rating": req.body.rating || '',
              "genre": req.body.genre || '',
              "cast": req.body.cast || '',
              "releasedate": req.body.releasedate || ''
            };
            return res.status(201).send(tempData);
          }
        );        
      }
    }
  );

});

/**
 * Route to perform update action on move and related data
 */
router.put("/:id", saveMovieValidation, (req, res, next) => {
  if(!req.body || req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ msg: null, error: "Please provide input data to update your favourite movie." });
  } else {
    const decoded = decodeJWT(req, res, next);

    let castArr = [];
    if(req.body.cast != null) {
      castArr = req.body.cast.split(',');
    }
    // update selected movie
    db.query(`
      UPDATE movies m 
      SET m.name = ?
      WHERE m.user_id = ? AND m.id = ?
    `, [req.body.name, decoded.id, parseInt(req.params.id)], (error, updResults, fields) => {
      if(error) throw error;
  
      return res.status(200).send({ data: updResults, msg: "Your favourite movie has successfully been updated!" });
    }); 
  }
});

/**
 * Route to perform delete action on movie and related data
 */
router.delete("/:id", (req, res, next) => {

  if(!req.params.id || req.params.id == null || req.params.id <= 0) {
    return res.status(400).json({ msg: null, error: "Please provide valid id to delete your favourite movie." });
  } else {
    const decoded = decodeJWT(req, res, next);

    // check if the delete request for the movie id is linked with the user_id or not?
    db.query(`
      SELECT m.id
      FROM movies m 
      WHERE m.user_id = ? AND m.id = ?
    `, [decoded.id, req.params.id], (error, results, fields) => {
      if(error) throw error;
      if(!results || results[0] == null) {
        return res.status(400).json({ msg: null, error: "Provided movie id not found to perform delete action." });
      } else {
        // actual movie record from movies table will be deleted now
        db.query(`
          DELETE
          FROM movies
          WHERE id = ? AND user_id = ?
        `, [req.params.id, decoded.id], (error, results, fields) => {
          if(error) throw error;
          return res.status(200).send({ id: parseInt(req.params.id) });
        });
      }
    });
  }
});

module.exports = router;