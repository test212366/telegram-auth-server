require('dotenv').config()
const { Api, TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
 

 
 
const stringSession = new StringSession("") // fill this later with the value from session.save()
let globalPhoneCodePromise:any
let globalPassordPromise: any
let clientStartPromise:any
 

//promise for wait codePhone in telegram message
function generatePromise() {
	let resolve, reject
	let promise = new Promise((_resolve, _reject) => {
		 resolve = _resolve
		 reject = _reject
	})
	return { resolve, reject, promise }
}
//@ts-ignore
class AuthController {
	async login (req:any, res:any) {
		try {
			const setupStep: number | string = req.body.setupStep,
			 apiIdStr:string | number = process.env.API_ID,
			 apiHash:string | number = process.env.API_HASH,
			 phoneNumber:string = req.body.phoneNumber,
			 password:string = req.body.password,
			 obtainedCode:string | number = req.body.code
			let n:string
			if(phoneNumber) n = phoneNumber.replace(' ', '')
			
			
		 	if(Number.isNaN(Number(apiIdStr))){
				res.json({
					 "status": "error",
					 "message": "apiId is not a number"
				})
		  }
		  let apiId = Number(apiIdStr) // Convert apiId to number
	 
		  let credentials = {
				"apiId": apiId,
				"apiHash": apiHash
		  }
	 
		  if(setupStep == 1){
				let client:any = new TelegramClient(new StringSession(""), credentials.apiId, credentials.apiHash, {
					 connectionRetries: 5,
				})
				
				globalPhoneCodePromise = generatePromise()
				globalPassordPromise = generatePromise()

				 



				clientStartPromise = client.start({
					 phoneNumber: n,
					 password: async () => {
					 
						let password = await globalPassordPromise.promise
						globalPassordPromise = generatePromise()
						return password
					 },
					 phoneCode: async () => {
						  let code:string = await globalPhoneCodePromise.promise
						  globalPhoneCodePromise = generatePromise()
						  return code;
					 },
					 onError: (err:any) => {
						  res.json({
								"status": "error",
								"setupStep": 9,
								"message": err
						  })
					 },
				})
			 
				res.json({
					 "status": "ok",
					 "setupStep": 1
				})
		  } else if(setupStep == 2){
				globalPhoneCodePromise.resolve(obtainedCode)


				 
				clientStartPromise.then(async () => {
					 console.log("You should now be connected.")
					 res.json({
						  "status": "ok",
						  "setupStep": 2
					 })
	 
				}).catch((err:any) => {
					 res.json({
						  "status": "error",
						  "setupStep": 2,
						  "message": err
					 })
					 
				})
			 
		  } else if(setupStep == 3){
			globalPassordPromise.resolve(password)
			clientStartPromise.then(async () => {
				 console.log("You should now be connected.")
				 res.json({
					  "status": "ok",
					  "setupStep": 3
				 })
 
			}).catch((err:any) => {
				 res.json({
					  "status": "error",
					  "setupStep": 3,
					  "message": err
				 })
			})
	  }
		} catch(e:any) {
			console.log(e)
		}
	}
}
module.exports = new AuthController()








 
 