const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = mongoose.Schema({
    _id: String,
    title: String,
    rating: Number,
    ratingCount: Number

}, { timestamps: true })


const Movie = mongoose.model('Movie', movieSchema);

module.exports = { Movie }
