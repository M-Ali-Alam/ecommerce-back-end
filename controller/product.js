import Product from "../models/Product.js";
import Order from "../models/Orders.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { env } from "process";

export const placeOrder = async (req, res, next) => {
  console.log(req.body);
  const obj = jwt.verify(req.body.token, env.JWT);
  console.log("req.body");
  console.log(req.body);

  const products = req.body.orderDetails;

  console.log("products");
  console.log(products);

  const order = new Order({
    products: products,
    user: obj.id,
  });
  try {
    const savedOrder = await order.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  console.log("req");
  console.log(req);
  const product = new Product({
    name: req.body.name,
    image: req.file.path,
    price: Number(req.body.price),
    desc: req.body.description,
    category: req.body.category,
  });
  try {
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    console.log("error");
    console.log(error);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          image: req.file?.path,
          price: req.body.price,
          desc: req.body.desc,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    console.log(req.params);
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(
      product
      //   {
      //     _id: mongoose.Schema.Types.ObjectId(product._id),
      //     name: product.name,
      //     desc: product.desc,
      //     category: product.category,
      //     price: product.price,
      //     image: product.image,
      //   }
    );
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
