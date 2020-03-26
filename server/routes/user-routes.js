const express = require('express');
const UserController = require('../controllers/user-controller');
const instanceUserController = new UserController();
const router = new express.Router();

router.get('/', instanceUserController.getUsers);
router.get('/:id', instanceUserController.getUser);
router.post('/', instanceUserController.addUser);
router.delete('/:id', instanceUserController.deleteUser);
router.put('/', instanceUserController.editUser);

module.exports = router;