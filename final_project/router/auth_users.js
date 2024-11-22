const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const validusers = users.filter((user) => {
        return user.username === username;
    });

    return validusers.length === 0;

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let authenticatedUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    return authenticatedUsers.length !== 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract the ISBN and review details from the request
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    let validBook = books[isbn];
    if (validBook) {
        const reviews = validBook.reviews;
        const existingReview = reviews[username];
        reviews[username] = review;
        if (existingReview) {
            return res.status(200).send({ message: `Review for book with ISBN ${isbn} updated successfully.` });
        } else {
            return res.status(200).send({ message: `Review for book with ISBN ${isbn} added successfully.` });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});


// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let validBook = books[isbn];

    if (validBook) {
        const existingReview = validBook.reviews[username];
        if (existingReview) {
            delete validBook.reviews[username];
        }
        return res.status(200).send({ message: `Review for book with ISBN ${isbn} updated successfully.` });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
