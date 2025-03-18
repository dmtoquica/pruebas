const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');  // Para manejar rutas
const app = express();
const port = 5000;

// Middleware para manejar JSON
app.use(express.json());

// Configurar para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Crear y conectar a la base de datos SQLite
const db = new sqlite3.Database('./carritoLibros.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err);
  } else {
    console.log('Conectado a SQLite');
  }
});

// Crear la tabla de libros si no existe
db.run(`CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    precio REAL NOT NULL,
    cantidad INTEGER NOT NULL
  )`);

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡API de carrito de libros en funcionamiento!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

// Rutas API para los libros
app.post('/libros', (req, res) => {
  const { titulo, autor, precio, cantidad } = req.body;
  if (!titulo || !autor || !precio || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son necesarios' });
  }
  const query = `INSERT INTO libros (titulo, autor, precio, cantidad) VALUES (?, ?, ?, ?)`;
  db.run(query, [titulo, autor, precio, cantidad], function (err) {
    if (err) {
      console.error('Error al agregar el libro:', err);
      return res.status(500).json({ message: 'Error al agregar el libro', err });
    }
    res.status(201).json({ id: this.lastID, titulo, autor, precio, cantidad });
  });
});

// Obtener todos los libros
app.get('/libros', (req, res) => {
  const query = 'SELECT * FROM libros';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los libros', err });
    }
    res.status(200).json(rows);
  });
});

// Obtener un libro por ID
app.get('/libros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM libros WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el libro', err });
    }
    if (!row) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.status(200).json(row);
  });
});

// Eliminar un libro por ID
app.delete('/libros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM libros WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el libro', err });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.status(200).json({ message: 'Libro eliminado' });
  });
});

// Limpiar la base de datos
app.get('/limpiar-base', (req, res) => {
  const query = "DELETE FROM libros";
  db.run(query, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al limpiar la base de datos', err });
    }
    res.status(200).json({ message: 'Base de datos limpiada con éxito' });
  });
});
