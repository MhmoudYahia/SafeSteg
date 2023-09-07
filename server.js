const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 2000;
process.on('uncaughtException', (err) => {
  console.log('uncaught exception'.toUpperCase(), ',Shutting down......');
  console.log(err.name, err.message);
  process.exit(1);
});

const DBString = process.env.DATABASE.replace(
  '<password>',
  process.env.PASSWORD
);

app.listen(port, () => {
  mongoose.connect(DBString).then(() => {
    console.log('DB connection established');
    console.log(`server listening on port ${port}`);
  });
});
