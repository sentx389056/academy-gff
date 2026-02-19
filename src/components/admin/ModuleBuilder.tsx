"use client";

import { useState } from "react";
import FileUploader from "./FileUploader";

export type ModuleType =
  | "heading"
  | "paragraph"
  | "text"
  | "image"
  | "video"
  | "quote"
  | "list"
  | "file"
  | "divider";

export interface Module {
  id: string;
  type: ModuleType;
  content: Record<string, unknown>;
}

interface ModuleDefinition {
  type: ModuleType;
  label: string;
  icon: string;
  description: string;
  defaultContent: Record<string, unknown>;
}

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    type: "heading",
    label: "Заголовок",
    icon: "H",
    description: "Заголовок раздела",
    defaultContent: { text: "", level: 2 },
  },
  {
    type: "paragraph",
    label: "Текст",
    icon: "¶",
    description: "Абзац с текстом",
    defaultContent: { text: "" },
  },
  {
    type: "image",
    label: "Изображение",
    icon: "🖼",
    description: "Изображение с подписью",
    defaultContent: { url: "", alt: "", caption: "" },
  },
  {
    type: "video",
    label: "Видео",
    icon: "▶",
    description: "Встроенное видео",
    defaultContent: { url: "" },
  },
  {
    type: "quote",
    label: "Цитата",
    icon: "❝",
    description: "Выделенная цитата",
    defaultContent: { text: "", author: "" },
  },
  {
    type: "list",
    label: "Список",
    icon: "≡",
    description: "Маркированный или нумерованный список",
    defaultContent: { items: [""], ordered: false },
  },
  {
    type: "file",
    label: "Файл",
    icon: "📎",
    description: "Ссылка на файл для скачивания",
    defaultContent: { url: "", name: "", size: "" },
  },
  {
    type: "divider",
    label: "Разделитель",
    icon: "—",
    description: "Горизонтальная линия",
    defaultContent: {},
  },
];

interface Props {
  value: Module[];
  onChange: (modules: Module[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ModuleBuilder({ value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addModule = (def: ModuleDefinition) => {
    const newModule: Module = {
      id: generateId(),
      type: def.type,
      content: { ...def.defaultContent },
    };
    onChange([...value, newModule]);
    setShowPicker(false);
    setEditingId(newModule.id);
  };

  const removeModule = (id: string) => {
    onChange(value.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateModule = (id: string, content: Record<string, unknown>) => {
    onChange(value.map((m) => (m.id === id ? { ...m, content } : m)));
  };

  const moveModule = (index: number, direction: -1 | 1) => {
    const newModules = [...value];
    const target = index + direction;
    if (target < 0 || target >= newModules.length) return;
    [newModules[index], newModules[target]] = [newModules[target], newModules[index]];
    onChange(newModules);
  };

  return (
    <div className="space-y-3">
      {/* Module List */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((module, index) => {
            const def = MODULE_DEFINITIONS.find((d) => d.type === module.type);
            const isEditing = editingId === module.id;

            return (
              <div
                key={module.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isEditing
                    ? "border-[#8f1a1c] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Module Header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
                  onClick={() => setEditingId(isEditing ? null : module.id)}
                >
                  <span className="text-sm font-mono w-6 text-center text-gray-400">
                    {def?.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700 flex-1">
                    {def?.label}
                    {typeof module.content.text === "string" && module.content.text && (
                      <span className="ml-2 text-gray-400 font-normal truncate max-w-[200px] inline-block align-bottom">
                        — {module.content.text.slice(0, 40)}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveModule(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Вверх"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveModule(index, 1)}
                      disabled={index === value.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Вниз"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeModule(module.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Удалить"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Module Editor */}
                {isEditing && (
                  <div className="px-4 py-4 bg-white">
                    <ModuleEditor
                      module={module}
                      onChange={(content) => updateModule(module.id, content)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Module Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#8f1a1c] rounded-xl py-4 text-sm text-gray-500 hover:text-[#8f1a1c] transition-colors"
      >
        <span className="text-lg">+</span>
        Добавить модуль
      </button>

      {/* Module Picker (like Карта Победы) */}
      {showPicker && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Выберите тип модуля
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MODULE_DEFINITIONS.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => addModule(def)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-[#8f1a1c] hover:bg-[#8f1a1c]/5 transition-all group text-center"
              >
                <span className="text-2xl">{def.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-gray-700 group-hover:text-[#8f1a1c]">
                    {def.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{def.description}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}

function ModuleEditor({
  module,
  onChange,
}: {
  module: Module;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const { type, content } = module;

  const set = (key: string, value: unknown) =>
    onChange({ ...content, [key]: value });

  switch (type) {
    case "heading":
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Уровень заголовка
            </label>
            <select
              value={String(content.level || 2)}
              onChange={(e) => set("level", parseInt(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c] w-32"
            >
              <option value="1">H1 — Главный</option>
              <option value="2">H2 — Раздел</option>
              <option value="3">H3 — Подраздел</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Текст</label>
            <input
              type="text"
              value={String(content.text || "")}
              onChange={(e) => set("text", e.target.value)}
              placeholder="Введите заголовок..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
        </div>
      );

    case "paragraph":
      return (
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Текст</label>
          <textarea
            value={String(content.text || "")}
            onChange={(e) => set("text", e.target.value)}
            rows={4}
            placeholder="Введите текст абзаца..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c] resize-y"
          />
        </div>
      );

    case "image": {
      const imgMode = (content.imgMode as string) || "upload";
      return (
        <div className="space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {[
              { key: "upload", label: "📁 Загрузить" },
              { key: "url", label: "🔗 По ссылке" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange({ ...content, imgMode: opt.key, url: "" })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  imgMode === opt.key
                    ? "bg-white text-[#8f1a1c] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {imgMode === "upload" ? (
            <FileUploader
              accept="image"
              currentUrl={typeof content.url === "string" ? content.url : undefined}
              onUploaded={(r) => onChange({ ...content, url: r.url, alt: content.alt || r.name })}
            />
          ) : (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">URL изображения</label>
              <input
                type="url"
                value={String(content.url || "")}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
              />
              {typeof content.url === "string" && content.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.url} alt="preview" className="max-h-40 rounded-lg border mt-2" />
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Alt текст</label>
            <input
              type="text"
              value={String(content.alt || "")}
              onChange={(e) => set("alt", e.target.value)}
              placeholder="Описание изображения"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Подпись</label>
            <input
              type="text"
              value={String(content.caption || "")}
              onChange={(e) => set("caption", e.target.value)}
              placeholder="Подпись под изображением"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
        </div>
      );
    }

    case "video": {
      const videoMode = (content.videoMode as string) || "iframe";
      return (
        <div className="space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {[
              { key: "iframe", label: "▶ Embed (YouTube и др.)" },
              { key: "upload", label: "📁 Загрузить видео" },
              { key: "url",    label: "🔗 По ссылке" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange({ ...content, videoMode: opt.key, url: "", iframeSrc: "" })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  videoMode === opt.key
                    ? "bg-white text-[#8f1a1c] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {videoMode === "iframe" && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Embed-ссылка</label>
              <input
                type="url"
                value={String(content.iframeSrc || "")}
                onChange={(e) => set("iframeSrc", e.target.value)}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
              />
              <p className="text-xs text-gray-400 mt-1">
                YouTube: откройте видео → Поделиться → Встроить → скопируйте src из iframe
              </p>
              {typeof content.iframeSrc === "string" && content.iframeSrc && (
                <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe src={content.iframeSrc} className="w-full h-full" allowFullScreen />
                </div>
              )}
            </div>
          )}

          {videoMode === "upload" && (
            <FileUploader
              accept="video"
              currentUrl={typeof content.url === "string" ? content.url : undefined}
              onUploaded={(r) => onChange({ ...content, url: r.url })}
            />
          )}

          {videoMode === "url" && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Прямая ссылка на видео-файл</label>
              <input
                type="url"
                value={String(content.url || "")}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
              />
              {typeof content.url === "string" && content.url && (
                <video src={content.url} controls className="mt-2 w-full rounded-lg max-h-48" />
              )}
            </div>
          )}
        </div>
      );
    }

    case "quote":
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Текст цитаты</label>
            <textarea
              value={String(content.text || "")}
              onChange={(e) => set("text", e.target.value)}
              rows={3}
              placeholder="Введите цитату..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Автор</label>
            <input
              type="text"
              value={String(content.author || "")}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Имя автора (необязательно)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
        </div>
      );

    case "list": {
      const items = (content.items as string[]) || [""];
      const ordered = Boolean(content.ordered);
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-xs font-medium text-gray-600">Тип списка:</label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                checked={!ordered}
                onChange={() => set("ordered", false)}
                className="accent-[#8f1a1c]"
              />
              Маркированный
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                checked={ordered}
                onChange={() => set("ordered", true)}
                className="accent-[#8f1a1c]"
              />
              Нумерованный
            </label>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-sm text-gray-400 w-5 text-right flex-shrink-0">
                  {ordered ? `${i + 1}.` : "•"}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = e.target.value;
                    set("items", newItems);
                  }}
                  placeholder={`Пункт ${i + 1}`}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
                />
                <button
                  type="button"
                  onClick={() => set("items", items.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 text-sm"
                  disabled={items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set("items", [...items, ""])}
            className="text-xs text-[#8f1a1c] hover:underline"
          >
            + Добавить пункт
          </button>
        </div>
      );
    }

    case "file": {
      const fileMode = (content.fileMode as string) || "upload";
      function formatBytes(b: number) {
        if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} КБ`;
        return `${(b / 1024 / 1024).toFixed(1)} МБ`;
      }
      return (
        <div className="space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {[
              { key: "upload", label: "📁 Загрузить" },
              { key: "url",    label: "🔗 По ссылке" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange({ ...content, fileMode: opt.key, url: "", name: "", size: "" })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  fileMode === opt.key
                    ? "bg-white text-[#8f1a1c] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {fileMode === "upload" ? (
            <FileUploader
              accept="both"
              compact
              currentUrl={typeof content.url === "string" ? content.url : undefined}
              onUploaded={(r) => onChange({
                ...content,
                url: r.url,
                name: content.name || r.name,
                size: formatBytes(r.size),
              })}
            />
          ) : (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">URL файла</label>
              <input
                type="url"
                value={String(content.url || "")}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Название файла</label>
            <input
              type="text"
              value={String(content.name || "")}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Например: Программа курса.pdf"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Размер (необязательно)</label>
            <input
              type="text"
              value={String(content.size || "")}
              onChange={(e) => set("size", e.target.value)}
              placeholder="Например: 2.4 МБ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8f1a1c]"
            />
          </div>
        </div>
      );
    }

    case "divider":
      return (
        <div className="text-center py-2">
          <hr className="border-gray-300" />
          <span className="text-xs text-gray-400 mt-1 block">Горизонтальная линия</span>
        </div>
      );

    default:
      return null;
  }
}
