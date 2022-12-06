import express from "express";
import {} from 'productManager.js'

const app = express();

const PORT = 8080;

app.get("/api/products.json", async (req, res) => {
  const {limit} = req.query;

  const allProducts = await ProductManager.getProducts()
  
  if (!limit || limit < 1) {
    return res.send({succes: true, products: allProducts})
  }
  
  const products = allProducts.slice(0, limit)

  res.send({succes: true, products})

})

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`))