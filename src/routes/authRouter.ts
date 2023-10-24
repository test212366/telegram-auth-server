//@ts-ignore
const Router = require('express'),
//@ts-ignore	
	router = new Router(),
	authController = require('../controllers/authController')

router.post('/login', authController.login)
 
module.exports = router
 