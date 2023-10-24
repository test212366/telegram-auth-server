const Router = require('express'), router = new Router(), authController = require('../controllers/authController');
router.post('/login', authController.login);
module.exports = router;
