const express = require('express');
const todoController = require('../controllers/todo.controller');
const { route } = require('../app');

const router = express.Router();

router.post('/', todoController.createTodo)
router.get('/', todoController.getTodos)

module.exports = router;