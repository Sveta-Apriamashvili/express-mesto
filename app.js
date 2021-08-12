const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

const auth = require('./middlewares/auth');

app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '61054463d311473a7fc30fe6',
//   };

//   next();
// });

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый метод не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
