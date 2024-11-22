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

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
     // Filter the users array for any user with the same username and password
     let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
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
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // Extract the ISBN and review details from the request
    const isbn = req.params.isbn;
    const { review } = req.query;

    // Ensure the user is authenticated and get their username (from the session)
    const username = req.session.authorization.username; // Assuming session contains `username`
    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Check if the `review` query parameter is provided
    if (!review) {
        return res.status(400).json({ message: "Review content must be provided." });
    }

    // Initialize the reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review for the given user
    books[isbn].reviews[username] = review;

    // Respond with success
    return res.status(200).send(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
