const express = require('express');
const app = express();
const port = 3000;

let products = [
    {id: 1, name: 'cat', price: 1000},
    {id: 2, name: 'dog', price: 2000},
    {id: 3, name: 'fish', price: 3000},
]

app.use(express.json());

//при переходе с помощью корневого URL - вывод приветсвия
app.get('/', (req, res) => {
    res.send('Главная страница');
});

//вывод всех товаров, вывод товаров по id
app.get('/products', (req, res) => {
    res.send(JSON.stringify(products));
});

app.get('/products/:id', (req, res) => {
    let product = products.find(u => u.id == req.params.id);
    res.send(JSON.stringify(product));
});

//добавление товара
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

//редактирование
app.patch('/products/:id', (req, res)=>{
    const product = products.find(u => u.id == req.params.id);
    const { name, price } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    products = products.filter(u => u.id != req.params.id);
    res.send('Ok');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});