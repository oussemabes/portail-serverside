const { app } = require("./app");
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);
const db = require("./config");
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
async function createTables(){

  await db.query(
    "CREATE TABLE IF NOT EXISTS users (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,name VARCHAR(30),email VARCHAR(30),password VARCHAR(255),admin VARCHAR(10),age int(3));",
    function (err) {
      if (err) throw err;
      console.log("users TABLE created.");
    }
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS studies (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255));",
    function (err) {
      if (err) throw err;
      console.log("studies TABLE created.");
    }
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS participants (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT(11) UNSIGNED, study_id INT(11) UNSIGNED, state VARCHAR(10), document VARCHAR(255), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (study_id) REFERENCES studies(id));",
    function (err) {
      if (err) throw err;
      console.log("participants TABLE created.");
    }
  );
}


//createTables()
server.listen(
  process.env.SERVER_PORT,
  console.log(`server is running at port http://${process.env.SERVER_PORT}`)
);
