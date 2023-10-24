var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const stringSession = new StringSession("");
let globalPhoneCodePromise;
let globalPassordPromise;
let clientStartPromise;
function generatePromise() {
    let resolve, reject;
    let promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return { resolve, reject, promise };
}
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setupStep = req.body.setupStep, apiIdStr = process.env.API_ID, apiHash = process.env.API_HASH, phoneNumber = req.body.phoneNumber, password = req.body.password, obtainedCode = req.body.code;
                let n;
                if (phoneNumber)
                    n = phoneNumber.replace(' ', '');
                if (Number.isNaN(Number(apiIdStr))) {
                    res.json({
                        "status": "error",
                        "message": "apiId is not a number"
                    });
                }
                let apiId = Number(apiIdStr);
                let credentials = {
                    "apiId": apiId,
                    "apiHash": apiHash
                };
                if (setupStep == 1) {
                    let client = new TelegramClient(new StringSession(""), credentials.apiId, credentials.apiHash, {
                        connectionRetries: 5,
                    });
                    globalPhoneCodePromise = generatePromise();
                    globalPassordPromise = generatePromise();
                    clientStartPromise = client.start({
                        phoneNumber: n,
                        password: () => __awaiter(this, void 0, void 0, function* () {
                            let password = yield globalPassordPromise.promise;
                            globalPassordPromise = generatePromise();
                            return password;
                        }),
                        phoneCode: () => __awaiter(this, void 0, void 0, function* () {
                            let code = yield globalPhoneCodePromise.promise;
                            globalPhoneCodePromise = generatePromise();
                            return code;
                        }),
                        onError: (err) => {
                            res.json({
                                "status": "error",
                                "setupStep": 9,
                                "message": err
                            });
                        },
                    });
                    res.json({
                        "status": "ok",
                        "setupStep": 1
                    });
                }
                else if (setupStep == 2) {
                    globalPhoneCodePromise.resolve(obtainedCode);
                    clientStartPromise.then(() => __awaiter(this, void 0, void 0, function* () {
                        console.log("You should now be connected.");
                        res.json({
                            "status": "ok",
                            "setupStep": 2
                        });
                    })).catch((err) => {
                        res.json({
                            "status": "error",
                            "setupStep": 2,
                            "message": err
                        });
                    });
                }
                else if (setupStep == 3) {
                    globalPassordPromise.resolve(password);
                    clientStartPromise.then(() => __awaiter(this, void 0, void 0, function* () {
                        console.log("You should now be connected.");
                        res.json({
                            "status": "ok",
                            "setupStep": 3
                        });
                    })).catch((err) => {
                        res.json({
                            "status": "error",
                            "setupStep": 3,
                            "message": err
                        });
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = new AuthController();
