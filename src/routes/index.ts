
	//@ts-ignore
const Router = require('express'),
	//@ts-ignore	
	router = new Router(),
	authRouter = require('./authRouter')


router.use('/auth', authRouter)
module.exports = router