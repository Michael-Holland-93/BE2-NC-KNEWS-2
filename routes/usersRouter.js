const usersRouter = require('express').Router();

const { getUsers, addUser } = require('../controllers/users');

usersRouter.route('/').get(getUsers);
usersRouter.route('/').post(addUser);

module.exports = usersRouter;
