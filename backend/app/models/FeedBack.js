const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    feedback_id : String,
    email :String,
    user : Object
});


var feedback = mongoose.model('feedback', feedbackSchema);
module.exports = feedback;
