/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();
const nextConfig = {};

module.exports = removeImports({
  ...nextConfig,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
});
