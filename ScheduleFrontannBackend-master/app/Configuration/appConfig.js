const express = require('express')
let AppConfig = {}

AppConfig.port = 3000
AppConfig.allowedCORSorigin = "*"
AppConfig.env = "dev"
AppConfig.db = {
     uri : 'mongodb://127.0.0.1:27017/MeetingOrganizerDB'
}
AppConfig.mailer = {
    auth: {
      user: 'test@gmail.com',
      pass: 'secret',
    }
}
AppConfig.apiVersion = '/api/v1'

/**
 * exporting this object to use in other modules
 */
module.exports = {
    port : AppConfig.port,
    allowedCORSorigin : AppConfig.allowedCORSorigin,
    env : AppConfig.env,
    db : AppConfig.db,
    apiVersion : AppConfig.apiVersion,
    mailer : AppConfig.mailer
}