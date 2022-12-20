const schedule = require('node-schedule');
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

    const nextappear = task.nextappear * (1000);
    const startTime = new Date(Date.now() + nextappear);
    const endTime = new Date(startTime.getTime() + 2000);
    const job = schedule.scheduleJob(
      { start: startTime, end: endTime, rule: '*/2 * * * * *' },
      async function () {
        await task.activate();
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
};
