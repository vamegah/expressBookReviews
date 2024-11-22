const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ username: username, password: password });
            return res
                .status(200)
                .json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Simulate a local database fetch with a Promise
const fetchBooks = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(books); // Resolve with the local books data
        } catch (error) {
            reject(new Error("Failed to fetch books."));
        }
    });
};

// Get the list of books available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        const bookList = await fetchBooks(); // Simulate async data fetch
        return res.status(200).json(bookList);
    } catch (error) {
        console.error("Error retrieving books:", error.message);
        return res.status(500).json({ message: "An error occurred while retrieving books." });
    }
});

// Get the list of books available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    //Write your code here
    fetchBooks()
        .then(books => {
            return res.status(200).send(JSON.stringify(books, null, 4));
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        })
});

// Simulate a local database fetch with a Promise
const fetchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books[isbn]; // Get the book by ISBN from the local object
        if (book) {
            resolve(book); // Resolve if the book exists
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found.`)); // Reject if not found
        }
    });
};

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await fetchBookByISBN(isbn); // Simulate async data fetch
        return res.status(200).send(book);
    } catch (error) {
        console.error("Error retrieving book:", error.message);
        return res.status(404).json({ message: error.message });
    }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    fetchBookByISBN(isbn)
        .then(book => {
            return res.status(200).send(book)
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        })

});

// Simulate a local database fetch with a Promise
const fetchBooksByAuthor = (authorName) => {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const booksByAuthor = [];

        // Iterate through the books object to find books by the given author
        bookKeys.forEach((key) => {
            if (books[key].author === authorName) {
                booksByAuthor.push(books[key]);
            }
        });

        // Resolve or reject based on the result
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject(new Error(`No books found by author ${authorName}.`));
        }
    });
};
// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
    try {
        const booksByAuthor = await fetchBooksByAuthor(authorName); // Simulate async data fetch
        return res.status(200).send(booksByAuthor);
    } catch (error) {
        console.error("Error retrieving books by author:", error.message);
        return res.status(404).json({ message: error.message });
    }
});

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author;
    fetchBooksByAuthor(authorName)
        .then(booksByAuthor => {
            return res.status(200).json(booksByAuthor);
        })
        .catch(error => {
            console.error("Error retrieving books by author:", error.message);
            return res.status(404).json({ message: error.message });
        });
});

// Get book details based on author without promise or async/await
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

// Simulate a local database fetch with a Promise
const fetchBooksByTitle = (bookTitle) => {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const booksByTitle = [];

        // Iterate through the books object to find books by the given author
        bookKeys.forEach((key) => {
            if (books[key].title === bookTitle) {
                booksByTitle.push(books[key]);
            }
        });

        // Resolve or reject based on the result
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject(new Error(`No books found by author ${bookTitle}.`));
        }
    });
};
// Get book details based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    const bookTitle = req.params.title;
    try {
        const booksByTitle = await fetchBooksByTitle(bookTitle); // Simulate async data fetch
        return res.status(200).send(booksByTitle);
    } catch (error) {
        console.error("Error retrieving books by title:", error.message);
        return res.status(404).json({ message: error.message });
    }
});
// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title;
    fetchBooksByTitle(bookTitle)
        .then(booksByTitle => {
            return res.status(200).send(booksByTitle);
        })
        .catch(error => {
            console.error("Error retrieving books by author:", error.message);
            return res.status(404).json({ message: error.message });
        });
});

// Get all books based on title without callback promise or async/await
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
        return res.status(200).send(books[isbn]);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.general = public_users;
