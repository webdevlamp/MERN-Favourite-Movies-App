var Config = {};

Config.jwtSecret =  "favourite-movies-app";
Config.jwtSecretExpiresIn =  "1h";

Config.mysql = {
  host: "localhost",
  db: "favourite-movies",
  user: "favourite-movies",
  pass: "favourite-movies"
}

module.exports = Config;