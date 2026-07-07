import * as XLSX from "xlsx-js-style";

export type GuestRow = {
  guestId: string;
  name: string;
  phone: string;
};

export type QrPayload = {
  guestId: string;
  guestName: string;
  phone: string;
  attendance: "Hadir" | "Tidak Hadir";
  guests: number;
  timestamp: number;
};

export type CheckinEntry = {
  guestId: string;
  guestName: string;
  phone: string;
  attendance: string;
  guests: number;
  checkedInAt: string;
};

export const STORAGE_KEYS = {
  guestList: "wedding_guest_list",
  rsvpList: "wedding_rsvp",
  checkinList: "wedding_checkin_list",
};

export const createGuestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export const normalizePhoneForWhatsapp = (phone: string) => {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("0")) return `62${cleaned.slice(1)}`;
  return cleaned;
};

export const encodeQuery = (value: string) => encodeURIComponent(value).replace(/%20/g, "+");

const getAppBasePath = () => {
  if (typeof window === "undefined") return "";
  const pathSegments = window.location.pathname.split("/").slice(0, 2).join("/");
  return pathSegments === "/" ? "" : pathSegments;
};

export const createGuestLink = (guest: GuestRow) => {
  const base = typeof window !== "undefined" ? `${window.location.origin}${getAppBasePath()}` : "";
  const params = new URLSearchParams({
    guestId: guest.guestId,
    guestName: guest.name,
    phone: guest.phone,
  });
  return `${base}/?${params.toString()}`;
};

export const createWhatsAppLink = (guest: GuestRow) => {
  const phone = normalizePhoneForWhatsapp(guest.phone);
  const inviteUrl = createGuestLink(guest);
  const text = `Halo ${guest.name}, kamu diundang ke pernikahan kami! Silakan buka undangan ini: ${inviteUrl}`;
  const encoded = encodeQuery(text);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
};

export const createQrPayload = (
  guest: Pick<GuestRow, "guestId" | "name" | "phone">
, attendance: "Hadir" | "Tidak Hadir", guests: number) => {
  const payload: QrPayload = {
    guestId: guest.guestId,
    guestName: guest.name,
    phone: guest.phone,
    attendance,
    guests,
    timestamp: Date.now(),
  };
  return JSON.stringify(payload);
};

export const decodeQrPayload = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed.guestId === "string" &&
      typeof parsed.guestName === "string" &&
      typeof parsed.phone === "string"
    ) {
      return parsed as QrPayload;
    }
  } catch {
    return null;
  }
  return null;
};

const mapRowToGuest = (row: Record<string, string>): GuestRow => ({
  guestId: row.guestid || row.id || createGuestId(),
  name: row.name || row.nama || "Tamu Undangan",
  phone: row.phone || row.nomor || row.hp || "",
});

export const parseGuestCsv = (csv: string) => {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map(header => header.trim().toLowerCase());
  const rows = lines.slice(1);

  return rows.map(line => {
    const values = line.split(",").map(cell => cell.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return mapRowToGuest(row);
  });
};

export const parseGuestWorkbook = (buffer: ArrayBuffer): GuestRow[] => {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return rows
    .map(raw => {
      const row: Record<string, string> = {};
      Object.entries(raw).forEach(([key, value]) => {
        row[key.trim().toLowerCase()] = String(value ?? "").trim();
      });
      return mapRowToGuest(row);
    })
    .filter(guest => guest.name !== "Tamu Undangan" || guest.phone);
};

export const parseGuestFile = async (file: File): Promise<GuestRow[]> => {
  const isExcel = /\.xlsx?$/i.test(file.name);
  if (isExcel) {
    const buffer = await file.arrayBuffer();
    return parseGuestWorkbook(buffer);
  }
  const text = await file.text();
  return parseGuestCsv(text);
};

const HEADER_STYLE = {
  fill: { fgColor: { rgb: "D4A843" } },
  font: { bold: true, color: { rgb: "2A2A0E" }, sz: 12 },
  alignment: { horizontal: "center" as const, vertical: "center" as const },
  border: {
    top: { style: "thin" as const, color: { rgb: "8A6D1A" } },
    bottom: { style: "thin" as const, color: { rgb: "8A6D1A" } },
    left: { style: "thin" as const, color: { rgb: "8A6D1A" } },
    right: { style: "thin" as const, color: { rgb: "8A6D1A" } },
  },
};

const CELL_STYLE = {
  border: {
    top: { style: "thin" as const, color: { rgb: "DDDDDD" } },
    bottom: { style: "thin" as const, color: { rgb: "DDDDDD" } },
    left: { style: "thin" as const, color: { rgb: "DDDDDD" } },
    right: { style: "thin" as const, color: { rgb: "DDDDDD" } },
  },
  alignment: { vertical: "center" as const },
};

export const downloadGuestTemplate = () => {
  const headers = ["name", "phone"];
  const example = [
    ["Budi Santoso", "081234567890"],
    ["Siti Aminah", "082198765432"],
  ];

  const sheetData = [headers, ...example];
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);

  const headerCells = ["A1", "B1"];
  headerCells.forEach(cell => {
    if (sheet[cell]) sheet[cell].s = HEADER_STYLE;
  });
  for (let r = 1; r <= example.length; r++) {
    ["A", "B"].forEach(col => {
      const cell = `${col}${r + 1}`;
      if (sheet[cell]) sheet[cell].s = CELL_STYLE;
    });
  }

  sheet["!cols"] = [{ wch: 28 }, { wch: 22 }];
  sheet["!rows"] = [{ hpx: 26 }];

  const notesData = [
    ["Panduan Pengisian Data Tamu"],
    [""],
    ["1. Jangan ubah nama kolom di sheet 'Data Tamu' (name, phone)."],
    ["2. Kolom 'name' diisi nama lengkap tamu."],
    ["3. Kolom 'phone' diisi nomor WhatsApp aktif, contoh: 081234567890."],
    ["4. Hapus 2 baris contoh sebelum mengisi data tamu asli, atau timpa langsung."],
    ["5. Simpan file ini lalu upload melalui halaman Admin > Import CSV/Excel Tamu."],
  ];
  const notesSheet = XLSX.utils.aoa_to_sheet(notesData);
  notesSheet["A1"].s = { font: { bold: true, sz: 13, color: { rgb: "2A2A0E" } } };
  notesSheet["!cols"] = [{ wch: 70 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Data Tamu");
  XLSX.utils.book_append_sheet(workbook, notesSheet, "Panduan");

  XLSX.writeFile(workbook, "template_data_tamu.xlsx");
};

export const exportCsv = (items: Record<string, unknown>[], headers: string[]) => {
  const content = [headers.join(",")].concat(
    items.map(item =>
      headers
        .map(header => {
          const value = item[header as keyof typeof item];
          if (value === undefined || value === null) return "";
          const text = String(value);
          return text.includes(",") || text.includes("\"")
            ? `"${text.replace(/"/g, '""')}"`
            : text;
        })
        .join(",")
    )
  );
  return content.join("\n");
};

export const buildCheckinEntry = (
  payload: QrPayload
): CheckinEntry => ({
  guestId: payload.guestId,
  guestName: payload.guestName,
  phone: payload.phone,
  attendance: payload.attendance,
  guests: payload.guests,
  checkedInAt: new Date().toISOString(),
});
