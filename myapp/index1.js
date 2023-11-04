const express = require("express");
const dbTest = express();
let db = null;
const path = require("path");
const dbPath = path.join(__dirname, "goodreads.db");
const { open } = require("sqlite");
const sqlite = require("sqlite3");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
    dbTest.listen(3000, () => {
      console.log("Server is Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

dbTest.get("/books/", async (request, response) => {
  const getBooks = `
    SELECT * FROM book ORDER BY book_id
    `;
  const books = await db.all(getBooks);
  response.send(books);
});
//Get single book
dbTest.get("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const getSingleBookQuary = `
  SELECT * FROM book WHERE book_id = ${bookId}
  `;
  const getSingleBook = await db.get(getSingleBookQuary);
  response.send(getSingleBook);
});
//Add Book
dbTest.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});
