/**
 * carrito.js
 * -----------------------------------------------------------------
 * Archivo responsable por renderizar la vista del carrito (carrito.html)
 * y por exponer vistas/acciones relacionadas (actualizar cantidades,
 * eliminar, vaciar, navegar al checkout).
 *
 * En esta demo el estado proviene de `localStorage.carrito`.
 */

(function () {
  'use strict';

  const ENVIO_BASE = 5000; // valor por defecto para cálculo de envío

  // Inicialización en DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    renderCarrito();
    configurarEventos();
  });

  /**
   * Renderizar la lista de productos del carrito
   */
  // Renderiza la lista de productos en el elemento #cart-items-list
  function renderCarrito() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
      container.innerHTML = `
        <div class="carrito-vacio">
          <h2>Tu carrito está vacío</h2>
          <p>No has agregado ningún producto aún.</p>
          <a href="index.html" class="btn btn--primary" style="display: inline-block;">
            ← Ir a comprar
          </a>
        </div>
      `;
      actualizarResumen();
      return;
    }

    container.innerHTML = '';

    carrito.forEach((item, index) => {
      const article = document.createElement('article');
      article.className = 'carrito-item';
      article.setAttribute('role', 'listitem');

      const img = item.imagen ? item.imagen : 'assets/images/producto_placeholder.png';

      article.innerHTML = `
        <img src="${img}" alt="${escapeHtml(item.nombre)}" class="carrito-img">
        <div class="carrito-info">
          <h3>${escapeHtml(item.nombre)}</h3>
          <p>${item.descripcion ? item.descripcion.substring(0, 100) + '...' : 'Producto de calidad'}</p>
          <p style="font-weight: bold; color: #0f172a;">Precio unitario: $${item.precioUnitario.toLocaleString()}</p>
          
          <div class="carrito-cantidad">
            <label for="qty-${index}">Cantidad:</label>
            <input type="number" id="qty-${index}" min="1" value="${item.cantidad}" class="qty-input" data-index="${index}">
          </div>
          
          <p style="font-weight: bold; color: #10b981;">Subtotal: $${(item.precioUnitario * item.cantidad).toLocaleString()}</p>
          
          <button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button>
        </div>
      `;

      container.appendChild(article);
    });

    // Agregar listeners a inputs de cantidad
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', actualizarCantidad);
    });

    // Agregar listeners a botones eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', eliminarProducto);
    });

    actualizarResumen();
  }

  /**
   * Actualizar cantidad de un producto
   */
  // Maneja el cambio de cantidad desde la UI (input number)
  function actualizarCantidad(e) {
    const index = e.target.dataset.index;
    const nueva_cantidad = Math.max(1, parseInt(e.target.value) || 1);

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
      carrito[index].cantidad = nueva_cantidad;
      carrito[index].total = carrito[index].precioUnitario * nueva_cantidad;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      renderCarrito();
    }
  }

  /**
   * Eliminar un producto del carrito
   */
  function eliminarProducto(e) {
    const index = e.target.dataset.index;
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
  }

  /**
   * Actualizar resumen del carrito
   */
  function actualizarResumen() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const subtotal = carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const envio = subtotal > 100000 ? 0 : ENVIO_BASE;
    const total = subtotal + envio;

    // Actualizar elementos HTML
    const totalItemsSpan = document.getElementById('cart-total-items');
    const subtotalSpan = document.getElementById('subtotal-amount');
    const envioSpan = document.getElementById('envio-amount');
    const totalSpan = document.getElementById('total-pagar-amount');

    if (totalItemsSpan) totalItemsSpan.textContent = totalItems;
    if (subtotalSpan) subtotalSpan.textContent = subtotal.toLocaleString();
    if (envioSpan) envioSpan.textContent = envio.toLocaleString();
    if (totalSpan) totalSpan.textContent = total.toLocaleString();
  }

  /**
   * Configurar eventos de botones
   */
  function configurarEventos() {
    const btnComprar = document.getElementById('btn-comprar-ahora');
    const btnVaciar = document.getElementById('btn-vaciar-carrito');

    if (btnComprar) {
      btnComprar.addEventListener('click', irACompra);
    }

    if (btnVaciar) {
      btnVaciar.addEventListener('click', vaciarCarrito);
    }
  }

  /**
   * Ir a la página de compra
   */
  function irACompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    window.location.href = 'compra.html';
  }

  /**
   * Vaciar el carrito
   */
  function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      localStorage.removeItem('carrito');
      renderCarrito();
    }
  }

  /**
   * Escapar HTML para evitar inyecciones
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

})();
