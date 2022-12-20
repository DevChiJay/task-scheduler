const path = require('path');
const express = require('express');

const db = require('./data/database');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFoundMiddleware = require('./middlewares/not-found');
const baseRoutes = require('./routes/base.routes');
const taskRoutes = require('./routes/task.routes');

let port = 3000;

if (process.env.PORT) {
  port = process.env.PORT
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


app.use(baseRoutes);
app.use(taskRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

db.initDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
