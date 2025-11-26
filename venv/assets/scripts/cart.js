/* ======================================================
   SISTEMA DE CARRITO - Versión corregida y robusta
   Maneja productos, totales, guardados y órdenes (localStorage)
   Compatible con index.html, carrito.html y compra.html
========================================================= */

/**
 * cart.js
 * -----------------------------------------------------------------
 * Módulo principal del carrito de la demo. Maneja:
 *  - Estado del carrito (añadir, eliminar, actualizar cantidades)
 *  - Guardado de items "para después"
 *  - Generación y almacenamiento de órdenes (localStorage)
 *  - Renderizado en páginas que contienen contenedores con ids
 *
 * Diseño:
 *  - Mantener las funciones puras cuando sea posible
 *  - Actualizar la UI solo si el contenedor está presente
 *  - Usar delegación de eventos para botones dinámicos
 *
 * Limitaciones:
 *  - Sin backend; toda la persistencia está en localStorage
 */
(function () {
  'use strict';

  /* -------------------------------
     LLAVES EN LOCALSTORAGE
  --------------------------------*/
  // Claves usadas en localStorage
  const LS_CARRITO = 'carrito';
  const LS_GUARDADOS = 'guardados';
  const LS_ORDENES = 'ordenes';

  /* -------------------------------
     ESTADO IN-MEMORY
  --------------------------------*/
  // Estado en memoria (se sincroniza con localStorage)
  let carrito = JSON.parse(localStorage.getItem(LS_CARRITO) || '[]');
  let guardados = JSON.parse(localStorage.getItem(LS_GUARDADOS) || '[]');

  /* -------------------------------
     SELECTORES (pueden no existir en todas las páginas)
  --------------------------------*/
  // Selectores que pueden o no estar presentes según la página
  const cartItemsEl = document.getElementById('cart-items');       // contenedor de items (carrito/compra)
  const savedItemsEl = document.getElementById('saved-items');     // contenedor de guardados
  const subtotalSpan = document.getElementById('subtotal');        // subtotal display
  const totalItemsSpan = document.getElementById('total-items');   // cantidad total items
  const totalPagarSpan = document.getElementById('total-pagar');   // total a pagar
  const envioSpan = document.getElementById('envio');              // display envío
  const ADD_TO_CART_BTN = '.add-to-cart';                          // selector delegado para botones "Agregar al carrito"
  const envio = 5; // envío fijo por defecto (puedes cambiarlo)

  /* ======================================================
     UTIL: Guardar estado en localStorage
  ====================================================== */
  function saveState() {
    localStorage.setItem(LS_CARRITO, JSON.stringify(carrito));
    localStorage.setItem(LS_GUARDADOS, JSON.stringify(guardados));
  }

  /* ======================================================
     UTIL: Obtener valor numérico seguro
  ====================================================== */
  // Convierte a número seguro (si falla retorna 0)
  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  /* ======================================================
     FUNCIÓN: Añadir item al carrito (genérica)
     item = { id?, nombre, precioUnitario, cantidad, total, imagen }
  ====================================================== */
  /**
   * Añadir un item al carrito.
   * - normaliza campos numéricos
   * - combina si el producto ya existía (por id o nombre)
   */
  function addItemToCart(item) {
    if (!item || !item.nombre) return;
    item.precioUnitario = toNumber(item.precioUnitario);
    item.cantidad = Math.max(1, Math.floor(toNumber(item.cantidad) || 1));
    item.total = item.precioUnitario * item.cantidad;

    // Buscar por id (si existe) o por nombre como fallback
    const existeIndex = carrito.findIndex(p => (p.id && item.id && p.id === item.id) || p.nombre === item.nombre);
    if (existeIndex > -1) {
      carrito[existeIndex].cantidad = carrito[existeIndex].cantidad + item.cantidad;
      carrito[existeIndex].total = carrito[existeIndex].precioUnitario * carrito[existeIndex].cantidad;
    } else {
      if (!item.id) item.id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      carrito.push(item);
    }

    saveState();
    renderCarrito(); // actualizar UI si corresponde
    renderGuardados(); // actualizar lista de guardados si corresponde
  }

  /* ======================================================
     FUNCIÓN: Render del carrito (si el contenedor está presente)
  ====================================================== */
  /**
   * Renderiza el carrito dentro del contenedor `cartItemsEl` (si existe).
   * Separa responsabilidades: construcción del HTML y actualización de totales.
   */
  function renderCarrito() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';

    if (!carrito || carrito.length === 0) {
      cartItemsEl.innerHTML = '<p>No hay productos en el carrito.</p>';
      actualizarTotales();
      return;
    }

    carrito.forEach((item, index) => {
      const img = item.imagen ? item.imagen : 'assets/images/producto_placeholder.png';
      const fragment = document.createElement('article');
      fragment.className = 'carrito-item';
      fragment.setAttribute('role', 'listitem');
      fragment.innerHTML = `
        <img src="${img}" alt="${escapeHtml(item.nombre)}" class="carrito-img">
        <div class="carrito-info">
          <h3>${escapeHtml(item.nombre)}</h3>
          <p class="descripcion">${item.descripcion ? escapeHtml(item.descripcion) : ''}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Precio total: $ ${formatNumber(item.total)}</p>
          <div class="carrito-acciones">
            <button class="btn btn--small" data-accion="guardar" data-index="${index}">Guardar para después</button>
            <button class="btn btn--danger btn--small" data-accion="eliminar" data-index="${index}">Eliminar</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(fragment);
    });

    actualizarTotales();
  }

  /* ======================================================
     FUNCIÓN: Render de guardados (si el contenedor está presente)
  ====================================================== */
  function renderGuardados() {
    if (!savedItemsEl) return;
    savedItemsEl.innerHTML = '';

    if (!guardados || guardados.length === 0) {
      savedItemsEl.innerHTML = '<p>No hay productos guardados.</p>';
      return;
    }

    guardados.forEach((item, index) => {
      const img = item.imagen ? item.imagen : 'assets/images/producto_placeholder.png';
      const fragment = document.createElement('article');
      fragment.className = 'guardado-item';
      fragment.setAttribute('role', 'listitem');
      fragment.innerHTML = `
        <img src="${img}" alt="${escapeHtml(item.nombre)}">
        <h4>${escapeHtml(item.nombre)}</h4>
        <p>Precio: $${formatNumber(item.precioUnitario)}</p>
        <button class="btn btn--primary btn--small" data-accion="mover" data-index="${index}">Mover al carrito</button>
      `;
      savedItemsEl.appendChild(fragment);
    });
  }

  /* ======================================================
     ACTUALIZAR TOTALES
  ====================================================== */
  function actualizarTotales() {
    const subtotal = carrito.reduce((s, p) => s + toNumber(p.total), 0);
    const cantidadTotal = carrito.reduce((s, p) => s + toNumber(p.cantidad), 0);
    if (subtotalSpan) subtotalSpan.textContent = formatNumber(subtotal);
    if (totalItemsSpan) totalItemsSpan.textContent = cantidadTotal;
    if (totalPagarSpan) totalPagarSpan.textContent = formatNumber(subtotal + envio);
    if (envioSpan) envioSpan.textContent = envio;
  }

  /* ======================================================
     ACCIONES: eliminar, guardar, mover
  ====================================================== */
  function eliminarItem(index) {
    if (index < 0 || index >= carrito.length) return;
    carrito.splice(index, 1);
    saveState();
    renderCarrito();
    renderGuardados();
  }

  function guardarParaDespues(index) {
    if (index < 0 || index >= carrito.length) return;
    guardados.push(carrito[index]);
    carrito.splice(index, 1);
    saveState();
    renderCarrito();
    renderGuardados();
  }

  function moverAlCarrito(index) {
    if (index < 0 || index >= guardados.length) return;
    carrito.push(guardados[index]);
    guardados.splice(index, 1);
    saveState();
    renderCarrito();
    renderGuardados();
  }

  /* ======================================================
     BOTONES GENERALES (pueden o no existir en la página)
  ====================================================== */
  function setupButtons() {
    // Vaciar carrito
    const vaciarBtn = document.getElementById('btn-vaciar');
    if (vaciarBtn) {
      vaciarBtn.addEventListener('click', () => {
        carrito = [];
        saveState();
        renderCarrito();
      });
    }

    // Ir a compra (desde carrito)
    const pagarBtn = document.getElementById('btn-pagar');
    if (pagarBtn) {
      pagarBtn.addEventListener('click', () => {
        // Redirigir a compra.html
        window.location.href = 'compra.html';
      });
    }

    // Confirmar pago (en compra.html)
    const confirmarBtn = document.getElementById('btn-confirmar');
    if (confirmarBtn) {
      confirmarBtn.addEventListener('click', () => {
        confirmarCompra();
      });
    }
  }

  /* ======================================================
     CONFIRMAR COMPRA (compra.html)
     Guarda la orden en localStorage y limpia carrito
  ====================================================== */
  function confirmarCompra() {
    if (!carrito || carrito.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de confirmar.');
      return;
    }

    // Leer datos del formulario de checkout si existen
    const nombre = (document.getElementById('checkout-name')?.value) || null;
    const email = (document.getElementById('checkout-email')?.value) || null;
    const direccion = (document.getElementById('checkout-address')?.value) || null;
    const metodo = (document.getElementById('checkout-payment')?.value) || null;

    const subtotal = carrito.reduce((s, p) => s + toNumber(p.total), 0);
    const total = subtotal + envio;
    const orden = {
      id: `ORD-${Date.now()}`,
      fecha: new Date().toISOString(),
      buyer: { nombre, email, direccion, metodo },
      items: carrito,
      subtotal,
      envio,
      total
    };

    // Guardar orden
    const ordenes = JSON.parse(localStorage.getItem(LS_ORDENES)) || [];
    ordenes.push(orden);
    localStorage.setItem(LS_ORDENES, JSON.stringify(ordenes));

    // Limpiar carrito y guardados
    carrito = [];
    guardados = [];
    saveState();

  // Guardar última orden para pantalla de confirmación y redirigir
  localStorage.setItem('ultimaOrden', JSON.stringify(orden));
  alert(`Compra confirmada ✔\nOrden: ${orden.id}\nTotal: $ ${formatNumber(total)}`);
  window.location.href = `confirmar-compra.html?orden=${encodeURIComponent(orden.id)}`;
  }

  /* ======================================================
     EVENT DELEGATION: acciones dentro de los contenedores
     (evita onclick inline y es más robusto)
  ====================================================== */
  function setupDelegation() {
    // Delegación en carrito (eliminar / guardar)
    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        const accion = btn.getAttribute('data-accion');
        const index = Number(btn.getAttribute('data-index'));
        if (accion === 'eliminar') eliminarItem(index);
        if (accion === 'guardar') guardarParaDespues(index);
      });
    }

    // Delegación en guardados (mover)
    if (savedItemsEl) {
      savedItemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        const accion = btn.getAttribute('data-accion');
        const index = Number(btn.getAttribute('data-index'));
        if (accion === 'mover') moverAlCarrito(index);
      });
    }
  }

  /* ======================================================
     ADD-TO-CART: escucha botones en index.html con clase .add-to-cart
     Los botones deben tener atributos data-*: data-name, data-price, data-img, data-id (opc.)
  ====================================================== */
  function setupAddToCartButtons() {
    // Delegación a nivel de documento para soportar páginas SPA o dinámicas
    document.addEventListener('click', (e) => {
      const btn = e.target.closest(ADD_TO_CART_BTN);
      if (!btn) return;
      const id = btn.getAttribute('data-id') || null;
      const nombre = btn.getAttribute('data-name') || btn.dataset.name || 'Producto';
      const precio = toNumber(btn.getAttribute('data-price') || btn.dataset.price || 0);
      const imagen = btn.getAttribute('data-img') || btn.dataset.img || 'assets/images/producto_placeholder.png';
      const item = {
        id,
        nombre,
        precioUnitario: precio,
        cantidad: 1,
        total: precio,
        imagen
      };
      addItemToCart(item);

      // Feedback visual rápido
      btn.textContent = '✓ Agregado';
      setTimeout(() => btn.textContent = btn.getAttribute('data-label') || 'Agregar al carrito', 1200);
    });
  }

  /* ======================================================
     UTIL: Formateo y seguridad mínima
  ====================================================== */
  function formatNumber(n) {
    // no usar locales complejos aquí para evitar cambios inesperados
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ======================================================
     INICIALIZACIÓN GENERAL
  ====================================================== */
  function init() {
    // Renderizar si corresponde
    renderCarrito();
    renderGuardados();
    actualizarTotales();

    // Setup botones y delegaciones
    setupButtons();
    setupDelegation();
    setupAddToCartButtons();
  }

  // Ejecutar al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
