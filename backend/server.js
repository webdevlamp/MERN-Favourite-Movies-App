const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const { authenticateJWT } = require('./Common/Auth.js');

const userRouter = require('./Routers/UserRouter.js');
const movieRouter = require('./Routers/MovieRouter.js');
 
const app = express();
 
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(cors());
 
app.use('/api/users', userRouter);
app.use('/api/movies', authenticateJWT, movieRouter);
 
// Handling Errors
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
 
app.listen(3000,() => console.log('Server is running on port 3000'))