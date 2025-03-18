document.addEventListener("DOMContentLoaded", () => {
    // Cargar los libros al cargar la página
    loadBooks();
  });
  
  // Función para cargar los libros desde la API
  function loadBooks() {
    fetch('http://localhost:5000/libros')
      .then(response => response.json())
      .then(data => {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";  // Limpiar la lista antes de agregar los nuevos libros
  
        // Verifica si la respuesta contiene libros
        if (data.length === 0) {
          bookList.innerHTML = "<li>No hay libros en el carrito.</li>";
        } else {
          // Iterar sobre los libros y agregarlos a la lista
          data.forEach(book => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
              <strong>${book.titulo}</strong> - ${book.autor} - $${book.precio} - Cantidad: ${book.cantidad}
              <button onclick="deleteBook(${book.id})">Eliminar</button>
            `;
            bookList.appendChild(listItem);
          });
        }
      })
      .catch(error => console.error("Error al cargar los libros:", error));
  }
  
  // Agregar un libro
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
      addBookForm.reset(); // Limpiar el formulario
      loadBooks(); // Recargar la lista de libros
    })
    .catch(error => console.error("Error al agregar el libro:", error));
  });
  
  // Eliminar un libro
  function deleteBook(id) {
    fetch(`http://localhost:5000/libros/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log("Libro eliminado:", data);
      loadBooks(); // Recargar la lista de libros después de eliminar uno
    })
    .catch(error => console.error("Error al eliminar el libro:", error));
  }
  