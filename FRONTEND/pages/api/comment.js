import { mongooseConnect } from "@/lib/mongoose";
import { Comment } from "@/models/Comment";

export default async function handle(req, res) {
  await mongooseConnect(); // Ensure database connection

  const { method } = req;

  if (method === "POST") {
    try {
      const { name, email, title, contentpera, parent, rating } = req.body;

      let commentDoc;
      if (parent) {
        // Create a child comment
        commentDoc = await Comment.create({
          name,
          email,
          title,
          contentpera,
          rating,
          parent,
        });

        // Update the parent comment
        await Comment.findByIdAndUpdate(parent, {
          $push: { children: commentDoc._id },
        });
      } else {
        // Create a root comment
        commentDoc = await Comment.create({
          name,
          email,
          title,
          contentpera,
          rating,
        });
      }

      res.status(201).json(commentDoc);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create a comment" });
    }
  } else if (method === "DELETE") {
    try {
      const { id } = req.query;
      console.log("Deleting comment with ID:", id); // Debugging log
      await Comment.findByIdAndDelete(id);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }

  } else if (method === "PUT") {
    try {
      const { id } = req.query; // Extract the comment ID from the query params
      const { name, email, title, contentpera, rating } = req.body;

      // Update the comment
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { name, email, title, contentpera, rating },
        { new: true } // Return the updated document
      );

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: "Failed to update comment" });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
