const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const port = process.env.PORT || 2000;

const DBString = process.env.DATABASE.replace(
  '<password>',
  process.env.PASSWORD
);

app.listen(port, () => {
  mongoose.connect(DBString).then(() => {
    console.log('DB connection established');
  });
  console.log(`server listening on port ${port}`);
});
