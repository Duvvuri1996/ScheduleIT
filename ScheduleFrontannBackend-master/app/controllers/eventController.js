const mongoose = require('mongoose')

const shortid = require('shortid')
const userModel = mongoose.model('User')
const authModel = mongoose.model('Auth')
const eventModel = mongoose.model('Event')
const nodemailer = require('nodemailer')
const check = require('../libs/checkLib')
const logger = require('../libs/logger')
const validateInput = require('../libs/paramsValidationLib')
const response = require('../libs/responseLib')
const token = require('../libs/tokenLib')
const passwordLib = require('../libs/passwordLib')
const time = require('../libs/timLib')
const appConfig = require('../Configuration/appConfig')

//start getAllEvents function
let getAllEvents = (req, res) => {
    eventModel.find()
        .select('-_id -__v')
        .lean()
        .exec((err, eventDetails) => {
            if (err) {
                logger.error(err.message, "getAllEvents function", 10)
                let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
                res.send(apiResponse)
            } else if (check.isEmpty(eventDetails)) {
                logger.info("No events found", "getAllEvents function")
                let apiResponse = response.generate(true, "No events found", 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, "Events found", 200, eventDetails)
                res.send(apiResponse)
            }
        })
} //end getAllEvents function

//start getCountOfAllEvents function
let getCountOfAllEvents = (req, res) => {
    eventModel.countDocuments()
        .exec((err, count) => {
            if (err) {
                logger.error(err.message, "getCountOfAllEvents function", 10)
                let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, " Count retireved", 200, count)
                res.send(apiResponse)
            }
        })
} //end getCountOfAllEvents function

//start getSingleEventByEventId function
let getSingleEventByEventId = (req, res) => {
    eventModel.findOne({
        eventId: req.params.eventId
    }, (err, eventDetails) => {
        if (err) {
            logger.error(err.message, "getSingleEventByEventId function", 10)
            let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
            res.send(apiResponse)
        } else if (check.isEmpty(eventDetails)) {
            logger.info("No events found", "getSingleEventByEventId function")
            let apiResponse = response.generate(true, "Event not found for the given eventid", 500, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, " Event found", 200, eventDetails)
            res.send(apiResponse)
        }
    })
} //end getSingleEvent function

//start getAllEventsOfSingleUser function
let getAllEventsOfSingleUser = (req, res) => {
    let findUser = () => {
        console.log(req.params.userId + "of getAllEventsOfSingleUser")
        return new Promise((resolve, reject) => {
            if (req.params.userId) {
                userModel.findOne({
                    'userId': req.params.userId
                }, (err, userDetails) => {
                    console.log(userDetails + " All details")
                    if (err) {
                        logger.error(err.message, "getAllEventsOfSingleUser function", 10)
                        let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.info("No user found", "getAllEventsOfSingleUser function")
                        let apiResponse = response.generate(true, "No user found", 500, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, " User found", 200, userDetails)
                        resolve(userDetails)
                        console.log(userDetails + " after verified")
                    }
                })
            } else {
                let apiResponse = response.generate(true, "Query parameter missing for userId", 400, null)
                reject(apiResponse)
            }
        })
    } //end findUser function

    let findMeetings = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (userDetails.isAdmin === true) {
                eventModel.find({
                    'creatorId': userDetails.userId
                }, (err, events) => {
                    console.log(events + " from findMeetings")
                    if (err) {
                        logger.error(err.message, "getAllEventsOfSingleUser function", 10)
                        let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(events)) {
                        logger.info("No events found", "getAllEventsOfSingleUser function")
                        let apiResponse = response.generate(true, "No events found", 500, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, " User events found", 200, events)
                        resolve(events)
                        console.log(events + " of admin")
                    }
                })
            } else {
                eventModel.find({
                    userId: userDetails.userId
                }, (err, events) => {
                    if (err) {
                        logger.error(err.message, "getAllEventsOfSingleUser function", 10)
                        let apiResponse = response.generate(true, "Failed to retrieve data", 404, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(events)) {
                        logger.info("No events found", "getAllEventsOfSingleUser function")
                        let apiResponse = response.generate(true, "No events found", 500, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, " User events found", 200, events)
                        resolve(events)
                        console.log(events + " of normal")
                    }
                })
            }

        })
    } //end findMeetings

    findUser(req, res)
        .then(findMeetings)
        .then((resolve) => {
            let apiResponse = response.generate(false, " User events found", 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
} //end getAllEventsOfSingleUser function

//start getAllEventsCountOfSingleUser function
let getAllEventsCountOfSingleUser = (req, res) => {
    console.log(req.params.userId)
    if (req.params.userId) {
        eventModel.countDocuments({
            userId: req.params.userId
        }, (err, count) => {
            if (err) {
                logger.error(err.message, "getAllEventsCountOfSingleUser function", 10)
                let apiResponse = response.generate(true, "Failed to retireve data", 404, null)
                res.send(apiResponse)
            } else {
                console.log(count)
                let apiResponse = response.generate(false, "Count retrieved", 200, count)
                res.send(apiResponse)
            }
        })
    }
} //end getAllEventsCountOfSingleUser function

//start createEvent function
let createEvent = (req, res) => {
    let today = Date.now()
    let newEvent = new eventModel({
        eventId: shortid.generate(),
        eventTitle: req.body.eventTitle,
        place: req.body.place,
        userEmail: req.body.userEmail,
        userId: req.body.userId,
        userName: req.body.userName,
        creatorId: req.body.creatorId,
        creatorName: req.body.creatorName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdOn: today
    })
    newEvent.save((err, result) => {
        console.log(newEvent)
        if (err) {
            logger.error(err.message, "createEvent function", 10)
            let apiResponse = response.generate(true, "Failed to create event", 404, null)
            res.send(apiResponse)
        } else {
            userModel.findOne({
                userId: result.userId
            }, (err, userDetails) => {
                if (err) {
                    logger.error(err.message, "createEvent function", 10)
                } else if (check.isEmpty(userDetails)) {
                    logger.info("No user found or no longer exists", "createEvent function")
                } else {

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
                        subject: `Event created`,
                        text: `Please check your calender for changes as new event is being created`
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log("Error occured while sending email from createEvent")
                            console.log(err)
                        } else {
                            console.log("Email sent successfully from createEvent")
                            console.log(info)
                        }
                    })

                }
            })
            let apiResponse = response.generate(false, "Event created successfully and sent a mail", 200, result)
            res.send(apiResponse)
        }
    })

} //end createEvent

//start deleteEventByEventId function
let deleteEventByEventId = (req, res) => {
    let userEmail
    eventModel.findOne({
            'eventId': req.params.eventId
        })
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'deleteEventByEventId', 10)
            } else if (check.isEmpty(result)) {
                logger.info('No event found', 'deleteEventByEventId')
            } else {
                userEmail = result.userEmail
                eventModel.deleteOne({
                    'eventId': req.params.eventId
                }, (err, result) => {
                    if (err) {
                        logger.error(err.message, "deleteEventByEventId", 5)
                        let apiResponse = response.generate(true, "Failed to delete", 500, null)
                        res.send(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, "Event deleted successfully and sent a mail", 200, null)
                        res.send(apiResponse)
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: appConfig.mailer.auth.user,
                                pass: appConfig.mailer.auth.pass
                            }
                        })
                        let mailOptions = {
                            from: appConfig.mailer.auth.user,
                            to: userEmail,
                            subject: `Event deleted`,
                            text: `Please check your calender for changes`
                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log("Error while sending an email from deleteEventByEventId")
                                console.log(err)
                            } else {
                                console.log("Successfully sent email from deleteEventByEventId")
                                console.log(info)
                            }
                        })
                    }
                })
            }
        })
} //end deleteEventByEventID

//start deleteEventByEventId
let editEventByEventId = (req, res) => {
    let options = req.body;
    eventModel.updateOne({
        'eventId': req.params.eventId
    }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'editEventByEventId', 10)
            let apiResponse = response.generate(true, 'Failed To edit event details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No event Found', 'editEventByEventId')
            let apiResponse = response.generate(true, 'No event Found', 404, null)
            res.send(apiResponse)
        } else {
            result.modifiedOn = Date.now()
            let apiResponse = response.generate(false, 'Event details edited', 200, result)
            res.send(apiResponse)
            userModel.findOne({
                userId: result.userId
            }, (err, retrievedUserDetails) => {
                if (err) {
                    logger.error(err.message, 'editEventByEventId')
                } else if (check.isEmpty(retrievedUserDetails)) {
                    logger.info('No user Found', 'editEventByEventId')
                } else {
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: appConfig.mailer.auth.user,
                            pass: appConfig.mailer.auth.pass
                        }
                    })
                    let mailOptions = {
                        from: appConfig.mailer.auth.user,
                        to: retrievedUserDetails.email,
                        subject: `Event changes`,
                        text: `Please check your calender for changes`
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log("Error while sending an email from editEventByEventId")
                            console.log(err)
                        } else {
                            console.log("Successfully sent email from editEventByEventId")
                            console.log(info)
                        }
                    })
                }

            })

        }
    })

} //end editEventByEventId

//start reminderToUser function
let reminderToUser = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            userModel.findOne({
                userId: req.body.userId
            }, (err, userDetails) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'findUser in reminderToUser', 10)
                    let apiResponse = response.generate(true, 'Failed To find userdetails', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.info('No user Found', 'findUser in reminderToUser')
                    let apiResponse = response.generate(true, 'No user Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(userDetails)
                }
            })
        })
    } //end findUser

    let findMeetings = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (userDetails.isAdmin === true) {
                eventModel.find({
                    creatorId: req.body.userId
                }, (err, meetingDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'findMeetings', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Meetings', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(meetingDetails)) {
                        logger.info('No Meeting Found', 'findMeetings')
                        let apiResponse = response.generate(true, 'No Meeting Found', 404, null)
                        reject(apiResponse)
                        console.log("No meetings")
                    } else {
                        console.log(meetingDetails + " from reminders")
                        let i = 0
                        for (let meeting of meetingDetails) {
                            if (new Date(meeting.startDate).getUTCDate === new Date().getUTCDate && new Date() < new Date(meeting.startDate)) {
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: appConfig.mailer.auth.user,
                                        pass: appConfig.mailer.auth.pass
                                    }
                                })
                                let mailOptions = {
                                    from: appConfig.mailer.auth.user,
                                    to: meeting.userEmail,
                                    subject: `Event Reminder`,
                                    text: `Please check your calendar as there is an event assigned to you`
                                }
                                i += 1;
                                console.log(i)
                                transporter.sendMail(mailOptions, (err, info) => {
                                    if (err) {
                                        console.log("Error while sending an email")
                                        console.log(err)
                                    } else {
                                        console.log("Mail sent successfully as reminders for an event")
                                        console.log(info)
                                    }
                                })
                            }
                        }
                        if (i > 0) {
                            let apiResponse = response.generate(false, "Sent all mails regarding today's events", 200, null)
                            resolve(meetingDetails)
                            console.log(i)
                        }
                    }

                })
            }
        })
    }
    findUser(req, res)
        .then(findMeetings)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Sent all mails regarding today's events", 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
} //end reminderToUser function

module.exports = {
    getAllEvents: getAllEvents,
    getCountOfAllEvents: getCountOfAllEvents,
    getSingleEventByEventId: getSingleEventByEventId,
    getAllEventsOfSingleUser: getAllEventsOfSingleUser,
    getAllEventsCountOfSingleUser: getAllEventsCountOfSingleUser,
    createEvent: createEvent,
    deleteEventByEventId: deleteEventByEventId,
    editEventByEventId: editEventByEventId,
    reminderToUser: reminderToUser
}