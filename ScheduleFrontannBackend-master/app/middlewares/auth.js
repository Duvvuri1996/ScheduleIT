const mongoose = require('mongoose')
const Auth = mongoose.model('Auth')

const logger = require('../libs/logger')
const response = require('../libs/responseLib')
const token = require('../libs/tokenLib')
const check = require('../libs/checkLib')

let isAuthorized = (req,res,next) => {
    console.log(req.params.authToken)
    if(req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
        Auth.findOne({authToken : req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')}, (err,authDetails) => {
            if(err) {
                
                logger.error(err.message, 'Authorization middleware', 10)
                let apiResponse = response.generate(true, "Authorization error", 500, null)
                res.send(apiResponse)
            } else if(check.isEmpty(authDetails)) {
                console.log(authDetails+" is authDetails")
                logger.error('No authorization key is present', 'Authorization error', 10)
                let apiResponse = response.generate(true, "Authorization missing", 404, null)
                res.send(apiResponse)
            } else {
                token.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err,decoded) => {
                    if(err) {
                        logger.error(err.message, 'Authorization middleware', 10)
                        let apiResponse = response.generate(true, 'Verification error', 500, null)
                        res.send(apiResponse)
                    } else {
                        req.user = {userId : decoded.data.userId}
                        console.log(req.user)
                        next()
                        
                    }
                }) //end verify authtoken
            }
        })
    } else {
        logger.error('Authorization error', 'Authorization middleware', 5)
        let apiResponse = response.generate(true, 'Authorization token missing', 400, null)
        res.send(apiResponse)
    }
}

module.exports = {
    isAuthorized : isAuthorized
}