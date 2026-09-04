# Prompt para Claude Code — Juego "Escuadrón"

> Copia todo lo que hay debajo de la línea y pégalo en Claude Code.

---

Quiero que construyas un prototipo jugable de un juego arcade para navegador, del tipo que sale en los anuncios de móvil: un escuadrón que dispara hacia arriba, puertas con multiplicadores que hacen crecer el escuadrón, y oleadas de enemigos que bajan. Estilo *Squad Alpha* / *Gun Crowd*.

## Stack y restricciones

- **Un único archivo `index.html`** autocontenido: HTML, CSS y JavaScript en el mismo fichero.
- **Sin librerías ni frameworks.** Nada de motor de física: la lógica de movimiento y colisiones es propia, con rectángulos. Para balas y bloques que caen, un motor de física es más estorbo que ayuda.
- **Canvas 2D** para el juego. El HUD y las pantallas de inicio/fin son HTML superpuesto, no dibujado en canvas.
- JavaScript moderno (ES2020+), sin transpilar. Todo dentro de una IIFE con `'use strict'`.
- Debe funcionar con doble clic sobre el archivo, sin servidor.

## Arquitectura del código

Separa el script en bloques claros y comentados, en este orden:

1. `CFG` — objeto con **todas** las constantes de balance agrupadas al principio. Nada de números mágicos repartidos por el código: si quiero tocar la cadencia de disparo o la velocidad, quiero encontrarlo en un solo sitio.
2. Setup de canvas y escalado.
3. Estado del juego (`S`) y funciones de reinicio.
4. Generación de filas (puertas y enemigos).
5. Lógica de actualización (`update(dt)`).
6. Renderizado (`draw()`).
7. Controles.
8. Bucle principal.

**El bucle usa delta time**, no un `dt` fijo: la velocidad del juego no puede depender de los fps del dispositivo. Limita el `dt` a 0,05 s para que un cambio de pestaña no teletransporte a los enemigos.

**Mundo virtual de coordenadas fijas** (360×640) escalado al tamaño real del canvas con `ctx.setTransform`. Así toda la lógica trabaja en unidades constantes y no hay que recalcular posiciones al redimensionar. Ten en cuenta el `devicePixelRatio` (capado a 2) para que no se vea borroso en pantallas retina.

## Mecánica

**Escuadrón (jugador).** Empieza con 1 soldado en una línea fija cerca del borde inferior. Se mueve solo en horizontal. Los soldados se dibujan en formación piramidal centrada en la posición del escuadrón, con filas que crecen (1, 3, 5, 7...). Limita los soldados *dibujados* a unos 60 por rendimiento, aunque el contador real suba más; cachea las posiciones de formación por número de soldados para no recalcularlas cada frame.

**Disparo automático.** Ráfagas a intervalo fijo. El número de cañones simultáneos escala con el tamaño del escuadrón hasta un tope, de modo que un escuadrón grande hace más daño por segundo. Las balas suben en línea recta y se destruyen al salir de pantalla o al impactar.

**Puertas.** Aparecen por parejas ocupando media pantalla cada una. Cada puerta tiene una operación que se aplica al contador del escuadrón al cruzarla: `+N`, `×N`, `−N`, `÷N`. Se aplica la del lado por el que pase el jugador, una sola vez. Las sumas y multiplicaciones se pintan en verde, las restas y divisiones en naranja.

Detalle de diseño importante: **aproximadamente un tercio de las parejas deben tener las dos puertas buenas pero desiguales** (por ejemplo `+12` frente a `×2`). Si el par siempre es "buena contra mala", la decisión es trivial y el juego aburre. Con dos buenas desiguales, el jugador tiene que calcular cuál le conviene según cuántos soldados lleve, que es donde está la gracia.

**Enemigos.** Bloques que bajan con un número de resistencia escrito encima y una barra de vida. Cada impacto resta 1. Al destruirlos dan puntos proporcionales a su resistencia máxima. **Si un enemigo llega a la línea del escuadrón, resta tantos soldados como resistencia le quedara** — no es muerte instantánea, es un castigo proporcional. Entre 1 y 3 bloques por fila, repartidos en carriles.

**Progresión.** Filas alternas de puertas y enemigos, generadas por procedimiento a intervalo vertical constante. La velocidad de bajada y la resistencia de los enemigos crecen con la puntuación, con un tope de velocidad. Las dos primeras filas deben ser siempre puertas: empezar con 1 soldado contra un enemigo no es jugable.

**Fin de partida** cuando el escuadrón llega a 0, por una puerta negativa o por un impacto.

## Controles

- **Puntero**: pulsar y arrastrar en cualquier punto del tablero mueve el escuadrón. Usa Pointer Events con `setPointerCapture`, así funciona igual con ratón y con dedo. Pon `touch-action: none` en el contenedor para que el móvil no haga scroll al arrastrar.
- **Teclado**: flechas izquierda/derecha.
- El movimiento es **suavizado** hacia una posición objetivo, no un salto directo. Y el escuadrón queda limitado dentro de la pantalla teniendo en cuenta el ancho real de la formación, que crece con el número de soldados.

## Interfaz

- HUD superpuesto con dos datos: soldados y puntuación.
- Pantalla de inicio con instrucciones breves y botón de empezar.
- Pantalla de fin con puntuación, récord y botón de reintentar.
- **Récord persistente en `localStorage`**, con `try/catch` en lectura y escritura: en modo incógnito o con el almacenamiento bloqueado lanza excepción, y el juego no debe romperse por eso.
- El tablero debe verse ya poblado de elementos en la pantalla de inicio, detrás del overlay. Un canvas vacío no muestra de qué va el juego.

## Estética

Arcade nocturno: fondo azul muy oscuro con degradado y una rejilla tenue que se desplaza para dar sensación de avance. Escuadrón en cian, enemigos en magenta, puertas buenas en verde, malas en naranja, acentos en dorado. Tipografía técnica y condensada para los números del HUD y de las puertas. Es un juego, así que comprométete con un único tema oscuro; no hagas versión clara.

Añade feedback visual en los momentos que importan: partículas al destruir un enemigo y al cruzar una puerta, un destello de color en pantalla (verde al ganar soldados, rojo al perderlos) y sacudida de cámara al recibir un impacto. Respeta `prefers-reduced-motion` para la interfaz HTML.

## Criterios de aceptación

Antes de darlo por terminado, comprueba que:

1. El juego arranca y se puede jugar una partida completa hasta perder.
2. Arrastrando con el ratón y con las flechas, el escuadrón se mueve y nunca se sale de la pantalla, ni siquiera con 200 soldados.
3. Al cruzar una puerta, el contador cambia según la operación correcta y solo se aplica una vez.
4. Los enemigos pierden resistencia al recibir disparos y desaparecen al llegar a cero.
5. Un enemigo que llega abajo resta soldados; si el escuadrón llega a 0, sale la pantalla de fin.
6. El récord se guarda y se recupera al recargar.
7. No hay errores en la consola.

## Lo que no quiero

- No añadas menús de opciones, niveles, tienda, ni sonido: es un prototipo para validar si la mecánica engancha.
- No metas dependencias "por si acaso".
- No dejes código muerto ni funciones sin usar.

Cuando termines, resúmeme en cinco líneas qué constantes de `CFG` debería tocar primero para ajustar la dificultad.
