import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import JSZip from "jszip";

// ─── Konfigurace sazeb ────────────────────────────────────────────────────────
const SAZBY: Record<string, [number, number]> = {
  "Mihal Krajníkovec":    [300, 350],
  "Nieklesa Yurii":       [300, 350],
  "Viktor Pomeščikov":    [300, 350],
  "František Máša":       [350, 350],
  "Sergei Makhota":       [350, 350],
  "Gyorgy Sip":           [350, 350],
  "Jan Fišer":            [350, 350],
  "Jan Rudolf":           [400, 350],
  "Vojtěch Budera":       [400, 350],
  "Stanislav Hušner":     [400, 350],
  "Robert Kodejška/LIB/": [400, 350],
  "Patrik Kubeška":       [400, 400],
  "Jan Juhász":           [350, 350],
  "Otto Zwesper":         [350, 350],
};

const ZAHRNUTÉ_STATUSY = new Set(["INVOICE", "WORK DONE"]);
const HEADER_COLOR = "FF8BC34A";

interface WorkRow {
  id: string;
  souhrn: string;
  datum: Date;
  hodiny: number;
}

function parseSouhrn(souhrn: string): string {
  const idx = souhrn.indexOf(" - ");
  if (idx > -1) return souhrn.slice(0, idx) + "\n" + souhrn.slice(idx + 3);
  return souhrn;
}

function getMonthBounds(dates: Date[]): [string, string] {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const lastDay = new Date(last.getFullYear(), last.getMonth() + 1, 0).getDate();
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  return [fmt(first), fmt(new Date(last.getFullYear(), last.getMonth(), lastDay))];
}

function monthPrefix(dates: Date[]): string {
  const d = [...dates].sort((a, b) => a.getTime() - b.getTime())[0];
  return `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function safeFilename(jmeno: string): string {
  return jmeno.replace(/\s+/g, "_").replace(/[/\\]/g, "");
}

async function generateWorkbook(
  rows: WorkRow[],
  jmeno: string,
  sazba: number,
  doprava: number,
  obdobiOd: string,
  obdobiDo: string
): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Vyúčtování");

  const bold16: Partial<ExcelJS.Font> = { bold: true, size: 16, name: "Calibri" };
  const bold11: Partial<ExcelJS.Font> = { bold: true, size: 11, name: "Calibri" };
  const norm11: Partial<ExcelJS.Font> = { size: 11, name: "Calibri" };
  const wrapTop: Partial<ExcelJS.Alignment> = { wrapText: true, vertical: "top", horizontal: "left" };

  // ── Řádek 1 ────────────────────────────────────────────────────────────────
  ws.getCell("A1").value = `Vyúčtování – ${jmeno}`;
  ws.getCell("A1").font = bold16;

  // ── Řádek 2 ────────────────────────────────────────────────────────────────
  ws.getCell("A2").value = `Období: ${obdobiOd} až ${obdobiDo}`;
  ws.getCell("A2").font = bold11;

  // ── Řádek 3 ────────────────────────────────────────────────────────────────
  ws.getCell("A3").value = "Sazba práce:";
  ws.getCell("A3").font = bold11;
  ws.getCell("B3").value = sazba;
  ws.getCell("B3").font = norm11;
  ws.getCell("D3").value = "Kč/hod";
  ws.getCell("D3").font = norm11;

  // ── Řádek 4 ────────────────────────────────────────────────────────────────
  ws.getCell("A4").value = "Doprava:";
  ws.getCell("A4").font = bold11;
  ws.getCell("B4").value = doprava;
  ws.getCell("B4").font = norm11;
  ws.getCell("D4").value = "Kč/zakázku";
  ws.getCell("D4").font = norm11;

  // ── Řádek 6: záhlaví sloupců ───────────────────────────────────────────────
  const headers = [
    "ID", "Zakázka", "Datum", "Odpracované hodiny",
    "Práce celkem (Kč)", "Doprava (Kč)", "Materiál (Kč)",
    "Parkovné (Kč)", "Zakázka celkem (Kč)",
  ];
  const headerRow = ws.getRow(6);
  headerRow.height = 30;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = bold11;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_COLOR } };
    cell.alignment = wrapTop;
  });

  // ── Data ────────────────────────────────────────────────────────────────────
  const dataStart = 7;
  rows.forEach((row, i) => {
    const r = dataStart + i;
    const zakázka = parseSouhrn(row.souhrn);

    ws.getCell(r, 1).value = row.id;
    ws.getCell(r, 2).value = zakázka;
    ws.getCell(r, 3).value = row.datum;
    ws.getCell(r, 3).numFmt = "DD.MM.YYYY";
    ws.getCell(r, 4).value = row.hodiny;

    // Práce celkem = zaokrouhlení na půlhodiny × sazba
    ws.getCell(r, 5).value = {
      formula: `IF(OR(A${r}="",D${r}="",$B$3=""),"",(ROUND(D${r}*2,0)/2)*$B$3*1)`,
    };

    // Doprava, Materiál, Parkovné – prázdné pro ruční doplnění
    // (sloupce 6, 7, 8 zůstanou prázdné)

    // Zakázka celkem
    ws.getCell(r, 9).value = {
      formula: `IF(A${r}<>"",SUM(E${r}:H${r}),"")`,
    };

    for (let c = 1; c <= 9; c++) {
      ws.getCell(r, c).font = norm11;
      ws.getCell(r, c).alignment = wrapTop;
    }
  });

  // ── CELKEM ─────────────────────────────────────────────────────────────────
  const lastDataRow = dataStart + rows.length - 1;
  const celkemRow = lastDataRow + 6;
  ws.getCell(celkemRow, 8).value = "CELKEM";
  ws.getCell(celkemRow, 8).font = bold11;
  ws.getCell(celkemRow, 9).value = { formula: `SUM(I${dataStart}:I${lastDataRow})` };
  ws.getCell(celkemRow, 9).font = bold11;

  // ── Šířky sloupců ──────────────────────────────────────────────────────────
  ws.getColumn(1).width = 18;
  ws.getColumn(2).width = 52;
  ws.getColumn(3).width = 14;
  ws.getColumn(4).width = 18;
  ws.getColumn(5).width = 18;
  ws.getColumn(6).width = 14;
  ws.getColumn(7).width = 14;
  ws.getColumn(8).width = 14;
  ws.getColumn(9).width = 20;

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return new Uint8Array(arrayBuffer as ArrayBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Chybí soubor" }, { status: 400 });
    }

    // Přečti XLS
    const buffer = await file.arrayBuffer();
    const xlsWb = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheet = xlsWb.Sheets["Zápisy práce"];

    if (!sheet) {
      return NextResponse.json(
        { error: 'Soubor neobsahuje záložku "Zápisy práce"' },
        { status: 400 }
      );
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });

    // Filtruj a seskup
    const filtered = rawRows.filter((r) =>
      ZAHRNUTÉ_STATUSY.has(String(r["Stav úlohy"]))
    );

    const groups = new Map<string, WorkRow[]>();
    for (const r of filtered) {
      const jmeno = String(r["Celé jméno"]);
      if (!SAZBY[jmeno]) continue;

      let datum: Date;
      const rawDatum = r["Datum práce"];
      if (rawDatum instanceof Date) {
        datum = rawDatum;
      } else {
        datum = new Date(String(rawDatum));
      }

      const row: WorkRow = {
        id: String(r["Klíč úlohy"]),
        souhrn: String(r["Souhrn úlohy"]),
        datum,
        hodiny: Number(r["Hodiny"]),
      };

      if (!groups.has(jmeno)) groups.set(jmeno, []);
      groups.get(jmeno)!.push(row);
    }

    if (groups.size === 0) {
      return NextResponse.json(
        { error: "Žádné zakázky nebyly nalezeny (zkontroluj sazby v konfiguraci)" },
        { status: 400 }
      );
    }

    // Vygeneruj xlsx soubory do ZIPu
    const zip = new JSZip();
    const generated: string[] = [];

    for (const [jmeno, rows] of groups) {
      const [sazba, doprava] = SAZBY[jmeno];
      const dates = rows.map((r) => r.datum);
      const [od, do_] = getMonthBounds(dates);
      const prefix = monthPrefix(dates);

      rows.sort((a, b) => a.datum.getTime() - b.datum.getTime());

      const xlsxBuffer = await generateWorkbook(rows, jmeno, sazba, doprava, od, do_);
      const filename = `${prefix}_${safeFilename(jmeno)}.xlsx`;
      zip.file(filename, xlsxBuffer);
      generated.push(filename);
    }

    const zipUint8 = await zip.generateAsync({ type: "uint8array" });
    const month = generated[0]?.slice(0, 7) ?? "vycetovani";

    return new NextResponse(zipUint8.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${month}_vycetovani.zip"`,
        "X-Generated-Files": encodeURIComponent(generated.join(",")),
        "X-Generated-Count": String(generated.length),
      },
    });
  } catch (err) {
    console.error("Chyba při generování vyúčtování:", err);
    return NextResponse.json({ error: "Interní chyba serveru" }, { status: 500 });
  }
}
