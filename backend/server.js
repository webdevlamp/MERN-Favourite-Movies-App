const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const Config = require('./Common/Config');
const { authenticateJWT } = require('./Common/Auth');

const userRouter = require('./Routers/UserRouter');
const movieRouter = require('./Routers/MovieRouter');
 
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
 
app.listen(Config.port || 3000, () => console.log('Server is running on port ' + Config.port || 3000))