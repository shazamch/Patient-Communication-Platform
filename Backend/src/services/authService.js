const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtil');

exports.createUser = async (data) => {
  try {
    if (!data.email || !data.password) {
      throw new Error('Email, and password are required');
    }

    const username = data.email.split('@')[0];
    let tag = "boy"
    if (data.gender==="Female"){
      tag = "girl"
    }

    const profilephoto = `https://avatar.iran.liara.run/public/${tag}?username=${username}`;
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.username = username;
    data.password = hashedPassword;
    data.profilephoto = data.profilephoto || profilephoto;
    const newUser = await User.create(data);
    
    if (!newUser) {
        throw new Error(newUser);
    }
    // Generate tokens for the new user
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    return {
        _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilephoto: newUser.profilephoto,
      role: newUser.role,
      tokens: { accessToken, refreshToken }
    };
  } catch (error) {
    // Throw specific error message
    throw new Error(error.message || 'User creation failed');
  }
};


// Login User
exports.loginUser = async (email, password) => {
    try {
      // Find user by email (case-insensitive)
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Check if user is inactive
      if (user.status === "Inactive") {
        throw new Error('Inactive user');
      }
  
      // Validate the provided password
      if (!password || !user.password) {
        throw new Error("Password or hashed password is missing");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
  
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Destructure sensitive or unnecessary fields
      const { password: hashedPassword, otp,status, createdAt, updatedAt, __v, ...safeUser } = user._doc;
  
      // Return tokens and sanitized user data
      return {
        accessToken,
        refreshToken,
        userData: safeUser
      };
  
    } catch (error) {
      console.error("Error during login:", error.message);
      throw new Error(error.message || 'Login failed');
    }
  };
  