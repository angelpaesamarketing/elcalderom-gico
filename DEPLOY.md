# Publicar en Cloudflare Pages

La web es íntegramente de cliente (el 3D corre en el navegador), así que se
exporta como sitio estático. Cloudflare Pages solo tiene que servir archivos:
no hace falta `@cloudflare/next-on-pages` ni funciones.

## Opción A — Conectar el repositorio (recomendada)

En el panel de Cloudflare: **Workers & Pages → el proyecto → Settings → Builds**.

| Campo | Valor |
|---|---|
| Framework preset | `Next.js (Static HTML Export)` — si no aparece, `None` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(vacío)* |

Y en **Settings → Environment variables**, para el entorno de producción:

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `22` |

> El repositorio ya trae un archivo `.node-version` con `22`. La variable de
> entorno es el cinturón por si Cloudflare no lo lee: Next 16 no arranca con
> Node 18.

**Importante — la rama.** El trabajo está en `claude/festive-wright-r7oqlo`, no
en la rama por defecto. En **Settings → Builds → Branch control**, pon esa rama
como *production branch*, o fusiona la rama a la principal antes de desplegar.
Si no, Pages construirá una rama vacía y publicará un 404.

Cada push a esa rama vuelve a desplegar solo.

## Opción B — Subida directa

```bash
npm install
npm run build          # genera out/
npx wrangler pages deploy out --project-name=<nombre-del-proyecto>
```

O arrastrar la carpeta `out/` al panel de Pages, en **Create deployment → Upload assets**.

## Comprobar que salió bien

Al abrir la URL deberías ver el caldero girando levemente con el ratón, la
poción ámbar burbujeando y el vapor saliendo. Al bajar, la poción cambia de
color en cada sección.

Si sale la página pero **sin caldero**, es WebGL: pasa en navegadores muy
antiguos o con la aceleración por hardware desactivada. El resto de la web
sigue siendo legible y usable; la imagen de respaldo para esos casos está
pendiente.

## Peso

El export completo ronda los 3 MB, de los cuales la mayor parte es la librería
3D. Las texturas van en `public/textures/`.
