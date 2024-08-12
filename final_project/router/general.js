const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }
  const userList = (username) => users.some(user => user.username === username);
  if (userList(username)) {
      return res.status(400).json({ message: 'User already exists!' });
  }
  users.push({ username, password });
  return res.status(201).json({ message: 'User successfully registered. Thanks, now you can proceed to login.' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const results = Object.keys(books)
    .map(key => books[key])
    .filter(book => book.author === author);
  res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const results = Object.keys(books)
    .map(key => books[key])
    .filter(book => book.title === title);
  res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.json(book.reviews);
});

module.exports.general = public_users;
