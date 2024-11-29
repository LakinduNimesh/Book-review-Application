
const { Schema, models, model } = require('mongoose');

const BookSchema = new Schema({
  title: { type: String },
  slug: { type: String, required: true },
  author: { type: String },
  images: [{ type: String }],
  description: { type: String },
  bookcategory: [{ type: String }],
  tags: [{ type: String }],
  status: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, {
  timestamps: true, //this will automatically manage createAt and updateAt
});

export const Books = models.Books || model('Books', BookSchema, 'books');