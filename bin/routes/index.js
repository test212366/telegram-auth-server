const Router = require('express'), router = new Router(), authRouter = require('./authRouter');
router.use('/auth', authRouter);
module.exports = router;
