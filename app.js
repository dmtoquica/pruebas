document.addEventListener("DOMContentLoaded", () => {
    // Obtener todos los libros y mostrar en la lista
    fetch('http://localhost:5000/libros')
      .then(response => response.json())
      .then(data => {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";
        data.forEach(book => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <strong>${book.titulo}</strong> - ${book.autor} - $${book.precio} - Cantidad: ${book.cantidad}
            <button onclick="deleteBook(${book.id})">Eliminar</button>
          `;
          bookList.appendChild(listItem);
        });
      })
      .catch(error => console.error("Error al cargar los libros:", error));
  });
//agregar un libro
const addBookForm = document.getElementById("add-book-form");

addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const cantidad = parseInt(document.getElementById("cantidad").value);

  const newBook = {
    titulo,
    autor,
    precio,
    cantidad
  };

  // Enviar los datos del nuevo libro al Backend (API POST)
  fetch('http://localhost:5000/libros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBook)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Libro agregado:", data);
    // Recargar la lista de libros
    addBookForm.reset();
    loadBooks();
  })
  .catch(error => console.error("Error al agregar el libro:", error));
});

//eliminar un libro
function deleteBook(id) {
    fetch(`http://localhost:5000/libros/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log("Libro eliminado:", data);
      // Recargar la lista de libros
      loadBooks();
    })
    .catch(error => console.error("Error al eliminar el libro:", error));
  }
  function loadBooks() {
    fetch('http://localhost:5000/libros')
      .then(response => response.json())
      .then(data => {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";  // Limpiar la lista antes de agregar los libros
  
        data.forEach(book => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <strong>${book.titulo}</strong> - ${book.autor} - $${book.precio} - Cantidad: ${book.cantidad}
            <button onclick="deleteBook(${book.id})">Eliminar</button>
          `;
          bookList.appendChild(listItem);
        });
      })
      .catch(error => console.error("Error al cargar los libros:", error));
  }
    