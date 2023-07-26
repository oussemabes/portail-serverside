const { app } = require("./app");
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);
const db = require("./config");
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
async function createTables() {
  await db.query(
    "CREATE TABLE IF NOT EXISTS users (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, ref INT(11) UNSIGNED UNIQUE, name VARCHAR(30), email VARCHAR(30), password VARCHAR(255), admin VARCHAR(10), age INT(3), gender VARCHAR(30));",
    function (err) {
      if (err) throw err;
      console.log("users TABLE created.");
    }
  ); 

  await db.query(
    "CREATE TABLE IF NOT EXISTS diseases (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));",
    function (err) {
      if (err) throw err;
      console.log("diseases TABLE created.");
    }
  );

  await db.query(
    "CREATE TABLE IF NOT EXISTS user_diseases (user_id INT(11) UNSIGNED, disease_id INT(11) UNSIGNED, PRIMARY KEY (user_id, disease_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (disease_id) REFERENCES diseases(id));",
    function (err) {
      if (err) throw err;
      console.log("user_diseases TABLE created.");
    }
  );

  await db.query(
    "CREATE TABLE IF NOT EXISTS studies (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),discreption VARCHAR(30),disease VARCHAR(255));",
    function (err) {
      if (err) throw err;
      console.log("studies TABLE created.");
    }
  );

  await db.query(
    "CREATE TABLE IF NOT EXISTS participants (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, ref INT(11) UNSIGNED, study_id INT(11) UNSIGNED,  user_id INT(11) UNSIGNED,state VARCHAR(10), document VARCHAR(255), date DATETIME,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (ref) REFERENCES users(ref) ON DELETE CASCADE, FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE);",
    function (err) {
      if (err) throw err;
      console.log("participants TABLE created.");
    }
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS health_measurements (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,user_id INT(11) UNSIGNED,date DATE,heart_beat INT(3),temperature FLOAT,  oxygen_saturation FLOAT,blood_pressure INT(3),FOREIGN KEY (user_id) REFERENCES users(id));",
    function (err) {
      if (err) throw err;
      console.log("participants TABLE created.");
    }
  );
}
 
 
 
createTables()
server.listen(
  process.env.SERVER_PORT,
  console.log(`server is running at port http://${process.env.SERVER_PORT}`)
);
  