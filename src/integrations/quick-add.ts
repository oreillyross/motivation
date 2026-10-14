import { readFile, writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import { addQuote } from "../lib/add-quote";

const QUOTES_FILE = new URL("../data/quotes.txt", import.meta.url);

/**
 * Dev-only `POST /api/quotes` that appends a pasted quote to src/data/quotes.txt.
 * The site is static, so there is no write path in production; commit the file instead.
 */
export function quickAdd(): AstroIntegration {
  return {
    name: "quick-add-quote",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use("/api/quotes", async (req, res) => {
          const send = (status: number, body: unknown) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
          };
          if (req.method !== "POST") return send(405, { ok: false, error: "POST only." });

          try {
            let body = "";
            for await (const chunk of req) body += chunk;
            const input = JSON.parse(body || "{}");
            const result = addQuote(await readFile(QUOTES_FILE, "utf8"), {
              text: String(input.text ?? ""),
              author: String(input.author ?? ""),
            });
            if (!result.ok) return send(400, result);
            await writeFile(QUOTES_FILE, result.raw);
            send(201, { ok: true, quote: result.quote });
          } catch {
            send(500, { ok: false, error: "Couldn't save that one." });
          }
        });
      },
    },
  };
}
