const express = require('express');

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    return res.sendStatus(204);
  }
  next();
});

const products = [
  {
    id: 1,
    name: 'Maca Andina',
    description: 'Superfood energético rico en nutrientes',
    price: 25.0,
    image: 'https://proexpansion.com/uploads/article/image/1841/larger_maca.jpg',
    category: 'superfoods',
    stock: 20,
    rating: 4.8,
    benefits: ['Energía', 'Resistencia', 'Vitaminas'],
  },
  {
    id: 2,
    name: 'Aceite de Coco Extra Virgen',
    description: 'Ideal para cocinar y cuidado personal',
    price: 18.5,
    image: 'https://borganics.cl/cdn/shop/products/aceite-coco-virgen-500-scaled.jpg',
    category: 'aceites',
    stock: 15,
    rating: 4.7,
    benefits: ['Piel saludable', 'Antioxidantes'],
  },
  {
    id: 3,
    name: 'Cápsulas de Omega 3',
    description: 'Suplemento para la salud cardiovascular',
    price: 32.0,
    image: 'https://masonnatural.pe/wp-content/uploads/2020/04/Fish-Oil-Front-2.png',
    category: 'capsulas',
    stock: 10,
    rating: 4.9,
    benefits: ['Corazón', 'Cerebro'],
  },
  {
    id: 4,
    name: 'Infusión de Manzanilla',
    description: 'Bebida relajante y digestiva',
    price: 12.0,
    image: 'https://plazavea.vteximg.com.br/arquivos/ids/17782556-418-418/133196.jpg',
    category: 'infusiones',
    stock: 30,
    rating: 4.6,
    benefits: ['Relajación', 'Digestión'],
  },
];

const categories = [
  { id: 'superfoods', name: 'Superfoods' },
  { id: 'aceites', name: 'Aceites' },
  { id: 'capsulas', name: 'Cápsulas' },
  { id: 'infusiones', name: 'Infusiones' },
  { id: 'miel', name: 'Miel' },
];
const orders = [];
const users = [
  { id: 1, name: 'Usuario de Prueba', email: 'test@example.com', password: 'password123' },
];

app.get('/api/products', (req, res) => {
  const category = req.query.category;

  const result =
    category && category !== 'todos'
      ? products.filter(product => product.category === category)
      : products;

  res.json(result);
});

app.get('/api/products/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const result = products.filter(
    (product) =>
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
  );
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.json({
    token: 'fake-jwt-token',
    user: { name: user.name, email: user.email },
  });
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const order = {
    id: orders.length + 1,
    ...orderData,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((item) => item.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Pedido no encontrado' });
  }
  res.json(order);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});