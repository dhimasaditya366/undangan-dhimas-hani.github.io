import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk Github Pages: build project jadi kumpulan file HTML/CSS statis
  output: "export",

  images: {
    // Github Pages tidak mendukung fitur optimasi gambar server bawaan Next.js
    unoptimized: true,
  },

  // Repo ini adalah GitHub Pages project page,
  // sehingga asset dan route harus ada di subpath repo.
  basePath: "/undangan-dhimas-hani.github.io",
  assetPrefix: "/undangan-dhimas-hani.github.io",
};

export default nextConfig;
