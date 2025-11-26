/**
 * LÓGICA DE LA PÁGINA PRINCIPAL (index.html)
 * Carga productos y maneja interacciones
 */

/**
 * index.js
 * -----------------------------------------------------------------
 * Lógica de la página principal (`index.html`).
 * - Carga dinámicamente el catálogo desde `productos.js`
 * - Maneja el click en botones "Agregar al carrito"
 * - Actualiza el contador del header
 */
(function () {
  'use strict';

  // Esperar a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', function () {
    renderProductos();
    renderPromociones();
    actualizarContadorCarrito();
  });

  /**
   * Renderizar grid de productos
   */
  // Renderiza el grid principal de productos en index.html
  function renderProductos() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const productos = obtenerTodosProductos();
    grid.innerHTML = '';

    productos.forEach(producto => {
      const article = document.createElement('article');
      article.className = 'producto';
      article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="rating" style="color: #f59e0b; font-size: 0.9rem;">⭐ ${producto.rating} (${producto.resenas} reseñas)</p>
        <p class="precio" style="font-weight: bold; color: #0f172a; font-size: 1.1rem;">$${producto.precio.toLocaleString()}</p>
        <button class="btn btn--primary add-to-cart"
          data-id="${producto.id}" 
          data-name="${producto.nombre}" 
          data-price="${producto.precio}" 
          data-img="${producto.imagen}"
          data-description="${producto.descripcionCompleta}">
          Agregar al carrito
        </button>
      `;
      grid.appendChild(article);
    });

    // Agregar listeners a los botones
    agregarListenersCarrito();
  }

  /**
   * Renderizar sección de promociones
   */
  // Renderiza las promociones en la sección correspondiente
  function renderPromociones() {
    const grid = document.getElementById('promos-grid');
    if (!grid) return;

    const productos = obtenerTodosProductos();
    const promos = productos.slice(4, 8); // Últimos 4 productos como promociones

    grid.innerHTML = '';

    promos.forEach(producto => {
      const article = document.createElement('article');
      article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p style="color: #10b981; font-weight: bold;">Especial: $${producto.precio.toLocaleString()}</p>
      `;
      grid.appendChild(article);
    });
  }

  /**
   * Agregar listeners a botones "Agregar al carrito"
   */
  // Añade listeners a los botones "Agregar al carrito" generados dinámicamente
  function agregarListenersCarrito() {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
      button.addEventListener('click', function () {
        const id = this.dataset.id;
        const nombre = this.dataset.name;
        const precio = parseFloat(this.dataset.price);
        const imagen = this.dataset.img;
        const descripcion = this.dataset.description;

        const item = {
          id: id,
          nombre: nombre,
          precioUnitario: precio,
          cantidad: 1,
          total: precio,
          imagen: imagen,
          descripcion: descripcion
        };

        agregarAlCarrito(item);
        this.textContent = '✓ Agregado';
        this.disabled = true;

        setTimeout(() => {
          this.textContent = 'Agregar al carrito';
          this.disabled = false;
        }, 2000);
      });
    });
  }

  /**
   * Agregar item al carrito (usando función de cart.js)
   */
  // Lógica local para agregar al carrito (guarda en localStorage y actualiza contador)
  function agregarAlCarrito(item) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const existe = carrito.find(p => p.id == item.id);
    if (existe) {
      existe.cantidad += 1;
      existe.total = existe.precioUnitario * existe.cantidad;
    } else {
      carrito.push(item);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
  }

  /**
   * Actualizar contador de carrito en header
   */
  // Actualiza el contador visible en el header (id="cart-count")
  function actualizarContadorCarrito() {
    const counter = document.getElementById('cart-count');
    if (!counter) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    counter.textContent = total;
  }

})();
