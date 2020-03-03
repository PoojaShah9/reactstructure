const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const tokenLib = require('../libs/tokenLib');
const Promise = require('bluebird')

const User = mongoose.model('User');
const tokenCol = mongoose.model('tokenCollection');

let createUser = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.firstName && req.body.lastName && req.body.email && req.body.password) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter firstName, lastName, email or password is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.find({email: req.body.email}, function (err, userDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetail)) {
                    resolve();
                } else {
                    logger.error("User Already Exists", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User Already Exists", 401, null);
                    reject(apiResponse);
                }
            })
        });
    }; // end of checkUser

    let addUser = () => {
        console.log("addUser");
        return new Promise((resolve, reject) => {
            let body = {
                user_id: shortid.generate(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: (req.body.email),
                password: (req.body.password),
            };
            console.log('body', body);
            User.create(body, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while create User", "createUser => addUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of addUser

    validatingInputs()
        .then(checkUser)
        .then(addUser)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let getUser = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.username && req.params.customer_id) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter username or customer_id is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.find({username: req.params.username, customer_id: req.params.customer_id}, function (err, userDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetail)) {
                    logger.error("User doesnt Exists", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User doesnt Exists", 401, null);
                    reject(apiResponse);
                } else {
                    resolve(userDetail);
                }
            })
        });
    }; // end of checkUser

    validatingInputs()
        .then(checkUser)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let loginUser = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.email && req.body.password) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter email or password is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.findOne({
                email: req.body.email,
            }, function (err, userDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "loginUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetail)) {
                    logger.error("User does not Exists", "loginUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User does not Exists", 401, null);
                    reject(apiResponse);
                } else {
                    if (userDetail.password && userDetail.password !== '' && userDetail.password !== null) {
                        Promise.all([pwdMatch(userDetail)])
                            .then((data)=>{
                                resolve({user: userDetail,  password: true, tokens: data[0]});
                            })
                            .catch((e)=>{
                                reject(e);
                            })
                    } else {
                        console.log('else data');
                        resolve({user: userDetail, password: false, tokens: {}});
                    }
                }
            })
        });
    }; // end of checkUser

    let pwdMatch = (userDetails) => {
        console.log("pwdMatch");
        return new Promise((resolve, reject) => {
            let password = req.body.password
            userDetails.comparePassword(password, function (err, match) {
                if (err) {
                    logger.error("Internal Server Error while compare password", "loginUser => pwdMatch()", 5);
                    let apiResponse = response.generate(true, "Internal Server Error while compare password", 500, null);
                    reject(apiResponse);
                } else {
                    if (match === true) {
                        generateToken(userDetails)
                            .then((finaltokens)=>{
                                resolve(finaltokens);
                            })
                            .catch((e)=>{
                                reject(e)
                            })

                    } else {
                        logger.error("Wrong Password", "loginUser => pwdMatch()", 5);
                        let apiResponse = response.generate(true, "Wrong Password", 401, null);
                        reject(apiResponse);
                    }
                }
            });
        });
    } // end of pwdMatch function

    let generateToken = (user) => {
        console.log("generateToken");
        return new Promise((resolve, reject) => {
            tokenLib.generateToken(user, (err, tokenDetails) => {
                if (err) {
                    logger.error("Failed to generate token", "userController => generateToken()", 10);
                    let apiResponse = response.generate(true, "Failed to generate token", 500, null);
                    reject(apiResponse);
                } else {
                    let finalObject = user.toObject();
                    delete finalObject.__v;
                    tokenDetails.userId = user._id
                    tokenDetails.userDetails = finalObject;
                    saveToken(tokenDetails)
                        .then((savetokenres)=>{
                            resolve(savetokenres);
                        })
                        .catch((e)=>{
                            reject(e)
                        })
                }
            });
        });
    }; // end of generateToken

    let saveToken = (tokenDetails) => {
        console.log("saveToken");
        return new Promise((resolve, reject) => {
            tokenCol.findOne({userId: tokenDetails.userId})
                .exec((err, retrieveTokenDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "Failed to save token", 500, null);
                        reject(apiResponse);
                    }
                    // player is logging for the first time
                    else if (check.isEmpty(retrieveTokenDetails)) {
                        let newAuthToken = new tokenCol({
                            userId: tokenDetails.userId,
                            authToken: tokenDetails.token,
                            // we are storing this is due to we might change this from 15 days
                            tokenSecret: tokenDetails.tokenSecret,
                            tokenGenerationTime: new Date().getTime()
                        });

                        newAuthToken.save((err, newTokenDetails) => {
                            if (err) {
                                let apiResponse = response.generate(true, "Failed to save token", 500, null);
                                reject(apiResponse);
                            } else {
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                };
                                resolve(responseBody);
                            }
                        });
                    }
                    // user has already logged in need to update the token
                    else {
                        retrieveTokenDetails.authToken = tokenDetails.token;
                        retrieveTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                        retrieveTokenDetails.tokenGenerationTime = new Date().getTime();
                        retrieveTokenDetails.save((err, newTokenDetails) => {
                            if (err) {
                                let apiResponse = response.generate(true, "Failed to save token", 500, null);
                                reject(apiResponse);
                            } else {
                                delete tokenDetails._id;
                                delete tokenDetails.__v;
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                };
                                resolve(responseBody);
                            }
                        });
                    }
                });
        });

    }; // end of saveToken

    validatingInputs()
        .then(checkUser)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let logout = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.email && req.body.password) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter email or password is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.findOne({
                email: req.body.email,
            }, function (err, userDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "loginUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetail)) {
                    logger.error("User does not Exists", "loginUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User does not Exists", 401, null);
                    reject(apiResponse);
                } else {
                    if (userDetail.password && userDetail.password !== '' && userDetail.password !== null) {
                        Promise.all([pwdMatch(userDetail)])
                            .then((data)=>{
                                resolve({user: userDetail,  password: true, tokens: data[0]});
                            })
                            .catch((e)=>{
                                reject(e);
                            })
                    } else {
                        console.log('else data');
                        resolve({user: userDetail, password: false, tokens: {}});
                    }
                }
            })
        });
    }; // end of checkUser

    let pwdMatch = (userDetails) => {
        console.log("pwdMatch");
        return new Promise((resolve, reject) => {
            let password = req.body.password
            userDetails.comparePassword(password, function (err, match) {
                if (err) {
                    logger.error("Internal Server Error while compare password", "loginUser => pwdMatch()", 5);
                    let apiResponse = response.generate(true, "Internal Server Error while compare password", 500, null);
                    reject(apiResponse);
                } else {
                    if (match === true) {
                        generateToken(userDetails)
                            .then((finaltokens)=>{
                                resolve(finaltokens);
                            })
                            .catch((e)=>{
                                reject(e)
                            })

                    } else {
                        logger.error("Wrong Password", "loginUser => pwdMatch()", 5);
                        let apiResponse = response.generate(true, "Wrong Password", 401, null);
                        reject(apiResponse);
                    }
                }
            });
        });
    } // end of pwdMatch function

    let generateToken = (user) => {
        console.log("generateToken");
        return new Promise((resolve, reject) => {
            tokenLib.generateToken(user, (err, tokenDetails) => {
                if (err) {
                    logger.error("Failed to generate token", "userController => generateToken()", 10);
                    let apiResponse = response.generate(true, "Failed to generate token", 500, null);
                    reject(apiResponse);
                } else {
                    let finalObject = user.toObject();
                    delete finalObject.__v;
                    tokenDetails.userId = user._id
                    tokenDetails.userDetails = finalObject;
                    saveToken(tokenDetails)
                        .then((savetokenres)=>{
                            resolve(savetokenres);
                        })
                        .catch((e)=>{
                            reject(e)
                        })
                }
            });
        });
    }; // end of generateToken

    let saveToken = (tokenDetails) => {
        console.log("saveToken");
        return new Promise((resolve, reject) => {
            tokenCol.findOne({userId: tokenDetails.userId})
                .exec((err, retrieveTokenDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "Failed to save token", 500, null);
                        reject(apiResponse);
                    }
                    // player is logging for the first time
                    else if (check.isEmpty(retrieveTokenDetails)) {
                        let newAuthToken = new tokenCol({
                            userId: tokenDetails.userId,
                            authToken: tokenDetails.token,
                            // we are storing this is due to we might change this from 15 days
                            tokenSecret: tokenDetails.tokenSecret,
                            tokenGenerationTime: new Date().getTime()
                        });

                        newAuthToken.save((err, newTokenDetails) => {
                            if (err) {
                                let apiResponse = response.generate(true, "Failed to save token", 500, null);
                                reject(apiResponse);
                            } else {
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                };
                                resolve(responseBody);
                            }
                        });
                    }
                    // user has already logged in need to update the token
                    else {
                        retrieveTokenDetails.authToken = tokenDetails.token;
                        retrieveTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                        retrieveTokenDetails.tokenGenerationTime = new Date().getTime();
                        retrieveTokenDetails.save((err, newTokenDetails) => {
                            if (err) {
                                let apiResponse = response.generate(true, "Failed to save token", 500, null);
                                reject(apiResponse);
                            } else {
                                delete tokenDetails._id;
                                delete tokenDetails.__v;
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                };
                                resolve(responseBody);
                            }
                        });
                    }
                });
        });

    }; // end of saveToken

    validatingInputs()
        .then(checkUser)
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
    createUser: createUser,
    getUser: getUser,
    loginUser: loginUser,
    logout: logout,
}
