/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages sirve archivos estáticos: no hay servidor Node detrás.
  // Toda la web es cliente, así que el export completo es suficiente.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ['three'],
};

export default nextConfig;
