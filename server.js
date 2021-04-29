const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const { Server } = require('./app');

mongoose
  .connect('mongodb+srv://user:pass@mongo-cluster-wtmmm.mongodb.net/make_a_wish?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`MongoDB connected `);
  })
  .catch((err) => {
    throw err;
  });

//test

Server.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else {
    console.log(`Server started at port ${process.env.PORT || 3000}`);
  }
});
