const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaintingSchema = new Schema({
  name: String,
  url: String,
  technique: String
});

try {  // seems like a nasty hack, but getting error if model created more than once
  module.exports = mongoose.model('Painting');
} catch {
  module.exports = mongoose.model('Painting', PaintingSchema);
}
