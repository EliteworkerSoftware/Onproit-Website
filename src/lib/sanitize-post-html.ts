import "server-only";
import sanitizeHtml from "sanitize-html";

// Blog post bodies are rendered with dangerouslySetInnerHTML (on the public
// post page and the admin draft preview), and drafts can be written by the
// content automation — so anything stored is cut down to plain article
// markup first. No scripts, styles, iframes, event handlers, or
// javascript: links can survive, whoever wrote the HTML.
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "b", "i",
      "a", "blockquote", "br", "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
  });
}
