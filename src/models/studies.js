const { faker } = require('@faker-js/faker')
const mysql = require('mysql');
const data=[];
for (let i = 0; i < 100; i++) {
    // Runs 5 times, with values of step 0 through 4.
    const personName = faker.person.firstName();
    const fakeDiseaseName = faker.lorem.word();

    data.push([personName,fakeDiseaseName])
  }


const db = mysql.createConnection({
    host:"localhost" ,
    user: "root" ,
    port:"3306",
    database: "portail"   
  });
  

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
        const sql = "INSERT INTO studies (name,disease) VALUES ?";
        db.query(sql,[data], function (err, result) {
          if (err) throw err;
          console.log("records inserted");
    });

  });