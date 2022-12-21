const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.get('/', taskController.getTasks);

router.get('/new-task', taskController.getNewTask);

router.post('/new-task', taskController.createNewTask);

router.post('/task/:id', taskController.completeTask);

router.post('/refresh-tasks', taskController.refreshTask);

module.exports = router;
