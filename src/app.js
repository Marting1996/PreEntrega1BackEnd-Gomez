import express from "express";
import { Router } from "express";
import { productsRouter } from './routes/products.router.js';
import cartsRouter from "./routes/carts.router.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
