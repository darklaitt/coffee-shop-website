const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://microservice2:3002';

app.use(cors());
app.use(express.json());

let orders = [];
let orderIdCounter = 1;

app.get('/', (req, res) => {
  res.json({
    service: 'Order Service',
    version: '1.0.0',
    description: 'Микросервис для управления заказами кофе',
    endpoints: {
      'GET /orders': 'Получить все заказы',
      'POST /orders': 'Создать новый заказ',
      'GET /orders/:id': 'Получить заказ по ID',
      'GET /health': 'Проверка работоспособности'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/orders', (req, res) => {
  res.json({
    total: orders.length,
    orders: orders
  });
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }
  res.json(order);
});

app.post('/orders', async (req, res) => {
  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Необходимо указать customerName и items (массив товаров)' 
      });
    }

    try {
      const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/check`, {
        params: { items: items.join(',') }
      });

      if (!inventoryResponse.data.available) {
        return res.status(400).json({ 
          error: 'Некоторые товары недоступны',
          unavailable: inventoryResponse.data.unavailable
        });
      }
    } catch (error) {
      console.log('Warning: unable to check inventory:', error.message);
    }

    const newOrder = {
      id: orderIdCounter++,
      customerName,
      items,
      status: 'pending',
      total: items.length * 5.99,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    try {
      await axios.post(`${INVENTORY_SERVICE_URL}/inventory/use`, {
        items: items
      });
    } catch (error) {
      console.log('Warning: unable to update inventory:', error.message);
    }

    res.status(201).json({
      message: 'Заказ успешно создан',
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Необходимо указать status' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({
    message: 'Статус заказа обновлен',
    order: order
  });
});

app.delete('/orders/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const deletedOrder = orders.splice(index, 1)[0];
  res.json({
    message: 'Заказ удален',
    order: deletedOrder
  });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
  console.log(`Documentation available at http://localhost:${PORT}/`);
});
