const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

// MySQL connection pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'insurance_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Set up EJS for rendering views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files (like CSS and JavaScript)
app.use(express.static('public'));

// Fetch data from MySQL and render it in the dashboard
app.get('/', (req, res) => {
  const query = 'SELECT * FROM insurance_applications';

  pool.execute(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data');
    }

    // Render the dashboard view with data from the database
    res.render('dashboard', { applications: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Dashboard is running at http://localhost:${port}`);
});