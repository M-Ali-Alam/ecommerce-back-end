import express from 'express';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controller/product.js';
import upload from '../utils/productImage.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/',verifyToken,verifyAdmin,upload, addProduct)

router.put('/:id',verifyUser,verifyAdmin,upload, updateProduct)

router.delete('/:id',verifyUser,verifyAdmin, deleteProduct)

router.get('/:id', getProduct)

router.get('/', getProducts)

export default router;