# Pixel Ciclismo

[← Volver a la colección](../../README.md) · [Jugar](index.html)

Carrera ciclista de perfil en pixel art (lienzo de 480×270 escalado sin suavizado).
Eres el líder de un equipo de dos y tu objetivo es ganar una etapa de montaña con
final en alto. No se trata de pulsar más rápido, sino de **gestionar tres recursos**:
la energía, tu compañero y los boosts.

## Modos

- **Carrera:** 6 corredores en 3 equipos (el tuyo, ROJO y VERDE). Meta en la cima
  del primer gran puerto pasados los 9 km (km ~17,9). Al llegar, podio y clasificación
  con diferencias de tiempo.
- **Entrenamiento:** solo tú y tu compañero, sin meta y con recorrido infinito, para
  practicar relevos y avituallamiento.

## Controles

| Acción | Teclado | Pantalla |
|---|---|---|
| Esprintar (mantener) | `Espacio` / `→` | botón rojo **SPRINT** o clic sobre el juego |
| Boost | `B` / `Shift` | botón dorado **BOOST** |
| Órdenes al compi | `1` `2` `3` | botonera de abajo a la izquierda |
| Pausa | `Esc` / `P` | botón **⏸ PAUSA** |
| Salir al menú | `M` | desde la pausa |

## Energía y pendiente

- **Esprintar** vacía la barra de energía en unos 3 s. Sin esprintar se recarga, más
  rápido si vas **a rueda** (con alguien justo delante que te corta el viento).
- Si llega a **0 quedas AGOTADO** y no puedes esprintar hasta recuperar un 25 %.
- En **subida** la velocidad se divide según la pendiente (13 km/h al 20 %) y el
  rebufo apenas ayuda; en **bajada** se acelera. El marcador muestra la pendiente y la
  altitud, y los ciclistas se ponen de pie al escalar o esprintar.
- El **perfil de la etapa** (abajo a la izquierda) muestra todo el recorrido coloreado
  por dureza, dónde estás, dónde van los rivales y la meta.

## Tu compañero

| Orden | Qué hace |
|---|---|
| 🔄 **Relevos** | Esprinta delante de ti ~4 s llevándote a rueda a ~50 km/h (te arrastra sin gastar tu energía), se aparta a descansar a tu rueda y, al pasar del 70 %, vuelve a tirar. |
| 🛡️ **Conmigo** | Va a tu rueda ahorrando fuerzas. Es la orden por defecto. |
| 🍌 **Avituallar** | Baja al **coche de equipo** (va detrás del grupo), carga comida y vuelve: **+1 boost**. Una vez por etapa y solo si has gastado alguno (nunca pasas de 3). Mientras tanto no cuentas con él. |

## ⚡ Boosts: el componente táctico

- **3 boosts por equipo y etapa, compartidos** entre los dos corredores.
- Cada uno dura **4 s**: más rápido que cualquier esprint y **sin gastar energía**.
  Se ve con dos siluetas fantasma que salen del corredor y vuelven al terminar.
- **Los rivales también tienen 3.** El marcador de arriba a la derecha muestra los que
  le quedan a cada equipo: un equipo sin boosts es un equipo vulnerable.

## Los rivales

Cada equipo rival tiene un **líder** (ROJO1, VERDE1) y un **gregario** (ROJO2, VERDE2):

- **El gregario trabaja para su líder:** tira delante de él, lo espera si se queda,
  lo alcanza si se ha ido y **persigue los ataques** de otros equipos.
- **El líder guarda fuerzas:** ataca en las subidas y en el último kilómetro y medio;
  usa sus boosts al final o para romper en un puerto.
- Cuando alguien se escapa, líder y gregario **se organizan en relevos** para cazarlo.
- VERDE son **escaladores** (vuelan en los puertos); ROJO, **rodadores**.
- Una "goma" suave mantiene a los rivales cerca de ti, pero **solo a corta distancia**
  y al 25 % en subida: si abres hueco de verdad, lo mantienes.

## Consejos

1. Usa **relevos** en llano para avanzar sin gastar energía.
2. Gasta un boost pronto si te sirve, y manda al compi al **coche** en un tramo tranquilo
   para llegar al puerto final con los 3.
3. Mira el marcador de boosts: **ataca cuando los rivales ya no tengan**.
4. En la subida final el rebufo casi no cuenta: ahí gana quien llegue con energía y boosts.

## Ajustar el juego

Todo está en un único `index.html`. Los valores más útiles:

| Dónde | Efecto |
|---|---|
| `FINISH` | Posición de la meta (la primera cima grande pasados 3600 px ≈ 9 km). |
| `alt(x)` | Forma del terreno: amplitud y longitud de los puertos. |
| `BOOST_F` / `BOOSTS` | Duración del boost (240 fotogramas = 4 s) y cuántos hay por equipo. |
| `pow` / `grimpeur` de cada corredor | Fuerza en llano y en subida de cada rival. |
| `const target = s<0 ? base/(1+up*5) : base+s*5` | Cuánto frena la subida y cuánto acelera la bajada. |
| `BK` / `CS` | Tamaño de los ciclistas y del coche. |

> El juego avanza por fotograma: en pantallas de 120/144 Hz todo va más rápido.

