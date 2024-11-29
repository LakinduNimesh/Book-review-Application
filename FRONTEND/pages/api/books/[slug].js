import { mongooseConnect } from '@/lib/mongoose';
import { Books } from '@/models/Book';
import { Comment } from '@/models/Comment';

export default async function handler(req, res) {

  const { slug } = req.query;

  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      //getch book by slug
      const book = await Books.findOne({ slug });

      if (!book) {
        return res.status(404).json({ message: ' book Not Found' });
      }

      //fetch comments for the  book 

      const comments = await Comment.find({ book: book._id }).sort({ createdAt: -1 });

      res.status(200).json({ book, comments })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' })
    }

  } else if (req.method === 'POST') {
    try {
      const { name, email, title, contentpera, maincomment, parent } = req.body;
      const book = await Books.findOne({ slug });

      if (!book) {
        return res.status(404).json({ message: 'book Not Found' })

      }

      if (parent) {
        // if it's a child comment, finf the parent coment
        const parentComment = await Comment.findById(parent);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent Comment Not Found' })

        }

        //create the child comment 
        const newComment = new Comment({
          name,
          email,
          title,
          contentpera,
          maincomment,
          parent: parentComment._id,
          book: book._id,
          parentName: parentComment.name //Optionaly , Store parent name for display purposes

        })

        //save the childf comment 
        await newComment.save();

        //update parent comment to include the child comment 
        parentComment.children.push(newComment._id);

        await parentComment.save();

        res.status(201).json(newComment);
      } else {
        // if its a root comment no parent, create it directly 

        const newComment = new Comment({
          name,
          email,
          title,
          contentpera,
          maincomment,
          book: book._id
        });

        await newComment.save();

        res.status(201).json(newComment);
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Parent Comment Not Found' })

    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

}
