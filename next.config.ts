import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk Github Pages: build project jadi kumpulan file HTML/CSS statis
  output: "export",
  
  images: {
    // Github Pages tidak mendukung fitur optimasi gambar server bawaan Next.js
    unoptimized: true,
  },
  
  // Catatan: Jika repository GitHub-mu bernama "undangan-dhimas",
  // kamu harus mengaktifkan baris di bawah ini dan mengganti namanya:
  // basePath: "/undangan-dhimas",
};

export default nextConfig;
