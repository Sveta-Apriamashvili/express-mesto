const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use('/', userRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '61054463d311473a7fc30fe6',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
