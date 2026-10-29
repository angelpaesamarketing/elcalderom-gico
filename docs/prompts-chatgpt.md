# Prompts para generar las imágenes de referencia con ChatGPT

Objetivo: conseguir un set de imágenes de referencia coherentes para modelar el
caldero 3D del hero de la web y para los elementos decorativos.

## Cómo usarlo

1. Abre un chat nuevo en ChatGPT y pega el **PROMPT MAESTRO**. Espera a que confirme.
2. Pide las imágenes **de una en una**, en orden, pegando cada bloque tal cual.
3. Desde la imagen 2 en adelante, **adjunta la imagen 1** al mensaje y empieza con
   "mismo caldero que la referencia adjunta". Es lo único que mantiene la coherencia.
4. Descarga siempre a máxima resolución y sin recortar. Guarda cada archivo en su
   carpeta de `assets/raw/` con el nombre que indica cada bloque.

## Importante

- **La comida NO se genera con IA.** Los platos tienen que ser los reales del
  restaurante o el cliente se siente engañado al llegar. Esas fotos van con móvil.
- La IA no mantiene el mismo objeto entre ángulos de forma fiable. Estas imágenes
  son **referencia de concepto**, no una vuelta fotogramétrica: con 3-4 buenas ya
  se puede modelar el caldero.
- Si el restaurante tiene calderos reales, fotografiarlos es mejor que generarlos.
  Ver `brief-fotos-caldero.md`.

---

## PROMPT MAESTRO (pegar primero)

Eres mi director de arte. Vas a generar un set de imágenes de referencia para el hero 3D
de la web de "El Caldero Mágico", un restaurante de temática mágica en Zaragoza: ambiente
de escuela de magia antigua, clases de pociones con coctelería molecular, cerveza de
mantequilla, luz de velas, madera oscura y botes de cristal.

MUY IMPORTANTE: el restaurante no está afiliado a ninguna franquicia. No uses logotipos,
escudos, uniformes, nombres ni ningún elemento reconocible de ninguna película, libro o
marca. Magia genérica y atemporal.

OBJETO PROTAGONISTA — debe ser el mismo en todas las imágenes:
Caldero de hierro fundido negro, panzudo, con la boca algo más estrecha que la panza,
labio grueso y redondeado, tres patas cortas, dos asas laterales de hierro con remaches.
Superficie mate con desgaste real: rayones, marcas de uso, óxido sutil en los bordes y
restos de hollín en la base. Tamaño de caldero de mesa, unos 30 cm de alto. Sin grabados
ni runas.

ESTILO: fotografía de producto realista, no ilustración y no render de videojuego. Luz
suave y envolvente de estudio, con una luz principal lateral alta y un contraluz cálido
tenue que separe el objeto del fondo. Fondo liso negro mate, sin degradados marcados, sin
suelo visible y sin reflejos de espejo. Nitidez alta en todo el objeto, equivalente a f/8,
sin desenfoque de fondo exagerado. Paleta: negro, gris hierro y ámbar cálido.

REGLAS: sin texto, sin marcas de agua, sin logotipos, sin personas ni manos salvo que lo
pida expresamente, sin viñeteado fuerte y sin filtros de color. Objeto entero y centrado,
ocupando alrededor del 70% del encuadre, con aire alrededor. Formato cuadrado 1:1 y la
máxima resolución que puedas.

Te iré pidiendo las imágenes de una en una. En cada una mantén exactamente el mismo
caldero, la misma luz y el mismo fondo: lo único que cambia es el ángulo de cámara o lo
que yo indique. Confírmame que lo tienes y espera mi primera petición.

---

## SERIE A — El caldero (carpeta `assets/raw/caldero/`)

### A1 · `caldero-frontal.png`
Imagen 1: el caldero de frente, cámara exactamente a la altura del borde superior, a
nivel, sin picado ni contrapicado. Vacío, sin líquido. Las dos asas visibles a izquierda y
derecha, simétricas. Es la imagen de referencia maestra, que se vea perfectamente la
silueta y la proporción.

### A2 · `caldero-tresquartos.png`
Mismo caldero que la referencia adjunta, misma luz y mismo fondo. Cambia solo la cámara:
vista en tres cuartos, girado 45 grados a la derecha, cámara 15 grados por encima del
borde. Vacío.

### A3 · `caldero-perfil.png`
Mismo caldero que la referencia adjunta. Vista de perfil exacto, 90 grados, con un asa
apuntando directamente a cámara. Cámara a la altura del borde. Vacío.

### A4 · `caldero-picado-45.png`
Mismo caldero que la referencia adjunta. Cámara en picado a 45 grados, viendo a la vez el
exterior de la panza y el interior vacío del caldero. Que se aprecie el grosor del labio.

### A5 · `caldero-cenital-vacio.png`
Mismo caldero que la referencia adjunta. Vista cenital perfecta, desde arriba a 90 grados,
centrado. Interior vacío, que se vea la pared interior y el fondo del caldero.

### A6 · `caldero-contrapicado.png`
Mismo caldero que la referencia adjunta. Contrapicado suave, cámara casi a ras de mesa
mirando ligeramente hacia arriba, de frente. Que se vean bien las tres patas y el hollín
de la base.

### A7 · `caldero-textura-hierro.png`
Primer plano extremo de la superficie del hierro de este caldero, llenando todo el
encuadre, casi plano, sin que se reconozca la forma del caldero. Textura mate con
rayones, poros del hierro fundido, óxido sutil y hollín. Luz rasante que marque el relieve.
Sirve como textura, que sea lo más uniforme posible.

### A8 · `caldero-detalle-asa.png`
Primer plano del asa de hierro y de su unión con el cuerpo del caldero, con los remaches
visibles. Luz lateral marcada para que se lea el volumen.

---

## SERIE B — Líquido y vapor (carpeta `assets/raw/liquido-vapor/`)

### B1 · `pocion-ambar.png`
Mismo caldero que la referencia adjunta, vista cenital a 90 grados, lleno hasta tres
cuartos de una poción líquida de color ámbar dorado, translúcida y luminosa, que emite luz
propia suave hacia arriba e ilumina la pared interior del caldero. Superficie con ondas
concéntricas lentas y algunas burbujas. Sin vapor todavía.

### B2 · `pocion-violeta.png`
Igual que la anterior, misma cámara cenital y mismo caldero, pero la poción es violeta
intenso con reflejos magenta.

### B3 · `pocion-verde-dorada.png`
Igual que las anteriores, misma cámara cenital y mismo caldero, pero la poción es verde
esmeralda con partículas doradas en suspensión.

### B4 · `pocion-superficie-macro.png`
Primer plano extremo de la superficie de una poción ámbar luminosa dentro del caldero,
llenando todo el encuadre: ondas, burbujas de distintos tamaños reventando y partículas
brillantes en suspensión. Sirve como textura, sin que se vea el borde del caldero.

### B5 · `vapor-contraluz.png`
Fondo totalmente negro. Solo una columna de vapor denso y lento subiendo y abriéndose en
volutas, iluminada a contraluz por una luz cálida situada detrás, de modo que el humo
quede luminoso sobre el negro puro. Sin ningún objeto, sin caldero, sin texto. Realista,
tipo humo de hielo seco, no nubes de dibujo.

### B6 · `caldero-pocion-vapor.png`
Mismo caldero que la referencia adjunta, vista en tres cuartos a 45 grados con cámara 15
grados por encima del borde, lleno de poción ámbar luminosa y con vapor denso saliendo y
desbordando por el labio, cayendo por la panza. Luz de la poción iluminando las asas y el
interior del labio desde abajo. Esta es la imagen clave del hero, pon el máximo detalle.

---

## SERIE C — Recortables (carpeta `assets/raw/recortables/`)

Para cada uno: **objeto solo, centrado, sobre fondo negro mate absolutamente liso**,
sin sombra proyectada en el fondo y sin ningún otro elemento. 1:1. Si ChatGPT puede
entregarlo con fondo transparente en PNG, mejor.

### C1 · `varita.png`
Una varita de madera de unos 35 cm, artesanal, con nudos y vetas visibles y mango algo más
grueso con un anillo de cuero. Diagonal en el encuadre. Fondo negro mate liso, objeto solo.
Diseño genérico, sin parecerse a ninguna marca.

### C2 · `botes-ingredientes.png`
Tres botes de cristal antiguos de distinto tamaño, con tapón de corcho, llenos de
ingredientes extraños: polvo dorado, hojas secas, pequeñas esferas luminosas. Etiquetas de
papel envejecido **en blanco, sin ningún texto escrito**. Fondo negro mate liso, objetos
solos.

### C3 · `velas-flotantes.png`
Tres velas blancas de cera derramada, de distinta altura, encendidas, flotando en el aire
sin candelabro ni soporte, con gotas de cera suspendidas. Fondo negro mate liso, objetos
solos.

### C4 · `pergamino.png`
Un pergamino de papel envejecido parcialmente enrollado, con los bordes quemados, **en
blanco, sin ningún texto ni dibujo**. Fondo negro mate liso, objeto solo.

### C5 · `llave-antigua.png`
Una llave de hierro antigua, grande y ornamentada, con óxido. Fondo negro mate liso,
objeto solo.

### C6 · `cuchara-caldero.png`
Un cucharón de madera oscura desgastada, largo, con restos secos de poción ámbar
brillante en la pala. Fondo negro mate liso, objeto solo.

---

## SERIE D — Ambiente (carpeta `assets/raw/ambiente/`)

Formato **16:9 horizontal y muy ancho**, estas van de fondo a pantalla completa.
Sin personas reconocibles y sin texto.

### D1 · `ambiente-mesa-pociones.png`
Formato 16:9 horizontal. Interior de una sala de pociones de una escuela de magia antigua:
mesa larga de madera oscura y gastada con varios calderos pequeños de hierro alineados,
cada uno con una poción de un color distinto que emite luz suave, botes de cristal con
tapón de corcho, cucharones de madera, velas encendidas y una estantería de madera al
fondo desenfocada llena de frascos. Luz cálida de velas, atmósfera cálida y acogedora, no
siniestra. Sin personas, sin texto, sin logotipos ni elementos de ninguna marca conocida.

### D2 · `ambiente-comedor.png`
Formato 16:9 horizontal. Un comedor de banquete en un salón antiguo de piedra: mesas
corridas de madera, bancos, vajilla sencilla, velas flotando en el aire a varias alturas y
un techo alto en penumbra. Luz cálida dorada. Sin personas, sin texto, sin escudos ni
estandartes con símbolos.

### D3 · `ambiente-cielo-velas.png`
Formato 16:9 horizontal. Solo el techo: velas flotando a distintas alturas y
profundidades sobre un fondo oscuro azulado, con las llamas desenfocadas en primer plano y
nítidas al fondo, como un cielo de velas. Pensado para usar como fondo de parallax, muy
oscuro en la mitad inferior.

### D4 · `ambiente-estanteria.png`
Formato 16:9 horizontal. Una pared entera de estanterías de madera oscura llena de
cientos de botes de cristal con ingredientes de colores, iluminados desde dentro por una
luz cálida. Etiquetas en blanco, sin texto. Sin personas.

---

## Lo que NO se genera con IA

- **Los platos y las bebidas.** Hamburguesas con pan de colores, nachos, patatas pulled
  pork, torrija caramelizada, cerveza de mantequilla, pociones chocolateadas y los
  cócteles de la clase: fotos reales, con móvil. Ver `brief-fotos-caldero.md`.
- **El local real** y el equipo.
- **El logotipo**, que ya existe: hace falta el archivo original en SVG o PNG transparente.
