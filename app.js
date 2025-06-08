const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
require('dotenv').config();


module.exports = {

  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE || 30,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI='mongodb+srv://root:root@cluster0.juowisz.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
