const mongodb = require('mongodb');

const db = require('../data/database');

class Task {
  constructor(taskData) {
    this.taskname = taskData.taskname;
    this.duration = taskData.duration;
    this.nextappear = taskData.nextappear;
    this.status = taskData.status;
    this.schedule = taskData.schedule;
    if (taskData._id) {
      this.id = taskData._id.toString();
    }
  }

  static async getDoneTasks() {
    const tasks = await db
      .getDb()
      .collection('tasks')
      .find({ status: 'Done' }).toArray();

      if (!tasks) {
        const error = new Error('Could not find any done task.');
        error.code = 404;
        throw error;
      }

      return tasks.map(function (taskDocument) {
        return new Task(taskDocument);
      });

  }

  static async getActiveTasks() {
    const tasks = await db
      .getDb()
      .collection('tasks')
      .find({ status: 'Active' })
      .sort({ duration: 1 }).toArray();

      if (!tasks) {
        const error = new Error('Could not find any done task.');
        error.code = 404;
        throw error;
      }

      return tasks.map(function (taskDocument) {
        return new Task(taskDocument);
      });

  }

  static async findById(taskId) {
    let taId;
    try {
      taId = new mongodb.ObjectId(taskId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const task = await db
      .getDb()
      .collection('tasks')
      .findOne({ _id: taId });

    if (!task) {
      const error = new Error('Could not find task with provided id.');
      error.code = 404;
      throw error;
    }

    return new Task(task);
  }

  static async findAll() {
    const tasks = await db.getDb().collection('tasks').find().toArray();

    return tasks.map(function (taskDocument) {
      return new Task(taskDocument);
    });
  }

  async save() {
    const taskData = {
      taskname: this.taskname,
      duration: +this.duration,
      nextappear: +this.nextappear,
      status: this.status,
      schedule: this.schedule,
    };

    if (this.id) {
      const taskId = new mongodb.ObjectId(this.id);

      db.getDb()
        .collection('tasks')
        .updateOne({ _id: taskId }, { $set: taskData });
    } else {
      db.getDb().collection('tasks').insertOne(taskData);
    }
  }

  complete() {
    const taskId = new mongodb.ObjectId(this.id);
    return db
      .getDb()
      .collection('tasks')
      .updateOne({ _id: taskId }, { $set: { status: 'Done' } });
  }

  activate() {
    const taskId = new mongodb.ObjectId(this.id);
    return db
      .getDb()
      .collection('tasks')
      .updateOne({ _id: taskId }, { $set: { status: 'Active' } });
  }

  remove() {
    const taskId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('tasks').deleteOne({ _id: taskId });
  }
}

module.exports = Task;
