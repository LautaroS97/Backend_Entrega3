const fs = require("fs");
const path = require("path");
const { threadId } = require("worker_threads");

class ProductManagerFilesystem {
  
  constructor(path) {
    this.path = "./data.json";
    this.init(path)
  }


  init() {
    try {
      const existFile = fs.existsSync(this.path);
      if (existFile) return;

      fs.writeFileSync(this.path, JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const response = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(response);
    } catch (error) {
      console.log(error);
    }
  }

  async saveProduct({ title, description, price, code, thumbnail, stock }) {
    try {

      if (!title || !description || !price || !code || !thumbnail || !stock)
        return { error: "Las variables son obligatorias" };

      const newProduct = { title, description, price, code, thumbnail, stock };
      
      const products = await this.getProducts();

      newProduct.id = !products.length
        ? 1
        : products[products.length - 1].id + 1;

      products.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));
      return newProduct;

    } catch (error) {
      console.log(error);
    }

  }

  async getProductById(id) {
    
    const products = await this.getProducts();

    const productFound = products.find((product) => product.id === id);

    return productFound;

  }

  #writeFile(data) {
    return fs.promises.writeFile(this.path, JSON.stringify(data, null, 3))
  }

  async update(id, { title, description, price, code, thumbnail, stock }) {

    const products = await this.getProducts();

    const productIndex = products.findIndex(product => product.id === id);

    if(productIndex === -1) {
      return {error: "El producto no existe."}
    }

    const product = products[productIndex]

    products[productIndex] = { ...product, ...newData};

    await this.#writeFile(products);

    return product[productIndex]
  }

  async deleteProduct(id) {
    
    const products = await this.getProducts()
    
    const productIndex = products.findIndex((product) => product.id === id);

    if(productIndex === -1) { 
      return {error: "El producto no existe."}
    }

    const deleteProducts = products.splice(productIndex, 1)

    await this.#writeFile(products);

    return deleteProducts[0];
  }
}

const productsList = new ProductManagerFilesystem(path);

const testClass = async () => {
  
    const productOneSaved = await productsList.saveProduct({
        code: "1234",
        title: "Civilización VI",
        description: "Juego de estrategia para PC",
        price: 800,
        thumbnail: "./img/CivilizacionVI.jpg",
        stock: 10
    });

    console.log({ productOneSaved });

    const productTwoSaved = await productsList.saveProduct({
        code: "5678",
        title: "Los Sims 4",
        description: "Juego de simulación social para PC.",
        price: 1500,
        thumbnail: "./img/TheSims4.jpg",
        stock: 5
    });

    console.log({ productTwoSaved });

    const productThreeSaved = await productsList.saveProduct({
        code: "9101",
        title: "Dead Island",
        description: "Juego de zombies para PC.",
        price: 1300,
        thumbnail: "./img/DeadIsland.jpg",
        stock: 5
    });

    console.log({ productThreeSaved });

  const allProducts = await productsList.getProducts();
  console.log(allProducts);

};

productsList.deleteProduct(2);

testClass();