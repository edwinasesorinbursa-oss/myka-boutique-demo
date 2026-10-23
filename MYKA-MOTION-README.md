# MYKA Motion Hero — 23 octubre 2026

Portada animada original para MYKA Boutique & Beauty, basada en la geometría de un carrusel arqueado de tarjetas.

- HTML/CSS/JS vanilla, sin framework ni build.
- Logo original y catálogos existentes de vestidos/pestañas intactos.
- Carrusel de diez tarjetas: derecha a izquierda, arrastre e inercia, bordes curvos calculados por posición, animaciones de entrada y flechas dibujadas.
- Un único video 5×2 a partir de fotografías existentes de MYKA, con leves movimientos independientes, y un poster WebP.
- Las diez tarjetas se renderizan desde un solo video y Canvas para reducir descargas y decodificación.
- Accesibilidad: teclado flechas izquierda/derecha y preferencias de movimiento reducido (video detenido).
- CTA de Boutique y Beauty Studio apunta a secciones existentes.
- Editor de fotos se conserva, pero el botón cambia de posición para no cubrir el hero.
- Contactos y precios siguen pendientes de confirmación del cliente; no se inventaron datos.
- No se descargaron ni reutilizaron videos ni logos de Reelmark.

## Pruebas
Archivo tools/qa_motion.cjs: Playwright comprueba escritorio 1440x1080, móvil 390x844, 360x780 y 820x1000. Ningún error JavaScript, ningún desbordamiento horizontal, catálogos de cinco y cinco intactos, video en pausa con movimiento reducido.

## Ejecución local
python -m http.server 8091

## Regeneración
python tools/build_motion_assets.py requiere Python + Pillow + ffmpeg.
tools/apply_motion_hero.py aplica por única vez sobre la plantilla previa, no repetir sobre esta misma versión.

## Publicación
GitHub Pages usa la rama main. Esta rama de desarrollo no cambia producción hasta una fusión verificada.
