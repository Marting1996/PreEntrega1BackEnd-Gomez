import express from "express";
import { Router } from "express";
import CartManager from "../manager/cartManager.js";
import ProductManager from "../manager/productManager.js";

const app = express();
const cartRouter = Router();
const cartManager = new CartManager("carts.json");
const productManager = new ProductManager("products.json");

cartRouter.post("/", async (req, res) => {
  const { id, products } = req.body;

  try {
    const newCart = await cartManager.createCart(id, products);
    res.status(201).json({ message: "Carrito creado correctamente", cart: newCart });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

cartRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  try {
    const cart = await cartManager.getCartById(cid);
    if (cart) {
      const product = await productManager.getProductById(pid);
      if (product) {
        await cartManager.addProductToCart(cid, pid);
        res.json({ message: "Producto agregado correctamente al carrito" });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default cartRouter;
