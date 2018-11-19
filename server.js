const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts');

const app = express();

//mongodb config
const db = require('./config/keys').mongoURI;

//connebt to mongodb
mongoose.connect(db)
  .then(() => console.log('connected to mongo db'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world'));

//Use routes 
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on ${port}`));