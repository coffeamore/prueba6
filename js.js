// Obtener los elementos del DOM
const iconoCarrito = document.getElementById('cart-icon');
const btnCerrarCarrito = document.getElementById('cart-close-btn');
const contenedorCarrito = document.getElementById('cart-container');
const itemsCarrito = document.getElementById('cart-items');
const totalCarrito = document.getElementById('cart-total');
const btnFinalizarCompra = document.getElementById('checkout-btn');
const contadorCarrito = document.getElementById('cart-count'); // Contador de productos

// Variable para almacenar los productos del carrito
let carrito = [];

// Mostrar/ocultar el carrito al hacer clic en el ícono
iconoCarrito.addEventListener('click', () => {
  contenedorCarrito.classList.toggle('cart-visible'); // Alternar visibilidad
});

// Cerrar el carrito al hacer clic en el botón de cierre
btnCerrarCarrito.addEventListener('click', () => {
  if (contenedorCarrito.classList.contains('cart-visible')) {
    contenedorCarrito.classList.remove('cart-visible'); // Ocultar carrito
  }
});

// Cargar productos desde un archivo JSON
fetch('./productos.json')
  .then(response => response.json())
  .then(data => {
    const contenedorProductos = document.getElementById('products-container');

    // Crear tarjetas de productos dinámicamente
    data.productos.forEach(producto => {
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('card');
      tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h1>${producto.nombre}</h1>
        <p class="txt-card">${producto.descripcion}</p>
        <p class="txt-card-v">$${producto.precio}</p>
        <button class="btn-2 agregar-carrito"
          data-id="${producto.id}"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}">
          Añadir al Carrito
        </button>
      `;
      contenedorProductos.appendChild(tarjeta);
    });

    // Agregar eventos a los botones de "Añadir al Carrito"
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
      boton.addEventListener('click', (event) => {
        const botonPresionado = event.target;
        const producto = {
          id: botonPresionado.getAttribute('data-id'),
          nombre: botonPresionado.getAttribute('data-nombre'),
          precio: parseFloat(botonPresionado.getAttribute('data-precio'))
        };
        agregarAlCarrito(producto); // Añadir producto al carrito
      });
    });
  })
  .catch(error => console.error('Error al cargar productos:', error));

// Función para añadir productos al carrito
function agregarAlCarrito(producto) {
  // Verificar si el producto ya existe en el carrito
  const productoExistente = carrito.find(item => item.id === producto.id);

  if (productoExistente) {
    // Si ya existe, aumentar la cantidad
    productoExistente.cantidad += 1;
  } else {
    // Agregar un nuevo producto como un objeto independiente
    carrito.push({ 
      id: producto.id, 
      nombre: producto.nombre, 
      precio: producto.precio, 
      cantidad: 1 
    });
  }

  actualizarCarrito(); // Actualizar el carrito después de cada cambio
}

// Función para actualizar el carrito (HTML y totales)
function actualizarCarrito() {
  itemsCarrito.innerHTML = ''; // Limpiar contenido previo
  let total = 0;
  let totalProductos = 0;

  // Generar cada elemento del carrito
  carrito.forEach(producto => {
    totalProductos += producto.cantidad;
    const item = document.createElement('li');
    item.classList.add('cart-item');
    item.innerHTML = `
      ${producto.nombre} x ${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}
      <button class="btn-disminuir" data-id="${producto.id}">-</button>
      <button class="btn-aumentar" data-id="${producto.id}">+</button>
      <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
    `;
    itemsCarrito.appendChild(item);
    total += producto.precio * producto.cantidad;
  });

  totalCarrito.textContent = `$${total.toFixed(2)}`;
  contadorCarrito.textContent = totalProductos; // Actualizar contador de productos
  agregarEventosEliminar();
  agregarEventosCantidad();
}

// Función para agregar eventos a los botones de eliminar
function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');

  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      eliminarDelCarrito(idProducto); // Eliminar producto
    });
  });
}

// Función para manejar el cambio de cantidad
function agregarEventosCantidad() {
  const botonesAumentar = document.querySelectorAll('.btn-aumentar');
  const botonesDisminuir = document.querySelectorAll('.btn-disminuir');

  botonesAumentar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      cambiarCantidadProducto(idProducto, 1); // Aumentar cantidad
    });
  });

  botonesDisminuir.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      cambiarCantidadProducto(idProducto, -1); // Disminuir cantidad
    });
  });
}

// Función para cambiar la cantidad de un producto
function cambiarCantidadProducto(idProducto, cambio) {
  const producto = carrito.find(item => item.id === idProducto);

  if (producto) {
    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
      eliminarDelCarrito(idProducto); // Eliminar si la cantidad es 0
    } else {
      actualizarCarrito(); // Actualizar carrito
    }
  }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto); // Filtrar productos
  actualizarCarrito(); // Actualizar carrito
}

// Función para finalizar la compra y vaciar el carrito
btnFinalizarCompra.addEventListener('click', () => {
  if (carrito.length > 0) {
    alert('¡Gracias por su compra!');
    carrito = []; // Vaciar carrito
    actualizarCarrito();
  } else {
    alert('El carrito está vacío.');
  }
});
