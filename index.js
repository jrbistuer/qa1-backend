import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
import { writeConsoleAndReturnMessage } from './logicbackend.js';
import { connection } from './connection.js';
import authController from './controllers/auth-controller.js';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
var cors = require('cors')
import dotenv from 'dotenv';

const app = express();
const port = 3000;

app.use(cors())

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'))
});

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
initializeApp(firebaseConfig);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);

app.get('/test-products', (req, res) => {
  const products = [
    { id: 1, name: 'Product A', price: 29.99 },
    { id: 2, name: 'Product B', price: 39.99 },
    { id: 3, name: 'Product C', price: 49.99 }
  ];
  res.json(products);
});

app.use(async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
        res.status(403).json({ message: "Unauthorized" });
    }
    const isOK = await checkToken(authorization);
    if (isOK) {
        next();
    } else {
        res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "error: " + error.message });
  }
});

app.get('/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results) => {
    if (error) {
      console.error("Error fetching productos:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, descripcion, imagen, precio } = req.body;
  connection.query('INSERT INTO productos (nombre, descripcion, imagen, precio) VALUES (?, ?, ?, ?)', [nombre, descripcion, imagen, precio], (error, results) => {
    if (error) {
      console.error("Error inserting producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId, nombre, descripcion, imagen, precio });
  });
});

app.get('/numProductos', async (req, res) => {
  try {
    const countMessage = await writeConsoleAndReturnMessage();
    res.status(200).json({ message: countMessage });
  } catch (error) {
    console.error("Error fetching numProductos:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function checkToken(idToken) {
  return admin.auth().verifyIdToken(removeBearer(idToken))
    .then((decodedToken) => {
      return decodedToken;
    })
    .catch((error) => {
      throw new Error("Invalid token");
    });
}

function removeBearer(token) {
  if (token.startsWith("Bearer ")) {
    return token.slice(7, token.length);
  } else {
    throw new Error("Invalid token format");
  }
}