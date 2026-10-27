import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeBrandNameDeep, normalizeBrandNameText } from "../_shared/brand-name.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ─── Admin Auth Check ─────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: adminRole } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!adminRole) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  // ─────────────────────────────────────────────────────────────────────────

  try {
    const { productName, category, brand, productType, price, duration, durationPlans, accountType, subtitle, type, demoDescription, count } = await req.json();

    if (!productName) {
      return new Response(JSON.stringify({ error: "productName is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";
    let maxTokens = 900;

    const specHint = [
      brand && `Brand: ${brand}`,
      category && `Category: ${category}`,
      price && `Price: BDT ${price}`,
      subtitle && `Tagline: ${subtitle}`,
    ].filter(Boolean).join(" | ");

    const bdCities = "ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল, ময়মনসিংহ, কুমিল্লা";

    const houseStyle = `BUSINESS: Booklover — online bookshop in Bangladesh.
Use only supplied product data. Never invent prices, reviews, contacts, warranty, delivery times or policies. Omit unknown facts. Use the requested language and spell the brand Booklover.`;
    const descSkeleton = `## [Book title]
### Description
### Author and publisher
### Book details
Include only known information from the supplied catalog.`;

    if (type === "short_description") {
      const numOptions = count && count > 1 ? count : 1;
      maxTokens = 900;
      systemPrompt = `তুমি Booklover-এর প্রোডাক্ট কপিরাইটার।
${houseStyle}

TASK: short description লিখবে ঠিক এই ফরম্যাটে (markdown):

### প্যাকেজে যা যা পাবেন

(প্যাকেজের প্রতিটি আইটেম আলাদা লাইনে, ব্র্যাকেটে তার কাজ — যেমন: বইয়ের নাম।)

শেষে ১–২ লাইনে বইয়ের বিষয়বস্তু ও পাঠক।

শুধু টেক্সট রিটার্ন করবে, কোনো JSON বা অতিরিক্ত কথা নয়।${numOptions > 1 ? ` ঠিক ${numOptions}টি ভিন্ন অপশন দাও, প্রতিটি "---" দিয়ে আলাদা করে।` : ""}`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}`;

    } else if (type === "description" || type === "demo_style") {
      maxTokens = 2600;
      systemPrompt = `তুমি Booklover-এর সিনিয়র eCommerce কনটেন্ট রাইটার।
${houseStyle}

নিচের স্কেলিটন হুবহু অনুসরণ করে সম্পূর্ণ প্রোডাক্ট ডেসক্রিপশন লিখবে (markdown, ### হেডিং, বুলেট পয়েন্ট):

${descSkeleton}

RULES:
- মাপ/সাইজ অনুমান করা লাগলে ওই ধরনের বিন ব্যাগের বাস্তবসম্মত মাপ দাও।
- কোনো ইমোজি হেডিং নয়, কোনো "Important Notes" ফুটার নয়, কোনো দাম-প্ল্যান টেবিল নয়।
- ৩৫০–৬০০ শব্দ। শুধু markdown রিটার্ন করবে।${demoDescription ? `\n- নিচের রেফারেন্স ডেসক্রিপশনের টোন ও স্ট্রাকচার মেনে চলবে।` : ""}`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}${demoDescription ? `\n\n=== REFERENCE STYLE ===\n${String(demoDescription).slice(0, 6000)}` : ""}`;

    } else if (type === "seo") {
      maxTokens = 500;
      systemPrompt = `তুমি Bangladesh-focused SEO expert (হোম ফার্নিচার ও বিন ব্যাগ)।
${houseStyle}

Return ONLY valid JSON:
{ "seo_title": "max 60 chars", "seo_description": "max 160 chars" }

seo_title: প্রোডাক্টের নাম + "Price in BD" বা "দাম বাংলাদেশ"।
seo_description: ৳ দাম, "ফ্রি হোম ডেলিভারি", "ক্যাশ অন ডেলিভারি" বা "১৮ মাসের ওয়ারেন্টি" — যেকোনো ট্রাস্ট সিগন্যাল সহ।`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}`;

    } else if (type === "all") {
      maxTokens = 3000;
      systemPrompt = `তুমি Booklover-এর প্রোডাক্ট কপিরাইটার ও Bangladesh SEO expert।
${houseStyle}

Return ONLY valid JSON in this exact shape (newline গুলো \\n হিসেবে escape করবে):
{
  "short_description": "markdown — '### প্যাকেজে যা যা পাবেন' হেডিং, প্যাকেজের আইটেম আলাদা লাইনে, শেষে জায়গা ও উপযুক্ততা",
  "description": "সম্পূর্ণ markdown ডেসক্রিপশন, নিচের স্কেলিটন হুবহু অনুসরণ করে",
  "seo_title": "max 60 chars — প্রোডাক্ট নাম + Price in BD",
  "seo_description": "max 160 chars — ৳ দাম + ফ্রি হোম ডেলিভারি / ক্যাশ অন ডেলিভারি"
}

description-এর স্কেলিটন:

${descSkeleton}

কোনো ইমোজি হেডিং নয়, কোনো Important Notes ফুটার নয়, কোনো ডিজিটাল/লাইসেন্স কথা নয়।`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}`;

    } else if (type === "rich_content") {
      maxTokens = 4000;
      systemPrompt = `তুমি Booklover-এর সিনিয়র eCommerce SEO কনটেন্ট স্ট্র্যাটেজিস্ট।
${houseStyle}

Return ONLY valid JSON:
{ "description": "৬০০–১০০০ শব্দের সম্পূর্ণ markdown বডি", "faq": [ { "q": "...", "a": "..." }, ... ৬–৮টি ] }

description স্কেলিটন (এই ক্রমে, প্রয়োজনে অতিরিক্ত ### সেকশন যোগ করা যাবে যেমন "কোথায় ব্যবহার করবেন", "কাদের জন্য উপযুক্ত"):

${descSkeleton}

FAQ: বাংলাদেশি ক্রেতার বাস্তব প্রশ্ন — ডেলিভারি সময়, ক্যাশ অন ডেলিভারি, ওয়ারেন্টি, ফিলার রিফিল, কাপড় পরিষ্কার, ওজন ধারণক্ষমতা, রিটার্ন/এক্সচেঞ্জ। উত্তর ২–৪ বাক্য।
কোনো সফটওয়্যার/লাইসেন্স/ডিজিটাল ডেলিভারি প্রসঙ্গ থাকবে না।`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}${demoDescription ? `\n\n=== বর্তমান ডেসক্রিপশন (তথ্যের ভিত্তি) ===\n${String(demoDescription).slice(0, 6000)}` : ""}`;

    } else if (type === "faq") {
      maxTokens = 2000;
      systemPrompt = `তুমি Booklover-এর কাস্টমার এক্সপেরিয়েন্স রাইটার।
${houseStyle}

Return ONLY valid JSON: { "faq": [ { "q": "...", "a": "..." }, ... ৬–৮টি ] }
প্রশ্নগুলো হবে বাংলাদেশি ক্রেতার বাস্তব প্রশ্ন: ডেলিভারি সময় ও চার্জ, ক্যাশ অন ডেলিভারি, ১৮ মাসের ওয়ারেন্টি, EPS বিনস রিফিল, কাপড় পরিষ্কার, ধারণক্ষমতা, রিটার্ন/এক্সচেঞ্জ, সাইজ ও জায়গা।
উত্তর ২–৪ বাক্য, সহজ বাংলা। কোনো ডিজিটাল প্রোডাক্ট প্রসঙ্গ নয়।`;
      userPrompt = `প্রোডাক্ট: ${productName}${specHint ? `\n${specHint}` : ""}${demoDescription ? `\n\n=== বর্তমান ডেসক্রিপশন ===\n${String(demoDescription).slice(0, 6000)}` : ""}`;

    } else {
      return new Response(JSON.stringify({ error: "Invalid type. Use: short_description, description, seo, all, demo_style, rich_content, or faq" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isJsonType = type === "seo" || type === "all" || type === "rich_content" || type === "faq";


    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.65,
      max_tokens: maxTokens,
    };

    if (isJsonType) {
      requestBody.response_format = { type: "json_object" };
    }

    // Try Lovable AI, then fallback to direct Gemini
    let content = "";
    const lovableResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (lovableResp.ok) {
      const data = await lovableResp.json();
      content = data.choices?.[0]?.message?.content || "";
    } else {
      console.warn(`Lovable AI failed (${lovableResp.status}); falling back to Gemini`);
      const { callAIWithFallback } = await import("../_shared/ai-fallback.ts");
      try {
        const { text } = await callAIWithFallback({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt + (isJsonType ? "\n\nReturn ONLY valid JSON, no markdown." : "") },
            { role: "user", content: userPrompt },
          ],
          maxTokens,
        });
        content = text;
      } catch (e) {
        return new Response(JSON.stringify({ error: "AI সাময়িকভাবে অনুপলব্ধ। পরে আবার চেষ্টা করুন।" }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (type === "short_description" || type === "description" || type === "demo_style") {
      return new Response(JSON.stringify({ result: normalizeBrandNameText(content.trim()) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // JSON types — robust multi-stage parsing
    let parsed: any;
    try {
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          try {
            const fixed = match[0]
              .replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, "\\n")
              .replace(/[\x00-\x1F\x7F]/g, (c) => {
                if (c === "\n") return "\\n";
                if (c === "\r") return "\\r";
                if (c === "\t") return "\\t";
                return "";
              });
            parsed = JSON.parse(fixed);
          } catch {
            if (type === "all") {
              parsed = {
                short_description: "",
                description: content,
                seo_title: "",
                seo_description: "",
              };
            } else {
              throw new Error("Failed to parse AI response as JSON");
            }
          }
        }
      } else {
        if (type === "all") {
          parsed = {
            short_description: "",
            description: content,
            seo_title: "",
            seo_description: "",
          };
        } else {
          throw new Error("Failed to parse AI response as JSON");
        }
      }
    }

    return new Response(JSON.stringify({ result: normalizeBrandNameDeep(parsed) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("generate-product-content error:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
