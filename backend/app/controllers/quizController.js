const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const Promise = require('bluebird')

const Quiz = mongoose.model('quiz');
const FeedBack = mongoose.model('feedback');

let getQuestions = (req, res) => {

    let getQue = () => {
        console.log("getQue");
        return new Promise((resolve, reject) => {
            Quiz.find({}, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while get questions", "getQuestions => getQue()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of addUser

    getQue()
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let getTotal = (req, res) => {

    let getTotalNumber = () => {
        console.log("getQue");
        return new Promise((resolve, reject) => {
            FeedBack.find({})
                .count()
                .then((data) => {
                    console.log('data', data)
                    resolve({totalCount: data});
                })
                .catch((e) => {
                    logger.error("Internal Server error while get questions", "getQuestions => getQue()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                })

            /* , function (err, feedbacks) {
             if (err) {
                 logger.error("Internal Server error while get questions", "getQuestions => getQue()", 5);
                 let apiResponse = response.generate(true, err, 500, null);
                 reject(apiResponse);
             } else {
                 console.log('feedbac', feedbacks)
                 if(feedbacks.isArray){
                     resolve({totalCount:feedbacks.length});
                 } else {
                     resolve({totalCount:0});
                 }

             }*/
            // })
        });
    }; // end of addUser

    getTotalNumber()
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let setquestions = (req, res) => {

    let setQue = () => {
        console.log("setQue");
        return new Promise((resolve, reject) => {
            Quiz.create({
                quiz_id: shortid.generate(),
                question: 'abcd',
                answers: ['a', 'b', 'c', 'd'],
                correct: 'c'
            }, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while get questions", "setquestions => setQue()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of addUser

    setQue()
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let setanswer = (req, res) => {

    let setANs = () => {
        console.log("setANs");
        return new Promise((resolve, reject) => {
            FeedBack.create(req.body.answers, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while save answer", "setanswer => setANs()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of addUser

    setANs()
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

module.exports = {
    getQuestions: getQuestions,
    getTotal: getTotal,
    setquestions: setquestions,
    setanswer: setanswer,
}
