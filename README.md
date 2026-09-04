# Macedonia — Arcade

Colección de prototipos de juegos arcade para navegador. Sin dependencias, sin
compilación y sin servidor: se abren con doble clic sobre el archivo.

**[index.html](index.html)** es el menú principal, desde el que se entra a cada juego.

## Juegos

| Juego | Estado | Descripción |
|---|---|---|
| [Escuadrón](games/escuadron/index.html) | Jugable | Cruza puertas de multiplicadores, haz crecer tu escuadrón y revienta los bloques que bajan. |

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

## Añadir un juego

1. Crea `games/<slug>/index.html`, autocontenido.
2. Añade una entrada al array `GAMES` de [index.html](index.html) con su `slug`,
   nombre, color de acento y descripción.
