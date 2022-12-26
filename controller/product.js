import Product from '../models/Product.js';

export const addProduct = async (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        image: req.file.path,
        price: req.body.price,
        desc: req.body.desc,
        category: req.body.category
    })
    try {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct)
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: {
            name: req.body.name,
            image: req.file?.path,
            price: req.body.price,
            desc: req.body.desc,
            category: req.body.category
        }},{new: true});
        res.status(200).json(updatedProduct)
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted")
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (error) {
        next(error);
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        next(error);
    }
}