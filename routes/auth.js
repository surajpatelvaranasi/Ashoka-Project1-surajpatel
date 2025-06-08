const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // Your Gmail address
    pass: process.env.EMAIL_PASS,        // Your Gmail App Password
  }
});


// Auth Middleware (if using JWT)
const authenticateToken = require('../middleware/authMiddleware');

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ username, email, password: hashedPassword }).save();
  res.redirect('/login');
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

// Dashboard (Session Based)
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard'); // or pass user data if needed
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/t_book',(req,res)=>{
  res.render('t_book');
});
// Handle tourist booking form submission
router.post('/t_book', async (req, res) => {
  const { name, place, vehicle } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,        // Sender address
    to: process.env.EMAIL_USER,          // Receiver address (your email)
    subject: `New Tourist Booking Request: ${name}`,
    text: `
      Name: ${name}
      Places to visit: ${place}
      Vehicle Type: ${vehicle}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // If email is sent successfully, send success message
    res.render('t_book', { success: 'Booking request sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    // If there is an error sending the email, show error message
    res.render('t_book', { error: 'Failed to send booking request. Please try again.' });
  }
});

// Other routes
router.get('/w', (req, res) => {
  res.render('w');
});

router.get('/garden', (req, res) => {
  res.render('garden');
});

router.get('/book', (req, res) => {
  res.render('book');
});

router.get('/tourist', (req, res) => {
  res.render('tourist');
});

router.get('/ecom',(req,res)=>{
  res.render('ecom');
});

router.get('/contact',(req,res)=>{
  res.render('contact');
});

module.exports = router;
