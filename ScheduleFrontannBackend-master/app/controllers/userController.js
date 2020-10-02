const mongoose = require('mongoose')

const shortid = require('shortid')
const nodemailer = require('nodemailer')

const authModel = mongoose.model('Auth')
const userModel = mongoose.model('User')
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/passwordLib')
const time = require('../libs/timLib')
const response = require('../libs/responseLib')
const logger = require('../libs/logger')
const token = require('../libs/tokenLib')
const appConfig = require('../Configuration/appConfig')
const countryName = require('../libs/countryName')
const countrynameCode = require('../libs/countrynameCode')
const phonecode = require('../libs/phonecode')


let getCountryNamesWithCodes = (req, res) => {
    let data = countrynameCode
    let apiResponse = response.generate(false, "Country names", 200, data)
    res.send(apiResponse)
}

let getCountryPhoneCodes = (req, res) => {
    let data = phonecode
    let apiResponse = response.generate(false, "Phone codes", 200, data)
    res.send(apiResponse)
}

//start getAllUsers function
let getAllUsers = (req, res) => {
    userModel.find()
        .select(' -__v -_id -password')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'getAllUsers', 10)
                let apiResponse = response.generate(true, "Failed to find user", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'getAllUser')
                let apiResponse = response.generate(true, "No user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "All user details found", 200, result)
                res.send(apiResponse)
            }
        })
} // end get all users

//start getAllNormalUsers function
let getAllNormalUsers = (req, res) => {
    userModel.find({
        isAdmin: false
    }, (err, result) => {
        if (err) {
            logger.error(err.message, 'getAllNormalUsers', 10)
            let apiResponse = response.generate(true, "Failed to find normal user", 404, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No user Found', 'getAllNormalUsers')
            let apiResponse = response.generate(true, "No user found", 500, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, "All normal user details found", 200, result)
            res.send(apiResponse)
        }
    })
} //end get all normal users

//start getAllAdminUsers function
let getAllAdminUsers = (req, res) => {
    userModel.find({
            isAdmin: true
        })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'getAllAdminUsers', 10)
                let apiResponse = response.generate(true, "Failed to find admin user", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'getAllAdminUsers')
                let apiResponse = response.generate(true, "No user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "All admin user details found", 200, result)
                res.send(apiResponse)
            }
        })
} //end get all admin users

//start getUserByUserId function
let getUserByUserId = (req, res) => {
    userModel.findOne({
            'userId': req.params.userId
        })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'getUserByUserId', 10)
                let apiResponse = response.generate(true, "Failed to find user", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'getUserByuserId')
                let apiResponse = response.generate(true, "No user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "User with specified userId found", 200, result)
                res.send(apiResponse)
            }
        })
} //end get user by userid

//start getAllNormalUsersCount function
let getAllNormalUsersCount = (req, res) => {
    userModel.count({
            isAdmin: false
        })
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'getAllNormalUsersCount', 10)
                let apiResponse = response.generate(true, "Failed to retrieve normal users data", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No normal user found', 'getAllNormalUsersCount')
                let apiResponse = response.generate(true, "No normal user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "Count retrieved of all normal users", 200, result)
                res.send(apiResponse)
            }
        })
} //end getAllNormalUsersCount function

//start getAllAdminUsersCount
let getAllAdminUsersCount = (req, res) => {
    userModel.count({
            isAdmin: true
        })
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'getAllAdminUsersCount', 10)
                let apiResponse = response.generate(true, "Failed to retrieve admin users data", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No admin user found', 'getAllAdminUsersCount')
                let apiResponse = response.generate(true, "No admin user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "Count retrieved of all admin users", 200, result)
                res.send(apiResponse)
            }
        })
} // end getAllAdminUsersCount function

//start deleteUserByUserId
let deleteUserByUserId = (req, res) => {
    userModel.findOneAndRemove({
            'userId': req.params.userId
        })
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'deleteUserByUserId', 10)
                let apiResponse = response.generate(true, "Failed to delete user", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No user found', 'deleteUserByUserId')
                let apiResponse = response.generate(true, "No user found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "Successfully deleted user", 200, null)
                res.send(apiResponse)
            }
        })
} //end deleteUserByUserId function

//start signUpFunction
let signUpFunction = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, "Email does not met the requirement", 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, "Password missing", 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                let apiResponse = response.generate(true, "Onr or more parameter(s) missing in the field", 400, null)
                reject(apiResponse)
            }

        })
    } //end validate user detalis function

    let createUser = () => {
        return new Promise((resolve, reject) => {
            userModel.findOne({
                    email: req.body.email
                })
                .exec((err, foundUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(foundUserDetails)) {
                        console.log(req.body)
                        let newUser = new userModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            fullName: req.body.firstName + ' ' + req.body.lastName,
                            country: req.body.country,
                            mobileNumber: req.body.mobileNumber,
                            email: req.body.email,
                            password: passwordLib.hashPassword(req.body.password),
                            isAdmin: req.body.isAdmin,
                            isUser : req.body.isUser,
                            uniqueUserName: req.body.uniqueUserName,
                            createdOn: time.now()
                        })
                        if (newUser.isAdmin === true) {
                            newUser.uniqueUserName = req.body.uniqueUserName + '-admin'
                        } else {
                            newUser.uniqueUserName = req.body.uniqueUserName
                        }
                        newUser.telCode = countryName.countryCallingCode(req.body.country)

                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                                console.log(newUserObj.password + 'is called and displayed')
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    } //end create user function
    validateParams(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.generate(false, 'User created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })

} //end signup function

//start login function
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log('findUser function is called')
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log(req.body)
                userModel.findOne({
                        email: req.body.email
                    })
                    .exec((err, userDetails) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to find user", 500, null)
                            reject(apiResponse)
                        } else if (check.isEmpty(userDetails)) {
                            let apiResponse = response.generate(true, "No user Found", 404, null)
                            reject(apiResponse)
                        } else {
                            logger.info('User Found', 'userController: findUser()')
                            resolve(userDetails)
                        }
                    })
            } else {
                let apiResponse = response.generate(true, "Email parameter is missing in the body parameter", 400, null)
                reject(apiResponse)
            }

        })
    } //end findUser function

    let validatePasswordInput = (retrievedUserDetails) => {
        //console.log(retrievedUserDetails + 'retrievedUserDetails is called')
        //console.log(req.body.password + 'is called')
        console.log("validatePasswordInput is called")
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    let apiResponse = response.generate(true, "Login failed", 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let userDetails = retrievedUserDetails.toObject()
                    delete userDetails.password
                    delete userDetails._id
                    delete userDetails._v
                    delete userDetails.createdOn
                    delete userDetails.modifiedOn
                    resolve(userDetails)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePasswordInput')
                    let apiResponse = response.generate(true, "Invalid login password", 400, null)
                    reject(apiResponse)
                }
            })
        })
    } //end validatePasswordInput function

    let generateToken = (userDetails) => {
        console.log("Generate token is called")
        return new Promise((resolve, reject) => {
            token.generateJwt(userDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error("Failed to generate token", "generateToken()", 10)
                    let apiResponse = response.generate(true, "Failed to generate token", 500, null)
                    reject(apiResponse)
                } else {
                    logger.info("Successfull", "generateToken()")
                    tokenDetails.userId = userDetails.userId;
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails)
                }
            })
        })
    } //end generateToken function

    let saveToken = (tokenDetails) => {
        console.log("SaveToken function is called")
        return new Promise((resolve, reject) => {
            authModel.findOne({
                userId: tokenDetails.userId
            }, (err, foundTokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "Failed to find userId", 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(foundTokenDetails)) {
                    let newAuthToken = new authModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenarationTime: time.now(),
                        isAdmin: tokenDetails.isAdmin
                    })
                    newAuthToken.save((err, newToken) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to create new token", 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newToken.authToken,
                                userDetails: tokenDetails.userDetails,
                            }
                            userDetails.onlineStatus = "online"
                            resolve(responseBody)
                            console.log("Token saved")
                        }
                    })
                } else {
                    foundTokenDetails.authToken = tokenDetails.token
                    foundTokenDetails.userId = tokenDetails.userId
                    foundTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    foundTokenDetails.tokenGenarationTime = tokenDetails.tokenGenarationTime
                    foundTokenDetails.isAdmin = tokenDetails.isAdmin

                    foundTokenDetails.save((err, newToken) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to update newToken", 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newToken.authToken,
                                userDetails: tokenDetails.userDetails,

                            }
                            resolve(responseBody)
                            console.log("Token saved")
                        }
                    })

                }
            })
        })
    } //end saveToken function

    findUser(req, res)
        .then(validatePasswordInput)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Login successfull", 200, resolve)
            res.status(200)
            res.send(apiResponse)
            console.log(resolve.authToken)
        })
        .catch((err) => {
            console.log(err + 'is called')
            res.send(err)
        })
} //end login function

//start logout function
let logoutFunction = (req, res) => {
    authModel.findOneAndRemove({
        userId: req.user.userId
    }, (err, userDetails) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'logout Function', 10)
            let apiResponse = response.generate(true, `error occurred at: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(userDetails)) {
            let apiResponse = response.generate(true, 'Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
            userDetails.onlineStatus = "offline"
        }
    })
} //end logout function

//start recoverMail function
let recoveryMail = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            userModel.findOne({
                email: req.body.email
            }, (err, userDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "User does not exists", 404, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'generateToken()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */
                    logger.info('User Found', 'userController: findUser()', 10)
                    resolve(userDetails)
                }
            })
        })
    } //end generateToken function

    let generateRecoveryToken = (userDetails) => {
        console.log(userDetails + " in sendMail function")
        return new Promise((resolve, reject) => {
            token.generateJwt(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    } //end generateRecoveryToken function

    let setRecoveryToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({
                email : req.body.email
            }).exec((err, userDetails) => {
                console.log(userDetails.recoveryToken)
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'resetPasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To find user', 500, null)
                    reject(apiResponse)
                } else {
                    userDetails.recoveryToken = tokenDetails.token
                    userDetails.save((err, updatedDetails) => {
                        console.log(userDetails.recoveryToken)
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'resetPasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To save details', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(userDetails)
                    console.log(userDetails)
                }
                    })
                }
            })
        })
    }


    let sendMail = (userDetails) => {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: appConfig.mailer.auth.user,
                    pass: appConfig.mailer.auth.pass
                }
            })
            let mailOptions = {
                from: appConfig.mailer.auth.user,
                to: userDetails.email,
                subject: 'Reset password',
                html: `<h4>Hi ${userDetails.fullName}<h4>
                    <p>You are receiving this because you have requested the reset of the password for your account.<br>
                        <br>'Please click on the following link to complete the process.'<br>
                        <br> <a href="http://localhost:4200/resetpassword/${userDetails.recoveryToken}">Reset Password</a>
                    </p>
                    <p>
                    <br>If You have'nt initiated this request please ignore<br>
                    <br>Thank you<br>
                    </p>`
            }
            console.log(mailOptions)
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err.message)
                    let apiResposne = response.generate(true, "Failed to send mail link, provided mailId and password are not valid", 500, null)
                    reject(apiResposne)
                } else {
                    resolve(info)
                }
            })
        })
    } //end senEmail function


    findUser(req, res)
        .then(generateRecoveryToken)
        .then(setRecoveryToken)
        .then(sendMail)
        .then((resolve) => {
            let apiResposne = response.generate(false, "Mail sent successfully to your email id", 200, resolve)
            res.send(apiResposne)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })

} //end recoveryMail function

//start resetPassword function
let resetPassword = (req, res) => {
    let findUser = () => {
        //console.log(req.body)
        return new Promise((resolve, reject) => {
            if (req.body.recoveryToken) {
                userModel.findOne({
                    recoveryToken: req.body.recoveryToken
                }, (err, userTokenDetails) => {
                    console.log(userTokenDetails)
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userTokenDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'findUser()', 10)
                        resolve(userTokenDetails)
                    }
                })
            } else {
                let apiResponse = response.generate(true, '"validationToken" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateResetPassword = (userTokenDetails) => {
        return new Promise((resolve, reject) => {
            let options = {
                password: passwordLib.hashPassword(req.body.password),
                recoveryToken:'Null'
            }
            userModel.update({ 'userId': userTokenDetails.userId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'updateResetPassword function', 10)
                    let apiResponse = response.generate(true, 'Failed To reset user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found with given Details', 'updateResetPassword function')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Password Updated successfully', 200, result)
                    resolve(apiResponse)
                }
            })
        })
    }
    findUser(req, res)
    .then(updateResetPassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Password reset successful...please login to continue", 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
} //end reset password function


module.exports = {
    getAllUsers: getAllUsers,
    getAllNormalUsers: getAllNormalUsers,
    getAllNormalUsersCount: getAllNormalUsersCount,
    getAllAdminUsers: getAllAdminUsers,
    getAllAdminUsersCount: getAllAdminUsersCount,
    getUserByUserId: getUserByUserId,
    deleteUserByUserId: deleteUserByUserId,
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logoutFunction: logoutFunction,
    recoveryMail: recoveryMail,
    resetPassword: resetPassword,
    getCountryNamesWithCodes: getCountryNamesWithCodes,
    getCountryPhoneCodes: getCountryPhoneCodes
}