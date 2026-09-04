# Macedonia — Arcade

Colección de prototipos de juegos arcade para navegador. Sin dependencias, sin
compilación y sin servidor: se abren con doble clic sobre el archivo.

**[index.html](index.html)** es el menú principal, desde el que se entra a cada juego.

Jugable en **https://arlanzon29.github.io/Macedonia/**

## Juegos

| Juego | Estado | Descripción |
|---|---|---|
| [Escuadrón](games/escuadron/index.html) | Jugable | Cruza puertas de multiplicadores, haz crecer tu escuadrón y revienta los bloques que bajan. |
| [Convoy](games/convoy/index.html) | Jugable | Carretera en perspectiva: las puertas suben tu potencia de fuego y la horda te quita vida. |

## Instalar en el móvil

Es una PWA. En Android, abre la web en Chrome y usa *Instalar aplicación*: se abre
a pantalla completa, **sin barra de direcciones**, y funciona sin conexión.

Para que Chrome ofrezca instalarla hacen falta las tres cosas a la vez, no solo el
manifiesto: [`manifest.webmanifest`](manifest.webmanifest) con `display: standalone`,
un icono, y [`sw.js`](sw.js), un service worker con manejador de `fetch`. Sin el
service worker, Android crea un acceso directo que abre el navegador con su barra.

## Escuadrón

Arcade vertical del estilo *Squad Alpha* / *Gun Crowd*. El escuadrón dispara solo;
tú únicamente eliges por qué puerta pasar.

- **Controles:** arrastrar con el ratón o el dedo sobre el tablero, o flechas ← →.
- **Puertas:** `+N`, `×N` (verdes) y `−N`, `÷N` (naranjas) modifican el contador al cruzarlas.
- **Bloques:** cada impacto resta 1 de resistencia. El que llega a tu línea te quita
  tantos soldados como resistencia le quedara.
- **Fin de partida:** cuando el escuadrón llega a 0. El récord se guarda en `localStorage`.

Todo en un único `index.html` autocontenido: canvas 2D, mundo virtual de 360×640
escalado con `setTransform`, bucle con delta time y HUD en HTML superpuesto.

### Ajustar la dificultad

Todas las constantes de balance están agrupadas en el objeto `CFG`, al principio del
script. Las que más mueven la aguja:

| Constante | Efecto |
|---|---|
| `enemy.hpPerSoldier` | **El mando principal.** La resistencia de los bloques escala con tu escuadrón; sin esto el juego se gana solo, porque tú creces de forma multiplicativa y la amenaza no. Subir = más difícil. |
| `gate.mulChance` | Cuántas puertas buenas son `×N`. Subirlo dispara el crecimiento exponencial y produce partidas de "invencible y de pronto muerto". |
| `scroll.base` / `scroll.max` | Ritmo: cuánto tiempo tienes para decidir en cada puerta. |
| `startRunwaySec` | Margen antes de que llegue la primera puerta. |
| `gate.safeRows` | Primeras filas sin puerta mala. Con 1 soldado, un `−N` es muerte sin decisión posible. |
| `gate.goodPairChance` | Proporción de parejas con las dos puertas buenas pero desiguales. No es dificultad, es *interés*: ahí está la decisión real. |

## Convoy

Carretera en perspectiva falsa: el juego trabaja en `(x lateral, z profundidad)` y
proyecta con `p = near/(z+near)`. El horizonte está **fuera de pantalla** (`cam.horizon`
negativo) para que la calzada salga por el borde superior en vez de converger en un
punto visible.

A diferencia de Escuadrón, aquí hay **dos recursos separados**: la *potencia* de fuego,
que es lo que tocan las puertas, y la *vida*, que es lo que te quitan los enemigos. Una
puerta mala no te mata: te deja sin pegada, y entonces la horda te desborda.

### Ajustar la dificultad

| Constante | Efecto |
|---|---|
| `fire.streamGap` / `fire.maxStreams` | **El mando principal.** La potencia compra *ancho* de fuego, no solo daño. Con los chorros juntos, la multitud se reparte por la calzada, la mayoría nunca entra en la línea de tiro y subir la potencia no sirve de nada. |
| `enemy.countPerDist` | Cuántos enemigos por oleada según la distancia. Es de donde viene la dificultad a largo plazo. |
| `enemy.hpPerPower` | Bajo a propósito: si la resistencia escala con tu potencia tanto como el daño, la partida se vuelve invariante de escala y las puertas dejan de importar. |
| `enemy.dmgPerHp` | Cuánta vida te cuesta cada enemigo que llega. |
| `gate.mulChance` | Frecuencia de las puertas `×N`. Subirlo dispara el crecimiento exponencial. |

## Añadir un juego

1. Crea `games/<slug>/index.html`, autocontenido.
2. Añade una entrada al array `GAMES` de [index.html](index.html) con su `slug`,
   nombre, color de acento y descripción.
