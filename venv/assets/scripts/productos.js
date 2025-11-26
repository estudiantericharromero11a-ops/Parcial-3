/**
 * productos.js
 * -----------------------------------------------------------------
 * Catálogo de productos (datos en memoria).
 * Este archivo actúa como una 'fuente de verdad' para el catálogo
 * en esta demo. Cada producto incluye campos para facilitar la
 * visualización en distintas páginas (index/explorar/promos/compra).
 *
 * NOTA: En una app real estos datos vendrían del servidor (API).
 */

/* Producto: { id, nombre, precio, descripcion, descripcionCompleta, imagen, cantidad, rating, resenas } */
const PRODUCTOS_CATALOGO = [
  {
    id: 1,
    nombre: "Macetas",
    precio: 20000,
    descripcion: "Macetas decorativas para interior y exterior.",
    descripcionCompleta: "Macetas decorativas premium para plantas de interior y exterior. Disponibles en diferentes tamaños y colores. Material resistente y duradero.",
    imagen: "assets/images/producto1.png",
    cantidad: 100,
    rating: 4.5,
    resenas: 150
  },
  {
    id: 2,
    nombre: "Bonsái",
    precio: 35000,
    descripcion: "Planta decorativa en miniatura.",
    descripcionCompleta: "Hermosos Bonsái cultivados profesionalmente. Perfectos para decorar tu espacio. Incluye maceta y guía de cuidado.",
    imagen: "assets/images/producto2.png",
    cantidad: 50,
    rating: 4.8,
    resenas: 280
  },
  {
    id: 3,
    nombre: "Abono orgánico",
    precio: 15000,
    descripcion: "Fertilizante natural para tus plantas.",
    descripcionCompleta: "Fertilizante 100% orgánico para nutrir tus plantas. Sin químicos dañinos. Ideal para cualquier tipo de planta.",
    imagen: "assets/images/producto3.png",
    cantidad: 200,
    rating: 4.3,
    resenas: 95
  },
  {
    id: 4,
    nombre: "Kit de jardinería",
    precio: 50000,
    descripcion: "Todo lo necesario para empezar tu jardín en casa.",
    descripcionCompleta: "Kit completo de jardinería con herramientas básicas, semillas seleccionadas y guía detallada de cultivo. Perfecto para principiantes.",
    imagen: "assets/images/producto_destacado.png",
    cantidad: 30,
    rating: 4.7,
    resenas: 320
  },
  {
    id: 5,
    nombre: "Girasoles amarillos",
    precio: 30000,
    descripcion: "Girasoles de gran calidad para decoración.",
    descripcionCompleta: "Girasoles amarillos de gran calidad, tallo firme y resistente de 50-70 cm. Ideales para arreglos florales. Durabilidad de 5-7 días.",
    imagen: "assets/images/articulos/jirasoles.png",
    cantidad: 75,
    rating: 4.6,
    resenas: 400
  },
  {
    id: 6,
    nombre: "Rosas rojas",
    precio: 35000,
    descripcion: "Rosas premium para ocasiones especiales.",
    descripcionCompleta: "Rosas rojas de primera calidad. Perfectas para regalos y ocasiones especiales. Frescas garantizadas.",
    imagen: "assets/images/articulos/rosas.png",
    cantidad: 60,
    rating: 4.9,
    resenas: 520
  },
  {
    id: 7,
    nombre: "Margaritas blancas",
    precio: 18000,
    descripcion: "Flores silvestres elegantes y sencillas.",
    descripcionCompleta: "Margaritas blancas naturales. Flores sencillas pero elegantes para cualquier arreglo. Excelente relación precio-calidad.",
    imagen: "assets/images/articulos/margaritas.png",
    cantidad: 90,
    rating: 4.2,
    resenas: 175
  },
  {
    id: 8,
    nombre: "Tulipanes variados",
    precio: 28000,
    descripcion: "Tulipanes frescos en diversos colores.",
    descripcionCompleta: "Tulipanes frescos en variedad de colores: rojo, rosa, amarillo y blanco. Flores de primavera perfecto para decorar.",
    imagen: "assets/images/articulos/tulipanes.png",
    cantidad: 80,
    rating: 4.4,
    resenas: 210
  }
];

/**
 * Obtener producto por ID (conversión segura a número).
 * @param {number|string} id - id del producto
 * @returns {Object|undefined} producto o undefined si no existe
 */
function obtenerProductoPorId(id) {
  return PRODUCTOS_CATALOGO.find(p => p.id === parseInt(id, 10));
}

/**
 * Obtener todos los productos
 */
function obtenerTodosProductos() {
  return PRODUCTOS_CATALOGO;
}

/**
 * Buscar productos por término (nombre o descripción corta).
 * Busca de forma case-insensitive.
 * @param {string} termino
 * @returns {Array} lista de productos coincidentes
 */
function buscarProductos(termino) {
  if (!termino) return PRODUCTOS_CATALOGO.slice();
  const terminoMinuscula = String(termino).toLowerCase();
  return PRODUCTOS_CATALOGO.filter(p =>
    (p.nombre || '').toLowerCase().includes(terminoMinuscula) ||
    (p.descripcion || '').toLowerCase().includes(terminoMinuscula)
  );
}
