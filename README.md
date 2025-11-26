# Tienda Web - Proyecto (Demo)

Descripción
-----------
Este repositorio contiene una tienda online de demostración, diseñada como un proyecto educativo/práctico. Es una aplicación estática (HTML/CSS/JS) que simula las operaciones típicas de una tienda: catálogo, carrito, checkout y confirmación de pedidos. Todo el estado se guarda en `localStorage` (no hay backend).

Estructura del proyecto
----------------------
- `index.html` — Página principal / catálogo.
- `explorar.html` — Página de búsqueda / exploración de productos.
- `promos.html` — Página de promociones.
- `carrito.html` — Vista del carrito con edición de cantidades.
- `compra.html` — Checkout y formulario de datos de envío.
- `confirmar-compra.html` — Página que muestra la orden confirmada.
- `login.html` — Inicio de sesión simulado (localStorage).
- `assets/` — Recursos estáticos:
  - `styles/styles.css` — Estilos principales.
  - `images/` — Imágenes de productos y recursos.
  - `scripts/` — Lógica del cliente:
    - `productos.js` — Catálogo central de productos.
    - `index.js` — Render del catálogo en `index.html`.
    - `cart.js` — Lógica centralizada del carrito y órdenes.
    - `carrito.js` — (opcional) lógica relacionada con la vista del carrito.
    - `header.js` — Estado del header (contador de carrito, login/logout).
    - `forms.js` — Manejo de formularios globales (sugerencias, búsqueda).

Cómo ejecutar (local)
---------------------
1. Abre una terminal (PowerShell en Windows).
2. Sitúate en la carpeta que contiene `index.html` (ej. `venv` en este proyecto):

```powershell
cd 'C:\Users\Richar\Desktop\Trabajo parcial 2 - copia\Parcial 2\venv'
python -m http.server 8000
```

3. Abre tu navegador en `http://localhost:8000/index.html`.

Flujo de prueba rápido
----------------------
- Agregar productos desde la página principal.
- Ver el carrito (`carrito.html`), modificar cantidades, eliminar productos.
- Ir a pago (`compra.html`), rellenar formulario de envío y confirmar.
- Ver la confirmación en `confirmar-compra.html`.

Notas importantes
-----------------
- Esta es una demo sin backend; `localStorage` guarda carrito y órdenes.
- Para producción se debe agregar un backend, autenticación real y pasarela de pagos.

Licencia
--------
Proyecto de ejemplo. Reutiliza imágenes y contenido propios del autor (ver archivos en `assets/images`).
# Tienda Web (Proyecto)

Este repositorio contiene una página estática de ejemplo para una tienda online. Se han aplicado mejoras semánticas, de accesibilidad y de estilos para reducir el uso excesivo de <div> y organizar mejor el CSS.

## Estructura principal

- `index.html` - Página principal (refactorizada a etiquetas semánticas: header, nav, main, section, article, aside, footer)
- `assets/styles/styles.css` - Hoja de estilos principal (variables, utilidades, responsive y mejoras de foco)
- `assets/images/` - Imágenes usadas en la plantilla (si existen)

> Nota: el proyecto original tenía referencias a `assets/css/estilos.css`. He dejado estable la referencia al archivo `assets/styles/styles.css` como el principal para evitar duplicados. Si tienes otro archivo de estilos, revísalo y consolida los estilos.

## Cambios realizados (resumen)

1. HTML
   - Reemplazados <div> innecesarios por etiquetas semánticas (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<figure>`, `<figcaption>`, `<address>`).
   - Añadidos `role`, `aria-label`, `id` en puntos importantes para mejorar accesibilidad.
   - Labels ocultos (`.visually-hidden`) añadidos para formularios.
   - Comentarios en español explicando la estructura.

2. CSS
   - Hoja reorganizada con variables CSS (`:root`) para colores y espaciado.
   - Clases utilitarias y componentes básicos (`.btn`, `.btn--primary`, focus-visible, inputs).
   - Mejoras en imágenes (responsive), transiciones respetando `prefers-reduced-motion`.
   - Mejores reglas responsivas para móviles.

3. README
   - Archivo agregado con instrucciones y resumen de cambios.

## Cómo probar localmente

1. Abre `index.html` en un navegador moderno (Chrome, Edge, Firefox).
2. Revisa la consola de desarrollador para warnings.
3. Para comprobar accesibilidad básica, prueba navegar con teclado (Tab) y verifica los anillos de foco.

## Siguientes pasos recomendados

- Consolidar cualquier CSS restante en un solo archivo.
- Reemplazar los textos placeholder y las rutas de imágenes por contenido real.
- Ejecutar validadores HTML/CSS (por ejemplo, W3C validator, linters) si quieres comprobaciones automáticas.

---


