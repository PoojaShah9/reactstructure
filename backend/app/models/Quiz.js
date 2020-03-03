const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    quiz_id : String,
    question :String,
    answers : Array,
    correct: String
});


var quiz = mongoose.model('quiz', quizSchema);
module.exports = quiz;
