const usersRouter = require('express').Router();

const { getUsers, addUser } = require('../controllers/users');

usersRouter.route('/').get(getUsers).post(addUser);

module.exports = usersRouter;
