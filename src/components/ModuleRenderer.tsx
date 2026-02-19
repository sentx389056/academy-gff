type Module = {
  id: string;
  type: string;
  content: Record<string, unknown>;
};

// Helper to safely get string value
function str(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

function bool(val: unknown): boolean {
  return val === true;
}

interface Props {
  modules: Module[];
}

export default function ModuleRenderer({ modules }: Props) {
  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <ModuleBlock key={module.id} module={module} />
      ))}
    </div>
  );
}

function ModuleBlock({ module }: { module: Module }) {
  const { type, content } = module;

  if (type === "heading") {
    const level = Number(content.level) || 2;
    const text = str(content.text);
    if (level === 1) return <h1 className="text-3xl font-bold text-[#1d1d1d]">{text}</h1>;
    if (level === 3) return <h3 className="text-xl font-semibold text-[#1d1d1d]">{text}</h3>;
    return <h2 className="text-2xl font-bold text-[#1d1d1d]">{text}</h2>;
  }

  if (type === "text") {
    const html = str(content.html) || str(content.text);
    return (
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (type === "paragraph") {
    return <p className="text-gray-700 leading-relaxed">{str(content.text)}</p>;
  }

  if (type === "image") {
    const url = str(content.url);
    const alt = str(content.alt);
    const caption = str(content.caption);
    return (
      <figure>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} className="w-full rounded-xl" />
        )}
        {caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "video") {
    const videoMode = str(content.videoMode) || "iframe";
    const iframeSrc = str(content.iframeSrc) || str(content.url); // fallback for old data
    const videoUrl = str(content.url);

    if (videoMode === "iframe") {
      if (!iframeSrc) return null;
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-black">
          <iframe src={iframeSrc} className="w-full h-full" allowFullScreen />
        </div>
      );
    }

    // upload or url — use <video> tag
    if (!videoUrl) return null;
    return (
      <video
        src={videoUrl}
        controls
        className="w-full rounded-xl"
        preload="metadata"
      />
    );
  }

  if (type === "quote") {
    const text = str(content.text);
    const author = str(content.author);
    return (
      <blockquote className="border-l-4 border-[#8f1a1c] pl-4 py-1 italic text-gray-600">
        <p>{text}</p>
        {author && (
          <cite className="text-sm text-gray-400 not-italic mt-1 block">
            — {author}
          </cite>
        )}
      </blockquote>
    );
  }

  if (type === "list") {
    const rawItems = content.items;
    const items: string[] = Array.isArray(rawItems) ? rawItems.map((i) => str(i)) : [];
    const ordered = bool(content.ordered);
    if (ordered) {
      return (
        <ol className="list-decimal pl-6 space-y-1 text-gray-700">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    }
    return (
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }

  if (type === "file") {
    const url = str(content.url, "#");
    const name = str(content.name, "Файл");
    const size = str(content.size);
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
      >
        <div className="w-10 h-10 bg-[#8f1a1c]/10 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-[#8f1a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-800 group-hover:text-[#8f1a1c]">{name}</div>
          {size && <div className="text-xs text-gray-400">{size}</div>}
        </div>
        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
    );
  }

  if (type === "divider") {
    return <hr className="border-gray-200 my-2" />;
  }

  return null;
}
