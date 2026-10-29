# Brief de material — Hero 3D "El Caldero vivo"

Web de El Caldero Mágico (Zaragoza). Idea elegida: un caldero en 3D en el hero, con
líquido animado por shader que reacciona al ratón y cambia de color según la sección.

## Cómo se construye y por qué pido lo que pido

El caldero será un **modelo 3D real (GLB)** iluminado en tiempo real, no un vídeo ni una
secuencia de fotos girando (eso pesa mucho más, no reacciona a la luz y se pixela en
pantallas grandes).

Por eso **las fotos del caldero no se publican tal cual**. Se usan para tres cosas:
1. Modelar el caldero fiel al real.
2. Extraer la textura del hierro (rayones, óxido, desgaste).
3. Acertar con la luz y el ambiente de la escena.

De ahí que haga falta muchos ángulos aunque luego no se vea ninguna foto del caldero.

---

## 1. Fotos del caldero

**Montaje:** caldero sobre una mesa, fondo liso y mate (tela negra o gris, o pared lisa),
luz difusa y uniforme (día nublado junto a una ventana grande, o dos focos con difusor).
Sin flash directo ni sombras duras.

**Reglas que importan más que la cámara:**
- Un móvil reciente vale. Usar la lente **1x o 2x, nunca el gran angular** (deforma la silueta).
- **Exposición y enfoque bloqueados** durante toda la vuelta (iPhone: mantener pulsado hasta AE/AF Lock). No cambiar el zoom a mitad.
- **No mover el caldero** entre tomas: moverse alrededor, o usar una bandeja giratoria marcando las posiciones con cinta.
- Horizontal, caldero entero ocupando ~70% del encuadre y con aire alrededor.
- **Sin recortar, sin filtros, sin mejora automática.** RAW/HEIF además del JPEG si se puede.

**Tomas (unas 50-60):**

| # | Toma | Ángulo | Cantidad |
|---|---|---|---|
| A | Vuelta orbital principal | cámara a la altura del borde, 15° por encima | 24 fotos, una cada 15° (o 12 cada 30° si es simétrico) |
| B | Vuelta orbital alta | 45° de picado | 12 fotos, cada 30° |
| C | Cenital | 90°, justo encima | 3: vacío, con líquido, con vapor |
| D | Contrapicado | casi a ras de mesa | 4, cada 90° |
| E | Base y patas | desde abajo | 3-4 |
| F | Macro de detalle | asa y su unión, remaches, borde, pata, soldaduras, grabados si tiene | 8-10 |
| G | Textura del hierro | plano muy cercano y plano, que se vean rayones y óxido | 4-5 |
| H | Escala | con una mano o un vaso al lado, + una con cinta métrica | 2-3 |

**Medidas a apuntar (texto, no foto):** alto total, alto del cuerpo sin patas, diámetro de
la boca, diámetro máximo de la panza, grosor del borde, número de patas y su altura, ancho
de las asas.

Carpeta: `assets/raw/caldero/`

## 2. Líquido y vapor

Es el alma del hero.
- Superficie del líquido **desde arriba**, llenando el encuadre, en **3 colores** si se puede (ámbar, violeta, verde/dorado).
- Burbujeo real: modo ráfaga, 10-15 fotos.
- Vapor o hielo seco en **tres intensidades** (poco, medio, desbordando).
- Serie **a contraluz con fondo negro**: con el humo iluminado desde detrás es como se ve de verdad.
- Macro de los brillos o de las perlas de coctelería molecular si las hay.

Carpeta: `assets/raw/liquido-vapor/`

## 3. El caldero en su sitio

5-6 fotos del caldero en la mesa de la clase de pociones, con la estantería de botes, las
velas y la luz tal como está una noche normal. Sirven para calcar la paleta y la
iluminación de la escena 3D.

Carpeta: `assets/raw/ambiente/`

---

## 4. Resto de la web

### Marca → `assets/raw/marca/`
- Logo en **SVG** (o PNG transparente de 2000px mínimo): versión blanca, negra y color; horizontal, vertical y el símbolo solo.
- Tipografías que se usan (archivos o nombres).
- Manual de marca o códigos de color exactos si existen.

### Comida y bebida → `assets/raw/comida/`
Fondo oscuro, luz lateral, dos tomas de cada plato: **picado 45° y cenital**.
- Carta: 6-8 platos. Imprescindibles el pan de colores, los nachos caseros, las patatas pulled pork y la torrija caramelizada.
- Cerveza de mantequilla: jarra con espuma alta, una a contraluz.
- Pociones chocolateadas: 3-4.
- Cócteles de la clase: el caldero individual humeando y el momento de echar el ingrediente.

**Esto no se genera con IA.** Tienen que ser los platos reales.

### Ambiente → `assets/raw/ambiente/`
- 4-6 fotos **muy horizontales y anchas** del local (van de fondo a pantalla completa): sala vacía y sala con gente.
- Clase de pociones en marcha, trivial del miércoles, un cumpleaños o evento.

### Recortables → `assets/raw/recortables/`
Oro para las animaciones. Cada objeto **solo, sobre fondo negro mate o liso**, bien
iluminado: sombrero seleccionador, varitas, botes de ingredientes, velas, pergaminos,
llaves. Se usan flotando en parallax.

### Vídeo → `assets/raw/video/`
Trípode o apoyado, cualquier móvil sirve.
- 15 s del caldero burbujeando, plano fijo, 4K si se puede.
- 15 s de humo subiendo **sobre fondo negro**.

Estos dos son además el *fallback* para móviles lentos.

### Datos y textos (sin esto la web no se publica)
- Dirección exacta, horarios, teléfono, email.
- **Qué sistema de reservas se usa** y su enlace. Es lo más importante de toda la web.
- Precios y duración de las clases de pociones; precios de eventos.
- Carta completa en texto o PDF, **alérgenos**, y qué es vegano y sin gluten.
- Enlaces de redes, aviso legal, política de cookies y el texto exacto del descargo de Warner Bros.

---

## 5. Prioridad

**Para arrancar:** bloque A (vuelta orbital), las medidas, el logo y las fotos del líquido.
Con eso ya se construye el hero.

**Después:** comida, ambiente, recortables, vídeo y textos.

Mientras llega el material se trabaja con un caldero genérico de relleno y el shader del
líquido ya funcionando. Al llegar las fotos se sustituye el modelo y la textura sin tocar
el resto.

## 6. Si se prefiere generar las imágenes con IA

Ver `prompts-chatgpt.md`. Funciona para el caldero de concepto, los recortables y el
ambiente; **no** para la comida.
