import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper: Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                          // payload (what's inside the token)
    process.env.JWT_SECRET,                  // secret key to sign it
    { expiresIn: '7d' }                      // token expires in 7 days
  );
};


export async function registerNewUser(req,res) {
try {
  const {name,email,password} = req.body

  // 1. check if the user already exist
  const existingUser = await User.findOne({email})
  if (existingUser) {
    return res.status(400).json({message: 'User already exist'})
  }

   // 2. Hash the password
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password, salt)

       // 3. Create and save the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


        res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

} catch (error) {
  console.error('error in registerNewUser controller ', error)
  res.status(500).json({ message: error.message });
}
}

//////////////////////////////////////////
export async function loginUser(req,res) {
try {
  const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
} catch (error) {
    console.error('error in LoginUser controller ', error)
  res.status(500).json({ message: error.message });
}
}