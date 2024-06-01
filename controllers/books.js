const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
const { validateISBN } = require("../util/validation");

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection("books").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("books")
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const createBook = async (req, res) => {
  const books = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    pages: req.body.pages,
    rating: req.body.rating,
    ISBN: req.body.ISBN,
    genre: req.body.genre,
    language: req.body.language,
  };

  const { error } = validateISBN(books.ISBN);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .insertOne(books);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while creating the book.");
  }
};

const updateBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const books = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    pages: req.body.pages,
    rating: req.body.rating,
    ISBN: req.body.ISBN,
    genre: req.body.genre,
    language: req.body.language,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .replaceOne({ _id: userId }, books);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while updating the book.");
  }
};

const deleteBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while deleting the book.");
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook,
};
