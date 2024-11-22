const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.status(200).send(JSON.stringify(books, null, 4));
    return res.status(404).json({ message: "An error has occured trying to retrieve all the books" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4))
    return res.status(300).json({ message: `Book with ISBN ${isbn} not found.` });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    // Extract the author name from the request parameters
    const authorName = req.params.author;

    // Get all keys of the 'books' object
    const bookKeys = Object.keys(books);

    // Array to store books by the given author
    const booksByAuthor = [];

    // Iterate through the 'books' object and check if the author matches
    bookKeys.forEach((key) => {
        if (books[key].author === authorName) {
            booksByAuthor.push(books[key]);
        }
    });

    // Check if any books were found for the given author
    if (booksByAuthor.length > 0) {
        return res.status(200).send(booksByAuthor);
    } else {
        return res.status(404).json({ message: `No books found by author ${authorName}.` });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const bookTitle = req.params.title;
    let bookByTitle = null;

    Object.keys(books).forEach((key) => {
        if (books[key].title === bookTitle) {
            bookByTitle = books[key];
        }
    });

    if (bookByTitle) {
        return res.status(200).send(bookByTitle);
    } else {
        return res.status(404).json({ message: `No book found with the title "${bookTitle}".` });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(b[isbn]);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.general = public_users;
