const schedule = require('node-schedule');
const db = require('../data/database');
const Task = require('../models/task.model');

function getNewTask(req, res) {
  res.render('admin/new-task');
}

async function createNewTask(req, res, next) {
  const task = new Task({
    ...req.body,
    status: 'Active',
  });

  try {
    await task.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/');
}

async function getTasks(req, res, next) {
  try {
    const doneTask = await Task.getDoneTasks();
    const activeTask = await Task.getActiveTasks();
    res.render('welcome', { doneTask: doneTask, activeTask: activeTask });
  } catch (error) {
    next(error);
  }
}

async function completeTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    await task.complete();
  } catch (error) {
    return next(error);
  }

  res.redirect('/');
}

async function refreshTask(req, res, next) {
  try {
    const result = await db
      .getDb()
      .collection('tasks')
      .updateMany(
        { status: 'Done' },
        {
          $set: {
            status: 'Active',
          },
        }
      );
  } catch (error) {
    return next(error);
  }

  res.redirect('/');
}

module.exports = {
  getNewTask: getNewTask,
  createNewTask: createNewTask,
  getTasks: getTasks,
  completeTask: completeTask,
  refreshTask: refreshTask,
};
