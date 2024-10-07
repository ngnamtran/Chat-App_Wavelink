const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const app = express();
const sql3 = sqlite3.verbose();

const CryptoJS = require("crypto-js"); // Password encryption thingy
const cookieParser = require('cookie-parser');

const cwd = process.cwd(); // Current Working Directory

app.use(express.static(cwd));//Use the Current Working Directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Create the db instance
const db = new sql3.Database('../users.db', (err) => {
  if (err)
    return console.error(err.message);
  console.log('Connected to the users.db SQLite database.');
  if (err)
    return console.error(err.message);
  console.log('Connected to the users.db SQLite database.');
});

//Create the users table
db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, lastlogin BIGINT, lastlogout BIGINT, contacts MEDIUMTEXT)', (err) => {
  if (err)
    return console.error(err.message);
  else
    console.log("New table created");
});

//Registration form action
app.post('/addUser', (req, res) => {
  const { username, password } = req.body;
  console.log("Checking username...");
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) console.log(err.message);
    else {
      if (row === undefined && checkCredentials(username, password)) {
        res.cookie("user", {
          Username: username,
          LastLogin: new Date().getTime(),
          LastLogout: 0
        });
        res.redirect('/index.html');
      } else {
        if (row !== undefined)
          res.cookie("user", { Username: '%%null:' + username });
        console.log('Username check failed...');
        res.redirect('/register.html');
      }
    }
  });
  console.log("Checking username...");
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) console.log(err.message);
    else {
      if (row === undefined && checkCredentials(username, password)) {
        res.cookie("user", {
          Username: username,
          LastLogin: new Date().getTime(),
          LastLogout: 0
        });
        res.redirect('/index.html');
      } else {
        if (row !== undefined)
          res.cookie("user", { Username: '%%null:' + username });
        console.log('Username check failed...');
        res.redirect('/register.html');
      }
    }
  });
});

app.get('/user', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err)
      return console.error(err.message);
    if (res.cookie.user)
      res.cookie("user", req.cookies.user);
    res.send(rows);
  });
});

app.post('/logout', (req, res) => {
  if (req.cookies.user && req.cookies.user.Username && req.cookies.user.LastLogin) { // If 'user' cookie(& its username&lastlogin values) exist in req.cookies, then set res.cookie;
    const currTime = new Date().getTime();
    res.cookie("user", {
      Username: req.cookies.user.Username,
      LastLogin: req.cookies.user.LastLogin,
      LastLogout: currTime
    });
    db.run(`UPDATE users SET lastlogout = '` + currTime + `' WHERE username = '` + req.cookies.user.Username + `';`);
  }
  res.redirect('/login.html');
});

app.get('/getUser', (req, res) => {
  db.all('SELECT username, lastlogin, lastlogout, contacts FROM users WHERE username=?', [req.body.username], (err, row) => {
    if (err)
      return console.error(err.message);
    else if (row != undefined)
      res.cookie("reqUser", {
        Username: row.username,
        LastLogin: row.lastlogin,
        LastLogout: row.lastlogout
      });
  });
});

// Using require to access http module
const http = require("http");
const PORT = process.env.PORT || 5500; // Port number

// Creating server
const server = http.createServer(
  // Server listening on port 2020
  (req, res) => {
    // Write a response to the client
    res.end();
  }
);
app.listen(PORT, error => {
  // Prints in console
  console.log(`Server listening on port ${PORT}`)
  console.log('Server is running on http://localhost:' + PORT + '/login.html');
});

//--Login stuff--//

app.post('/auth', (request, response) => {
  let username = request.body.username;
  let password = request.body.password;
  var hashString = CryptoJS.SHA512(password).toString();
  if (username && password) {
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, hashString], (err, row) => {
      console.log(row);
      if (err) {
        console.error(err);
      } else {
        if (row) {
          console.log('Login sucessful');
          const currTime = new Date().getTime();
          response.cookie("user", {
            Username: username,
            LastLogin: currTime,
            LastLogout: row.lastlogout
          });
          db.run(`UPDATE users SET lastlogin = '` + currTime + `' WHERE username = '` + username + `';`);
          response.redirect('/index.html');
        } else {
          console.log('Invalid username or password');
          response.redirect('/login.html');
          response.end();
        }
      }
    });
  } else {
    response.send('Please enter a username and password!');
    response.end();
  }
});

//--Credential Stuff--//
async function saveCredentials(username, password) {
  var hashString = CryptoJS.SHA512(password).toString();
  db.run(`INSERT INTO users (username, password, lastlogin, lastlogout) VALUES (?, ?, ?, ?)`, [username, hashString, new Date().getTime(), 0]);
  const users = db.all(`SELECT * FROM users`);
}

function checkCredentials(username, password) {
  let strongPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})';
  let pwd = "" + password;
  if (pwd.match(strongPassword)) {
    console.log('Password check passed!');
    if (username != 0) {
      console.log('attempting to save credentials..');
      username = username.replaceAll(',','_');
      saveCredentials(username, password);
      return true;
    }
  }
  console.log('Password check failed: ' + pwd.match(strongPassword) + ' : usr=' + username + ', pwd=' + password);
  return false;
}

function check() {
  let pwd = document.getElementById('password').value;
  let pwdConfirm = document.getElementById('passwordConfirm').value;
  let checker = document.getElementById('checker');

  if (pwd != "" && pwd == pwdConfirm) {
    checker.style.color = 'green';
    checker.innerHTML = 'matching';
    return true;
  } else {
    checker.style.color = 'red';
    checker.innerHTML = 'not matching';
  }
  return false;
}

function checkPWComplexity() {
  let passwordField = document.getElementById('password').value;

  if (passwordField.length >= 8)
    document.getElementById('pwLength').style.color = 'green';
  else
    document.getElementById('pwLength').style.color = '#AF0C0C';

  if (passwordField.match(/[a-z]/))
    document.getElementById('pwLowerCase').style.color = 'green';
  else
    document.getElementById('pwLowerCase').style.color = '#AF0C0C';

  if (passwordField.match(/[A-Z]/))
    document.getElementById('pwUpperCase').style.color = 'green';
  else
    document.getElementById('pwUpperCase').style.color = '#AF0C0C';

  if (passwordField.match(/\d/))
    document.getElementById('pwNumbers').style.color = 'green';
  else
    document.getElementById('pwNumbers').style.color = '#AF0C0C';

  if (passwordField.match(/[^a-zA-Z\d]/))
    document.getElementById('pwSpecialChar').style.color = 'green';
  else
    document.getElementById('pwSpecialChar').style.color = '#AF0C0C';

}

//--ACTUAL Cookie Stuff--//

function decodeCookie(encodedCookie = '') { return encodedCookie.replace('j', '').replace('%3A', '').replaceAll('%22', '"').replaceAll('%3A', ':').replaceAll('%2C', ',').replaceAll('%7B', '{').replaceAll('%7D', '}').replaceAll('%25', '%'); }
function getUsernameFromCookie(decodedCookie = '') { return decodedCookie.slice(6, -1).split(',')[0].slice(12, -1); }
function getLastloginFromCookie(decodedCookie = '') { return decodedCookie.slice(6, -1).split(',')[1].slice(12); }
function getLastlogoutFromCookie(decodedCookie = '') { return decodedCookie.slice(6, -1).split(',')[2].slice(13); }

/*--Date Conversions--*/

// Converts a number of weeks to a date;
// @Returns this date + (weeks); can be used for expire date;
function weeksToDate(weeks) {
  const d = new Date();
  d.setTime(d.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));
  return d.toUTCString();
}

// Converts a number of days to a date;
// @Returns this date + (days); can be used for expire date;
function daysToDate(days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  return d.toUTCString();
}

// Converts a number of hours to a date;
// @Returns this date + (hours); can be used for expire date;
function hoursToDate(hours) {
  const d = new Date();
  d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
  return d.toUTCString();
}

// Converts a number of seconds to a date;
// @Returns this date + (seconds); can be used for expire date;
function secondsToDate(seconds) {
  const d = new Date();
  d.setTime(d.getTime() + (seconds * 1000));
  return d.toUTCString();
}

// Converts a number of seconds to a date;
// @Returns this date + (seconds); can be used for expire date;
function secondsToDate(seconds) {
  const d = new Date();
  d.setTime(d.getTime() + (seconds * 1000));
  return d.toUTCString();
}

//--Other Functionality--//

// Toggles password visibility
function togglePW() {
  let passwordField = document.getElementById("password");
  let confirmPasswordField = document.getElementById("passwordConfirm");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    confirmPasswordField.type = "text";
  }
  else {
    passwordField.type = "password";
    confirmPasswordField.type = "password";
  }
}

// Sends the message when enter key is pressed while message-box is active
function enterMessage() {
  document.getElementById('btnSend').click();
  document.getElementById('txtSend').value = '';
}

// Sets the username in the greeting banner
function changeName() {
  document.getElementById('usersname').innerHTML = getUsernameFromCookie(decodeCookie(document.cookie));
}

// Checks if an invalid username was entered
function checkForInvalidUsername() {
  if (document.cookie) {
    let data = getUsernameFromCookie(decodeCookie(document.cookie));
    let nullity = data.substring(0, 7);
    let username = data.slice(7);
    console.log(data);
    console.log(nullity);
    console.log(username);
    if (username.length != 0)
      if (nullity == '%%null:') {
        alert('Username `' + username + '` has been taken.');
        document.cookie = 'user=; expires=' + secondsToDate(1);
      }
      else
        alert('Invalid username: `' + username + '`');
  }
}

// Checks if a user has this user as a contact
function isContactOf(username){
  let isContact = false;
  db.get(`SELECT contacts FROM users WHERE username = ?`, [username], (err, row) => {
    console.log(row);
    if (err) {
      console.error(err);
    } else if (row) {
      const contacts = row.split(',');
      for(const user of contacts)
        if(user==username)
          isContact = true;
    } else {
      console.log('User "'+username+'" not found');
      // Something else
    }
  });
  return isContact;
} 