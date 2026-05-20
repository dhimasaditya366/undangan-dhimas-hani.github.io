export type GuestRow = {
  guestId: string;
  name: string;
  phone: string;
};

export type QrPayload = {
  guestId: string;
  guestName: string;
  phone: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu";
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
, attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu", guests: number) => {
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

    return {
      guestId: row.guestid || row.guestId || row.id || createGuestId(),
      name: row.name || "Tamu Undangan",
      phone: row.phone || row.nomor || row.hp || "",
    } as GuestRow;
  });
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
