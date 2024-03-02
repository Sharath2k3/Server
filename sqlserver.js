// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Added for CORS support
const bodyParser = require('body-parser');

const app = express();
const port = 3004;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'sql6.freesqldatabase.com',
  user: 'sql6688053',
  password: '8r4UkuY1Eb',
  database: 'sql6688053',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

app.get('/api/packages', (req, res) => {
  const query = 'SELECT * from packages'; // Replace with your actual table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/packages/add', (req, res) => {
  const { location, duration, persons, price, rating, description, imageUrl } = req.body;
  const query = 'INSERT INTO packages (location, duration, persons, price, rating, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  const values = [location, duration, persons, price, rating, description, imageUrl];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding package to database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Package added successfully', id: results.insertId });
  });
});

app.post('/api/packages/delete', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM packages WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting package from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Package deleted successfully' });
  });
});


app.post('/api/feedback/add', (req, res) => {
  const { location, feedback, rating } = req.body;
  const feedbackQuery = 'INSERT INTO feedbacktable (location, feedback, rating) VALUES (?, ?, ?)';
  const feedbackValues = [location, feedback, rating];

  connection.query(feedbackQuery, feedbackValues, (err, feedbackResults) => {
    if (err) {
      console.error('Error adding feedback to database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Calculate the average rating for the specific location
    const averageRatingQuery = 'SELECT AVG(rating) AS averageRating FROM feedbacktable WHERE location = ?';
    connection.query(averageRatingQuery, [location], (err, averageResults) => {
      if (err) {
        console.error('Error calculating average rating:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const updatedRating = averageResults[0].averageRating || 0;

      // Update the 'packages' table with the calculated average rating for the corresponding location
      const updatePackageQuery = 'UPDATE packages SET rating = ? WHERE location = ?';
      const updatePackageValues = [updatedRating, location];

      connection.query(updatePackageQuery, updatePackageValues, (err) => {
        if (err) {
          console.error('Error updating package rating:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        res.json({ message: 'Feedback added successfully', id: feedbackResults.insertId, updatedRating });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
