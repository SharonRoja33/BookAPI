require("dotenv").config();

//Frame work
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Initializing express
const shapeAI = express();

//configurations
shapeAI.use(express.json());

// Establish database connection
mongoose
    .connect(process.env.MONGO_URL,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
 ).then(() => console.log("connection established!!!!"));

/* 
Route               /
Description         get all books
Access              PUBLIC
Parameters          NONE
Method              GET
*/

shapeAI.get("/", (req, res) => {
    
    return res.json({books: database.books});
});

/* 
Route               /is/:isbn
Description         get specific book based on ISBN
Access              PUBLIC
Parameters          isbn
Method              GET
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/* 
Route               /c
Description         get specific books based on category
Access              PUBLIC
Parameters          category
Method              GET
*/
shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getSpecificBooks.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ book: getSpecificBooks });
});

/* 
Route               /author/:id
Description         get a list of books based on author's id
Access              PUBLIC
Parameters          author id
Method              GET
*/
shapeAI.get("/author/:id", (req, res) => {
    const getListOfBooks = database.books.filter(
        (book) => book.authors.includes( req.params.id) 
    );
    

    if (getListOfBooks.length === 0) {
        return res.json({
            error: `No book found for the author ${req.params.id}`,
        });
    }

    return res.json({ books: getListOfBooks });
    
});



/* 
Route               /author
Description         get all authors
Access              PUBLIC
Parameters          NONE
Method              GET
*/
shapeAI.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
});

/* 
Route               /author/:name
Description         get specific author based on author's name
Access              PUBLIC
Parameters          name
Method              GET
*/
shapeAI.get("/author/:name", (req, res) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.name === req.params.name
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `No author found having name ${req.params.name}`,
        });
    }

    return res.json({ author: getSpecificAuthor });
});


/* 
Route               /authors/:isbn
Description         get a list of authors based on a book's isbn
Access              PUBLIC
Parameters          isbn        
Method              GET
*/
shapeAI.get("/authors/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthors.length === 0) {
        return res.json({
            error: `No author found for the book  ${req.params.isbn}`,
        });
    }

    return res.json({ authors: getSpecificAuthors });
});

/* 
Route               /publications
Description         get all publications
Access              PUBLIC
Parameters          NONE        
Method              GET
*/
shapeAI.get("/publications", (req, res) => {
    return res.json({publications: database.publications});
});


/* 
Route               /publication/:name
Description         get specific publication based on it's name
Access              PUBLIC
Parameters          name       
Method              GET
*/
shapeAI.get("/publication/:name", (req, res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.name == req.params.name
    )
    if (getSpecificPublication.length === 0) {
        return res.json({
            error: `No book found for the publication ${req.params.name}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});

/* 
Route               /publications/:isbn
Description         get a list of publications based on a book's isbn
Access              PUBLIC
Parameters          isbn      
Method              GET
*/
shapeAI.get("/publications/:isbn", (req, res) => {
    const getSpecificPublications = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn)
    )
    if (getSpecificPublications.length === 0) {
        return res.json({
            error: `No publications found for the book ${req.params.isbn}`,
        });
    }

    return res.json({ publications: getSpecificPublications });
});


/* 
Route               /book/new
Description         add new book
Access              PUBLIC
Parameters          NONE      
Method              POST
*/
shapeAI.post("/book/new", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books, message: "book was added!" });
});

/* 
Route               /author/new
Description         add new author
Access              PUBLIC
Parameters          NONE      
Method              POST
*/
shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({ authors: database.authors, message: "Author was added!" });
});

/* 
Route               /publication/new
Description         add new publication
Access              PUBLIC
Parameters          NONE      
Method              POST
*/
shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json({ publications: database.publications, message: "Publication was added!" });
});

/* 
Route               /book/update
Description         update title of a book
Access              PUBLIC
Parameters          isbn      
Method              PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({ books: database.books });
});

/* 
Route               /book/author/update
Description         update/add new author
Access              PUBLIC
Parameters          isbn      
Method              PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
            return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
        return author.books.push(req.params.isbn);
    });

    return res.json({ 
        books: database.books, 
        authors: database.authors,
        message: "New author was added!!",
    });
});

/* 
Route               /author/update
Description         Update name of Author 
Access              PUBLIC
Parameters          id     
Method              PUT
*/
shapeAI.put("/author/update/:idn", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === req.params.idn) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ authors: database.authors });
});

/* 
Route               /publication/update
Description         Update name of publication 
Access              PUBLIC
Parameters          id     
Method              PUT
*/
shapeAI.put("/publication/update/:ID", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === req.params.ID) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({ publications: database.publications });
});

/* 
Route               /publication/update/book
Description         Update/add a new book to publication 
Access              PUBLIC
Parameters          isbn    
Method              PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication",
    });
});

/* 
Route               /book/delete
Description         delete a book
Access              PUBLIC
Parameters          isbn    
Method              DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
    
});

/* 
Route               /book/delete/author
Description         Delete an author
Access              PUBLIC
Parameters          isbn, author id  
Method              DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });
    
    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );
            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        message: "author was deleted!!!",
        book: database.books,
        author: database.authors,
    });
});

/* 
Route               /publication/delete/book
Description         Delete a book from publication
Access              PUBLIC
Parameters          isbn, publication id  
Method              DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            );

            publication.books = newBooksList;
            return;
        }
    });

    // update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0; // no publication available
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
    });
});

shapeAI.listen(3000, () => console.log("Server running!!!"));
