import { mongooseConnect } from "@/lib/mongoose";
import { Books } from "@/models/Book";


export default async function handle(req, res) {

  //if authenticated connect to MongoDb

  await mongooseConnect();

  const { method } = req;

  if (method === 'POST') {
    const { title, slug, author, images, description, bookcategory, tags, status } = req.body;

    const bookDoc = await Books.create({
      title, slug, author, images, description, bookcategory, tags, status
    })

    res.json(bookDoc)
  }

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Books.findById(req.query.id))

    } else {
      res.json((await Books.find()).reverse())
    }
  }


  if (method === 'PUT') {
    const { _id, title, slug, author, images, description, bookcategory, tags, status } = req.body;

    await Books.updateOne({ _id }, {
      title, slug, author, images, description, bookcategory, tags, status
    });
    res.json(true)
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Books.deleteOne({ _id: req.query?.id })
      res.json(true)
    }
  }


}