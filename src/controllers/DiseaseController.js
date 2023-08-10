const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("../config");
app.use(express.static("./public"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//const Axios = require("axios");
 
// API to add a new disease to a user
async function add_disease(req, res) {
    const { user_id, disease_name } = req.body;
  
    if (!user_id || !disease_name) {
      return res.status(400).json({ error: 'User ID and disease name are required.' });
    }
  
    const checkUserDiseaseQuery = 'SELECT * FROM user_diseases WHERE user_id = ? AND disease_id = (SELECT id FROM diseases WHERE name = ? limit 1)';
  
    // Check if the user already has the disease
    db.query(checkUserDiseaseQuery, [user_id, disease_name], (err, result) => {
      if (err) {
        console.error('Error checking user diseases:', err);
        return res.status(500).json({ error: 'Failed to add disease to user' });
      }
  
      if (result.length > 0) {
        // The user already has the disease, so return an error
        return res.status(400).json({ error: 'User already has this disease.' }); 
      }
  
      const insertDiseaseQuery = 'INSERT INTO diseases (name) VALUES (?)';
      const insertUserDiseaseQuery = 'INSERT INTO user_diseases (user_id, disease_id) VALUES (?, ?)';
  
      // Start a transaction to ensure both queries are executed atomically
      db.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).json({ error: ' Failed to add disease to user.' });
        }
     
        db.query(insertDiseaseQuery, [disease_name], (err, result) => {
          if (err) {
            console.error('Error adding new disease:', err);
            db.rollback(() => {
              return res.status(500).json({ error: 'Failed to add disease to user.' });
            });
          }
  
          const disease_id = result.insertId;
  
          db.query(insertUserDiseaseQuery, [user_id, disease_id], (err) => {
            if (err) {
              console.error('Error adding disease to user:', err);
              db.rollback(() => {
                return res.status(500).json({ error: 'Failed to add disease to user.' });
              });
            }
  
            // If both queries were successful, commit the transaction
            db.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                db.rollback(() => {
                  return res.status(500).json({ error: 'Failed to add disease to user.' });
                });
              }
  
              return res.status(201).json({ message: 'Disease added to user successfully.' });
            });
          });
        });
      });
    });
  }
  async function getUserDiseases(req, res) {
    const user_id=req.params.user_id
  
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
  
    const getUserDiseasesQuery =
      'SELECT diseases.name FROM diseases ' +
      'JOIN user_diseases ON diseases.id = user_diseases.disease_id ' +
      'WHERE user_diseases.user_id = ?';
  
    db.query(getUserDiseasesQuery, [user_id], (err, result) => {
      if (err) {
        console.error('Error fetching user diseases:', err);
        return res.status(500).json({ error: 'Failed to fetch user diseases.' });
      }
  
      const userDiseases = result.map((row) => row.name);
      return res.status(200).json({ user_diseases: userDiseases });
    });
  }


module.exports = {
    add_disease,
    getUserDiseases
};