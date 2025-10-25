const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

let inventory = {
  'espresso': { name: 'Espresso', quantity: 50, price: 3.99 },
  'latte': { name: 'Latte', quantity: 45, price: 4.99 },
  'cappuccino': { name: 'Cappuccino', quantity: 40, price: 4.49 },
  'americano': { name: 'Americano', quantity: 60, price: 3.49 },
  'mocha': { name: 'Mocha', quantity: 30, price: 5.49 },
  'macchiato': { name: 'Macchiato', quantity: 25, price: 4.29 }
};

app.get('/', (req, res) => {
  res.json({
    service: 'Inventory Service',
    version: '1.0.0',
    description: 'Микросервис для управления инвентарем кофейни',
    endpoints: {
      'GET /inventory': 'Получить весь инвентарь',
      'GET /inventory/:item': 'Получить информацию о товаре',
      'GET /inventory/check': 'Проверить наличие товаров',
      'POST /inventory/use': 'Использовать товары',
      'POST /inventory/add': 'Добавить товары',
      'GET /health': 'Проверка работоспособности'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/inventory', (req, res) => {
  const items = Object.keys(inventory).map(key => ({
    id: key,
    ...inventory[key]
  }));

  res.json({
    total: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    items: items
  });
});

app.get('/inventory/:item', (req, res) => {
  const item = req.params.item.toLowerCase();
  
  if (!inventory[item]) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json({
    id: item,
    ...inventory[item]
  });
});

app.get('/inventory/check', (req, res) => {
  const { items } = req.query;
  
  if (!items) {
    return res.status(400).json({ error: 'Необходимо указать параметр items' });
  }

  const itemsArray = items.split(',').map(i => i.trim().toLowerCase());
  const unavailable = [];

  for (const item of itemsArray) {
    if (!inventory[item] || inventory[item].quantity <= 0) {
      unavailable.push(item);
    }
  }

  res.json({
    available: unavailable.length === 0,
    unavailable: unavailable,
    checked: itemsArray
  });
});

app.post('/inventory/use', (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Необходимо указать items (массив товаров)' });
  }

  const used = [];
  const notFound = [];

  for (const item of items) {
    const itemKey = item.toLowerCase();
    
    if (!inventory[itemKey]) {
      notFound.push(item);
      continue;
    }

    if (inventory[itemKey].quantity > 0) {
      inventory[itemKey].quantity -= 1;
      used.push({
        item: itemKey,
        newQuantity: inventory[itemKey].quantity
      });
    }
  }

  res.json({
    message: 'Товары использованы',
    used: used,
    notFound: notFound
  });
});

app.post('/inventory/add', (req, res) => {
  const { item, quantity, price, name } = req.body;

  if (!item) {
    return res.status(400).json({ error: 'Необходимо указать item' });
  }

  const itemKey = item.toLowerCase();

  if (!inventory[itemKey]) {
    if (!name || !price || !quantity) {
      return res.status(400).json({ 
        error: 'Для нового товара необходимо указать name, price и quantity' 
      });
    }

    inventory[itemKey] = {
      name: name,
      quantity: quantity,
      price: price
    };

    return res.status(201).json({
      message: 'Новый товар добавлен',
      item: {
        id: itemKey,
        ...inventory[itemKey]
      }
    });
  }

  if (quantity) {
    inventory[itemKey].quantity += quantity;
  }
  if (price) {
    inventory[itemKey].price = price;
  }
  if (name) {
    inventory[itemKey].name = name;
  }

  res.json({
    message: 'Товар обновлен',
    item: {
      id: itemKey,
      ...inventory[itemKey]
    }
  });
});

app.get('/inventory/stats', (req, res) => {
  const items = Object.keys(inventory).map(key => ({
    id: key,
    ...inventory[key]
  }));

  const lowStock = items.filter(item => item.quantity < 10);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  res.json({
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: totalValue.toFixed(2),
    lowStock: lowStock,
    mostStocked: items.sort((a, b) => b.quantity - a.quantity)[0],
    leastStocked: items.sort((a, b) => a.quantity - b.quantity)[0]
  });
});

app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
  console.log(`Documentation available at http://localhost:${PORT}/`);
});
