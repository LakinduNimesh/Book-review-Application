import { mongooseConnect } from "@/lib/mongoose";
import { Books } from "@/models/Book";

export default async function handle(req, res) {
  //if authenticated, connect to mongodb
  //if authenticated, connect to mongoDb

  await mongooseConnect();

  const { method } = req;

  if (method === 'GET') {
    if (req.query?.id) {
      // fetch a single book by id
      const book = await Books.findById(req.query.id);
      res.json(book);
    } else if (req.query?.tags) {
      // fetch Books by tags
      const booktag = await Books.find({ tags: req.query.tags });
      res.json(booktag);
    } else if (req.query?.bookcategory) {
      // fetch Books by category
      const bookscate = await Books.find({ bookcategory: req.query.bookcategory });
      res.json(bookscate);
    } else if (req.query?.slug) {
      // fetch bookscate by slug
      const bookSlug = await Books.find({ slug: req.query.slug });
      res.json(bookSlug.reverse());
    } else {
      //fetch all books
      const books = await Books.find();
      res.json(books.reverse());
    }
  } else {
    res.status(405).json({ message: 'method Not Allowed' });
  }




}