type MetaInput = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;    // absolute URL for social
  siteName?: string;
};

export function setMeta({ title, description, url, image, siteName }: MetaInput) {
  if (title) document.title = title;

  setTag('meta[name="description"]', { name: "description", content: description || "" });

  // Open Graph
  setTag('meta[property="og:title"]', { property: "og:title", content: title || "" });
  setTag('meta[property="og:description"]', { property: "og:description", content: description || "" });
  if (url)   setTag('meta[property="og:url"]', { property: "og:url", content: url });
  if (image) setTag('meta[property="og:image"]', { property: "og:image", content: image });
  setTag('meta[property="og:type"]', { property: "og:type", content: "website" });
  setTag('meta[property="og:site_name"]', { property: "og:site_name", content: siteName || "Inventory Blog" });

  // Twitter
  setTag('meta[name="twitter:card"]', { name: "twitter:card", content: image ? "summary_large_image" : "summary" });
  if (title) setTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  if (description) setTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  if (image) setTag('meta[name="twitter:image"]', { name: "twitter:image", content: image });
}

function setTag(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
  for (const [k,v] of Object.entries(attrs)) { if (v !== undefined) el.setAttribute(k, v); }
}
