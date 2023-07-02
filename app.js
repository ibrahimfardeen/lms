const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));


// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lms',
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    console.log(req.body);

    var username = req.body.username;
    var password = req.body.password;

    var checkUser = "select * from user where username = ? and password = ?";
    connection.query(checkUser, [username, password], function (error, results) {
        if (error) throw error;

        if (results.length == 0) {
            res.render("error", {
                message: "Entered Username or Password is wrong",
                link: '/login'
            });
        } else {
            res.redirect('/books');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    //console.log(req.body);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    var checkEmail = "select email from user where email = ?";
    connection.query(checkEmail, [email], function (error, results) {
        if (error) throw error;

        if (results.length > 0) {
            res.render("error", {
                message: "Entered Email is already in use"
            });
        } else if (password != confirmPassword) {
            return res.render('error', {
                message: "Passwords do not match",
                link: '/register'
            });
        } else {
            var query = "INSERT INTO user(username, email, password) VALUES (?, ?, ?)"

            connection.query(query, [username, email, password], function (error, result) {
                if (error) throw error;
                res.redirect('/login');

            });
        }
    });
});

app.get('/error', (req, res) => {
    res.render('error', {
        message: 'Test Error message'
    });
});

app.get('/books', (req, res) => {
    // Query to get all values from a table (replace 'your_table' with your actual table name)
    res.render('book');
});

// Start the server
app.listen(7000, () => {
    console.log('Server is listening on port 7000');
});
