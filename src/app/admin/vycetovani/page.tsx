"use client";

import { useRef, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function VycetovaniPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [filename, setFilename] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(file: File | null) {
    if (!file) return;
    setSelectedFile(file);
    setStatus("idle");
    setDownloadUrl("");
    setGeneratedFiles([]);
  }

  async function handleGenerate() {
    if (!selectedFile) return;

    setStatus("loading");
    setErrorMsg("");
    setDownloadUrl("");
    setGeneratedFiles([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/vycetovani", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Neznámá chyba");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const contentDisposition = res.headers.get("Content-Disposition") ?? "";
      const zipName =
        contentDisposition.match(/filename="(.+?)"/)?.[1] ?? "vycetovani.zip";
      const filesHeader = res.headers.get("X-Generated-Files") ?? "";

      setDownloadUrl(url);
      setFilename(zipName);
      setGeneratedFiles(filesHeader ? decodeURIComponent(filesHeader).split(",") : []);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Neznámá chyba");
      setStatus("error");
    }
  }

  function triggerDownload() {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    a.click();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Generátor vyúčtování</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Nahraj Report XLS z Jira → stáhni xlsx soubory pro každého řemeslníka.
        <br />
        Doprava, materiál a parkovné doplň ručně po stažení.
      </p>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[#0077B6] bg-blue-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-[#0077B6] hover:bg-gray-50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileChange(e.dataTransfer.files[0] ?? null);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        {selectedFile ? (
          <div>
            <p className="text-green-700 font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(selectedFile.size / 1024).toFixed(0)} KB · klikni pro změnu
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 font-medium">
              Přetáhni sem Report XLS nebo klikni pro výběr
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Soubor ze záložky Jira · Report_YYYY-MM-DD_YYYY-MM-DD.xls
            </p>
          </div>
        )}
      </div>

      {/* Tlačítko Generovat */}
      <button
        onClick={handleGenerate}
        disabled={!selectedFile || status === "loading"}
        className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: selectedFile && status !== "loading" ? "#0077B6" : undefined, background: !selectedFile || status === "loading" ? "#9ca3af" : "#0077B6" }}
      >
        {status === "loading" ? "Generuji…" : "Generovat vyúčtování"}
      </button>

      {/* Chyba */}
      {status === "error" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Výsledek */}
      {status === "done" && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
          <p className="font-semibold text-green-800 mb-3">
            ✅ Vygenerováno {generatedFiles.length} souborů
          </p>

          {generatedFiles.length > 0 && (
            <ul className="text-sm text-gray-700 mb-4 space-y-1">
              {generatedFiles.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={triggerDownload}
            className="w-full py-2.5 px-5 rounded-lg font-semibold text-white"
            style={{ backgroundColor: "#023047" }}
          >
            ⬇ Stáhnout ZIP ({filename})
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Po stažení doplň doprava / materiál / parkovné ručně v Excelu.
          </p>
        </div>
      )}
    </div>
  );
}
