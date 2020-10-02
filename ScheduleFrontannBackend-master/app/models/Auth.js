const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timLib')

const Auth = new Schema({
    userId: {
        type: String
    },
    uniqueUserName : {
        type: String
    },
    authToken: {
        type: String
    },
    tokenSecret: {
        type: String
    },
    tokenGenerationTime: {
        type: Date,
        default: time.now()
    },
    isAdmin : {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Auth', Auth)