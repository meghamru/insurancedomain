const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL connection pool setup using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',  // MySQL host from Docker Compose environment
  user: process.env.DB_USER || 'app_user',  // MySQL user from Docker Compose environment
  password: process.env.DB_PASSWORD || 'app_password',  // MySQL password from Docker Compose environment
  database: process.env.DB_NAME || 'insurance_app',  // MySQL database from Docker Compose environment
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve the login page
app.get('/', (req, res) => {
    // Login HTML content
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Page</title>
    </head>
    <body>
        <h2>Login Page</h2>
        <form action="/login" method="POST">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <button type="submit">Login</button>
        </form>
    </body>
    </html>
  `);
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Basic login validation (you can replace this with actual DB authentication)
  if (username === 'admin' && password === 'password') {
        // Successful login
    res.redirect('/application');
  } else {
        // Invalid login
    res.send('Invalid credentials, please try again.');
  }
});

// Serve the insurance form page after successful login
app.get('/application', (req, res) => {
    // Insurance User Entry Form HTML content
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Insurance User Entry Form</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 20px;
            }

            h1 {
                color: #4CAF50;
                text-align: center;
            }

            .form-container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #f9f9f9;
            }

            label {
                font-size: 16px;
                margin-bottom: 8px;
            }

            input, select, textarea {
                width: 100%;
                padding: 10px;
                margin: 8px 0 16px 0;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            button {
                width: 100%;
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
            }

            button:hover {
                background-color: #45a049;
            }

            .error {
                color: red;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <h1>Insurance User Entry Form</h1>
        <div class="form-container">
            <form id="insuranceForm" action="/submit" method="POST">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required>

                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required>

                <label for="dob">Date of Birth:</label>
                <input type="date" id="dob" name="dob" required>

                <label for="gender">Gender:</label>
                <select id="gender" name="gender" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label for="contactNumber">Contact Number:</label>
                <input type="tel" id="contactNumber" name="contactNumber" required>

                <label for="email">Email Address:</label>
                <input type="email" id="email" name="email" required>
                                
                <!-- Insurance Information -->
                <label for="insuranceType">Type of Insurance:</label>
                <select id="insuranceType" name="insuranceType" required>
                    <option value="Health">Health Insurance</option>
                    <option value="Life">Life Insurance</option>
                    <option value="Vehicle">Vehicle Insurance</option>
                    <option value="Home">Home Insurance</option>
                </select>

                <label for="coverageAmount">Coverage Amount (USD):</label>
                <input type="number" id="coverageAmount" name="coverageAmount" required min="1000" step="100">

                <label for="policyStartDate">Policy Start Date:</label>
                <input type="date" id="policyStartDate" name="policyStartDate" required>
                
                <!-- Additional Information -->
                <label for="comments">Any additional information or queries?</label>
                <textarea id="comments" name="comments" rows="4" placeholder="Please provide any additional details..."></textarea>

                                <!-- Submit Button -->
                <button type="submit">Submit Application</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

// Handle form submission and insert data into MySQL
app.post('/submit', (req, res) => {
  console.log(req.body);
  const { firstName, lastName, dob, gender, contactNumber, email, insuranceType, coverageAmount, policyStartDate, comments } = req.body;

  // Save form data to MySQL
  const query = `
    INSERT INTO insurance_applications 
    (first_name, last_name, dob, gender, contact_number, email, insurance_type, coverage_amount, policy_start_date, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.execute(query, [firstName, lastName, dob, gender, contactNumber, email, insuranceType, coverageAmount, policyStartDate, comments], (err, results) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      res.status(500).send('Error saving data');
    } else {
      console.log("Data inserted successfully:", results);
      res.send('<h1>Thank you for your submission!</h1>');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
