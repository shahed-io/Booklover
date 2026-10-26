// Shared image generation helper.
// Uses the Lovable AI Gateway image models (no third-party connector needed).
// Requires only LOVABLE_API_KEY.
// The exported API is kept stable (generateReplicateImage) so existing callers
// keep working.

const IMAGE_ENDPOINT = "https://ai.gateway.lovable.dev/v1/images/generations";

// Ordered fallback list of valid gateway image models.
const MODELS = [
  "google/gemini-3-pro-image",
  "google/gemini-3.1-flash-image",
  "google/gemini-2.5-flash-image",
];

export interface GenerateImageOptions {
  prompt: string;
  /** Optional reference image URL (or data URL) for image editing. */
  imageUrl?: string;
  /** Aspect ratio hint — passed to the model through the prompt. */
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  /** Override model id if needed. */
  model?: string;
  /** Unused, kept for backwards compatibility. */
  maxMinutes?: number;
}

export interface GenerateImageResult {
  /** Final image as raw base64 (no data: prefix). */
  base64: string;
  /** MIME type, typically image/png. */
  mimeType: string;
}

export async function generateReplicateImage(
  opts: GenerateImageOptions
): Promise<GenerateImageResult> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const aspect = opts.aspectRatio || "1:1";
  const promptText = `${opts.prompt}\n\nOutput aspect ratio: ${aspect}.`;

  const content: unknown = opts.imageUrl
    ? [
        { type: "text", text: promptText },
        { type: "image_url", image_url: { url: opts.imageUrl } },
      ]
    : promptText;

  const models = opts.model ? [opts.model, ...MODELS] : MODELS;
  let lastError = "unknown error";

  for (const model of models) {
    try {
      const resp = await fetch(IMAGE_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content }],
          modalities: ["image", "text"],
        }),
      });

      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        lastError = `${model} → ${resp.status}: ${t.slice(0, 200)}`;
        console.warn(`Image generation failed: ${lastError}`);
        // 402/403 are terminal — no point trying other models.
        if (resp.status === 402 || resp.status === 403) break;
        continue;
      }

      const data = await resp.json();
      const b64: string | undefined = data?.data?.[0]?.b64_json;
      if (!b64) {
        lastError = `${model} → response contained no image data`;
        console.warn(lastError);
        continue;
      }

      return { base64: b64, mimeType: "image/png" };
    } catch (e) {
      lastError = `${model} → ${e instanceof Error ? e.message : String(e)}`;
      console.warn(`Image generation exception: ${lastError}`);
    }
  }

  throw new Error(`Image generation failed: ${lastError}`);
}
