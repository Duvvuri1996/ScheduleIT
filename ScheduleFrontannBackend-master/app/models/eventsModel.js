const mongoose = require('mongoose')
const { isDate } = require('moment')
const Schema = mongoose.Schema


const Event = new Schema ({
    eventId : {
        type : String,
        default : '',
        unique : true,
        required : true
    },
    eventTitle : {
        type : String,
        default : ''
    },
    creatorName : {
        type : String,
        default : ''
    },
    creatorId : {
        type : String,
        default : ''
    },
    userId : {
        type : String,
        default : ''
    },
    userName : {
        type: String,
        default : ''
    },
    userEmail : {
        type: String,
        default: ''
    },
    startDate : {
        type : Date,
        default : ''
    },
    endDate : {
        type : Date,
        default : ''
    },
    createdOn : {
        type : Date,
        default : Date.now()
    },
    modifiedOn : {
        type : Date,
        default : ""
    },
    place : {
        type : 'String',
        default: ''
    }
})

module.exports = mongoose.model('Event', Event)