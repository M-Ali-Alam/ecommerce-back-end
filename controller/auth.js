import User from "../models/Users.js";
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const user = new User({
            username: req.body.username,
            phone: req.body.phone,
            address: req.body.address,
            card_details: req.body.card_details,
            password: hash,
            isAdmin: req.body.isAdmin
        });
        await user.save();
        res.status(200).send({success: true,message: "User has been registered successfully"})
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if (!user) {
            return next(createError(404, 'User not found!'));
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) {
            return next(createError(400, 'Wrong password or username!'));
        }

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT,{expiresIn: 300, algorithm: "HS512"})
        const {password, isAdmin, ...otherDetails} = user._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).send({ details: {...otherDetails }, isAdmin,success: true,token: token })
    } catch (error) {
        next(error);
    }
};