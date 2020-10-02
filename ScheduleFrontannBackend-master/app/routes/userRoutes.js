const express = require('express');
const appConfig = require('../Configuration/appConfig');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/user`

	app.get(`${baseUrl}/allnames`, userController.getCountryNamesWithCodes)
	app.get(`${baseUrl}/allPhoneCodes`, userController.getCountryPhoneCodes)

    app.get(`${baseUrl}/all`, auth.isAuthorized, userController.getAllUsers)
    
    
    /**
	 * @api {get} /api/v1/user/all Get all users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * {
	    "error": false,
	    "message": "All User Details Found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        firstName: "string",
                        lastName: "string",
                        fullName : "string",
						country: "string",
						telCode: "string",
                        mobileNumber: "string",
                        email: "string",
                        isAdmin: boolean,
                        uniqueUserName : "string",
                        createdOn: "date"
					}
	    		]
	    	}
		}
	}
	 @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find User Details",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.get(`${baseUrl}/all/normal`, auth.isAuthorized, userController.getAllNormalUsers)
    
    
    
    /**
	 * @api {get} /api/v1/user/all/normal Get all Normal users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All Normal User Details Found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        firstName: "string",
                        lastName: "string",
                        fullName : "string",
						country: "string",
						telCode: "string",
                        mobileNumber: "string",
                        email: "string",
                        isAdmin: boolean,
                        uniqueUserName : "string",
                        createdOn: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find Normal User Details",
	    "status": 404/500,
	    "data": null
	   }
	 */


    app.get(`${baseUrl}/all/admin`, auth.isAuthorized, userController.getAllAdminUsers)
    
    
    
    
    /**
	 * @api {get} /api/v1/user/all/admin Get all Admin users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All Admin User Details Found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        firstName: "string",
                        lastName: "string",
                        fullName : "string",
						country: "string",
						telCode: "string",
                        mobileNumber: "string",
                        email: "string",
                        isAdmin: boolean,
                        uniqueUserName : "string",
                        createdOn: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find Admin User Details",
	    "status": 404/500,
	    "data": null
	   }
	 */




    app.get(`${baseUrl}/:userId`, auth.isAuthorized, userController.getUserByUserId)
    
    
    
    
    /**
	 * @api {get} /api/v1/user/:userId Get a single user by userId
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} userId The userId should be passed as the URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "User Found Successfully.",
	    "status": 200,
	    "data": {
	    			userId: "string",
                    firstName: "string",
                    lastName: "string",
                    fullName : "string",
					country: "string",
					telCode: "string",
                    mobileNumber: "string",
                    email: "string",
                    isAdmin: boolean,
                    uniqueUserName : "string",
                    createdOn: "date"
				}
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 500,
	    "data": null
	   }
	 */


    app.post(`${baseUrl}/signup`, userController.signUpFunction)
    
    
    
    
    /**
	 * @api {post} /api/v1/user/signup Signup user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
	 * @apiParam {String} firstName firstName of the user passed as a body parameter
     * @apiParam {String} lastName lastName of the user passed as a body parameter
     * @apiParam {String} country country of the user passed as a body parameter
     * @apiParam {Number} mobileNumber mobileNumber of the user passed as a body parameter
     * @apiParam {Boolean} isAdmin isAdmin of the user passed as a body parameter
     * @apiParam {String} uniqueUserName uniqueUserName of the user passed as a body parameter
     * @apiParam {String} email email of the user passed as a body parameter
     * @apiParam {String} password password of the user passed as a body parameter
	 * @apiParam {Boolean} isUser isUser of the user passed as a body parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Signup successfull.",
	    "status": 200,
	    "data": {
	    	userId: "string",
                    firstName: "string",
                    lastName: "string",
                    fullName : "string",
					country: "string",
					telCode: "string",
                    mobileNumber: "string",
                    email: "string",
                    isAdmin: boolean,
                    uniqueUserName : "string",
                    createdOn: "date"
				}
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/login`, userController.loginFunction)
    
    
    
    
    /**
	 * @api {post} /api/v1/user/login Login user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} email email of the user passed as a body parameter
     * @apiParam {String} password password of the user passed as a body parameter
	 * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Login successfull.",
	    "status": 200,
	    "data": {
                    authToken: "string",
                    userId: "string",
                    firstName: "string",
                    lastName: "string",
                    fullName : "string",
                    country: "string",
                    mobileNumber: "string",
                    email: "string",
                    isAdmin: boolean,
                    uniqueUserName : "string",
                    createdOn: "date"
				}
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logoutFunction)
    
    
    
    
    /**
	 * @api {post} /api/v1/user/logout Logout user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Logout successfull.",
	    "status": 200,
	    "data": null
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUserByUserId)
    
    
    
    
    /**
	 * @api {post} /api/v1/user/:userId/delete Delete user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} userId The UserId passed as URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Deleted successfully.",
	    "status": 200,
	    "data": null
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/recoverymail`, userController.recoveryMail)
    
    
    
    /**
	 * @api {post} /api/v1/user/recoverymail Recoverymail to reset password
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} email email of the user passed as body parameter
	 *
     * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Email sent successfully.",
	    "status": 200,
	    "data": "Please check your email"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/resetpassword`, userController.resetPassword)
    
    
    
    /**
	 * @api {post} /api/v1/user/resetpassword Reset password
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} recoveryToken as body parameter
     * @apiParam {String} password password of the user passed as body parameter
	 *
     * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Password set successfully",
	    "status": 200,
	    "data": "Password set successfully"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.get(`${baseUrl}/count/normal`, auth.isAuthorized, userController.getAllNormalUsersCount)
    
    
    
    /**
	 * @api {get} /api/v1/user/count/normal Get count of all Normal users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All Normal Users count Found",
	    "status": 200,
	    "data": "number"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To get count of all Normal Users",
	    "status": 404/500,
	    "data": null
	   }
	 */



    app.get(`${baseUrl}count/admin`, auth.isAuthorized, userController.getAllAdminUsersCount)
    
    
    
    
    /**
	 * @api {get} /api/v1/user/count/admin Get count of all Admin users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All Admin Users count Found",
	    "status": 200,
	    "data": "number"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To get count of all Admin Users",
	    "status": 404/500,
	    "data": null
	   }
	 */
	

}