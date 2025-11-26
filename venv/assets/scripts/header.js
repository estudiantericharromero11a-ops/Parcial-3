/**
 * header.js
 * -----------------------------------------------------------------
 * Maneja el estado visible del header:
 *  - Contador del carrito (lee de localStorage 'carrito')
 *  - Estado de autenticación simulado (lee/escribe 'user' en localStorage)
 *  - Logout client-side (remove user)
 */
(function(){
  'use strict';

  /** Actualiza el contador mostrado en el header (#cart-count) */
  function actualizarCartCount(){
    const el = document.getElementById('cart-count');
    if(!el) return;
    const carrito = JSON.parse(localStorage.getItem('carrito')||'[]');
    const total = carrito.reduce((s,i)=> s + (i.cantidad||0), 0);
    el.textContent = total;
  }

  /** Actualiza los elementos marcados con [data-auth-target] segun user */
  function actualizarAuth(){
    const user = JSON.parse(localStorage.getItem('user')||'null');
    document.querySelectorAll('[data-auth-target]').forEach(el=>{
      if(user){
        el.textContent = `Hola, ${user.nombre}`;
        el.setAttribute('href','#');
        el.dataset.logged = 'true';
      } else {
        el.textContent = 'Iniciar sesión';
        el.setAttribute('href','login.html');
        el.dataset.logged = 'false';
      }
    });

    // Mostrar/ocultar botón logout según exista user
    const logoutBtn = document.getElementById('btn-logout');
    if(!logoutBtn) return;
    logoutBtn.style.display = user ? 'inline-block' : 'none';
  }

  /** Configura el botón de logout para limpiar localStorage.user */
  function setupLogout(){
    const btn = document.getElementById('btn-logout');
    if(!btn) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      localStorage.removeItem('user');
      actualizarAuth();
      // Redirigir a inicio después de cerrar sesión
      window.location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    actualizarCartCount();
    actualizarAuth();
    setupLogout();

    // Escuchar cambios en localStorage desde otras pestañas y sincronizar UI
    window.addEventListener('storage', (e)=>{
      if(e.key === 'carrito' || e.key === 'user'){
        actualizarCartCount();
        actualizarAuth();
      }
    });
  });
})();