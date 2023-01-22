import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const alreadyExists = User.find({ username: req.body.username });
    if (alreadyExists) {
      res.send("already exists");
    }

    const user = new User({
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      card_details: req.body.card_details,
      password: hash,
      isAdmin: req.body.isAdmin,
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "User has been registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send("Invalid Credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.send("Invalid Credentials");
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    res.status(200).json({
      header: { message: "success" },
      body: {
        token: token,
        type: user.isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    next(error);
  }
};
