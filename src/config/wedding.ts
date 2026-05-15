export const weddingConfig = {
  // ─── NAMA MEMPELAI ───────────────────────────────
  groomName: "Dhimas Aditya",
  groomFullName: "Dhimas Aditya",
  groomInitial: "D",
  groomParents: "Putra dari Bapak [X] & Ibu [Y]",

  brideName: "Raihannil Jannah",
  brideFullName: "Raihannil Jannah",
  brideInitial: "R",
  brideParents: "Putri dari Bapak [X] & Ibu [Y]",

  // ─── TANGGAL & WAKTU ──────────────────────────────
  weddingDate: "2026-12-18T09:00:00",
  weddingDateDisplay: "Jum'at, 18 Desember 2026",
  akadTime: "09.00 – 11.00 WIB",
  resepsiTime: "11.00 – 14.00 WIB",

  // ─── LOKASI ───────────────────────────────────────
  venueName: "NAMA VENUE",              // 📝 GANTI
  venueAddress: "Jl. Alamat, Kota",     // 📝 GANTI
  venueMapUrl: "https://maps.google.com/?q=NAMA+VENUE", // 📝 GANTI
  venueWazeUrl: "https://waze.com/ul?ll=-6.2088,106.8456", // 📝 GANTI
  venueLat: -6.2088,                    // 📝 GANTI — untuk iframe maps
  venueLng: 106.8456,                   // 📝 GANTI

  // ─── MEDIA ────────────────────────────────────────
  openingVideo: "/undangan-dhimas-hani.github.io/videos/opening.mp4",
  heroBg: "/undangan-dhimas-hani.github.io/images/hero-bg.jpeg",
  baroqueBg: "/undangan-dhimas-hani.github.io/images/baroque-bg.jpeg",
  backgroundMusic: "/undangan-dhimas-hani.github.io/audio/wedding-song.mp3",

  groomPhoto: "/undangan-dhimas-hani.github.io/images/groom.jpeg",      // 📝 GANTI — kosongkan jika belum ada
  bridePhoto: "/undangan-dhimas-hani.github.io/images/bride.jpeg",      // 📝 GANTI
  galleryPhotos: [                      // 📝 GANTI — tambah/kurangi sesuai jumlah foto
    "/undangan-dhimas-hani.github.io/images/gallery-1.jpg",
    "/undangan-dhimas-hani.github.io/images/gallery-2.jpg",
    "/undangan-dhimas-hani.github.io/images/gallery-3.jpg",
    "/undangan-dhimas-hani.github.io/images/gallery-4.jpg",
    "/undangan-dhimas-hani.github.io/images/gallery-5.jpg",
    "/undangan-dhimas-hani.github.io/images/gallery-6.jpg",
  ],

  // ─── TEKS ─────────────────────────────────────────
  closingQuote: "Dan mereka pun hidup bahagia selamanya", // 📝 GANTI
  dresscodeNote: "Formal / Semi-formal. Mohon hindari warna putih penuh.",
  dresscodeColors: [
    { name: "Olive", hex: "#3D3D18" },
    { name: "Sage", hex: "#DDE8B8" },
    { name: "Cream", hex: "#F2F5E8" },
    { name: "Gold", hex: "#C9A96E" },
  ],

  // ─── STORY OF US ──────────────────────────────────
  storyOfUs: {
    eyebrow: "OUR JOURNEY",
    title: "Story of Us",
    subtitle: "dari layar kaca menuju sebuah janji",
    chapters: [
      {
        number: "01",
        title: "Awal Mula",
        photo: "/undangan-dhimas-hani.github.io/images/story-1.jpeg",
        text: "Perkenalan kami dimulai dari hal yang sederhana — sebuah sapaan di dunia maya yang tanpa kami sadari, menjadi awal dari segalanya. Dari percakapan yang mengalir perlahan, kami mulai saling mengenal satu sama lain lebih dalam.",
        closingQuote: "",
      },
      {
        number: "02",
        title: "Perjalanan Bersama",
        photo: "/undangan-dhimas-hani.github.io/images/story-2.jpeg",
        text: "Hari demi hari, kami melewati berbagai momen — tawa yang menghangat, serta ujian yang menguatkan. Tidak selalu mudah. Ada masa-masa sulit yang mengguncang, namun justru di titik itulah kami belajar arti dari memilih satu sama lain, bukan hanya di saat senang, tetapi juga di saat paling berat sekalipun.",
        closingQuote: "",
      },
      {
        number: "03",
        title: "Sebuah Keputusan",
        photo: "/undangan-dhimas-hani.github.io/images/story-3.jpeg",
        text: "Setelah melewati semua yang telah kami jalani bersama, kami sampai pada satu keyakinan yang sama — bahwa tidak ada tempat yang lebih ingin kami tuju, selain melangkah maju bersama. Maka dengan penuh syukur dan doa, kami memilih untuk meresmikan ikatan ini dalam sebuah pernikahan.",
        closingQuote: "— dan kami pun memilih untuk terus melangkah, bersama.",
      },
    ],
  },
} as const;
