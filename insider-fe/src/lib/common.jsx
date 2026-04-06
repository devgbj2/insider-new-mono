import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'api/',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor (contoh untuk auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response);

    console.error(error);

    const isLoginRequest = error.config?.url?.includes("auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const formatLabel = (path) => {
  return path.replace(/-/g, " ").toUpperCase();
}

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

const pageSizes = [10, 25, 50, 100]

export { api, cn, formatLabel, Loading, pageSizes };

export const exportIspsExcel = (whiteListColumns, isps) => {
  const allHeaders = Object.keys(isps[0] || {})
  const headers = ["No.", ...allHeaders.filter(h => whiteListColumns.includes(h))] // ← filtered

  const rows = isps.map((obj, i) => [
    i + 1,                                      // ← row index
    ...headers.slice(1).map(h => obj[h] ?? "")  // ← rest of the data
  ])
  // ── Helpers ────────────────────────────────────────────────────────────────

  const encode = (str) => new TextEncoder().encode(str)
  const u16 = (n) => [n & 0xff, (n >> 8) & 0xff]
  const u32 = (n) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]
  const escXml = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")

  // CRC-32 (required by ZIP spec)
  const crcTable = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[i] = c
    }
    return t
  })()
  const crc32 = (buf) => {
    let c = 0xffffffff
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }

  // Column index → letter (0 → "A", 25 → "Z", 26 → "AA" …)
  const colLetter = (i) => {
    let s = ""; i++
    while (i > 0) { s = String.fromCharCode(65 + (i - 1) % 26) + s; i = Math.floor((i - 1) / 26) }
    return s
  }

  // ── Shared Strings (deduplicated string table) ─────────────────────────────

  const stringMap = new Map()
  const strings = []
  const addStr = (val) => {
    const key = String(val)
    if (!stringMap.has(key)) { stringMap.set(key, strings.length); strings.push(key) }
    return stringMap.get(key)
  }

  // ── Build cell data + populate shared strings ──────────────────────────────

  const headerRow = headers.map(h => ({ t: "s", v: addStr(h) }))
  const dataRows = rows.map(row => row.map(cell => {
    if (cell !== "" && cell !== null && cell !== undefined && !isNaN(Number(cell)))
      return { t: "n", v: Number(cell) }
    return { t: "s", v: addStr(cell) }
  }))
  const allRows = [headerRow, ...dataRows]

  // ── XML files ──────────────────────────────────────────────────────────────

  const lastCol = colLetter(headers.length - 1)
  const lastRow = allRows.length

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetData>
    ${allRows.map((row, ri) =>
    `<row r="${ri + 1}">` +
    row.map((cell, ci) => {
      const ref = `${colLetter(ci)}${ri + 1}`
      const style = ri === 0 ? ' s="1"' : ""          // s="1" → header style
      if (cell.t === "n") return `<c r="${ref}"${style}><v>${cell.v}</v></c>`
      return `<c r="${ref}" t="s"${style}><v>${cell.v}</v></c>`
    }).join("") +
    `</row>`
  ).join("\n    ")}
  </sheetData>
  <autoFilter ref="A1:${lastCol}${lastRow}"/>
</worksheet>`

  const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
     count="${strings.length}" uniqueCount="${strings.length}">
  ${strings.map(s => `<si><t xml:space="preserve">${escXml(s)}</t></si>`).join("\n  ")}
</sst>`

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts>
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills>
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2F75B6"/></patternFill></fill>
  </fills>
  <borders>
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD9D9D9"/></left>
      <right style="thin"><color rgb="FFD9D9D9"/></right>
      <top style="thin"><color rgb="FFD9D9D9"/></top>
      <bottom style="thin"><color rgb="FFD9D9D9"/></bottom>
    </border>
  </borders>
  <cellStyleXfs><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0"
        applyFont="1" applyFill="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
  </cellXfs>
</styleSheet>`

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="List ISP" sheetId="1" r:id="rId1"/></sheets>
</workbook>`

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  <Override PartName="/xl/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="xl/workbook.xml"/>
</Relationships>`

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
    Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings"
    Target="sharedStrings.xml"/>
  <Relationship Id="rId3"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
</Relationships>`

  // ── ZIP builder ────────────────────────────────────────────────────────────

  const zipFiles = []
  let zipOffset = 0

  const addZipFile = (name, content) => {
    const nameBytes = encode(name)
    const data = encode(content)
    const crc = crc32(data)

    const localHeader = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04,     // local file signature
      20, 0,                       // version needed
      0, 0,                        // general purpose flag
      0, 0,                        // compression (0 = store)
      0, 0, 0, 0,                  // mod time/date
      ...u32(crc),
      ...u32(data.length),         // compressed size
      ...u32(data.length),         // uncompressed size
      ...u16(nameBytes.length),
      0, 0,                        // extra field length
      ...nameBytes,
    ])

    zipFiles.push({ nameBytes, data, localHeader, crc, offset: zipOffset })
    zipOffset += localHeader.length + data.length
  }

  addZipFile("[Content_Types].xml", contentTypesXml)
  addZipFile("_rels/.rels", relsXml)
  addZipFile("xl/workbook.xml", workbookXml)
  addZipFile("xl/_rels/workbook.xml.rels", workbookRelsXml)
  addZipFile("xl/worksheets/sheet1.xml", sheetXml)
  addZipFile("xl/sharedStrings.xml", sharedStringsXml)
  addZipFile("xl/styles.xml", stylesXml)

  // Central directory
  const centralDirOffset = zipOffset
  const centralDirParts = zipFiles.map(f => new Uint8Array([
    0x50, 0x4b, 0x01, 0x02,     // central dir signature
    20, 0,                       // version made by
    20, 0,                       // version needed
    0, 0,                        // general purpose flag
    0, 0,                        // compression
    0, 0, 0, 0,                  // mod time/date
    ...u32(f.crc),
    ...u32(f.data.length),
    ...u32(f.data.length),
    ...u16(f.nameBytes.length),
    0, 0,                        // extra field length
    0, 0,                        // file comment length
    0, 0,                        // disk number start
    0, 0,                        // internal attributes
    0, 0, 0, 0,                  // external attributes
    ...u32(f.offset),
    ...f.nameBytes,
  ]))
  const centralDirSize = centralDirParts.reduce((a, p) => a + p.length, 0)

  const eocd = new Uint8Array([
    0x50, 0x4b, 0x05, 0x06,     // end of central dir signature
    0, 0, 0, 0,                  // disk numbers
    ...u16(zipFiles.length),
    ...u16(zipFiles.length),
    ...u32(centralDirSize),
    ...u32(centralDirOffset),
    0, 0,                        // comment length
  ])

  // Merge everything into one Uint8Array
  const allParts = [...zipFiles.flatMap(f => [f.localHeader, f.data]), ...centralDirParts, eocd]
  const totalBytes = allParts.reduce((a, p) => a + p.length, 0)
  const zip = new Uint8Array(totalBytes)
  let pos = 0
  allParts.forEach(p => { zip.set(p, pos); pos += p.length })

  // ── Download ───────────────────────────────────────────────────────────────

  const blob = new Blob(
    [zip],
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `INSIDER - List ISP - ${date}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportIspPdf(isp) {
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>INSIDER - ISP - ${isp.name}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .subtitle { color: #555; font-size: 12px; margin-bottom: 24px; }

        .section { margin-bottom: 20px; }
        .section-title {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          color: #888; border-bottom: 1px solid #ddd;
          padding-bottom: 4px; margin-bottom: 10px;
        }

        .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 24px; }
        .field label { font-size: 10px; color: #888; display: block; }
        .field p { font-weight: 500; }

        .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .badge {
          font-size: 10px; padding: 2px 8px; border-radius: 99px; border: 1px solid #ccc;
        }
        .badge.active { background: #111; color: #fff; border-color: #111; }
      </style>
    </head>
    <body>
      <h1>${isp.name}</h1>
      <p class="subtitle">${isp.legalName || ""}</p>

      <div class="badges">
        ${badge("Customer", isp.isCustomer)}
        ${badge("Kominfo", isp.isKominfo)}
        ${badge("ASN", isp.isAsn)}
        ${badge("Jartup", isp.isJartup)}
        ${badge("Jartaplok", isp.isJartaplok)}
      </div>

      <div class="section">
        <div class="section-title">Legalitas</div>
        <div class="grid">
          ${field("Legal Name", isp.legalName)}
          ${field("TIF BP Number", isp.tifBpNumber)}
          ${field("BP Number", isp.bpNumber)}
          ${field("ASN Number", isp.asnNumber)}
          ${field("CA Number", isp.caNumber)}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Profile</div>
        <div class="grid">
          ${field("Internal Risk", isp.internalRiskProfile)}
          ${field("Risk", isp.risk)}
          ${field("Size", isp.size)}
          ${field("Scale", isp.scale)}
          ${field("Quality", isp.quality)}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Contact</div>
        <div class="grid">
          ${field("Phone", isp.phone)}
          ${field("Headquarter", isp.headquarter)}
          ${field("Province", isp.province)}
          ${field("Address", isp.address)}
          ${field("Coverage", isp.coverageListProvince)}
        </div>
      </div>
    </body>
    </html>
  `

  // Buat iframe tersembunyi, isi HTML-nya, lalu print
  const iframe = document.createElement("iframe")
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0"
  document.body.appendChild(iframe)

  iframe.contentDocument.open()
  iframe.contentDocument.write(html)
  iframe.contentDocument.close()

  iframe.onload = () => {
    iframe.contentWindow.print()
    // Hapus iframe setelah dialog print ditutup
    iframe.contentWindow.onafterprint = () => iframe.remove()
  }
}

// ─── helpers kecil biar template di atas tetap bersih ───

function field(label, value) {
  return `
    <div class="field">
      <label>${label}</label>
      <p>${value || "-"}</p>
    </div>
  `
}

function badge(label, active) {
  return `<span class="badge ${active ? "active" : ""}">${label}</span>`
}

export const date = new Date().toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}).replace(/\//g, "-")