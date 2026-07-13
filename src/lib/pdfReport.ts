/**
 * Zero-dependency PDF report generator for the Full System Test.
 *
 * Builds a tiny (~5 KB) single-page A4 PDF using only the built-in Helvetica
 * fonts (no font embedding, no external library) so the download stays small.
 * The report includes device details, per-test results, a diagonal
 * "LaptopAnalyzer" watermark, and a clickable website link in the footer.
 *
 * All diagnostic results shown are the user's actual test outcomes; nothing
 * is faked or assumed.
 */

export interface DeviceInfo {
  deviceName: string;
  os: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  screenColorDepth: number;
  cpuCores: number;
  memory: string;
  battery: string;
  language: string;
  online: boolean;
}

export type ReportTestStatus = "passed" | "issue" | "skipped" | "pending";

export interface ReportTest {
  name: string;
  status: ReportTestStatus;
  detail: string;
}

export interface ReportData {
  score: number | null;
  scoreLabel: string;
  passedCount: number;
  issueCount: number;
  skippedCount: number;
  device: DeviceInfo;
  tests: ReportTest[];
  generatedAt: string;
}

// A4 page size in PostScript points
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 50;

// Colours as "r g b" strings (0..1)
const C_DARK = "0.11 0.12 0.15";
const C_MUTED = "0.42 0.45 0.5";
const C_PRIMARY = "0.05 0.55 0.78";
const C_SUCCESS = "0.13 0.6 0.32";
const C_WARNING = "0.85 0.55 0.1";
const C_LINE = "0.85 0.86 0.88";
const C_WATERMARK = "0.93 0.93 0.94";

/**
 * Collects a lightweight, ASCII-safe snapshot of the current device using only
 * native browser APIs. Runs entirely client-side; nothing is uploaded.
 */
export async function collectDeviceInfo(): Promise<DeviceInfo> {
  const ua = navigator.userAgent;

  let os = "Unknown";
  if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
  else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
  else if (ua.includes("Windows NT 6.2")) os = "Windows 8";
  else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) {
    const m = ua.match(/Mac OS X (\d+[._]\d+)/);
    os = m ? `macOS ${m[1].replace("_", ".")}` : "macOS";
  } else if (ua.includes("Android")) {
    const m = ua.match(/Android (\d+(\.\d+)?)/);
    os = m ? `Android ${m[1]}` : "Android";
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    const m = ua.match(/OS (\d+_\d+)/);
    os = m ? `iOS ${m[1].replace("_", ".")}` : "iOS";
  } else if (ua.includes("Linux")) os = "Linux";

  let browser = "Unknown";
  let browserVersion = "";
  if (ua.includes("Edg/")) {
    browser = "Microsoft Edge";
    browserVersion = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("Chrome/")) {
    browser = "Google Chrome";
    browserVersion = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("Firefox/")) {
    browser = "Mozilla Firefox";
    browserVersion = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    browser = "Apple Safari";
    browserVersion = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || "";
  }

  const platform = navigator.platform || "";
  let deviceName = "Unknown Device";
  if (platform.includes("Win")) deviceName = "Windows PC";
  else if (platform.includes("Mac")) deviceName = "Mac";
  else if (platform.includes("Linux")) deviceName = "Linux PC";
  else if (/Android/i.test(ua)) deviceName = "Android Device";
  else if (/iPhone|iPad|iPod/i.test(ua)) deviceName = "iOS Device";

  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const memory = deviceMemory ? `~${deviceMemory} GB` : "Not accessible";

  let battery = "Not accessible";
  try {
    const getBattery = (navigator as { getBattery?: () => Promise<{ level: number; charging: boolean }> }).getBattery;
    const b = await getBattery?.();
    if (b) {
      battery = `${Math.round(b.level * 100)}% (${b.charging ? "Charging" : "On battery"})`;
    }
  } catch {
    // Battery API unavailable; leave as "Not accessible"
  }

  return {
    deviceName,
    os,
    browser,
    browserVersion,
    screenResolution: `${window.screen.width} x ${window.screen.height}`,
    screenColorDepth: window.screen.colorDepth,
    cpuCores: navigator.hardwareConcurrency || 0,
    memory,
    battery,
    language: navigator.language || "Unknown",
    online: navigator.onLine,
  };
}

/**
 * Escapes a string so it is safe inside a PDF literal string and stays pure
 * ASCII. Keeping the byte length equal to the string length is what makes the
 * hand-computed xref byte offsets correct.
 */
function esc(input: string): string {
  let out = "";
  for (const ch of input || "") {
    const code = ch.codePointAt(0) || 0;
    if (code === 0x00d7) { out += "x"; continue; }                 // multiplication sign
    if (code === 0x2013 || code === 0x2014) { out += "-"; continue; } // en / em dash
    if (code < 0x20 || code > 0x7e) continue;                      // drop control / non-ASCII
    if (ch === "\\") { out += "\\\\"; continue; }
    if (ch === "(") { out += "\\("; continue; }
    if (ch === ")") { out += "\\)"; continue; }
    out += ch;
  }
  return out;
}

/** Approximate Helvetica text width in points (good enough for centering). */
function approxWidth(text: string, size: number): number {
  return text.length * size * 0.5;
}

function drawText(x: number, y: number, size: number, font: string, color: string, text: string): string {
  return `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${esc(text)}) Tj ET\n`;
}

function drawLine(x1: number, y: number, x2: number, color: string): string {
  return `${color} RG 0.6 w ${x1} ${y} m ${x2} ${y} l S\n`;
}

function statusText(status: ReportTestStatus): string {
  switch (status) {
    case "passed": return "PASSED";
    case "issue": return "ISSUE";
    case "skipped": return "SKIPPED";
    default: return "NOT TESTED";
  }
}

function statusColor(status: ReportTestStatus): string {
  switch (status) {
    case "passed": return C_SUCCESS;
    case "issue": return C_WARNING;
    default: return C_MUTED;
  }
}

/** Builds the page content stream. Returns the stream body and the footer link rect. */
function buildContent(data: ReportData): { stream: string; linkRect: [number, number, number, number] } {
  const d = data.device;
  let s = "";

  // Diagonal watermark (drawn first, behind the content)
  s += `q ${C_WATERMARK} rg BT /F2 58 Tf 0.7071 0.7071 -0.7071 0.7071 95 250 Tm (LaptopAnalyzer) Tj ET Q\n`;

  // Header
  s += drawText(MARGIN, 800, 21, "F2", C_PRIMARY, "LaptopAnalyzer");
  s += drawText(MARGIN, 779, 14, "F2", C_DARK, "Laptop Diagnostic Report");
  s += drawText(MARGIN, 763, 9.5, "F1", C_MUTED, `Generated: ${data.generatedAt}`);
  s += drawLine(MARGIN, 752, PAGE_W - MARGIN, C_LINE);

  // Health score
  s += drawText(MARGIN, 730, 12, "F2", C_DARK, "Overall Health Score:");
  const scoreStr = data.score !== null ? `${data.score} / 100  (${data.scoreLabel})` : "No score (all tests skipped)";
  const scoreColor = data.score === null ? C_MUTED : data.score >= 75 ? C_SUCCESS : C_WARNING;
  s += drawText(200, 729, 13, "F2", scoreColor, scoreStr);
  s += drawText(MARGIN, 712, 9.5, "F1", C_MUTED,
    `${data.passedCount} passed   -   ${data.issueCount} issues   -   ${data.skippedCount} skipped`);
  s += drawLine(MARGIN, 700, PAGE_W - MARGIN, C_LINE);

  // Device information
  s += drawText(MARGIN, 680, 13, "F2", C_DARK, "Device Information");
  const rows: [string, string][] = [
    ["Device", d.deviceName],
    ["Operating System", d.os],
    ["Browser", d.browserVersion ? `${d.browser} ${d.browserVersion}` : d.browser],
    ["Screen", `${d.screenResolution}  (${d.screenColorDepth}-bit)`],
    ["CPU Cores", d.cpuCores > 0 ? String(d.cpuCores) : "Not accessible"],
    ["Memory", d.memory],
    ["Battery", d.battery],
    ["Language", d.language],
    ["Network", d.online ? "Online" : "Offline"],
  ];
  let y = 660;
  for (const [label, value] of rows) {
    s += drawText(60, y, 10, "F1", C_MUTED, label);
    s += drawText(200, y, 10, "F1", C_DARK, value);
    y -= 16;
  }

  // Test results
  y -= 6;
  s += drawLine(MARGIN, y, PAGE_W - MARGIN, C_LINE);
  y -= 20;
  s += drawText(MARGIN, y, 13, "F2", C_DARK, "Test Results");
  y -= 22;
  for (const t of data.tests) {
    s += drawText(60, y, 10.5, "F2", C_DARK, t.name);
    s += drawText(430, y, 10, "F2", statusColor(t.status), statusText(t.status));
    if (t.detail) {
      s += drawText(60, y - 12, 8.5, "F1", C_MUTED, t.detail);
    }
    y -= 26;
  }

  // Footer
  s += drawLine(MARGIN, 74, PAGE_W - MARGIN, C_LINE);
  const foot = "This report was generated locally in your browser. No data was uploaded.";
  s += drawText((PAGE_W - approxWidth(foot, 8)) / 2, 58, 8, "F1", C_MUTED, foot);

  const url = "https://laptopanalyzer.com";
  const urlW = approxWidth(url, 10.5);
  const urlX = (PAGE_W - urlW) / 2;
  s += drawText(urlX, 42, 10.5, "F2", C_PRIMARY, url);

  const linkRect: [number, number, number, number] = [urlX - 2, 38, urlX + urlW + 2, 55];
  return { stream: s, linkRect };
}

/** Generates the full report as a PDF Blob. */
export function generateReportPdf(data: ReportData): Blob {
  const { stream, linkRect } = buildContent(data);

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
  objects[3] =
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
    `/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R /Annots [7 0 R] >>`;
  objects[4] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objects[7] =
    `<< /Type /Annot /Subtype /Link /Rect [${linkRect.join(" ")}] /Border [0 0 0] ` +
    `/A << /S /URI /URI (https://laptopanalyzer.com) >> >>`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 1; i <= 7; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += "xref\n0 8\n0000000000 65535 f \n";
  for (let i = 1; i <= 7; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

/** Triggers a browser download of the given report. */
export function downloadReportPdf(data: ReportData): void {
  const blob = generateReportPdf(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LaptopAnalyzer-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
