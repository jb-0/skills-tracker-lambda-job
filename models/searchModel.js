const mongoose = require('mongoose');

/**
 * Schema is used to save search parameters. Also contains daily count of no. of jobs on reed
 */
const searchSchema = new mongoose.Schema({
  searchTerms: { type: Object, required: true },
  dailySearchTermCount: { type: Array, required: false },
});

const Search = mongoose.model('Search', searchSchema);

module.exports = { Search };
