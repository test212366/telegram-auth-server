require('dotenv').config()

const express = require('express'),
 	app = express(),
	cors = require('cors'),
	//@ts-ignore
	router = require('./routes/index') 
	 

const PORT:number | string = process.env.PORT || 2032	

app.use(cors({Credential: true, origin: '*'}))
app.use(express.json({extended: true}))
app.use('/api', router)
 


;(() => {
	try {
	 	 app.listen(PORT, () => console.log('SERVER STARTED:',PORT))
	} catch (e:any) {
		console.log(e)
	}
})()