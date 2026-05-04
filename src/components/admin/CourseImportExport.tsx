"use client";

import { useRef, useState } from "react";
import { Download, Upload, Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImportResult = {
  created: number;
  updated: number;
  errors: string[];
  total: number;
};

export default function CourseImportExport() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);
    setImportError("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/courses/import", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setImportError(data.error || "Ошибка импорта");
      } else {
        setResult(data as ImportResult);
        if (data.created > 0 || data.updated > 0) {
          setTimeout(() => window.location.reload(), 1200);
        }
      }
    } catch {
      setImportError("Ошибка соединения");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Export */}
        <a href="/api/courses/export" download>
          <Button variant="outline" size="sm" className="gap-1.5 text-gray-600">
            <Download size={14} />
            Экспорт XML
          </Button>
        </a>

        {/* Import */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-gray-600"
          disabled={importing}
          onClick={() => fileRef.current?.click()}
        >
          {importing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {importing ? "Импорт..." : "Импорт XML"}
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept=".xml,application/xml,text/xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Result banner */}
      {importError && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle size={13} className="flex-shrink-0" />
          {importError}
        </div>
      )}

      {result && (
        <div className="flex flex-wrap gap-2 text-xs">
          {result.created > 0 && (
            <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-lg px-2.5 py-1">
              <CheckCircle2 size={12} />
              Создано: {result.created}
            </span>
          )}
          {result.updated > 0 && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1">
              <CheckCircle2 size={12} />
              Обновлено: {result.updated}
            </span>
          )}
          {result.errors.length > 0 && (
            <details className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2.5 py-1 cursor-pointer">
              <summary className="flex items-center gap-1 list-none">
                <AlertCircle size={12} />
                Ошибок: {result.errors.length}
              </summary>
              <ul className="mt-1 ml-4 list-disc space-y-0.5 text-amber-700">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </details>
          )}
          {result.total === 0 && result.errors.length === 0 && (
            <span className="text-gray-400">Нет изменений</span>
          )}
        </div>
      )}
    </div>
  );
}
