# Macedonia — Arcade

Colección de prototipos de juegos arcade para navegador. Sin dependencias, sin
compilación y sin servidor: se abren con doble clic sobre el archivo.

**[index.html](index.html)** es el menú principal, desde el que se entra a cada juego.

Jugable en **https://arlanzon29.github.io/Macedonia/**

## Juegos

| Juego | Estado | Descripción | Cómo se juega |
|---|---|---|---|
| [Escuadrón](games/escuadron/index.html) | Jugable | Cruza puertas de multiplicadores, haz crecer tu escuadrón y revienta los bloques que bajan. | [README](games/escuadron/README.md) |
| [Convoy](games/convoy/index.html) | Jugable | Carretera en perspectiva: las puertas suben tu potencia de fuego y la horda te quita vida. | [README](games/convoy/README.md) |
| [Pixel Ciclismo](games/ciclista/index.html) | Jugable | Etapa de montaña en pixel art: gestiona energía, da órdenes a tu compi y gasta bien tus 3 boosts. | [README](games/ciclista/README.md) |

## Instalar en el móvil

Es una PWA. En Android, abre la web en Chrome y usa *Instalar aplicación*: se abre
a pantalla completa, **sin barra de direcciones**, y funciona sin conexión.

Para que Chrome ofrezca instalarla hacen falta las tres cosas a la vez, no solo el
manifiesto: [`manifest.webmanifest`](manifest.webmanifest) con `display: standalone`,
un icono, y [`sw.js`](sw.js), un service worker con manejador de `fetch`. Sin el
service worker, Android crea un acceso directo que abre el navegador con su barra.

## Añadir un juego

1. Crea `games/<slug>/index.html`, autocontenido.
2. Añade una entrada al array `GAMES` de [index.html](index.html) con su `slug`,
   nombre, color de acento y descripción.
3. Añade su ruta a `ASSETS` en [sw.js](sw.js) y sube la versión de `CACHE`, para que
   funcione sin conexión.
4. Escribe `games/<slug>/README.md` explicando cómo se juega y enlázalo en la tabla de arriba.
