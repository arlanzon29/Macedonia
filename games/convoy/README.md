# Convoy

[← Volver a la colección](../../README.md) · [Jugar](index.html)

Carretera en perspectiva falsa: el juego trabaja en `(x lateral, z profundidad)` y
proyecta con `p = near/(z+near)`. El horizonte está **fuera de pantalla** (`cam.horizon`
negativo) para que la calzada salga por el borde superior en vez de converger en un
punto visible.

A diferencia de Escuadrón, aquí hay **dos recursos separados**: la *potencia* de fuego,
que es lo que tocan las puertas, y la *vida*, que es lo que te quitan los enemigos. Una
puerta mala no te mata: te deja sin pegada, y entonces la horda te desborda.

## Ajustar la dificultad

| Constante | Efecto |
|---|---|
| `fire.streamGap` / `fire.maxStreams` | **El mando principal.** La potencia compra *ancho* de fuego, no solo daño. Con los chorros juntos, la multitud se reparte por la calzada, la mayoría nunca entra en la línea de tiro y subir la potencia no sirve de nada. |
| `enemy.countPerDist` | Cuántos enemigos por oleada según la distancia. Es de donde viene la dificultad a largo plazo. |
| `enemy.hpPerPower` | Bajo a propósito: si la resistencia escala con tu potencia tanto como el daño, la partida se vuelve invariante de escala y las puertas dejan de importar. |
| `enemy.dmgPerHp` | Cuánta vida te cuesta cada enemigo que llega. |
| `gate.mulChance` | Frecuencia de las puertas `×N`. Subirlo dispara el crecimiento exponencial. |

