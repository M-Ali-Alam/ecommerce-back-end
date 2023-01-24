import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  placeOrder,
  updateProduct,
} from "../controller/product.js";
import upload from "../utils/productImage.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyAdmin, upload, addProduct);

router.put("/:id", verifyAdmin, upload, updateProduct);

router.delete("/:id", verifyAdmin, deleteProduct);

router.get("/:id", getProduct);

router.get("/", getProducts);

router.post("/place-order/", placeOrder);

export default router;
