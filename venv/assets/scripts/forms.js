/**
 * forms.js
 * -----------------------------------------------------------------
 * Utilidades para formularios globales:
 *  - Manejo del formulario de sugerencias en el footer
 *  - Redirección del buscador (envía a explorar.html?search=...)
 */
(function(){
  'use strict';

  /** Maneja el formulario de sugerencias ubicado típicamente en el footer */
  function handleSugerencias(){
    // Buscar el primer formulario dentro del footer (estructura del proyecto)
    const form = document.querySelector('footer form');
    if(!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const nombre = form.querySelector('#nombre')?.value || '';
      const correo = form.querySelector('#correo')?.value || '';
      const mensaje = form.querySelector('#mensaje')?.value || '';

      const sugerencias = JSON.parse(localStorage.getItem('sugerencias')||'[]');
      sugerencias.push({id: Date.now(), nombre, correo, mensaje, fecha: new Date().toISOString()});
      localStorage.setItem('sugerencias', JSON.stringify(sugerencias));

      // Retroalimentación simple al usuario
      alert('Gracias por tu sugerencia. La hemos guardado.');
      form.reset();
    });
  }

  /** Maneja los formularios de búsqueda (form.search) para redirigir a explorar.html */
  function handleSearch(){
    const searchForms = document.querySelectorAll('form.search');
    searchForms.forEach(form=>{
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const q = form.querySelector('input[type="search"]')?.value?.trim() || '';
        if(!q) return window.location.href = 'explorar.html';
        window.location.href = `explorar.html?search=${encodeURIComponent(q)}`;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    handleSugerencias();
    handleSearch();
  });
})();