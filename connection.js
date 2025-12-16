import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mysql = require("mysql2");
const fs = require("fs");

import dotenv from 'dotenv';
dotenv.config();

var connection = null;
try {
    connection = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: 14718,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        ssl: {
            ca: process.env.CA_PEM.replace(/\\n/g, '\n')
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("Connected to the database.");
} catch (error) {
    console.error("Error connecting to the database:", error);
}

export { connection };