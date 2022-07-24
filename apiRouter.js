//import
let express =require('express');
let usersCtrl = require('./routes/usersCtrl');

//router
exports.router = (() => {
    let apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/:id').put(usersCtrl.userUpdate);

    return apiRouter;
})();