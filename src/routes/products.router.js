import express from "express";
import ProductManager from "../manager/ProductManager.js";
import { Router } from "express";

const app = express();
const productManager = new ProductManager("products.json");
const productsRouter = Router();
productsRouter.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

productsRouter.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        res.status(400).json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
        return;
    }
    try {
        const products = await productManager.getProducts();
        const productoRepetido = products.find((product) => product.code === code);
        if (productoRepetido) {
            console.log("El producto ya existe");
            res.status(400).json({ error: "El producto ya existe" });
            return;
        }
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category);
        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});


productsRouter.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updateFields = req.body;
    
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        
        const updatedProduct = { ...product, ...updateFields };
        await productManager.updateProduct(productId, updatedProduct);
        
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        
        await productManager.deleteProduct(productId);
        
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export { productsRouter };