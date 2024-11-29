const { Schema, models, model } = require('mongoose');

const CommentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  title: { type: String },
  contentpera: { type: String },
  maincomment: { type: Boolean },
  createAt: { type: Date, default: Date.now },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment' }, // reference to parent comment
  children: { type: Schema.Types.ObjectId, ref: 'Comment' }, // reference to child comment
  parentName: { type: String },
  rating: { type: Number, min: 1, max: 5 },// Optional field for rating
}, {
  timestamps: true, // Automatically manage createAt and updateAt
});

export const Comment = models.Comment || model('Comment', CommentSchema, 'comments');
