const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const MAX_LOGGED_IN_USERS = 3;


exports.signup = async (req, res) => {
  const { username, password } = req.body;

  
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);

  
  const newUser = new User({
    username,
    password: hashedPassword, 
  });

  await newUser.save();
  res.status(201).json({ message: 'User created successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  
  const loggedInUsers = await Session.find().sort({ loggedInAt: 1 });

  if (loggedInUsers.length >= MAX_LOGGED_IN_USERS) {
    
    const firstLoggedInUser = loggedInUsers[0];
    await Session.deleteOne({ userId: firstLoggedInUser.userId });
    console.log(`User ${firstLoggedInUser.username} has been logged out`);
  }

  
  const newSession = new Session({
    userId: user._id,
    username: user.username,
    loggedInAt: new Date(),
  });
  await newSession.save();

  
  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Logged in successfully', token });
};


exports.logout = async (req, res) => {
  const { userId } = req.body;

  
  await Session.deleteOne({ userId });

  res.json({ message: 'Logged out successfully' });
};
