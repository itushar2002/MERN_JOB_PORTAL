import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { fullname, email, phone_number, password, role } = req.body;
    if (!fullname || !email || !phone_number || !password || !role) {
      return res
        .status(400)
        .json({ message: "something is missing", satisfies: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(404)
        .json({ message: "user already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    await user.create({
      fullname,
      email,
      phone_number: hashedPassword,
      password,
      role,
    });

    return res
      .status(201)
      .json({ message: "user registered successfully", success: true });
  } catch (error) {
    return res.status(402).json({ message: error });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(403)
        .json({ message: "something is missing!", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "incorrect email or password", success: false });
    }
    // match password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "incorrect email or password", success: false });
    }

    // check role is correct or not
    if (user.role !== role) {
      return res.status(403).json({
        message: "account does not exist for this role" + role,
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECERET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back!${user.fullname}`, success: true });
  } catch (error) {
    return res.status(402).json({ message: error });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "logged out successfully", success: true });
  } catch (error) {
    return res.status(402).json({ message: error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phone_number, bio, skills } = req.body;
    const file = req.file();
    if (!fullname || !email || !phone_number || !bio || !skills) {
      return res
        .status(400)
        .json({ message: "something is missing", satisfies: false });
    }

    // cloudinary code here................................................................

    const skillsArray = skills.split(",");
    const userId = req.id; // middlewarea authentication
    let user = user.findOne(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    // updating user Data
    user.fullname = fullname;
    user.email = email;
    user.phone_number = phone_number;
    user.bio = bio;
    user.skills = skillsArray;
    // resume comes here ..........

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
    };
    return res
      .status(200)
      .json({ message: "profile updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
  }
};
