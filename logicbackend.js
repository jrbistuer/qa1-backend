import { connection } from './connection.js';

async function writeConsoleAndReturnMessage() {
    try {
        var numProductos = await getNumProductos();
        var msg = "Este es el número de productos: " + numProductos;
        console.log(msg);
        return msg;
    } catch (error) {
        console.error("Error in writeConsoleAndReturnMessage:", error);
        throw error;
    }
}

function getNumProductos() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT COUNT(*) AS count FROM productos', (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      if (results.length === 0) {
        resolve(0);
      }
      resolve(results[0].count);
    });
  });
};

export {
  writeConsoleAndReturnMessage,
  getNumProductos
};