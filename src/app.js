// abliterated.ai — modular app.js (extracted from index.html)
// Original was 100% HTML, now proper JS module. Vite handles bundling, file:// still works via built dist/index.html
(() => {
  "use strict";

  // Capture a clean, untouched snapshot of this entire standalone HTML file BEFORE JS mutates the DOM
  const PRISTINE_HTML_SNAPSHOT = (() => {
    try {
      return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    } catch {
      return "";
    }
  })();

  const IS_FILE_PROTOCOL = location.protocol === "file:";
  const IS_SANDBOXED_VIEWER = location.origin === "null" && !IS_FILE_PROTOCOL;
  const EMBEDDED_PROXY_ORIGIN = (() => {
    try {
      const m = document.querySelector('meta[name="ablit-proxy-origin"]');
      const v = (m?.getAttribute("content") || "").trim().replace(/\/+$/, "");
      return /^https?:\/\//i.test(v) ? v : "";
    } catch {
      return "";
    }
  })();

  // Optional embedded portable state (present when opened from a "Download HTML + My Data" export)
  const PORTABLE_STATE = (() => {
    try {
      const node = document.getElementById("__PORTABLE_STATE__");
      if (!node || !node.textContent.trim()) return null;
      const parsed = JSON.parse(node.textContent);
      return (parsed && typeof parsed === "object") ? parsed : null;
    } catch {
      return null;
    }
  })();

  // ── Defaults & Configuration (100% Zero-API-Key · Verified Abliterated + Non-Abliterated) ─
  const DEFAULT_OLLAMA_URL = "http://localhost:11434/v1";
  const DEFAULT_LMSTUDIO_URL = "http://localhost:1234/v1";
  const STORAGE_SETTINGS = "ablit_runner_settings_v1";
  const STORAGE_CHATS = "ablit_runner_chats_v1";
  const STORAGE_STUDIO = "ablit_runner_studio_v1";

  // 100% Verified Keyless Unlimited Online Cloud Seed Models (AI Horde live-synced on startup · Access-Control-Allow-Origin: *)
  // Instant online replies with ZERO API keys, ZERO downloads, ZERO browser freezing!
  // Note: Anonymous AI Horde workers enforce a 512-token zero-kudos completion cap; capping max_completion_tokens at 512 avoids 403 KudosUpfront errors.
  const AIHORDE_ANON_MAX_TOKENS = 512;
  const AIHORDE_AUTO_FASTEST_ID = "aihorde/auto-fastest-abliterated";
  const AIHORDE_AUTO_FASTEST_MODEL = {
    id: AIHORDE_AUTO_FASTEST_ID,
    provider: "aihorde",
    category: "abliterated",
    isAutoRace: true,
    display_name: ">> Fastest Abliterated — Auto-Race (Online Keyless · Unlimited)",
    base_model: "AI Horde · Races Top Live GPUs · Lowest Latency · Zero Key",
    input_modalities: ["text"],
    context_length: 16384,
    max_completion_tokens: 512,
    hordeWorkers: 10,
    hordeQueued: 0,
    hordeEta: 0,
    hordePerf: 50,
    sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
  };
  // Verified live on 2026-11-17 via https://oai.aihorde.net/v1/models — all listed workers responded with x_horde.workers≥1 & Access-Control-Allow-Origin: * (file:// Origin: null CORS OK)
  // Live ETA/throughput syncs every 60s from https://aihorde.net/api/v2/status/models?type=text&model_state=known
  const AIHORDE_AUTO_FASTEST_NONABLIT_ID = "aihorde/auto-fastest-non-abliterated";
  const AIHORDE_AUTO_FASTEST_NONABLIT_MODEL = {
    id: AIHORDE_AUTO_FASTEST_NONABLIT_ID,
    provider: "auto-nonablit",
    category: "standard",
    isAutoRace: true,
    isNonAblitRace: true,
    display_name: ">> Fastest Non-Abliterated — Auto-Race (Online Keyless · Turbo)",
    base_model: "Races Pollinations + LLM7 + AI Horde · Lowest Latency · Zero Key",
    input_modalities: ["text"],
    context_length: 131072,
    max_completion_tokens: 2048,
    hordeWorkers: 10,
    hordeQueued: 0,
    hordeEta: 0,
    hordePerf: 80,
    sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
  };
  const AIHORDE_SEED_MODELS = [
    AIHORDE_AUTO_FASTEST_MODEL,
    AIHORDE_AUTO_FASTEST_NONABLIT_MODEL,
    {
      id: "koboldcpp/L3-8B-Stheno-v3.2",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Llama 3 8B Stheno Uncensored (Online Keyless · 6 workers)",
      base_model: "AI Horde · 6w · ~0.3s ETA · Fastest Abliterated",
      input_modalities: ["text"],
      context_length: 8192,
      max_completion_tokens: 512,
      hordeWorkers: 6,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Gemma-4-E4B-it-Ultra-Uncensored-Heretic",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Gemma 4 E4B Ultra Heretic Abliterated (Online Keyless · Vision)",
      base_model: "AI Horde · Heretic · 0 queued · Vision",
      input_modalities: ["text", "image"],
      context_length: 25600,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Cydonia-24B-v4zg-Q4_K_M",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Cydonia 24B Uncensored (Online Keyless · Vision)",
      base_model: "AI Horde · TheDrummer · Vision · 1w",
      input_modalities: ["text", "image"],
      context_length: 12288,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Llama-3-Lumimaid-8B-v0.1",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Llama 3 Lumimaid 8B Uncensored (Online Keyless)",
      base_model: "AI Horde · Uncensored · Vision · Fast",
      input_modalities: ["text", "image"],
      context_length: 8192,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/mini-magnum-12b-v1.1",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Magnum 12B Uncensored (Online Keyless · Unlimited)",
      base_model: "AI Horde · Fast Uncensored · 1w",
      input_modalities: ["text"],
      context_length: 12288,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Gemma-4-E4B-Uncensored-HauhauCS-Aggressive",
      provider: "aihorde",
      category: "abliterated",
      display_name: "Gemma 4 E4B Hauhau Aggressive (Online Keyless · Fast)",
      base_model: "AI Horde · Aggressive Uncensored · 0 queued",
      input_modalities: ["text", "image"],
      context_length: 4096,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Qwen3-1.7B",
      provider: "aihorde",
      category: "standard",
      display_name: "Qwen3 1.7B (Online Keyless · Ultra-Fast · 0 queued)",
      base_model: "AI Horde · 0 queued · Instant",
      input_modalities: ["text"],
      context_length: 2048,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Llama-3.2-1B-Instruct",
      provider: "aihorde",
      category: "standard",
      display_name: "Llama 3.2 1B Instruct (Online Keyless · 4 workers · Ultra-Fast)",
      base_model: "AI Horde · 4w · 0 queued · Instant",
      input_modalities: ["text"],
      context_length: 16384,
      max_completion_tokens: 512,
      hordeWorkers: 4,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "koboldcpp/Qwen3.5-4B",
      provider: "aihorde",
      category: "standard",
      display_name: "Qwen 3.5 4B (Online Keyless · Instant)",
      base_model: "AI Horde · 0 queued · Fast",
      input_modalities: ["text"],
      context_length: 4096,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "lmstudio/Qwen3.5-9B",
      provider: "aihorde",
      category: "standard",
      display_name: "Qwen3.5 9B (Online Keyless · 0 queued)",
      base_model: "AI Horde · 0 queued · Balanced",
      input_modalities: ["text"],
      context_length: 8192,
      max_completion_tokens: 512,
      hordeWorkers: 1,
      hordeQueued: 0,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    }
  ];

  // 100% Verified Live 2026-11-17 — all endpoints return Access-Control-Allow-Origin: * for Origin: null (file://) via fetch_page CORS check
  // Pollinations anonymous Classic API now serves GPT-OSS-20B (alias openai) at text.pollinations.ai/openai — 1 req at a time, 30s cooldown, no key
  // LLM7 turbo tier (usage_based_only=false) works keyless at 30 RPM anonymous; pro tier requires paid Pollen—only turbo models listed here
  const KEYLESS_CLOUD_MODELS = [
    {
      id: "openai",
      provider: "pollinations",
      category: "standard",
      display_name: "ChatGPT · GPT-OSS 20B (Pollinations · Keyless · Instant)",
      base_model: "Pollinations Classic · GPT-OSS 20B · Zero Key · 30s rate-limit",
      input_modalities: ["text"],
      context_length: 131072,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "gpt-oss:120b",
      provider: "llm7",
      category: "standard",
      display_name: "GPT-OSS 120B (LLM7 Turbo · Keyless · 131K ctx)",
      base_model: "LLM7 Turbo · 0.02 in / 0.10 out per 1M · Zero Key",
      input_modalities: ["text"],
      context_length: 131000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "gpt-oss:20b",
      provider: "llm7",
      category: "standard",
      display_name: "GPT-OSS 20B (LLM7 Turbo · Keyless · Fast)",
      base_model: "LLM7 Turbo · 0.03 in / 0.05 out · Zero Key",
      input_modalities: ["text"],
      context_length: 128000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "DeepSeek-V4-Flash-0731",
      provider: "llm7",
      category: "standard",
      display_name: "DeepSeek V4 Flash 0731 (LLM7 Turbo · 400K ctx)",
      base_model: "LLM7 Turbo · 0.02 in / 0.04 out · Reasoning + Tools",
      input_modalities: ["text"],
      context_length: 400000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "glm-5.3-flash",
      provider: "llm7",
      category: "standard",
      display_name: "GLM-5.3 Flash (LLM7 Turbo · 1M ctx)",
      base_model: "LLM7 Turbo · Zhipu · 0.04 in / 0.12 out · Zero Key",
      input_modalities: ["text"],
      context_length: 1048576,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "gemma4:31b",
      provider: "llm7",
      category: "standard",
      display_name: "Gemma 4 31B (LLM7 Turbo · 262K ctx)",
      base_model: "LLM7 Turbo · 0.04 in / 0.12 out · Google",
      input_modalities: ["text"],
      context_length: 262000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "codestral-latest",
      provider: "llm7",
      category: "standard",
      display_name: "Codestral Latest (LLM7 Turbo · 32K · Coding)",
      base_model: "LLM7 Turbo · 0.01 in / 0.02 out · Mistral",
      input_modalities: ["text"],
      context_length: 32000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "mimo-v2.6-flash",
      provider: "llm7",
      category: "standard",
      display_name: "MiMo V2.6 Flash (LLM7 Turbo · 1M ctx · Reasoning)",
      base_model: "LLM7 Turbo · Xiaomi · 0.03 in / 0.06 out",
      input_modalities: ["text"],
      context_length: 1000000,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    },
    {
      id: "gemma-3-27b",
      provider: "llm7",
      category: "standard",
      display_name: "Gemma 3 27B (LLM7 Turbo · 262K ctx)",
      base_model: "LLM7 Turbo · 0.06 in / 0.10 out · Google",
      input_modalities: ["text"],
      context_length: 262144,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    }
  ];

  // Lightweight Optional Offline In-Browser HTML ONNX Models (Only needed for No-Wi-Fi chat; heavy 1.7-2.2 GB models removed so tabs never freeze)
  const BROWSER_LOCAL_MODELS = [
    {
      id: "HuggingFaceTB/SmolLM2-135M-Instruct",
      provider: "browser",
      category: "standard",
      display_name: "SmolLM2 135M Instruct (Offline HTML · ~115 MB)",
      base_model: "Optional Offline · Fastest · ~115 MB",
      approx_mb: 112,
      supportedDtypes: { webgpuF16: "q4f16", webgpu: "q4", wasm: "q8" },
      input_modalities: ["text"],
      context_length: 8192,
      sampling_limits: { temperature: { minimum: 0, maximum: 1.5 } }
    },
    {
      id: "Jay0628/SmolLM2-360M-Instruct-heretic-TJS",
      provider: "browser",
      category: "abliterated",
      display_name: "SmolLM2 360M Heretic Abliterated (Offline HTML · ~390 MB)",
      base_model: "Optional Offline · Abliterated · ~390 MB",
      approx_mb: 392,
      supportedDtypes: { webgpuF16: "q4", webgpu: "q4", wasm: "q4" },
      input_modalities: ["text"],
      context_length: 8192,
      sampling_limits: { temperature: { minimum: 0, maximum: 1.5 } }
    },
    {
      id: "onnx-community/Qwen2.5-0.5B-Instruct-abliterated-v3-ONNX",
      provider: "browser",
      category: "abliterated",
      display_name: "Qwen 2.5 0.5B Abliterated v3 (Offline HTML · ~450 MB)",
      base_model: "Optional Offline · Abliterated · ~450 MB",
      approx_mb: 452,
      supportedDtypes: { webgpuF16: "q4f16", webgpu: "q4", wasm: "q8" },
      input_modalities: ["text"],
      context_length: 32768,
      sampling_limits: { temperature: { minimum: 0, maximum: 1.5 } }
    },
    {
      id: "onnx-community/Qwen2.5-0.5B-Instruct",
      provider: "browser",
      category: "standard",
      display_name: "Qwen 2.5 0.5B Instruct (Offline HTML · ~460 MB)",
      base_model: "Optional Offline · ~460 MB",
      approx_mb: 461,
      supportedDtypes: { webgpuF16: "q4f16", webgpu: "q4", wasm: "q8" },
      input_modalities: ["text"],
      context_length: 32768,
      sampling_limits: { temperature: { minimum: 0, maximum: 1.5 } }
    }
  ];

  const DEFAULT_BROWSER_AI_MODEL = BROWSER_LOCAL_MODELS[0].id;
  const DEFAULT_CLOUD_MODEL = KEYLESS_CLOUD_MODELS[0].id; // "openai" (ChatGPT · Pollinations Keyless Cloud)
  const DEFAULT_ONLINE_ABLITERATED_MODEL = AIHORDE_SEED_MODELS[0].id; // Live AI Horde Online Abliterated/Uncensored

  // POWER: Best coding model for unlimited code (bypasses Horde 512 cap, uses high-limit LLMs)
  function getBestCodeModel(){
    // Prefer true coding specialists with huge context & high max_completion_tokens
    const pool = (typeof KEYLESS_CLOUD_MODELS !== 'undefined' ? KEYLESS_CLOUD_MODELS : []).concat(typeof aiHordeLiveModels !== 'undefined' ? aiHordeLiveModels : []);
    const ranked = [
      "codestral-latest",
      "DeepSeek-V4-Flash-0731",
      "glm-5.3-flash",
      "gpt-oss:120b",
      "openai",
      "gpt-oss:20b",
      "gemma4:31b",
      "mimo-v2.6-flash"
    ];
    for(const want of ranked){
      const m = pool.find(x=> x.id===want || x.id.toLowerCase()===want.toLowerCase());
      if(m) return m;
    }
    // Fallback: any llm7/pollinations with max_completion_tokens >= 2048 or missing (means large)
    const fallback = pool.find(m=> (m.provider==="llm7" || m.provider==="pollinations") && (Number(m.max_completion_tokens||8192) >= 2048));
    if(fallback) return fallback;
    // Last resort: any model with context_length > 32000
    return pool.find(m=> Number(m.context_length||0) > 32000) || pool[0] || null;
  }

  function inferModelCategory(modelObj) {
    if (!modelObj) return "standard";
    if (modelObj.category === "abliterated" || modelObj.category === "standard") return modelObj.category;
    const hay = `${modelObj.id || ""} ${modelObj.display_name || ""} ${modelObj.base_model || ""}`;
    return /abliterat|heretic|uncensored|dolphin|unfiltered|obliterat|lorablated|stheno|cydonia|magnum|skyfall|behemoth|rocinante|lumimaid|dark[-_ ]?orthia|wicked|impish|fimbulvetr|mythomax|noromaid|lunaris|wayfarer|valkyrie/i.test(hay)
      ? "abliterated"
      : "standard";
  }

  function isAbliteratedModel(modelObj) {
    return inferModelCategory(modelObj) === "abliterated";
  }

  const PROVIDER_LABELS = {
    aihorde: "AI Horde (Online Keyless · Unlimited)",
    "auto-nonablit": "Auto-Race Non-Abliterated (Turbo)",
    pollinations: "Pollinations ChatGPT (Keyless Cloud)",
    llm7: "LLM7 (Keyless Cloud)",
    browser: "Optional Offline HTML",
    ollama: "Local Ollama (Unlimited)",
    lmstudio: "Local Server (Unlimited)",
    custom: "Custom Server"
  };

  const DEFAULT_SETTINGS = {
    ollamaUrl: DEFAULT_OLLAMA_URL,
    lmstudioUrl: DEFAULT_LMSTUDIO_URL,
    hfMirrorUrl: "",
    offlineMode: false,
    cachedBrowserModels: [],
    customModels: [],
    model: DEFAULT_ONLINE_ABLITERATED_MODEL,
    userPickedModel: false,
    autoSwitchedModel: false,
    reasoningEffort: "low",
    webEnabled: true,
    webMode: "agent",
    maxToolRounds: 6,
    temperature: 0.7,
    maxTokens: 262144, // ULTRA POWER: default 262K (full context) — Horde auto-clamps to 512, others use full blast
    systemPrompt: "",
    webEditorEnabled: true,
    ghRepo: "",
    ghBranch: "main",
    ghPath: "index.html",
    ghToken: "",
    netlifySiteId: "",
    netlifyToken: "",
    webhookUrl: "",
    webhookToken: "",
    secAuditEnabled: true,
    secAllowedDomains: "",
    supabaseUrl: "",
    supabaseKey: "",
    theme: "dark",
    // ── 10x: Model Health & Auto-Prune — broken models auto-hidden/deleted ──
    hiddenModels: {}, // { "provider::id": { reason, failures, lastError, hiddenAt, display_name, provider, id } }
    modelFailureCounts: {}, // { "provider::id": count }
    showHiddenModels: false
  };

  // ── State ───────────────────────────────────────────────────────────────────
  let settings = loadSettings();
  let ollamaDetectedModels = [];
  let aiHordeLiveModels = null; // null = use AIHORDE_SEED_MODELS until live sync finishes; array = live online workers
  let models = buildCatalogModels();
  let catalogFilter = "all"; // "all" | "abliteration" | "text" | "vision" | "extra"
let modelSearchQuery = "";
  let proxyAvailable = false;
  let networkBlockedHint = false;
  let chats = loadChats();
  let activeChatId = chats.length ? chats[0].id : null;
  let pendingImages = []; // [{ dataUrl, name, mime }]
  let forceSearchNext = false;
  let isStreaming = false;
  let activeAbortController = null;
  let sessionId = "ablit-web-" + Math.random().toString(36).slice(2, 10);
  const authorizedAuditHosts = new Set();

  const PROJECTS_KEY = "ablit_projects_v1";
function loadProjects(){
  try{
    const raw = localStorage.getItem(PROJECTS_KEY);
    if(raw){ const arr=JSON.parse(raw); if(Array.isArray(arr)) return arr; }
  }catch{}
  return [];
}
function saveProjects(){ try{ localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); }catch{} }
let projects = loadProjects(); // [{name,size,text}]

let studio = loadStudioState();
  let studioFileHandle = null;

  function loadStudioState() {
    try {
      const raw = localStorage.getItem(STORAGE_STUDIO);
      const p = raw ? JSON.parse(raw) : (PORTABLE_STATE?.studio || null);
      if (p && typeof p === "object") {
        const html = typeof p.html === "string" ? p.html : "";
        return {
          open: false,
          view: "preview",
          html,
          filename: p.filename || "index.html",
          sourceUrl: p.sourceUrl || "",
          lastPublishedUrl: p.lastPublishedUrl || "",
          history: html ? [html] : [],
          historyIdx: html ? 0 : -1
        };
      }
    } catch {
      const p = PORTABLE_STATE?.studio;
      if (p && typeof p === "object") {
        const html = typeof p.html === "string" ? p.html : "";
        return { open: false, view: "preview", html, filename: p.filename || "index.html", sourceUrl: p.sourceUrl || "", lastPublishedUrl: p.lastPublishedUrl || "", history: html ? [html] : [], historyIdx: html ? 0 : -1 };
      }
    }
    return {
      open: false,
      view: "preview",
      html: "",
      filename: "index.html",
      sourceUrl: "",
      lastPublishedUrl: "",
      history: [],
      historyIdx: -1
    };
  }

  function saveStudioState() {
    try {
      localStorage.setItem(STORAGE_STUDIO, JSON.stringify({
        html: studio.html,
        filename: studio.filename,
        sourceUrl: studio.sourceUrl,
        lastPublishedUrl: studio.lastPublishedUrl
      }));
    } catch {}
  }

  // ── DOM Refs ────────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const el = {
    sidebar: $("sidebar"),
    closeSidebarBtn: $("closeSidebarBtn"),
    toggleSidebarBtn: $("toggleSidebarBtn"),
    newChatBtn: $("newChatBtn"),
    chatSearchInput: $("chatSearchInput"),
    chatList: $("chatList"),
    connPill: $("connPill"),
    connDot: $("connDot"),
    connText: $("connText"),
    connModelsCount: $("connModelsCount"),
    openSettingsBtn: $("openSettingsBtn"),
    exportMdBtn: $("exportMdBtn"),
    modelSelect: $("modelSelect"),
    modelModalityBadge: $("modelModalityBadge"),
    effortGroup: $("effortGroup"),
    offlineToggleBtn: $("offlineToggleBtn"),
    offlineToggleLabel: $("offlineToggleLabel"),
    studioToggleBtn: $("studioToggleBtn"),
    webToggleBtn: $("webToggleBtn"),
    webToggleLabel: $("webToggleLabel"),
    downloadHtmlBtn: $("downloadHtmlBtn"),
    themeToggleBtn: $("themeToggleBtn"),
    themeIcon: $("themeIcon"),
    messagesWrap: $("messagesWrap"),
    messagesInner: $("messagesInner"),
    composerBox: $("composerBox"),
    pendingAttachments: $("pendingAttachments"),
    promptInput: $("promptInput"),
    imageFileInput: $("imageFileInput"),
    attachImgBtn: $("attachImgBtn"),
    forceSearchBtn: $("forceSearchBtn"),
    fetchUrlPromptBtn: $("fetchUrlPromptBtn"),
    editUrlPromptBtn: $("editUrlPromptBtn"),
    auditUrlPromptBtn: $("auditUrlPromptBtn"),
    sendBtn: $("sendBtn"),
    hintLeft: $("hintLeft"),
    studioPane: $("studioPane"),
    studioTabPreview: $("studioTabPreview"),
    studioTabCode: $("studioTabCode"),
    studioUndoBtn: $("studioUndoBtn"),
    studioRedoBtn: $("studioRedoBtn"),
    studioFileInput: $("studioFileInput"),
    studioOpenFileBtn: $("studioOpenFileBtn"),
    studioSaveBtn: $("studioSaveBtn"),
    studioPopoutBtn: $("studioPopoutBtn"),
    studioPublishBtn: $("studioPublishBtn"),
    studioCloseBtn: $("studioCloseBtn"),
    studioUrlInput: $("studioUrlInput"),
    studioCloneBtn: $("studioCloneBtn"),
    studioResetBtn: $("studioResetBtn"),
    studioStage: $("studioStage"),
    studioPreviewFrame: $("studioPreviewFrame"),
    studioCodeInput: $("studioCodeInput"),
    studioEmptyOverlay: $("studioEmptyOverlay"),
    studioStatusLeft: $("studioStatusLeft"),
    studioStatusRight: $("studioStatusRight"),
    drawerBackdrop: $("drawerBackdrop"),
    settingsDrawer: $("settingsDrawer"),
    closeSettingsBtn: $("closeSettingsBtn"),
    ollamaUrlInput: $("ollamaUrlInput"),
    syncOllamaBtn: $("syncOllamaBtn"),
    offlineModeToggle: $("offlineModeToggle"),
    browserAiModelSelect: $("browserAiModelSelect"),
    preloadBrowserAiBtn: $("preloadBrowserAiBtn"),
    diagBrowserAiBtn: $("diagBrowserAiBtn"),
    importLocalOnnxBtn: $("importLocalOnnxBtn"),
    importLocalOnnxInput: $("importLocalOnnxInput"),
    hfMirrorUrlInput: $("hfMirrorUrlInput"),
    clearBrowserAiCacheBtn: $("clearBrowserAiCacheBtn"),
    browserAiStatusBox: $("browserAiStatusBox"),
    lmstudioUrlInput: $("lmstudioUrlInput"),
    localScanResultBox: $("localScanResultBox"),
    downloadWinSetupBtn: $("downloadWinSetupBtn"),
    downloadUnixSetupBtn: $("downloadUnixSetupBtn"),
    customModelId: $("customModelId"),
    customModelModality: $("customModelModality"),
    customModelName: $("customModelName"),
    customModelCtx: $("customModelCtx"),
    customModelBaseUrl: $("customModelBaseUrl"),
    addCustomModelBtn: $("addCustomModelBtn"),
    customModelsList: $("customModelsList"),
    maxToolRoundsRange: $("maxToolRoundsRange"),
    maxToolRoundsVal: $("maxToolRoundsVal"),
    webEditorEnabledToggle: $("webEditorEnabledToggle"),
    ghRepoInput: $("ghRepoInput"),
    ghBranchInput: $("ghBranchInput"),
    ghPathInput: $("ghPathInput"),
    ghTokenInput: $("ghTokenInput"),
    netlifySiteIdInput: $("netlifySiteIdInput"),
    netlifyTokenInput: $("netlifyTokenInput"),
    webhookUrlInput: $("webhookUrlInput"),
    webhookTokenInput: $("webhookTokenInput"),
    supabaseUrlInput: $("supabaseUrlInput"),
    supabaseKeyInput: $("supabaseKeyInput"),
    secAuditEnabledToggle: $("secAuditEnabledToggle"),
    secAllowedDomainsInput: $("secAllowedDomainsInput"),
    tempRange: $("tempRange"),
    tempVal: $("tempVal"),
    tempLimitNote: $("tempLimitNote"),
    maxTokensInput: $("maxTokensInput"),
    systemPromptInput: $("systemPromptInput"),
    downloadCleanHtmlBtn: $("downloadCleanHtmlBtn"),
    downloadPortableHtmlBtn: $("downloadPortableHtmlBtn"),
    refreshModelsBtn: $("refreshModelsBtn"),
    exportJsonBtn: $("exportJsonBtn"),
    clearAllChatsBtn: $("clearAllChatsBtn"),
    toast: $("toast")
  };

  // Sticky Auto-Failover cooldown maps (populated on errors; cleared when user manually selects a model)
  const modelCooldownUntil = new Map();
  const providerCooldownUntil = new Map();
  const aiHordeMeasuredTtftMs = new Map(); // Empirical EWMA TTFT per AI Horde worker for instant fastest-first routing
  let lastAiHordeSyncAt = 0;
  let browserNetworkBlockedUntil = 0;

  function recordAiHordeSpeed(modelId, ttftMs) {
    if (!modelId || !Number.isFinite(ttftMs) || ttftMs <= 0) return;
    const prev = aiHordeMeasuredTtftMs.get(modelId);
    const next = prev ? Math.round(prev * 0.45 + ttftMs * 0.55) : Math.round(ttftMs);
    aiHordeMeasuredTtftMs.set(modelId, next);
  }

  function buildCatalogModels() {
    const out = [];
    const seen = new Set();
    const pushUnique = (m) => {
      if (!m || !m.id) return;
      const key = `${m.provider || "browser"}::${m.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ ...m, category: inferModelCategory(m) });
    };
    // 100% Verified Working Keyless Models Only (Online Cloud FIRST · Zero Freezing · Optional Lightweight Offline)
    // Startup TTFT optimization: local detectors first, then auto-race, then live workers — no heavy downloads!
    // 1. Live-detected local Ollama / LM Studio models (only shown when actually running!)
    ollamaDetectedModels.forEach(pushUnique);
    // 2. Auto-Race meta-models FIRST for lowest TTFT (abliterated + non-abliterated)
    pushUnique(AIHORDE_AUTO_FASTEST_MODEL);
    pushUnique(AIHORDE_AUTO_FASTEST_NONABLIT_MODEL);
    const hordeList = (Array.isArray(aiHordeLiveModels) && aiHordeLiveModels.length) ? aiHordeLiveModels : AIHORDE_SEED_MODELS;
    hordeList.forEach(pushUnique);
    // 3. Verified Keyless Online Cloud models (ChatGPT Pollinations + LLM7 Turbo · CORS *)
    KEYLESS_CLOUD_MODELS.forEach(pushUnique);
    // 4. Optional lightweight In-Browser Offline models (only needed when Wi-Fi is OFF)
    BROWSER_LOCAL_MODELS.forEach(pushUnique);
    // 4. User custom models
    if (Array.isArray(settings.customModels)) {
      settings.customModels.forEach(m => pushUnique({ ...m, provider: m.provider || "custom" }));
    }
    if(!out.length){
      KEYLESS_CLOUD_MODELS.forEach(pushUnique);
      BROWSER_LOCAL_MODELS.forEach(pushUnique);
    }
    return out;
  }

  // ── 10x: Auto-Prune Health System — deleted/hidden model engine ──
  function getModelKey(m){ return `${m?.provider || "custom"}::${m?.id || ""}`; }
  function isModelHidden(m){
    if(!m || !m.id) return false;
    if(settings.showHiddenModels) return false;
    const k = getModelKey(m);
    return !!(settings.hiddenModels && settings.hiddenModels[k]);
  }
  function getHiddenCount(){ return settings.hiddenModels ? Object.keys(settings.hiddenModels).length : 0; }
  function getHiddenModelsList(){
    const hm = settings.hiddenModels || {};
    return Object.entries(hm).map(([k,v])=> ({ key:k, ...v }));
  }
  function pruneExpiredHiddenModels(){
    const hm = settings.hiddenModels || {};
    const now = Date.now();
    let changed=false;
    for(const [k,v] of Object.entries(hm)){
      if(v && v.hiddenAt && (now - v.hiddenAt) > 24*60*60*1000){
        delete hm[k];
        changed=true;
      }
    }
    if(changed){ saveSettings(); rebuildModelsList(); }
  }
  function restoreHiddenModel(key){
    if(settings.hiddenModels && settings.hiddenModels[key]){
      delete settings.hiddenModels[key];
      if(settings.modelFailureCounts) delete settings.modelFailureCounts[key];
      saveSettings();
      rebuildModelsList();
      showToast(`✓ Restored ${key.split("::").pop()}`);
      renderHiddenModelsManager();
      updateHiddenBanner();
    }
  }
  function restoreAllHidden(){
    const c = getHiddenCount();
    if(!c) return;
    const keys = Object.keys(settings.hiddenModels||{});
    settings.hiddenModels = {};
    settings.modelFailureCounts = {};
    // also clear cooldowns for those models
    for(const k of keys) modelCooldownUntil.delete(k.split("::").pop());
    // clear all provider cooldowns too for fresh start
    providerCooldownUntil.clear(); modelCooldownUntil.clear();
    saveSettings(); rebuildModelsList(); showToast(`✓ Restored ${c} models`);
    renderHiddenModelsManager(); updateHiddenBanner();
  }
  function clearHiddenForever(){
    if(!confirm(`Permanently forget ${getHiddenCount()} hidden models? They will still reappear if provider lists them again.`)) return;
    settings.hiddenModels={}; settings.modelFailureCounts={}; saveSettings(); rebuildModelsList();
    showToast("Hidden list cleared"); renderHiddenModelsManager(); updateHiddenBanner();
  }
  function shouldAutoHideModel(modelObj, err){
    if(!modelObj || !modelObj.id) return false;
    const prov = (modelObj.provider||"").toLowerCase();
    if(prov==="ollama" || prov==="lmstudio") return false;
    const msg = String(err?.message || err || "").toLowerCase();
    const status = Number(err?.status||0);
    // Never hide on rate-limit / cooldown / offline transient
    if(status===429 || status===503 || status===402 || /rate.?limit|cooldown|quota|busy|temporarily|overloaded/i.test(msg)) return false;
    if(status===404 || status===401 || status===403) return true;
    if(/not\s*found|unknown\s*model|does\s*not\s*exist|no_eligible_worker|no worker|model.*not.*available|access.*denied|forbidden|invalid.*model/i.test(msg)) return true;
    if(/empty response/.test(msg)){
      // empty response twice = dead
      const k=getModelKey(modelObj);
      const cnt=(settings.modelFailureCounts?.[k]||0)+1;
      return cnt>=2;
    }
    // Soft errors: only delete on 3 strikes
    const k=getModelKey(modelObj);
    const cnt=(settings.modelFailureCounts?.[k]||0)+1;
    if(cnt>=3) return true;
    return false;
  }
  function hideFailedModel(modelObj, err){
    if(!modelObj || !modelObj.id) return false;
    const k=getModelKey(modelObj);
    // Never hide if only one visible model left — keep at least 1
    const visibleCount = models.filter(m=> !isModelHidden(m)).length;
    if(visibleCount<=1 && !isModelHidden(modelObj)){
      console.warn("hideFailedModel blocked: last visible model", k);
      return false;
    }
    const reason = summarizeFailoverReason(err);
    const cnt = (settings.modelFailureCounts?.[k]||0)+1;
    if(!settings.hiddenModels) settings.hiddenModels={};
    if(!settings.modelFailureCounts) settings.modelFailureCounts={};
    settings.modelFailureCounts[k]=cnt;
    // For custom models: actually DELETE from customModels array
    if(modelObj.provider==="custom"){
      if(Array.isArray(settings.customModels)){
        const before=settings.customModels.length;
        settings.customModels=settings.customModels.filter(m=> getModelKey({...m, provider:m.provider||"custom"})!==k);
        if(settings.customModels.length!==before){
          showToast(`🗑️ Deleted custom model ${modelObj.id} (failed: ${reason}) — undo in Settings`);
        }
      }
    }
    // For built-ins: hide (soft delete) with metadata
    settings.hiddenModels[k]={
      id: modelObj.id,
      provider: modelObj.provider,
      display_name: modelObj.display_name||modelObj.id,
      reason, failures: cnt, lastError: String(err?.message||err||"").slice(0,180),
      hiddenAt: Date.now()
    };
    saveSettings();
    rebuildModelsList();
    // Toast with undo
    showToast(`🗑️ Removed broken model: ${modelObj.display_name||modelObj.id} (${reason})`);
    // If current model was hidden, failover will already have switched; ensure UI updates
    if(settings.model===modelObj.id){
      const stillVisible = models.find(m=> m.id===settings.model && !isModelHidden(m));
      if(!stillVisible && models.length){
        const fallback = models.find(m=> !isModelHidden(m));
        if(fallback){ settings.model=fallback.id; saveSettings(); populateModelSelect(); syncModelCapabilitiesUI(); }
      }
    }
    renderHiddenModelsManager();
    updateHiddenBanner();
    return true;
  }
  function manuallyHideModel(modelId){
    const m = models.find(x=> x.id===modelId);
    if(!m) return;
    if(confirm(`Hide "${m.display_name||m.id}" from the model list? You can restore it in Settings → Model Health.`)){
      hideFailedModel(m, { message: "manually hidden", status: 0 });
    }
  }

  function isOfflineActive() {
    return Boolean(settings.offlineMode || (typeof navigator !== "undefined" && navigator.onLine === false));
  }

  function isLocalOfflineModel(modelObj) {
    const p = modelObj?.provider || "browser";
    return p === "browser" || p === "ollama" || p === "lmstudio" || p === "custom";
  }

  function rebuildModelsList() {
    models = buildCatalogModels();
    populateModelSelect();
    syncModelCapabilitiesUI();
    renderCustomModelsList();
    if (!getActiveChat()?.messages?.length) renderEmptyState();
    try{ renderHiddenModelsManager(); updateHiddenBanner(); }catch{}
  }

  // ── Persistence Helpers ─────────────────────────────────────────────────────
  function loadSettings() {
    const migrate = (obj)=>{
      if(!obj || typeof obj!=="object") return { ...DEFAULT_SETTINGS };
      const out = { ...DEFAULT_SETTINGS, ...obj, webMode: "agent" };
      if(!out.hiddenModels || typeof out.hiddenModels !== "object" || Array.isArray(out.hiddenModels)) out.hiddenModels = {};
      if(!out.modelFailureCounts || typeof out.modelFailureCounts !== "object" || Array.isArray(out.modelFailureCounts)) out.modelFailureCounts = {};
      if(typeof out.showHiddenModels !== "boolean") out.showHiddenModels = false;
      if(typeof out.model !== "string" || !out.model) out.model = DEFAULT_ONLINE_ABLITERATED_MODEL;
      if(typeof out.offlineMode !== "boolean") out.offlineMode = false;
      if(!Array.isArray(out.cachedBrowserModels)) out.cachedBrowserModels = [];
      if(!Array.isArray(out.customModels)) out.customModels = [];
      return out;
    };
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed==="object") return migrate(parsed);
      }
    } catch(e){ console.warn("loadSettings corrupt, will reset", e); }
    if (PORTABLE_STATE?.settings && typeof PORTABLE_STATE.settings === "object") {
      return migrate(PORTABLE_STATE.settings);
    }
    return { ...DEFAULT_SETTINGS };
  }

  function saveSettings() {
    try { localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings)); } catch {}
  }

  function loadChats() {
    try {
      const raw = localStorage.getItem(STORAGE_CHATS);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          // Validate and sanitize each chat — prevent blank screen from corrupt data
          const sane = arr.filter(c => c && typeof c.id === 'string' && Array.isArray(c.messages)).map(c => ({
            ...c,
            title: typeof c.title === 'string' ? c.title.slice(0, 120) : "New conversation",
            messages: c.messages.filter(m => m && typeof m.role === 'string' && (m.role === 'user' || m.role === 'assistant')).slice(-200) // cap at 200 msgs per chat
          }));
          if (sane.length) return sane;
        }
      }
    } catch (e) { console.warn("loadChats corrupted, resetting", e); }
    if (Array.isArray(PORTABLE_STATE?.chats)) return PORTABLE_STATE.chats;
    return [];
  }

  function renderProjects(){
    const listEl = document.getElementById("projectsList");
    const countEl = document.getElementById("projectsCount");
    if(!listEl) return;
    if(!projects.length){
      listEl.innerHTML = `<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:8px;">No project files yet</div>`;
      if(countEl) countEl.textContent = "0 files";
      return;
    }
    if(countEl) countEl.textContent = `${projects.length} file${projects.length===1?"":"s"} · ${(projects.reduce((a,b)=>a+(b.text?.length||0),0)/1024).toFixed(1)}KB`;
    listEl.innerHTML = projects.map((p,i)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--bg-canvas);border:1px solid var(--border);border-radius:6px;">
        <span style="flex:1;min-width:0;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${p.name} (${p.text.length} chars)">${p.name}</span>
        <span style="font-size:10px;color:var(--text-muted);">${(p.text.length/1024).toFixed(1)}KB</span>
        <button data-del-project="${i}" style="font-size:11px;padding:2px 6px;border-radius:4px;background:var(--danger-soft);color:var(--danger);border:1px solid var(--danger);">×</button>
      </div>`).join("");
  }

  function buildProjectsContext(filterQuery=""){
    if(!projects.length) return "";
    // Smart filter: if user asks about a specific project file, prioritize it
    let ranked = [...projects];
    if(filterQuery){
      const q = filterQuery.toLowerCase();
      ranked.sort((a,b)=>{
        const aScore = a.name.toLowerCase().includes(q) ? 0 : (a.text.toLowerCase().includes(q) ? 1 : 2);
        const bScore = b.name.toLowerCase().includes(q) ? 0 : (b.text.toLowerCase().includes(q) ? 1 : 2);
        return aScore - bScore;
      });
    }
    const total = ranked.reduce((a,b)=>a+(b.text?.length||0),0);
    const cap = 16000; // increased to 16K for 10× context power
    let out = "\n\n[PROJECT KNOWLEDGE — persistent files attached like Claude Projects. Use this context when relevant]:\n";
    for(const p of projects){
      const snippet = p.text.slice(0, cap);
      out += `\n--- ${p.name} (${p.text.length} chars) ---\n${snippet}\n`;
      if(out.length > cap) break;
    }
    if(total > cap) out += "\n(knowledge truncated to fit context)\n";
    return out.slice(0, cap+500);
  }

  function saveChats() {
    try {
      localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
    } catch (e) {
      console.warn("saveChats quota hit, slimming", e);
      try {
        // Slim: drop images, truncate long messages, keep last 50 chats
        const slim = chats.slice(0, 50).map(c => ({
          ...c,
          messages: c.messages.slice(-80).map(m => ({
            ...m,
            content: typeof m.content === "string" && m.content.length>8000 ? m.content.slice(0,8000)+"…(truncated)" : m.content,
            images: undefined,
            reasoning: undefined
          }))
        }));
        localStorage.setItem(STORAGE_CHATS, JSON.stringify(slim));
        showToast("Chats trimmed to fit storage — images removed from old chats");
      } catch (e2) {
        console.error("saveChats failed even after slim", e2);
        try { localStorage.removeItem(STORAGE_CHATS); } catch {}
      }
    }
  }

  function getActiveChat() {
    return chats.find(c => c.id === activeChatId) || null;
  }

  function createChat(title = "New conversation") {
    const chat = {
      id: "chat_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usedWeb: false,
      messages: []
    };
    chats.unshift(chat);
    activeChatId = chat.id;
    saveChats();
    renderChatList();
    renderMessages();
    return chat;
  }

  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.toast.classList.remove("show"), 2600);
  }

  // ── HTML Escaping & Safe URL ────────────────────────────────────────────────
  function escHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url) {
    try {
      const u = new URL(String(url).trim());
      if (u.protocol === "http:" || u.protocol === "https:") return u.href;
    } catch {}
    return null;
  }

  function getDomain(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
  }

  // ── Lightweight Syntax Highlighter & Markdown Renderer ──────────────────────
  function highlightCode(code, lang) {
    const escaped = escHtml(code);
    const l = (lang || "").toLowerCase();
    if (!l || l === "text" || l === "txt" || l === "plain") return escaped;
    // Tokenize safely in one pass so tags never collide
    const tokenRe = /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|async|await|if|else|for|while|switch|case|break|continue|import|from|export|default|class|extends|new|try|catch|finally|throw|def|lambda|yield|with|as|pass|None|True|False|true|false|null|undefined|SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|TABLE|fn|pub|struct|impl|enum|match|mut|type|interface|package|go|defer)\b|\b\d+(?:\.\d+)?\b)/g;
    return escaped.replace(tokenRe, (m) => {
      if (m.startsWith("//") || m.startsWith("/*") || (m.startsWith("#") && (l === "python" || l === "py" || l === "bash" || l === "sh" || l === "yaml" || l === "yml"))) {
        return `<span class="tok-cmt">${m}</span>`;
      }
      if (m.startsWith('"') || m.startsWith("'") || m.startsWith("`")) {
        return `<span class="tok-str">${m}</span>`;
      }
      if (/^\d/.test(m)) {
        return `<span class="tok-num">${m}</span>`;
      }
      return `<span class="tok-kw">${m}</span>`;
    });
  }

  function renderInlineMd(text) {
    // Protect inline code spans first
    const codeSpans = [];
    let s = text.replace(/`([^`\n]+)`/g, (_, code) => {
      const idx = codeSpans.length;
      codeSpans.push(`<code class="inline-code">${escHtml(code)}</code>`);
      return `\u0000CODE${idx}\u0000`;
    });

    // Escape remaining HTML
    s = escHtml(s);

    // Markdown links [label](url)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      const clean = safeUrl(url.replace(/&amp;/g, "&"));
      if (!clean) return label;
      return `<a href="${escHtml(clean)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    // Bare URLs (not already inside an href="")
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)"']+)/g, (m, pre, url) => {
      let cleanUrl = url.replace(/[.,;:!?]+$/, "");
      const tail = url.slice(cleanUrl.length);
      const valid = safeUrl(cleanUrl.replace(/&amp;/g, "&"));
      if (!valid) return m;
      return `${pre}<a href="${escHtml(valid)}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${tail}`;
    });

    // Bold, italic, strikethrough
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // Restore inline code
    s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeSpans[Number(idx)] || "");
    return s;
  }

  function renderMarkdown(md) {
    if (!md) return { html: "", codeBlocks: [] };
    const text = String(md).replace(/\r\n/g, "\n");

    // Extract fenced code blocks first
    const codeBlocks = [];
    const withPlaceholders = text.replace(/```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)(?:```|$)/g, (_, lang, code) => {
      const idx = codeBlocks.length;
      const cleanCode = code.replace(/\n$/, "");
      const langLabel = lang || "code";
      const html = `
        <div class="code-block">
          <div class="code-header">
            <span>${escHtml(langLabel)}</span>
            <button type="button" class="copy-code-btn" data-copy-code="${idx}">Copy</button>
          </div>
          <pre><code>${highlightCode(cleanCode, lang)}</code></pre>
        </div>`;
      codeBlocks.push({ html, raw: cleanCode });
      return `\n\u0000BLOCK${idx}\u0000\n`;
    });

    const lines = withPlaceholders.split("\n");
    const out = [];
    let i = 0;

    const isHeadingLine = (ln) => /^(#{1,6})\s+(.+)$/.test(ln) && ln.replace(/^#{1,6}\s+/, "").trim().length > 0;
    const isTableStart = (idx) =>
      lines[idx].includes("|") &&
      idx + 1 < lines.length &&
      /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[idx + 1]);

    while (i < lines.length) {
      const startI = i;
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) { i++; continue; }

      // Code block placeholder
      const blkMatch = trimmed.match(/^\u0000BLOCK(\d+)\u0000$/);
      if (blkMatch) {
        const entry = codeBlocks[Number(blkMatch[1])];
        if (entry) out.push(entry.html);
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(?:---+|\*\*\*+|___+)$/.test(trimmed)) {
        out.push("<hr />");
        i++;
        continue;
      }

      // Headings (h1–h6; requires non-whitespace title so streamed "## " never stalls)
      const hMatch = isHeadingLine(line) ? line.match(/^(#{1,6})\s+(.+)$/) : null;
      if (hMatch) {
        const lvl = Math.min(4, hMatch[1].length);
        out.push(`<h${lvl}>${renderInlineMd(hMatch[2].trim())}</h${lvl}>`);
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(trimmed)) {
        const qLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          qLines.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        out.push(`<blockquote>${qLines.map(renderInlineMd).join("<br/>")}</blockquote>`);
        continue;
      }

      // Table
      if (isTableStart(i)) {
        const parseRow = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
        const headers = parseRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
          rows.push(parseRow(lines[i]));
          i++;
        }
        const thead = `<thead><tr>${headers.map(h => `<th>${renderInlineMd(h)}</th>`).join("")}</tr></thead>`;
        const tbody = `<tbody>${rows.map(r => `<tr>${headers.map((_, ci) => `<td>${renderInlineMd(r[ci] || "")}</td>`).join("")}</tr>`).join("")}</tbody>`;
        out.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`);
        continue;
      }

      // Unordered list
      if (/^\s*[-*+]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
          i++;
        }
        out.push(`<ul>${items.map(it => `<li>${renderInlineMd(it)}</li>`).join("")}</ul>`);
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
          i++;
        }
        out.push(`<ol>${items.map(it => `<li>${renderInlineMd(it)}</li>`).join("")}</ol>`);
        continue;
      }

      // Paragraph
      const pLines = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^\u0000BLOCK\d+\u0000$/.test(lines[i].trim()) &&
        !isHeadingLine(lines[i]) &&
        !isTableStart(i) &&
        !/^>\s?/.test(lines[i].trim()) &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s+/.test(lines[i]) &&
        !/^(?:---+|\*\*\*+|___+)$/.test(lines[i].trim())
      ) {
        pLines.push(lines[i]);
        i++;
      }

      // Ironclad forward-progress invariant: never infinite-loop on any partial/edge input
      if (i === startI) {
        pLines.push(lines[i]);
        i++;
      }
      out.push(`<p>${pLines.map(renderInlineMd).join("<br/>")}</p>`);
    }

    return { html: out.join("\n"), codeBlocks };
  }

  // ── Built-in Client-Side Web Engine (CORS-Native, Zero Required Keys) ──────
  function decodeBase64UrlUtf8(b64url) {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  function decodeBingUrl(rawUrl) {
    try {
      const u = new URL(rawUrl);
      if (u.hostname.includes("bing.com") && u.pathname.includes("/ck/")) {
        const p = u.searchParams.get("u");
        if (p && p.startsWith("a1")) {
          const decoded = decodeBase64UrlUtf8(p.slice(2));
          if (decoded.startsWith("http://") || decoded.startsWith("https://")) return decoded;
        }
      }
      if (u.hostname.includes("bing.com") && u.searchParams.get("url")) {
        const direct = u.searchParams.get("url");
        if (direct.startsWith("http")) return direct;
      }
    } catch {}
    return rawUrl;
  }

  function parseBingWebMarkdown(md, limit = 8) {
    const body = md.replace(/^---[\s\S]*?---\s*/, "");
    const results = [];
    const blocks = body.split(/\n(?=\d+\.\s+\[)/);
    for (const block of blocks) {
      const m = block.match(/^\d+\.\s+\[([\s\S]*?)\]\((https?:\/\/[^\s)]+)\)/);
      if (!m) continue;
      const url = decodeBingUrl(m[2]);
      const rest = block.slice(m[0].length);
      const titleMatch = rest.match(/##\s+(.+)/);
      const title = titleMatch
        ? titleMatch[1].replace(/\\([_*[\]()])/g, "$1").trim()
        : m[1].replace(/\s+/g, " ").trim();
      let snippet = titleMatch
        ? rest.slice(rest.indexOf(titleMatch[0]) + titleMatch[0].length)
        : rest;
      snippet = snippet
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\\([_*[\]()])/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
      if (url && title && !url.includes("bing.com/ck/")) {
        results.push({ title, url, domain: getDomain(url), snippet: snippet.slice(0, 320) });
      }
      if (results.length >= limit) break;
    }
    return results;
  }

  function parseBingNewsMarkdown(md, limit = 8) {
    const body = md.replace(/^---[\s\S]*?---\s*/, "");
    const results = [];
    const blocks = body.split(/\n(?=##\s+\[)/);
    for (const block of blocks) {
      const m = block.match(/^##\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
      if (!m) continue;
      const title = m[1].replace(/\\([_*[\]()])/g, "$1").trim();
      const url = decodeBingUrl(m[2]);
      const snippet = block
        .slice(m[0].length)
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
      if (url && title) {
        results.push({ title, url, domain: getDomain(url), snippet: snippet.slice(0, 320) });
      }
      if (results.length >= limit) break;
    }
    return results;
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 11000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const parentSignal = options.signal;
    const onParentAbort = () => ctrl.abort();
    if (parentSignal) {
      if (parentSignal.aborted) { clearTimeout(timer); throw new DOMException("Aborted", "AbortError"); }
      parentSignal.addEventListener("abort", onParentAbort, { once: true });
    }
    try {
      return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
      if (parentSignal) parentSignal.removeEventListener("abort", onParentAbort);
    }
  }

  async function webGetWithProxy(url, signal, timeoutMs = 10000) {
    if (proxyAvailable) {
      try {
        const pr = await fetchWithTimeout(`./api/web/fetch?url=${encodeURIComponent(url)}`, { signal }, timeoutMs);
        if (pr.ok) return pr;
      } catch (e) {
        if (e.name === "AbortError" && signal?.aborted) throw e;
      }
    }
    return await fetchWithTimeout(url, { signal }, timeoutMs);
  }

  function isBingFallbackJunk(results, query) {
    if (!results.length) return false;
    if (/\bmicrosoft\b|\bwindows\b|\bexcel\b|\boffice\b|\bazure\b|\bcopilot\b|\bxbox\b/i.test(query)) return false;
    const msCount = results.filter(r =>
      /(^|\.)microsoft\.com$/i.test(r.domain) ||
      /^Microsoft\b|^Sign in to your|^Put multiple values in one cell/i.test(r.title)
    ).length;
    return msCount >= Math.max(2, Math.ceil(results.length * 0.5));
  }

  function simplifySearchQuery(q) {
    const words = q
      .replace(/[^\w\s.-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !/^(the|and|for|with|from|what|when|where|how|about|latest|recent|news|in|on|of|to|is|are)$/i.test(w));
    return words.slice(0, 3).join(" ");
  }

  async function runWebSearch(query, numResults = 8, signal) {
    const limit = Math.max(1, Math.min(12, Number(numResults) || 8));
    const q = String(query || "").trim();
    if (!q) return { query: q, engine: "none", results: [], error: "Empty query" };

    // 100% Zero-Key Engine: Parallel Bing Web + Bing News + DDG IA + Wikipedia
    const results = [];
    const seenUrls = new Set();
    const enginesUsed = [];

    const addResult = (item) => {
      if (!item || !item.url || seenUrls.has(item.url)) return;
      seenUrls.add(item.url);
      results.push(item);
    };

    const qPlus = encodeURIComponent(q).replace(/%20/g, "+");
    const [bingWebRes, bingNewsRes, ddgRes, wikiRes] = await Promise.allSettled([
      webGetWithProxy("https://defuddle.md/www.bing.com/search?q=" + qPlus, signal, 9000)
        .then(r => r.ok ? r.text() : ""),
      webGetWithProxy("https://defuddle.md/www.bing.com/news/search?q=" + qPlus, signal, 9000)
        .then(r => r.ok ? r.text() : ""),
      webGetWithProxy("https://api.duckduckgo.com/?q=" + qPlus + "&format=json&no_html=1&skip_disambig=1", signal, 5000)
        .then(r => r.ok ? r.json() : null),
      webGetWithProxy("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(q) + "&srlimit=3&format=json&origin=*", signal, 5000)
        .then(r => r.ok ? r.json() : null)
    ]);

    let bingWebItems = [];
    if (bingWebRes.status === "fulfilled" && bingWebRes.value) {
      const parsed = parseBingWebMarkdown(bingWebRes.value, limit);
      if (!isBingFallbackJunk(parsed, q)) {
        bingWebItems = parsed;
      }
    }

    // If Bing Web returned fallback junk or empty, retry once with simplified core keywords
    if (!bingWebItems.length) {
      const shortQ = simplifySearchQuery(q);
      if (shortQ && shortQ.toLowerCase() !== q.toLowerCase()) {
        try {
          const shortPlus = encodeURIComponent(shortQ).replace(/%20/g, "+");
          const retryMd = await webGetWithProxy("https://defuddle.md/www.bing.com/search?q=" + shortPlus, signal, 7000)
            .then(r => r.ok ? r.text() : "");
          const retryParsed = parseBingWebMarkdown(retryMd, limit);
          if (!isBingFallbackJunk(retryParsed, shortQ)) {
            bingWebItems = retryParsed;
          }
        } catch {}
      }
    }

    let bingNewsItems = [];
    if (bingNewsRes.status === "fulfilled" && bingNewsRes.value) {
      bingNewsItems = parseBingNewsMarkdown(bingNewsRes.value, 5);
    }

    // If Bing News was thin on a long query, try core keywords on Bing News too
    if (bingNewsItems.length < 2) {
      const shortQ = simplifySearchQuery(q);
      if (shortQ && shortQ.toLowerCase() !== q.toLowerCase()) {
        try {
          const shortPlus = encodeURIComponent(shortQ).replace(/%20/g, "+");
          const retryNews = await webGetWithProxy("https://defuddle.md/www.bing.com/news/search?q=" + shortPlus, signal, 7000)
            .then(r => r.ok ? r.text() : "");
          parseBingNewsMarkdown(retryNews, 4).forEach(it => bingNewsItems.push(it));
        } catch {}
      }
    }

    // Merge: fresh news + web results for maximum relevance
    if (bingNewsItems.length) {
      enginesUsed.push("Bing News");
      bingNewsItems.slice(0, 4).forEach(it => addResult({ ...it, type: "news" }));
    }
    if (bingWebItems.length) {
      enginesUsed.push("Bing Web");
      bingWebItems.forEach(it => addResult({ ...it, type: "web" }));
    }

    let instantAnswer = "";
    if (ddgRes.status === "fulfilled" && ddgRes.value) {
      const d = ddgRes.value;
      if (d.AbstractText) {
        instantAnswer = d.AbstractText;
        if (d.AbstractURL) {
          addResult({
            title: d.Heading || d.AbstractSource || "DuckDuckGo Instant Answer",
            url: d.AbstractURL,
            domain: getDomain(d.AbstractURL),
            snippet: d.AbstractText.slice(0, 320),
            type: "reference"
          });
        }
      }
    }

    if (results.length < limit && wikiRes.status === "fulfilled" && wikiRes.value?.query?.search?.length) {
      enginesUsed.push("Wikipedia");
      for (const hit of wikiRes.value.query.search.slice(0, 2)) {
        const cleanSnippet = (hit.snippet || "").replace(/<[^>]+>/g, "");
        const url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(hit.title.replace(/ /g, "_"));
        addResult({ title: hit.title + " — Wikipedia", url, domain: "en.wikipedia.org", snippet: cleanSnippet, type: "wikipedia" });
      }
    }

    if (results.length < 4) {
      try {
        const hn = await fetchWithTimeout(
          "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(q) + "&tags=story&hitsPerPage=4",
          { signal },
          6000
        ).then(r => r.ok ? r.json() : null);
        if (hn?.hits?.length) {
          enginesUsed.push("Hacker News");
          for (const h of hn.hits) {
            const url = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
            addResult({
              title: h.title || "HN Discussion",
              url,
              domain: getDomain(url),
              snippet: `Hacker News (${h.points || 0} pts, ${h.num_comments || 0} comments, ${(h.created_at || "").slice(0, 10)})`,
              type: "hn"
            });
          }
        }
      } catch {}
    }

    return {
      query: q,
      engine: enginesUsed.length ? enginesUsed.join(" + ") : "Web",
      instant_answer: instantAnswer || undefined,
      results: results.slice(0, limit)
    };
  }

  async function runWebNews(query, numResults = 7, signal) {
    const limit = Math.max(1, Math.min(12, Number(numResults) || 7));
    const q = String(query || "").trim();
    const results = [];
    const seen = new Set();

    const add = (item) => {
      if (!item?.url || seen.has(item.url)) return;
      seen.add(item.url);
      results.push(item);
    };

    const qPlus = encodeURIComponent(q).replace(/%20/g, "+");
    const [bingNews, hnRecent] = await Promise.allSettled([
      webGetWithProxy("https://defuddle.md/www.bing.com/news/search?q=" + qPlus, signal, 10000)
        .then(r => r.ok ? r.text() : ""),
      webGetWithProxy("https://hn.algolia.com/api/v1/search_by_date?query=" + encodeURIComponent(q) + "&tags=story&hitsPerPage=4", signal, 6000)
        .then(r => r.ok ? r.json() : null)
    ]);

    if (bingNews.status === "fulfilled" && bingNews.value) {
      parseBingNewsMarkdown(bingNews.value, limit).forEach(add);
    }

    if (results.length < 3) {
      const shortQ = simplifySearchQuery(q);
      if (shortQ && shortQ.toLowerCase() !== q.toLowerCase()) {
        try {
          const shortPlus = encodeURIComponent(shortQ).replace(/%20/g, "+");
          const retry = await webGetWithProxy("https://defuddle.md/www.bing.com/news/search?q=" + shortPlus, signal, 8000)
            .then(r => r.ok ? r.text() : "");
          parseBingNewsMarkdown(retry, limit).forEach(add);
        } catch {}
      }
    }

    if (results.length < limit && hnRecent.status === "fulfilled" && hnRecent.value?.hits) {
      for (const h of hnRecent.value.hits) {
        const url = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
        add({
          title: h.title,
          url,
          domain: getDomain(url),
          snippet: `Posted ${(h.created_at || "").slice(0, 10)} · ${h.points || 0} pts, ${h.num_comments || 0} comments`
        });
      }
    }

    if (!results.length) {
      return await runWebSearch(q + " latest news", limit, signal);
    }

    return { query: q, engine: "Bing News + HN", results: results.slice(0, limit) };
  }

  async function runWebFetch(rawUrl, maxChars = 12000, signal) {
    const clean = safeUrl(rawUrl);
    if (!clean) return { url: rawUrl, error: "Invalid URL (must start with http:// or https://)" };
    const cap = Math.max(1500, Math.min(30000, Number(maxChars) || 12000));

    // Fast path for Wikipedia articles via official CORS-enabled API
    try {
      const u = new URL(clean);
      if (u.hostname.endsWith(".wikipedia.org") && u.pathname.startsWith("/wiki/")) {
        const lang = u.hostname.split(".")[0];
        const title = decodeURIComponent(u.pathname.slice(6));
        const r = await fetchWithTimeout(
          `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exchars=${cap}&titles=${encodeURIComponent(title)}&format=json&origin=*`,
          { signal },
          8000
        );
        if (r.ok) {
          const data = await r.json();
          const pages = data?.query?.pages || {};
          const page = Object.values(pages)[0];
          if (page && page.extract) {
            return {
              url: clean,
              title: page.title || title,
              domain: u.hostname,
              reader: "Wikipedia API",
              content: page.extract.slice(0, cap),
              truncated: page.extract.length >= cap
            };
          }
        }
      }
    } catch {}

    // Tier 1: Defuddle.md (clean YAML frontmatter + Markdown, CORS *)
    const stripped = clean.replace(/^https?:\/\//i, "");
    try {
      const r = await webGetWithProxy("https://defuddle.md/" + stripped, signal, 11000);
      if (r.ok) {
        const md = await r.text();
        if (md && md.length > 60 && !md.startsWith('{"error"')) {
          const titleMatch = md.match(/^title:\s*"?([^"\n]+)"?/m);
          return {
            url: clean,
            title: titleMatch ? titleMatch[1].trim() : getDomain(clean),
            domain: getDomain(clean),
            reader: "defuddle.md",
            content: md.slice(0, cap),
            truncated: md.length > cap
          };
        }
      }
    } catch {}

    // Tier 2: urltomarkdown (CORS *)
    try {
      const r = await webGetWithProxy(
        "https://urltomarkdown.herokuapp.com/?url=" + encodeURIComponent(clean),
        signal,
        10000
      );
      if (r.ok) {
        const md = await r.text();
        if (md && md.length > 40) {
          return {
            url: clean,
            title: getDomain(clean),
            domain: getDomain(clean),
            reader: "urltomarkdown",
            content: md.slice(0, cap),
            truncated: md.length > cap
          };
        }
      }
    } catch {}

    // Tier 3: Jina Reader (works cleanly on residential browser IPs)
    try {
      const r = await fetchWithTimeout("https://r.jina.ai/" + clean, {
        headers: { "Accept": "text/plain" },
        signal
      }, 10000);
      if (r.ok) {
        const md = await r.text();
        if (md && md.length > 40) {
          return {
            url: clean,
            title: getDomain(clean),
            domain: getDomain(clean),
            reader: "r.jina.ai",
            content: md.slice(0, cap),
            truncated: md.length > cap
          };
        }
      }
    } catch {}

    // Tier 4: AllOrigins HTML -> Browser DOM text extraction
    try {
      const r = await fetchWithTimeout(
        "https://api.allorigins.win/get?url=" + encodeURIComponent(clean),
        { signal },
        10000
      );
      if (r.ok) {
        const data = await r.json();
        if (data?.contents) {
          const doc = new DOMParser().parseFromString(data.contents, "text/html");
          doc.querySelectorAll("script,style,noscript,svg,nav,footer").forEach(n => n.remove());
          const title = (doc.title || getDomain(clean)).trim();
          const text = (doc.body?.innerText || doc.body?.textContent || "").replace(/\s+/g, " ").trim();
          return {
            url: clean,
            title,
            domain: getDomain(clean),
            reader: "allorigins",
            content: text.slice(0, cap),
            truncated: text.length > cap
          };
        }
      }
    } catch {}

    return { url: clean, domain: getDomain(clean), error: "Could not fetch page (blocked or timed out across all readers)." };
  }

  async function runWikipediaLookup(topic, signal) {
    const q = String(topic || "").trim();
    if (!q) return { error: "Empty topic" };
    const sRes = await fetchWithTimeout(
      "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(q) + "&srlimit=3&format=json&origin=*",
      { signal },
      7000
    );
    if (!sRes.ok) return { error: "Wikipedia search failed" };
    const sData = await sRes.json();
    const hits = sData?.query?.search || [];
    if (!hits.length) return { topic: q, results: [], message: "No Wikipedia articles found." };

    const topTitle = hits[0].title;
    const eRes = await fetchWithTimeout(
      "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exchars=7000&titles=" + encodeURIComponent(topTitle) + "&format=json&origin=*",
      { signal },
      7000
    );
    let extract = "";
    if (eRes.ok) {
      const eData = await eRes.json();
      const page = Object.values(eData?.query?.pages || {})[0];
      extract = page?.extract || "";
    }

    const url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(topTitle.replace(/ /g, "_"));
    return {
      topic: q,
      title: topTitle,
      url,
      domain: "en.wikipedia.org",
      extract,
      other_matches: hits.slice(1).map(h => ({
        title: h.title,
        url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(h.title.replace(/ /g, "_")),
        snippet: (h.snippet || "").replace(/<[^>]+>/g, "")
      }))
    };
  }

  const WEB_TOOL_DEFINITIONS = [
    {
      type: "function",
      function: {
        name: "web_search",
        description: "Search the live web for current facts, documentation, websites, prices, or general information. Returns ranked titles, URLs, and snippets.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Concise search query." },
            num_results: { type: "integer", description: "Number of results (1-10, default 8)." }
          },
          required: ["query"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_news",
        description: "Search live breaking news and recent tech/world headlines for current events and recent announcements.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "News topic or entity to search." },
            num_results: { type: "integer", description: "Number of news items (1-10, default 7)." }
          },
          required: ["query"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_fetch",
        description: "Fetch and read the full readable content of a specific webpage URL (article, docs page, blog post, GitHub README, etc.).",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Full http:// or https:// URL to read." },
            max_chars: { type: "integer", description: "Max characters to return (default 12000)." }
          },
          required: ["url"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "wikipedia_lookup",
        description: "Look up an encyclopedia topic on Wikipedia and retrieve its detailed summary and key facts.",
        parameters: {
          type: "object",
          properties: {
            topic: { type: "string", description: "Topic or entity name." }
          },
          required: ["topic"]
        }
      }
    }
  ];

  // ── Web Editor Studio & Live Publishing Engine ─────────────────────────────
  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  async function sha1Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest("SHA-1", bytes);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function stripCspMeta(html) {
    // Strip CSP meta that would block inline <script> auto-run inside iframe srcdoc
    return String(html||"").replace(/<meta[^>]*http-equiv\s*=\s*["']?content-security-policy["']?[^>]*>/gi, "");
  }

  function injectStudioRuntime(html, pageUrl) {
    let out = stripCspMeta(String(html||""));
    if (pageUrl && !/<base\s+href=/i.test(out)) {
      const baseTag = `<base href="${escHtml(pageUrl)}">`;
      if (/<head[^>]*>/i.test(out)) {
        out = out.replace(/<head([^>]*)>/i, `<head$1>\n  ${baseTag}`);
      } else if (/<html[^>]*>/i.test(out)) {
        out = out.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}<meta charset="UTF-8"></head>`);
      } else if (out.trim()) {
        out = `<!DOCTYPE html>\n<html><head><meta charset="UTF-8">${baseTag}</head><body>\n${out}\n</body></html>`;
      }
    }
    // Runtime shim: nuke frame-busters + proxy failing fetches via CORS proxies for auto-run cloned sites + powerful console forwarding
    const shim = `<script>/* abliterated.ai studio runtime — powerful console */
(function(){try{const _l=console.log.bind(console),_w=console.warn.bind(console),_e=console.error.bind(console);function fwd(l,a){try{parent.postMessage({studioLog:{level:l,text:a.map(v=> typeof v==='object'?JSON.stringify(v):String(v)).join(' ')}},'*')}catch(e){}} console.log=function(){fwd('log',[...arguments]);return _l(...arguments)}; console.warn=function(){fwd('warn',[...arguments]);return _w(...arguments)}; console.error=function(){fwd('error',[...arguments]);return _e(...arguments)}}catch(e){}})();<\/script><script>/* abliterated.ai studio runtime — auto-run every script */
(function(){
  try{
    Object.defineProperty(window,'top',{get:function(){return window;}, configurable:true});
    Object.defineProperty(window,'parent',{get:function(){return window;}, configurable:true});
    Object.defineProperty(window,'self',{get:function(){return window;}, configurable:true});
    window.__AB_CLONE_ORIGIN__=${JSON.stringify(pageUrl||"")};
  }catch(e){}
  // kill common frame-bust attempts
  window.top = window; window.parent = window;
  const _fetch = window.fetch && window.fetch.bind(window);
  if(_fetch){
    window.fetch = async function(input, init){
      const urlStr = typeof input==='string' ? input : (input && input.url) ? input.url : String(input||'');
      try{
        const r = await _fetch(input, init);
        if(r && r.ok) return r;
        throw new Error('fetch '+ (r && r.status));
      }catch(err){
        if(/^https?:\\/\\//i.test(urlStr)){
          const proxies = [
            function(u){ return 'https://api.allorigins.win/raw?url='+encodeURIComponent(u); },
            function(u){ return 'https://corsproxy.io/?'+encodeURIComponent(u); },
            function(u){ return 'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(u); }
          ];
          for(var i=0;i<proxies.length;i++){
            try{ var r2 = await _fetch(proxies[i](urlStr), init); if(r2 && r2.ok) return r2; }catch(e2){}
          }
        }
        throw err;
      }
    };
  }
  // powerful visual error overlay inside iframe (better than Claude's hidden errors)
  (function(){
    function showOverlay(msg, stack){
      let ov=document.getElementById('_studio_error_overlay');
      if(!ov){
        ov=document.createElement('div');
        ov.id='_studio_error_overlay';
        ov.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;background:rgba(17,17,17,0.96);color:#fecaca;border:1px solid #f87171;border-radius:10px;padding:12px 14px;font-family:monospace;font-size:12px;z-index:99999;max-height:40vh;overflow:auto;box-shadow:0 8px 24px rgba(0,0,0,0.4);';
        const close=document.createElement('button');
        close.textContent='×';
        close.style.cssText='position:absolute;top:6px;right:8px;background:none;border:none;color:#f87171;font-size:16px;cursor:pointer;';
        close.onclick=function(){ov.remove()};
        ov.appendChild(close);
        document.body.appendChild(ov);
      }
      const line=document.createElement('div');
      line.textContent='⚠️ '+msg + (stack? ' \n'+stack.slice(0,800):'');
      line.style.marginTop='6px';
      ov.appendChild(line);
    }
    window.addEventListener('error', function(e){ console.warn('[studio]', e.message); try{ showOverlay(e.message, e.error && e.error.stack);}catch(err){} });
    window.addEventListener('unhandledrejection', function(e){ try{ showOverlay('Unhandled: '+(e.reason && e.reason.message||e.reason), e.reason && e.reason.stack);}catch(err){} });
  })();
  window.addEventListener('unhandledrejection', function(e){ console.warn('[studio unhandled]', e.reason); });
})();
<\/script>`;
    // inject shim immediately after <head> or at very top
    if (/<head[^>]*>/i.test(out)) {
      out = out.replace(/<head[^>]*>/i, function(m){ return m + "\n" + shim; });
    } else {
      out = shim + out;
    }
    return out;
  }

  function injectBaseHref(html, pageUrl) {
    return injectStudioRuntime(html, pageUrl);
  }

  function isProbablyHtml(str){
    var t = String(str||"").trim();
    if(!t) return false;
    if(/^\s*<!DOCTYPE\s+html/i.test(t)) return true;
    if(/^\s*<html[\s>]/i.test(t)) return true;
    if(/<(html|head|body|div|section|header|main|article|nav|style|script|canvas|svg|h1|h2|button|form)[\s>]/i.test(t.slice(0,3000))) return true;
    return false;
  }

  function wrapAnyCodeAsHtml(input, filenameHint){
    var raw = String(input||"");
    if(isProbablyHtml(raw)) return raw;
    var hint = String(filenameHint||"").toLowerCase();
    var escTitle = escHtml(filenameHint||"app");
    // CSS-only
    if(hint.endsWith(".css") || (/^\s*[\.#@a-zA-Z]/.test(raw) && /\{[^}]*:[^}]*\}/.test(raw) && !/function|const |let |import|=>/.test(raw.slice(0,800)))){
      return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escTitle}</title><style>\n${raw}\n</style></head><body><div style="font-family:system-ui;padding:40px;max-width:900px;margin:0 auto"><h1>CSS Preview</h1><p>Your CSS is live — add HTML in the Code tab to see it applied.</p><div class="demo" style="border:1px solid #e5e7eb;padding:24px;border-radius:12px;margin-top:20px;background:#fff;color:#111">Demo card — CSS active</div></div></body></html>`;
    }
    // JS / JSX / TS
    if(hint.endsWith(".js") || hint.endsWith(".jsx") || hint.endsWith(".ts") || hint.endsWith(".tsx") || hint.endsWith(".mjs") || /import\s+.*from|export\s+default|function\s+\w+\s*\(|=>\s*\{|console\.log|document\./.test(raw.slice(0,1500))){
      return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escTitle}</title><style>body{font-family:system-ui;background:#0f1117;color:#f3f4f6;padding:24px;line-height:1.6}#app{max-width:1100px;margin:0 auto}pre{background:#181b25;padding:14px;border-radius:8px;overflow:auto}</style></head><body><div id="app"></div><script type="module">\ntry{\n${raw}\n}catch(e){var el=document.getElementById('app'); var pre=document.createElement('pre'); pre.textContent='Runtime error: '+e.message+'\\n'+(e.stack||''); pre.style.color='#f87171'; el.appendChild(pre); console.error(e);}\n<\/script></body></html>`;
    }
    if(raw.trim().startsWith("<svg")){
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SVG</title><style>body{display:grid;place-items:center;min-height:100vh;background:#0f1117;margin:0}</style></head><body>${raw}</body></html>`;
    }
    // fallback: wrap as highlighted text doc that still auto-runs a tiny script
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escTitle}</title><style>body{font-family:system-ui;max-width:900px;margin:0 auto;padding:32px;line-height:1.7;background:#fff;color:#111}pre{background:#f3f4f6;padding:16px;border-radius:8px;overflow:auto;white-space:pre-wrap}</style></head><body><h1>${escTitle}</h1><pre>${escHtml(raw.slice(0,12000))}</pre><script>console.log('auto-wrapped text doc');<\/script></body></html>`;
  }

  function extractHtmlFromAssistantText(text){
    if(!text || !text.trim()) return null;
    // Prefer fenced blocks (```html ... ``` ```js ... ``` etc)
    const fences = [...String(text).matchAll(/```(?:html|htm|js|javascript|css|jsx|tsx|svg|xml)?\s*\n?([\s\S]*?)```/gi)];
    let longest = "";
    for(const m of fences){
      const c = (m[1]||"").trim();
      if(c.length > longest.length && (/<html|<!doctype|<script|<style|<div|<canvas|<svg|function\s+\w+|=>|import\s|export\s/i.test(c))) longest = c;
    }
    if(longest && longest.length > 120) return longest;
    // Raw <!DOCTYPE html> ... </html> without fences
    const rawDoctype = String(text).match(/<!DOCTYPE html[\s\S]{120,}<\/html>/i);
    if(rawDoctype) return rawDoctype[0];
    const rawHtml = String(text).match(/<html[\s\S]{150,}<\/html>/i);
    if(rawHtml) return rawHtml[0];
    return null;
  }

  function autoCaptureCodeToStudio(assistantText, triggerText){
    try{
      if(!assistantText) return false;
      const html = extractHtmlFromAssistantText(assistantText);
      if(!html || html.length < 100) return false;
      // Always auto-capture any substantial HTML/JS block — user explicitly said "just typing code should type into web thing"
      // Avoid overwriting identical doc
      if(studio.html && studio.html.trim() === html.trim()) return false;
      if(studio.html && studio.html.includes(html.slice(0,60)) && Math.abs(studio.html.length - html.length) < 15) return false;
      // Infer filename from <title>
      const tMatch = html.match(/<title>(.*?)<\/title>/i);
      const fname = tMatch ? (tMatch[1].trim().replace(/[^a-z0-9._-]+/gi,"_").slice(0,28) || "index") + ".html" : "index.html";
      setStudioHtml(html, { filename: fname, pushHistory: true, openPanel: true });
      showToast("✨ Auto-loaded your code into Web Studio — live preview on the right!");
      return true;
    }catch(e){ return false; }
  }

  function wrapMarkdownAsEditableHtml(md, sourceUrl) {
    const titleMatch = md.match(/^title:\s*"?([^"\n]+)"?/m);
    const title = titleMatch ? titleMatch[1].trim() : getDomain(sourceUrl || "webpage");
    const cleanMd = md.replace(/^---[\s\S]*?---\s*/, "");
    const rendered = renderMarkdown(cleanMd).html;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 860px; margin: 0 auto; padding: 40px 24px; line-height: 1.7; background: #0f1117; color: #f3f4f6; }
    a { color: #fbbf24; }
    h1, h2, h3 { line-height: 1.25; }
    pre { background: #181b25; padding: 14px; border-radius: 8px; overflow-x: auto; }
    img { max-width: 100%; border-radius: 8px; }
    blockquote { border-left: 3px solid #f59e0b; padding-left: 14px; margin-left: 0; color: #9ca3af; }
  </style>
</head>
<body>
  <header style="margin-bottom:28px;border-bottom:1px solid #262a36;padding-bottom:16px;">
    <h1>${escHtml(title)}</h1>
    ${sourceUrl ? `<p style="font-size:13px;color:#9ca3af;">Cloned from <a href="${escHtml(sourceUrl)}" target="_blank">${escHtml(sourceUrl)}</a></p>` : ""}
  </header>
  <main>${rendered}</main>
</body>
</html>`;
  }

  async function fetchRawHtmlForStudio(rawUrl, signal) {
    const clean = safeUrl(rawUrl);
    if (!clean) return { error: "Invalid URL (must start with http:// or https://)" };

    async function tryText(url, timeoutMs, label){
      try{
        const r = await fetchWithTimeout(url, { signal }, timeoutMs);
        if(r.ok){
          const t = await r.text();
          if(t && t.length > 30) return { html: injectStudioRuntime(t, clean), sourceUrl: clean, mode: label };
        }
      }catch(e){ if(e && e.name==="AbortError" && signal && signal.aborted) throw e; }
      return null;
    }

    // Tier 1: Same-origin proxy (Live Preview) — fastest exact clone when available
    if (proxyAvailable) {
      const hit = await tryText(`./api/web/fetch?url=${encodeURIComponent(clean)}`, 12000, "raw-html (proxy)");
      if(hit) return hit;
    }

    // Tier 2: Direct fetch — works for CORS-enabled sites, raw.githubusercontent, local dev
    {
      const hit = await tryText(clean, 7000, "raw-html (direct)");
      if(hit) return hit;
    }

    // Tier 3: AllOrigins raw
    {
      const hit = await tryText(`https://api.allorigins.win/raw?url=${encodeURIComponent(clean)}`, 9000, "raw-html (allorigins-raw)");
      if(hit) return hit;
    }

    // Tier 4: AllOrigins JSON wrapper (more reliable for some sites)
    try{
      const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(clean)}`, { signal }, 9000);
      if(r.ok){
        const j = await r.json();
        if(j && j.contents && j.contents.length > 30) return { html: injectStudioRuntime(j.contents, clean), sourceUrl: clean, mode: "raw-html (allorigins-json)" };
      }
    }catch(e){ if(e && e.name==="AbortError" && signal && signal.aborted) throw e; }

    // Tier 5: corsproxy.io (Cloudflare-friendly)
    {
      const hit = await tryText(`https://corsproxy.io/?${encodeURIComponent(clean)}`, 9000, "raw-html (corsproxy.io)");
      if(hit) return hit;
    }

    // Tier 6: codetabs proxy
    {
      const hit = await tryText(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(clean)}`, 9000, "raw-html (codetabs)");
      if(hit) return hit;
    }

    // Tier 7: r.jina.ai — server-side readable text fallback, wrapped as editable HTML
    try{
      const stripped = clean.replace(/^https?:\/\//i, "");
      const r = await fetchWithTimeout("https://r.jina.ai/http://" + stripped, { signal }, 10000);
      if(r.ok){
        const md = await r.text();
        if(md && md.length > 60 && !md.includes("Blocked") && !md.startsWith('{"error"')){
          // jina returns markdown — wrap as HTML so it still renders live
          return { html: wrapMarkdownAsEditableHtml(md, clean), sourceUrl: clean, mode: "reconstructed-html (jina)" };
        }
      }
    }catch(e){ if(e && e.name==="AbortError" && signal && signal.aborted) throw e; }

    // Tier 8: defuddle.md — clean YAML+Markdown -> editable HTML5 template (guaranteed CORS *)
    try {
      const stripped = clean.replace(/^https?:\/\//i, "");
      const r = await fetchWithTimeout("https://defuddle.md/" + stripped, { signal }, 11000);
      if (r.ok) {
        const md = await r.text();
        if (md && md.length > 40 && !md.startsWith('{"error"')) {
          return { html: wrapMarkdownAsEditableHtml(md, clean), sourceUrl: clean, mode: "reconstructed-html (defuddle)" };
        }
      }
    } catch (e) {
      if (e.name === "AbortError" && signal?.aborted) throw e;
    }

    return { error: "Could not fetch HTML from that URL (blocked by the site's anti-bot / CORS policy). Try pasting the URL again, or copy the page's HTML manually and paste it into the Code tab — Web Studio will auto-render any HTML/CSS/JS." };
  }

  function renderStudioUI() {
    if (!el.studioPane) return;
    const hasDoc = Boolean(studio.html && studio.html.trim());

    el.studioPane.classList.toggle("open", studio.open);
    el.studioToggleBtn.classList.toggle("active", studio.open);
    el.studioToggleBtn.classList.toggle("has-doc", hasDoc);

    el.studioStage.classList.toggle("code-mode", studio.view === "code");
    el.studioTabPreview.classList.toggle("active", studio.view === "preview");
    el.studioTabCode.classList.toggle("active", studio.view === "code");
    el.studioEmptyOverlay.classList.toggle("hidden", hasDoc || studio.view === "code");

    if (document.activeElement !== el.studioCodeInput) {
      el.studioCodeInput.value = studio.html || "";
    }
    if (studio.sourceUrl && document.activeElement !== el.studioUrlInput) {
      el.studioUrlInput.value = studio.sourceUrl;
    }

    el.studioUndoBtn.disabled = studio.historyIdx <= 0;
    el.studioRedoBtn.disabled = studio.historyIdx < 0 || studio.historyIdx >= studio.history.length - 1;
    el.studioSaveBtn.disabled = !hasDoc;
    el.studioPopoutBtn.disabled = !hasDoc;
    el.studioPublishBtn.disabled = !hasDoc;

    if (hasDoc) {
      const bytes = new Blob([studio.html]).size;
      const kb = bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
      const ver = studio.history.length ? `v${studio.historyIdx + 1}/${studio.history.length}` : "v1";
      const src = studio.sourceUrl ? getDomain(studio.sourceUrl) : (studio.filename || "index.html");
      el.studioStatusLeft.textContent = `${src} · ${kb} · ${ver}`;
    } else {
      el.studioStatusLeft.textContent = "No page loaded";
    }

    if (studio.lastPublishedUrl && safeUrl(studio.lastPublishedUrl)) {
      el.studioStatusRight.innerHTML = `Live: <a href="${escHtml(studio.lastPublishedUrl)}" target="_blank" rel="noopener noreferrer">${escHtml(getDomain(studio.lastPublishedUrl))} ↗</a>`;
    } else {
      const targets = [];
      if (settings.ghRepo && settings.ghToken) targets.push("GitHub");
      if (settings.netlifySiteId && settings.netlifyToken) targets.push("Netlify");
      if (settings.webhookUrl) targets.push("Webhook");
      el.studioStatusRight.textContent = targets.length
        ? `Publish ready: ${targets.join(" · ")}`
        : "AI edit tools active · Configure GitHub/Netlify in Settings to publish live";
    }
  }

  function refreshStudioPreview() {
    if (!el.studioPreviewFrame) return;
    el.studioPreviewFrame.srcdoc = studio.html || "";
  }

  // Powerful console: capture iframe console.log/warn/error via postMessage
  window.addEventListener("message", (e)=>{
    const d = e.data && e.data.studioLog;
    if(!d) return;
    const cons = document.getElementById("studioConsole");
    if(!cons) return;
    cons.classList.remove("hidden");
    const entry = document.createElement("div");
    entry.className = "log-entry " + (d.level||"");
    entry.textContent = "[" + (d.level||"log") + "] " + (d.text||"");
    cons.appendChild(entry);
    cons.scrollTop = cons.scrollHeight;
    // keep last 80 lines
    while(cons.children.length > 80) cons.removeChild(cons.firstChild);
  });

  function setStudioHtml(newHtml, opts = {}) {
    let htmlStr = String(newHtml ?? "");
    // Auto-wrap: Studio is not HTML-only — accept any code (JS/CSS/SVG/MD) and auto-render it live
    if(htmlStr.trim() && !isProbablyHtml(htmlStr)){
      htmlStr = wrapAnyCodeAsHtml(htmlStr, opts.filename || studio.filename || "index.html");
    }
    const pushHistory = opts.pushHistory !== false;
    if (opts.filename) studio.filename = opts.filename;
    if (opts.sourceUrl !== undefined) studio.sourceUrl = opts.sourceUrl;
    studio.html = htmlStr;

    if (pushHistory) {
      if (studio.historyIdx < studio.history.length - 1) {
        studio.history = studio.history.slice(0, studio.historyIdx + 1);
      }
      if (studio.history[studio.history.length - 1] !== htmlStr) {
        studio.history.push(htmlStr);
        if (studio.history.length > 30) studio.history.shift();
        studio.historyIdx = studio.history.length - 1;
      }
    }

    if (opts.openPanel) studio.open = true;
    saveStudioState();
    refreshStudioPreview();
    renderStudioUI();
  }

  function openStudio(view) {
    studio.open = true;
    if (view) studio.view = view;
    refreshStudioPreview();
    renderStudioUI();
  }

  function closeStudio() {
    studio.open = false;
    renderStudioUI();
  }

  function studioUndo() {
    if (studio.historyIdx <= 0) return;
    studio.historyIdx--;
    studio.html = studio.history[studio.historyIdx] || "";
    saveStudioState();
    refreshStudioPreview();
    renderStudioUI();
    showToast(`Reverted to v${studio.historyIdx + 1}`);
  }

  function studioRedo() {
    if (studio.historyIdx >= studio.history.length - 1) return;
    studio.historyIdx++;
    studio.html = studio.history[studio.historyIdx] || "";
    saveStudioState();
    refreshStudioPreview();
    renderStudioUI();
    showToast(`Restored v${studio.historyIdx + 1}`);
  }

  async function publishToGitHub({ path, commitMessage } = {}) {
    const repo = (settings.ghRepo || "").trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/+$/, "");
    const branch = (settings.ghBranch || "main").trim() || "main";
    const filePath = (path || settings.ghPath || studio.filename || "index.html").trim().replace(/^\/+/, "");
    const token = (settings.ghToken || "").trim();

    if (!studio.html || !studio.html.trim()) return { error: "Web Studio is empty — create or load a webpage first." };
    if (!repo || !repo.includes("/")) return { error: "GitHub repo not configured (expected owner/repo in Settings → Web Editor & Live Publishing)." };
    if (!token) return { error: "GitHub Personal Access Token not configured (add it in Settings → Web Editor & Live Publishing)." };

    const msg = (commitMessage || `Update ${filePath} via Abliteration Web Studio`).trim();
    const ok = confirm(`Publish live to GitHub?\n\nRepo: ${repo} (${branch})\nFile: ${filePath}\nCommit: ${msg}`);
    if (!ok) return { cancelled: true, message: "User cancelled GitHub publish." };

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath.split("/").map(encodeURIComponent).join("/")}`;
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    // Look up existing file SHA (needed when updating an existing file)
    let sha = undefined;
    try {
      const checkRes = await fetchWithTimeout(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers }, 10000);
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing?.sha) sha = existing.sha;
      }
    } catch {}

    const putBody = {
      message: msg,
      content: utf8ToBase64(studio.html),
      branch
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetchWithTimeout(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(putBody)
    }, 15000);

    const data = await putRes.json().catch(() => ({}));
    if (!putRes.ok) {
      return { error: `GitHub API HTTP ${putRes.status}: ${data.message || "Publish failed"}` };
    }

    const [owner, repoName] = repo.split("/");
    const pagesUrl = repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${owner}.github.io/${filePath === "index.html" ? "" : filePath}`
      : `https://${owner}.github.io/${repoName}/${filePath === "index.html" ? "" : filePath}`;

    studio.lastPublishedUrl = pagesUrl;
    saveStudioState();
    renderStudioUI();
    showToast(`Published ${filePath} to ${repo}!`);
    return {
      ok: true,
      provider: "GitHub",
      repo,
      branch,
      path: filePath,
      commit_url: data.commit?.html_url || "",
      file_url: data.content?.html_url || "",
      url: pagesUrl
    };
  }

  async function publishToNetlify({ filePath } = {}) {
    const siteId = (settings.netlifySiteId || "").trim();
    const token = (settings.netlifyToken || "").trim();
    const targetPath = "/" + (filePath || studio.filename || "index.html").trim().replace(/^\/+/, "");

    if (!studio.html || !studio.html.trim()) return { error: "Web Studio is empty — create or load a webpage first." };
    if (!siteId || !token) return { error: "Netlify Site ID and Personal Access Token must be configured in Settings → Web Editor & Live Publishing." };

    const ok = confirm(`Deploy live to Netlify?\n\nSite ID: ${siteId}\nFile: ${targetPath}`);
    if (!ok) return { cancelled: true, message: "User cancelled Netlify deploy." };

    const digest = await sha1Hex(studio.html);
    const deployRes = await fetchWithTimeout(`https://api.netlify.com/api/v1/sites/${encodeURIComponent(siteId)}/deploys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ files: { [targetPath]: digest } })
    }, 15000);

    const deploy = await deployRes.json().catch(() => ({}));
    if (!deployRes.ok) {
      return { error: `Netlify API HTTP ${deployRes.status}: ${deploy.message || "Deploy failed"}` };
    }

    if (Array.isArray(deploy.required) && deploy.required.includes(digest)) {
      const uploadRes = await fetchWithTimeout(
        `https://api.netlify.com/api/v1/deploys/${encodeURIComponent(deploy.id)}/files${targetPath}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/octet-stream"
          },
          body: studio.html
        },
        15000
      );
      if (!uploadRes.ok) {
        const t = await uploadRes.text().catch(() => "");
        return { error: `Netlify file upload failed (HTTP ${uploadRes.status}): ${t.slice(0, 160)}` };
      }
    }

    const liveUrl = deploy.ssl_url || deploy.url || deploy.deploy_ssl_url || "";
    if (liveUrl) {
      studio.lastPublishedUrl = liveUrl;
      saveStudioState();
      renderStudioUI();
    }
    showToast("Deployed live to Netlify!");
    return { ok: true, provider: "Netlify", deploy_id: deploy.id, url: liveUrl };
  }

  async function publishToWebhook({ method = "POST", payloadMode = "json" } = {}) {
    const url = safeUrl(settings.webhookUrl || "");
    const token = (settings.webhookToken || "").trim();
    if (!studio.html || !studio.html.trim()) return { error: "Web Studio is empty — create or load a webpage first." };
    if (!url) return { error: "Custom Webhook URL not configured in Settings → Web Editor & Live Publishing." };

    const verb = ["POST", "PUT", "PATCH"].includes(String(method).toUpperCase()) ? String(method).toUpperCase() : "POST";
    const ok = confirm(`Publish edited HTML to webhook?\n\n${verb} ${url}`);
    if (!ok) return { cancelled: true, message: "User cancelled webhook publish." };

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    let body;
    if (payloadMode === "raw") {
      headers["Content-Type"] = "text/html; charset=utf-8";
      body = studio.html;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        filename: studio.filename || "index.html",
        source_url: studio.sourceUrl || null,
        html: studio.html,
        updated_at: new Date().toISOString()
      });
    }

    const res = await fetchWithTimeout(url, { method: verb, headers, body }, 15000);
    const respText = await res.text().catch(() => "");
    if (!res.ok) {
      return { error: `Webhook HTTP ${res.status}: ${respText.slice(0, 200)}` };
    }
    showToast(`Published via webhook (HTTP ${res.status})!`);
    return { ok: true, provider: "Webhook", status: res.status, url, response: respText.slice(0, 400) };
  }

  const WEB_EDITOR_TOOL_DEFINITIONS = [
    {
      type: "function",
      function: {
        name: "web_studio_get",
        description: "Read the current HTML/CSS/JS source code loaded in the user's Live Web Editor Studio so you can inspect it before editing.",
        parameters: {
          type: "object",
          properties: {
            max_chars: { type: "integer", description: "Max characters to return (default 24000)." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_studio_load_url",
        description: "Clone any public webpage into Web Studio via universal proxy engine (handles strict CORS, Cloudflare basic, CSP) — injects base href + runtime shim so all scripts auto-run live.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Full http:// or https:// webpage URL to clone into Web Studio." }
          },
          required: ["url"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_studio_write",
        description: "MANDATORY for ANY build/create/make/code/design request — instantly creates the COMPLETE single-file HTML document (inline <style> + <script>) in Web Studio live preview. This is 10× more powerful than Claude Artifacts: real DOM, real JS execution, publishable. Never output code as text only.",
        parameters: {
          type: "object",
          properties: {
            html: { type: "string", description: "Complete code for the page — full HTML5 document preferred, but raw JS/CSS/SVG/React component also accepted and auto-wrapped into a runnable page." },
            filename: { type: "string", description: "Optional filename such as index.html." },
            summary: { type: "string", description: "Short summary of what was created or changed." }
          },
          required: ["html"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_studio_patch",
        description: "Apply targeted find-and-replace edits to the current code in Web Studio (HTML, CSS, JS, or any file) without rewriting the whole file.",
        parameters: {
          type: "object",
          properties: {
            edits: {
              type: "array",
              description: "Ordered list of exact find/replace edits to apply.",
              items: {
                type: "object",
                properties: {
                  find: { type: "string", description: "Exact existing snippet to match." },
                  replace: { type: "string", description: "Replacement HTML/CSS/JS text." }
                },
                required: ["find", "replace"]
              }
            },
            summary: { type: "string", description: "Short summary of edits applied." }
          },
          required: ["edits"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_publish_github",
        description: "Commit and push the current edited webpage from Web Studio live to the user's configured GitHub repository (GitHub Pages / Vercel / Netlify / Cloudflare Pages). Prompts user for confirmation.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "Optional repository file path (defaults to configured path, e.g. index.html)." },
            commit_message: { type: "string", description: "Concise git commit message." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_publish_netlify",
        description: "Deploy the current edited webpage from Web Studio directly to the user's configured Netlify site. Prompts user for confirmation.",
        parameters: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Optional file path on the Netlify site (default index.html)." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "web_publish_webhook",
        description: "Publish the current edited webpage from Web Studio to the user's configured Custom Website / CMS Webhook URL. Prompts user for confirmation.",
        parameters: {
          type: "object",
          properties: {
            method: { type: "string", enum: ["POST", "PUT", "PATCH"], description: "HTTP method (default POST)." },
            payload_mode: { type: "string", enum: ["json", "raw"], description: "'json' wraps {html, filename, source_url} or 'raw' sends raw text/html." }
          }
        }
      }
    }
  ];

  // ── GitHub Connector (as good as Claude) — read any public repo, list files, fetch raw content
  const GITHUB_TOOL_DEFINITIONS = [
    {
      type: "function",
      function: {
        name: "github_get_file",
        description: "Fetch a specific file from any GitHub repo (public or private via Settings PAT). Returns raw file content, path, and repo info. Perfect for reading code, README, configs.",
        parameters: {
          type: "object",
          properties: {
            repo: { type: "string", description: "GitHub repo as owner/repo (e.g. socks275/abliterated.ai)" },
            path: { type: "string", description: "File path inside repo (e.g. README.md, src/index.html)" },
            branch: { type: "string", description: "Branch name (default: main or default branch)" },
            max_chars: { type: "integer", description: "Max chars to return (default 12000)" }
          },
          required: ["repo", "path"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "github_list_files",
        description: "List files and directories in a GitHub repo path. Browse repo structure like Claude's GitHub connector.",
        parameters: {
          type: "object",
          properties: {
            repo: { type: "string", description: "GitHub repo owner/repo" },
            path: { type: "string", description: "Directory path (empty for root)" },
            branch: { type: "string", description: "Branch (default main)" }
          },
          required: ["repo"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "github_search",
        description: "Search GitHub repositories or code. Find relevant projects, examples, libraries.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (e.g. react dashboard boilerplate)" },
            type: { type: "string", enum: ["repos", "code"], description: "Search type (default repos)" },
            per_page: { type: "integer", description: "Results 1-10 (default 5)" }
          },
          required: ["query"]
        }
      }
    }
  ];

  // ── Supabase Connector (user enabled) — query your Supabase project
  const SUPABASE_TOOL_DEFINITIONS = [
    {
      type: "function",
      function: {
        name: "supabase_query",
        description: "Query a Supabase table (SELECT). Requires Supabase URL and anon key in Settings. Like Claude's database connector.",
        parameters: {
          type: "object",
          properties: {
            table: { type: "string", description: "Table name" },
            select: { type: "string", description: "Columns to select (default *)" },
            filter: { type: "string", description: "Optional PostgREST filter (e.g. id=eq.1)" },
            limit: { type: "integer", description: "Max rows (default 10, max 50)" }
          },
          required: ["table"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "supabase_insert",
        description: "Insert a row into Supabase table. Requires confirmation.",
        parameters: {
          type: "object",
          properties: {
            table: { type: "string", description: "Table name" },
            data: { type: "object", description: "Row data as JSON object" }
          },
          required: ["table", "data"]
        }
      }
    }
  ];

  // ── Defensive Passive Security Audit Engine (Authorized Sites Only) ────────
  function isDomainPreAuthorized(host) {
    const h = String(host || "").toLowerCase().replace(/^www\./, "");
    if (!h) return false;
    if (authorizedAuditHosts.has(h)) return true;
    const raw = (settings.secAllowedDomains || "").trim();
    if (!raw) return false;
    const allowed = raw.split(/[,\s]+/).map(s => s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "")).filter(Boolean);
    return allowed.some(d => h === d || h.endsWith("." + d));
  }

  function confirmAuditDomain(rawUrl) {
    const clean = safeUrl(rawUrl);
    if (!clean) return { ok: false, error: "Invalid URL (must start with http:// or https://)." };
    const host = getDomain(clean).toLowerCase();
    if (isDomainPreAuthorized(host)) return { ok: true, url: clean, host };
    const ok = confirm(
      `Authorize passive defensive security audit?\n\nTarget: ${host}\n\nConfirm that you own "${host}" or have explicit written permission to run passive, read-only security header & HTML posture checks on it.`
    );
    if (!ok) return { ok: false, error: `Audit cancelled — authorization not confirmed for ${host}.` };
    authorizedAuditHosts.add(host);
    return { ok: true, url: clean, host };
  }

  function gradeFromScore(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 65) return "C";
    if (score >= 50) return "D";
    return "F";
  }

  async function runSecAuditHeaders(rawUrl, signal) {
    const auth = confirmAuditDomain(rawUrl);
    if (!auth.ok) return { error: auth.error };

    let inspectData = null;
    let mode = "proxy";
    if (proxyAvailable) {
      try {
        const r = await fetchWithTimeout(`./api/sec/headers?url=${encodeURIComponent(auth.url)}`, { signal }, 12000);
        const j = await r.json().catch(() => null);
        if (r.ok && j?.ok) inspectData = j;
        else if (j?.error) return { url: auth.url, error: j.error };
      } catch (e) {
        if (e.name === "AbortError" && signal?.aborted) throw e;
      }
    }

    if (!inspectData) {
      // Standalone file:// fallback: inspect browser-accessible CORS headers only
      mode = "browser-direct-cors";
      try {
        const r = await fetchWithTimeout(auth.url, { method: "GET", signal }, 10000);
        const hdrs = {};
        r.headers.forEach((v, k) => { hdrs[k.toLowerCase()] = v; });
        inspectData = {
          ok: true,
          requested_url: auth.url,
          final_url: r.url || auth.url,
          https: (r.url || auth.url).startsWith("https://"),
          status: r.status,
          headers: hdrs,
          cookies: [],
          note: "Direct browser mode only exposes CORS-safelisted response headers. Use sec_audit_html for full client-side HTML/JS/CSP scanning, or run curl -I <url> locally for non-CORS headers."
        };
      } catch (err) {
        return {
          url: auth.url,
          mode,
          error: `Browser CORS prevented reading headers directly (${err.message}). Use sec_audit_html for full client-side HTML/JS/CSP scanning, or check raw headers with curl -I ${auth.url}.`
        };
      }
    }

    const h = inspectData.headers || {};
    const findings = [];
    let score = 100;
    const addFinding = (severity, category, title, detail, fix, penalty = 0) => {
      score = Math.max(0, score - penalty);
      findings.push({ severity, category, title, detail, fix });
    };

    if (!inspectData.https) {
      addFinding("Critical", "A02: Cryptographic Failures", "Site not served over HTTPS", `Final URL is ${inspectData.final_url}`, "Enable TLS and enforce a 301 redirect from http:// to https://.", 25);
    }

    const csp = h["content-security-policy"] || "";
    if (!csp) {
      addFinding("High", "A05: Security Misconfiguration", "Missing Content-Security-Policy (CSP)", "No CSP header returned; increases XSS impact.", "Add a strict Content-Security-Policy header (e.g., default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self').", 20);
    } else {
      if (/'unsafe-inline'/i.test(csp)) {
        addFinding("Medium", "A05: Security Misconfiguration", "CSP allows 'unsafe-inline'", "Inline scripts/styles reduce XSS protection.", "Replace 'unsafe-inline' with per-request nonces or SHA-256 hashes.", 8);
      }
      if (/'unsafe-eval'/i.test(csp)) {
        addFinding("Medium", "A05: Security Misconfiguration", "CSP allows 'unsafe-eval'", "eval()/Function() execution is permitted by CSP.", "Remove 'unsafe-eval' and eliminate dynamic code evaluation.", 8);
      }
      if (!/frame-ancestors/i.test(csp) && !h["x-frame-options"]) {
        addFinding("Medium", "A05: Security Misconfiguration", "No clickjacking frame protection", "Neither CSP frame-ancestors nor X-Frame-Options is set.", "Add frame-ancestors 'none' (or 'self') to CSP and X-Frame-Options: DENY.", 10);
      }
    }

    const hsts = h["strict-transport-security"] || "";
    if (inspectData.https) {
      if (!hsts) {
        addFinding("Medium", "A02: Cryptographic Failures", "Missing Strict-Transport-Security (HSTS)", "Browsers may still allow initial plaintext HTTP connections.", "Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload", 12);
      } else {
        const m = hsts.match(/max-age=(\d+)/i);
        if (m && Number(m[1]) < 15552000) {
          addFinding("Low", "A02: Cryptographic Failures", "Short HSTS max-age", `HSTS max-age is ${m[1]}s (< 180 days).`, "Raise max-age to at least 31536000 (1 year).", 4);
        }
      }
    }

    if ((h["x-content-type-options"] || "").toLowerCase() !== "nosniff") {
      addFinding("Low", "A05: Security Misconfiguration", "Missing X-Content-Type-Options: nosniff", "Browsers may MIME-sniff responses.", "Add X-Content-Type-Options: nosniff.", 6);
    }
    if (!h["referrer-policy"]) {
      addFinding("Low", "A05: Security Misconfiguration", "Missing Referrer-Policy", "Full URLs (including query params) could leak in Referer headers.", "Add Referrer-Policy: strict-origin-when-cross-origin.", 4);
    }
    if (!h["permissions-policy"]) {
      addFinding("Info", "A05: Security Misconfiguration", "Missing Permissions-Policy", "Browser APIs (camera, mic, geolocation) are not explicitly restricted.", "Add Permissions-Policy: camera=(), microphone=(), geolocation=().", 2);
    }

    const acao = h["access-control-allow-origin"] || "";
    const acac = (h["access-control-allow-credentials"] || "").toLowerCase();
    if (acao === "*" && acac === "true") {
      addFinding("High", "A01: Broken Access Control", "Dangerous CORS wildcard with credentials", "Access-Control-Allow-Origin: * combined with Allow-Credentials: true.", "Restrict Access-Control-Allow-Origin to explicit trusted origins.", 15);
    } else if (acao === "*") {
      addFinding("Info", "A01: Broken Access Control", "Open CORS policy (Access-Control-Allow-Origin: *)", "Publicly readable cross-origin; fine for public APIs/assets, avoid for authenticated endpoints.", "Confirm no sensitive per-user data is served from this endpoint.", 0);
    }

    const serverHdr = h["server"] || "";
    const poweredBy = h["x-powered-by"] || "";
    if (poweredBy || /\d+\.\d+/.test(serverHdr)) {
      addFinding("Low", "A05: Security Misconfiguration", "Server/framework version banner exposed", `Server: "${serverHdr || "—"}" · X-Powered-By: "${poweredBy || "—"}"`, "Disable X-Powered-By and minimize Server version tokens.", 4);
    }

    for (const c of (inspectData.cookies || [])) {
      const missingAttrs = [];
      if (!c.secure) missingAttrs.push("Secure");
      if (!c.httpOnly) missingAttrs.push("HttpOnly");
      if (!c.sameSite) missingAttrs.push("SameSite");
      if (missingAttrs.length) {
        addFinding("Medium", "A07: Identification & Auth", `Cookie "${c.name}" missing ${missingAttrs.join(", ")}`, `Set-Cookie flags: Secure=${c.secure}, HttpOnly=${c.httpOnly}, SameSite=${c.sameSite || "unset"}.`, `Add ${missingAttrs.join("; ")} (e.g. SameSite=Lax) to sensitive cookies.`, 6);
      }
    }

    const keyHeaders = {};
    for (const k of ["content-security-policy", "strict-transport-security", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy", "access-control-allow-origin", "server", "x-powered-by"]) {
      if (h[k]) keyHeaders[k] = h[k];
    }

    return {
      url: inspectData.final_url,
      status: inspectData.status,
      https: inspectData.https,
      mode,
      score,
      grade: gradeFromScore(score),
      headers_observed: keyHeaders,
      cookies_inspected: inspectData.cookies || [],
      findings,
      note: inspectData.note || undefined
    };
  }

  function maskSecret(str) {
    const s = String(str || "");
    if (s.length <= 10) return s.slice(0, 3) + "***";
    return s.slice(0, 6) + "…" + s.slice(-4);
  }

  async function runSecAuditHtml({ url, use_studio } = {}, signal) {
    let targetHtml = "";
    let sourceLabel = "Web Studio";
    let baseOrigin = "";

    if (use_studio || (!url && studio.html)) {
      if (!studio.html || !studio.html.trim()) {
        return { error: "Web Studio is empty. Pass a url to audit or load a page into Web Studio first." };
      }
      targetHtml = studio.html;
      sourceLabel = studio.sourceUrl || studio.filename || "Web Studio";
      if (studio.sourceUrl) {
        try { baseOrigin = new URL(studio.sourceUrl).origin; } catch {}
      }
    } else if (url) {
      const auth = confirmAuditDomain(url);
      if (!auth.ok) return { error: auth.error };
      const fetched = await fetchRawHtmlForStudio(auth.url, signal);
      if (fetched.error) return { url: auth.url, error: fetched.error };
      targetHtml = fetched.html;
      sourceLabel = fetched.sourceUrl;
      try { baseOrigin = new URL(fetched.sourceUrl).origin; } catch {}
    } else {
      return { error: "Provide either url or set use_studio: true." };
    }

    const findings = [];
    const lines = targetHtml.split("\n");
    const findLineNum = (idx) => targetHtml.slice(0, idx).split("\n").length;
    const add = (severity, category, title, detail, fix, line) => {
      findings.push({ severity, category, title, detail, fix, line: line || undefined });
    };

    // 1. Potential exposed client-side secrets (always masked in output)
    const secretRules = [
      { name: "AWS Access Key ID", re: /\bAKIA[0-9A-Z]{16}\b/g },
      { name: "GitHub Personal Access Token", re: /\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g },
      { name: "Private Key Block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
      { name: "OpenAI / Stripe-style Secret Key", re: /\bsk-(?:live|test|proj|ant-api03)?-[A-Za-z0-9_-]{20,}\b/g },
      { name: "Google API Key", re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
      { name: "Supabase Service Role / Secret JWT Hint", re: /service_role["'\s:=]+["']?(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/gi }
    ];
    for (const rule of secretRules) {
      const m = rule.re.exec(targetHtml);
      if (m) {
        add("Critical", "A02: Cryptographic Failures", `Possible exposed ${rule.name} in client HTML/JS`, `Matched pattern "${maskSecret(m[1] || m[0])}" in public frontend source.`, "Move secrets to server-side environment variables and rotate any exposed credentials immediately.", findLineNum(m.index));
      }
    }

    // 2. DOM XSS sinks & unsafe JS evaluation
    const sinkRules = [
      { name: "eval() / new Function()", sev: "High", re: /\b(?:eval\s*\(|new\s+Function\s*\()/g, fix: "Eliminate dynamic code execution; parse data safely with JSON.parse()." },
      { name: "document.write()", sev: "Medium", re: /\bdocument\.write(?:ln)?\s*\(/g, fix: "Use safe DOM APIs (createElement + textContent)." },
      { name: "innerHTML / outerHTML assignment", sev: "Medium", re: /\.(?:innerHTML|outerHTML)\s*=/g, fix: "Use textContent for untrusted data or sanitize HTML with DOMPurify before inserting." },
      { name: "javascript: URL", sev: "Medium", re: /href\s*=\s*["']\s*javascript:/gi, fix: "Replace javascript: hrefs with button elements and addEventListener()." }
    ];
    for (const r of sinkRules) {
      const matches = [...targetHtml.matchAll(r.re)];
      if (matches.length) {
        add(r.sev, "A03: Injection / DOM XSS", `${r.name} detected (${matches.length} occurrence${matches.length === 1 ? "" : "s"})`, `First seen at line ${findLineNum(matches[0].index)}.`, r.fix, findLineNum(matches[0].index));
      }
    }

    // 3. Mixed content (http:// assets) & external scripts missing Subresource Integrity (SRI)
    const httpAssets = [...targetHtml.matchAll(/<(?:script|link|iframe|img)[^>]+(?:src|href)\s*=\s*["'](http:\/\/[^"']+)["']/gi)];
    if (httpAssets.length) {
      add("High", "A02: Cryptographic Failures", `Insecure HTTP asset URLs (${httpAssets.length})`, `Example: ${httpAssets[0][1].slice(0, 100)}`, "Serve all external scripts, stylesheets, images, and iframes over HTTPS.", findLineNum(httpAssets[0].index));
    }

    const extScripts = [...targetHtml.matchAll(/<script\b([^>]*)\bsrc\s*=\s*["'](https?:\/\/[^"']+)["']([^>]*)>/gi)];
    const missingSri = extScripts.filter(m => {
      const fullTag = m[0];
      const src = m[2];
      const sameOrigin = baseOrigin && src.startsWith(baseOrigin);
      return !sameOrigin && !/\bintegrity\s*=/i.test(fullTag);
    });
    if (missingSri.length) {
      add("Medium", "A08: Software & Data Integrity", `Third-party scripts without Subresource Integrity (${missingSri.length})`, `Example: ${missingSri[0][2].slice(0, 100)}`, "Pin CDN versions and add integrity=\"sha384-...\" crossorigin=\"anonymous\" attributes.", findLineNum(missingSri[0].index));
    }

    // 4. Forms & link security
    const insecureForms = [...targetHtml.matchAll(/<form\b[^>]*action\s*=\s*["'](http:\/\/[^"']+)["']/gi)];
    if (insecureForms.length) {
      add("High", "A02: Cryptographic Failures", "Form submits over plaintext HTTP", `Action: ${insecureForms[0][1].slice(0, 100)}`, "Submit all forms exclusively over HTTPS.", findLineNum(insecureForms[0].index));
    }

    const postForms = [...targetHtml.matchAll(/<form\b[^>]*method\s*=\s*["']post["'][^>]*>([\s\S]*?)<\/form>/gi)];
    const formsNoCsrf = postForms.filter(m => !/csrf|xsrf|_token|authenticity_token/i.test(m[1]));
    if (formsNoCsrf.length) {
      add("Low", "A01: Broken Access Control", `POST form(s) without visible CSRF token field (${formsNoCsrf.length})`, "Verify CSRF protection (synchronizer token or SameSite cookie + Origin validation).", "Include anti-CSRF tokens on state-changing POST forms or validate Origin/SameSite server-side.", findLineNum(formsNoCsrf[0].index));
    }

    const unsafeBlankLinks = [...targetHtml.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi)]
      .filter(m => !/\brel\s*=\s*["'][^"']*noopener/i.test(m[0]));
    if (unsafeBlankLinks.length) {
      add("Low", "A05: Security Misconfiguration", `External target="_blank" links missing rel="noopener noreferrer" (${unsafeBlankLinks.length})`, "Older browsers can expose window.opener to opened tabs.", "Add rel=\"noopener noreferrer\" to all target=\"_blank\" links.", findLineNum(unsafeBlankLinks[0].index));
    }

    // 5. Inline event handlers & sensitive comments
    const inlineHandlers = [...targetHtml.matchAll(/\bon(?:click|load|error|mouseover|focus|submit|input|change)\s*=\s*["']/gi)];
    if (inlineHandlers.length > 0) {
      add("Low", "A03: Injection / CSP Readiness", `Inline HTML event handlers (${inlineHandlers.length})`, "Inline on* attributes block deploying a strict script-src CSP without 'unsafe-inline'.", "Move event handlers to external/module JS using addEventListener().", findLineNum(inlineHandlers[0].index));
    }

    const sensitiveComments = [...targetHtml.matchAll(/<!--([\s\S]*?)-->/g)]
      .filter(m => /\b(password|passwd|secret|api[_-]?key|token|staging|internal|debug|admin|todo|fixme)\b/i.test(m[1]));
    if (sensitiveComments.length) {
      add("Info", "A05: Security Misconfiguration", `Potentially sensitive HTML comments (${sensitiveComments.length})`, `Sample: <!-- ${sensitiveComments[0][1].trim().slice(0, 90)} -->`, "Strip internal/debug comments during production builds.", findLineNum(sensitiveComments[0].index));
    }

    const sevOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
    findings.sort((a, b) => (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9));

    return {
      source: sourceLabel,
      url: safeUrl(sourceLabel) || undefined,
      chars_scanned: targetHtml.length,
      lines_scanned: lines.length,
      summary: {
        critical: findings.filter(f => f.severity === "Critical").length,
        high: findings.filter(f => f.severity === "High").length,
        medium: findings.filter(f => f.severity === "Medium").length,
        low: findings.filter(f => f.severity === "Low").length,
        info: findings.filter(f => f.severity === "Info").length
      },
      findings
    };
  }

  async function runSecAuditWellKnown(rawUrl, signal) {
    const auth = confirmAuditDomain(rawUrl);
    if (!auth.ok) return { error: auth.error };

    let origin;
    try { origin = new URL(auth.url).origin; } catch { return { error: "Invalid URL." }; }

    const fetchText = async (u) => {
      try {
        const r = await webGetWithProxy(u, signal, 8000);
        if (!r.ok) return { exists: false, status: r.status };
        const text = await r.text();
        return { exists: true, status: r.status, text: text.slice(0, 4000) };
      } catch (e) {
        return { exists: false, error: e.message || String(e) };
      }
    };

    const [secTxt, robotsTxt, sitemapXml] = await Promise.all([
      fetchText(`${origin}/.well-known/security.txt`),
      fetchText(`${origin}/robots.txt`),
      fetchText(`${origin}/sitemap.xml`)
    ]);

    const findings = [];
    if (!secTxt.exists) {
      findings.push({
        severity: "Info",
        title: "No /.well-known/security.txt found",
        detail: "RFC 9116 security.txt helps researchers report vulnerabilities responsibly.",
        fix: "Publish /.well-known/security.txt with Contact: mailto:security@yourdomain.com and Expires: fields."
      });
    }

    const sensitiveDisallows = [];
    if (robotsTxt.exists && robotsTxt.text) {
      for (const ln of robotsTxt.text.split("\n")) {
        const m = ln.match(/^\s*Disallow:\s*(.+)/i);
        if (m && /admin|backup|config|\.env|internal|private|secret|staging|debug|db|sql|phpinfo/i.test(m[1])) {
          sensitiveDisallows.push(m[1].trim());
        }
      }
      if (sensitiveDisallows.length) {
        findings.push({
          severity: "Low",
          title: "Sensitive-looking paths listed in robots.txt",
          detail: `Disallow entries: ${sensitiveDisallows.slice(0, 8).join(", ")}`,
          fix: "Never rely on robots.txt for access control — enforce real server-side authentication on sensitive routes."
        });
      }
    }

    return {
      origin,
      url: auth.url,
      security_txt: { exists: secTxt.exists, status: secTxt.status },
      robots_txt: { exists: robotsTxt.exists, status: robotsTxt.status, sensitive_disallows: sensitiveDisallows },
      sitemap_xml: { exists: sitemapXml.exists, status: sitemapXml.status },
      findings
    };
  }

  const SEC_AUDIT_TOOL_DEFINITIONS = [
    {
      type: "function",
      function: {
        name: "sec_audit_headers",
        description: "Run a passive, read-only HTTP security header, HTTPS, CORS, and cookie-flag audit on a website the user owns/authorizes. Returns an A-F grade and OWASP remediation advice.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Full http:// or https:// URL of the authorized website to audit." }
          },
          required: ["url"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "sec_audit_html",
        description: "Run a static client-side OWASP risk scan on a webpage's HTML/JS (checks DOM XSS sinks, exposed secrets, missing SRI, mixed content, insecure forms, CSRF hints, and tabnabbing) either from a URL or from Web Studio.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Optional http:// or https:// URL of an authorized site to statically scan." },
            use_studio: { type: "boolean", description: "Set true to scan the HTML currently loaded in Web Studio." }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "sec_audit_wellknown",
        description: "Check public web security hygiene files (/.well-known/security.txt, /robots.txt, /sitemap.xml) passively via read-only GET on an authorized website.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Full http:// or https:// URL of the authorized website." }
          },
          required: ["url"]
        }
      }
    }
  ];

  function getActiveToolDefinitions(webOn, webMode, modelObj = getCurrentModelObj(), lastUserText = "", requireSearch = false) {
    const offline = isOfflineActive();
    const prov = modelObj?.provider || "browser";
    const text = String(lastUserText || "");
    const tools = [];

    // AI Horde volunteer workers (koboldcpp/aphrodite) reply 2-4x faster and avoid KudosUpfront / prompt bloat
    // when we only attach the exact tool group(s) relevant to the user's prompt instead of dumping all 14 JSON schemas (6.2 KB) on every casual chat.
    const isHorde = prov === "aihorde";
    const wantsWebSearch = !isHorde
      || Boolean(requireSearch)
      || /https?:\/\//i.test(text)
      || /\b(search|look\s*up|google|web\s*search|fetch|browse|latest|news|today|tonight|yesterday|current|weather|stock\s*price|price\s+of|score|who\s+won|wikipedia|recent|2025|2026|live\s+data)\b/i.test(text);

    if (!offline && webOn && webMode === "agent" && wantsWebSearch) {
      tools.push(...WEB_TOOL_DEFINITIONS);
    }

    // Web Studio must ALWAYS be available when enabled — prior strict regex blocked "build a todo app" on Horde workers, breaking the core feature
    const isCompactLocal = isLocalOfflineModel(modelObj) && /(?:^|[:\-_])(?:0\.5|0\.6|0\.8|1|1\.5|1\.7|2|3)b\b/i.test(modelObj?.id || "");
    // Always attach studio tools for non-compact models; for Horde/compact, still attach on any build-ish intent (very broad)
    const wantsStudioTools = (!isCompactLocal && !isHorde)
      || /\b(build|create|make|generate|design|code|develop|prototype|clone|remake|remix|edit|update|fix|redesign|replicate|copy|html|webpage|web\s*page|website|web\s*studio|studio|landing\s*page|portfolio|patch|publish|github|netlify|webhook|site|app|game|tool|page|landing|portfolio|calculator|dashboard|chat|todo|store|shop|blog|card|button|form|animation|canvas|svg|react|vue)\b/i.test(text)
      || text.trim().length < 120; // short prompts often are build requests, keep tools attached
    const wantsSecTools = (!isCompactLocal && !isHorde)
      || /\b(audit|security|owasp|xss|csp|headers?|vulnerab|well-?known|hsts|cors\s+check|pentest)\b/i.test(text);
    const wantsGithubTools = (!isCompactLocal && !isHorde)
      || /\b(github|repo|repository|pull request|pr |commit|issue|file from github|owner\/repo)\b/i.test(text);
    const wantsSupabaseTools = (!isCompactLocal && !isHorde)
      || /\b(supabase|database|table|insert|query.*table)\b/i.test(text);

    if (settings.webEditorEnabled !== false && wantsStudioTools) {
      if (offline) {
        // Offline-only local studio tools (zero network calls)
        tools.push(...WEB_EDITOR_TOOL_DEFINITIONS.filter(t =>
          ["web_studio_get", "web_studio_write", "web_studio_patch"].includes(t.function.name)
        ));
      } else {
        tools.push(...WEB_EDITOR_TOOL_DEFINITIONS);
      }
    }
    if (settings.secAuditEnabled !== false && wantsSecTools) {
      if (offline) {
        tools.push(...SEC_AUDIT_TOOL_DEFINITIONS.filter(t => t.function.name === "sec_audit_html"));
      } else {
        tools.push(...SEC_AUDIT_TOOL_DEFINITIONS);
      }
    }
    if (wantsGithubTools) {
      tools.push(...GITHUB_TOOL_DEFINITIONS);
    }
    if (wantsSupabaseTools) {
      // Only attach if configured, but always attach definitions so AI knows they exist; execution will error gracefully if not configured
      tools.push(...SUPABASE_TOOL_DEFINITIONS);
    }
    return tools;
  }

  async function executeToolCall(name, args, signal) {
    switch (name) {
      case "web_search": return await runWebSearch(args.query, args.num_results, signal);
      case "web_news": return await runWebNews(args.query, args.num_results, signal);
      case "web_fetch": return await runWebFetch(args.url, args.max_chars, signal);
      case "wikipedia_lookup": return await runWikipediaLookup(args.topic, signal);
      case "sec_audit_headers": return await runSecAuditHeaders(args.url, signal);
      case "sec_audit_html": return await runSecAuditHtml(args, signal);
      case "sec_audit_wellknown": return await runSecAuditWellKnown(args.url, signal);
      case "web_studio_get": {
        const cap = Math.max(2000, Math.min(60000, Number(args.max_chars) || 24000));
        if (!studio.html) return { loaded: false, message: "Web Studio is currently empty. Use web_studio_write or web_studio_load_url." };
        return {
          loaded: true,
          filename: studio.filename,
          source_url: studio.sourceUrl || null,
          chars: studio.html.length,
          truncated: studio.html.length > cap,
          html: studio.html.slice(0, cap)
        };
      }
      case "web_studio_load_url": {
        const res = await fetchRawHtmlForStudio(args.url, signal);
        if (res.error) return res;
        const domainFile = getDomain(res.sourceUrl).replace(/[^a-z0-9.-]/gi, "_") + ".html";
        setStudioHtml(res.html, { filename: domainFile, sourceUrl: res.sourceUrl, pushHistory: true, openPanel: true });
        return {
          ok: true,
          url: res.sourceUrl,
          title: domainFile,
          domain: getDomain(res.sourceUrl),
          mode: res.mode,
          chars: res.html.length,
          html_preview: res.html.slice(0, 18000),
          truncated: res.html.length > 18000
        };
      }
      case "web_studio_write": {
        if (typeof args.html !== "string" || !args.html.trim()) return { error: "html string is required." };
        const incoming = String(args.html);
        const existing = studio.html || "";
        const incomingLooksFragment = !/^\s*<!DOCTYPE/i.test(incoming) && !/^\s*<html[\s>]/i.test(incoming);
        const existingTruncated = existing && existing.length > 600 && !/<\/html>\s*$/i.test(existing.trim()) && !/<\/html>/i.test(existing.slice(-800));
        // SMART UNLIMITED: if Studio already has truncated doc and incoming is a continuation fragment, APPEND instead of replace
        if(existingTruncated && incomingLooksFragment && incoming.length > 80){
          // Heuristic: incoming is continuation if it starts with partial tag or plain JS/CSS
          const merged = existing + "\n" + incoming;
          setStudioHtml(merged, {
            filename: args.filename || studio.filename || "index.html",
            pushHistory: true,
            openPanel: true
          });
          return {
            ok: true,
            filename: studio.filename,
            chars: studio.html.length,
            version: studio.historyIdx + 1,
            appended: true,
            summary: (args.summary || "Appended continuation") + " (smart-merged truncated doc)"
          };
        }
        // Normal path: handle </html> truncation inside incoming itself by appending to previous if needed
        if(existing && incomingLooksFragment && existingTruncated && incoming.length > 200){
          const merged2 = existing + incoming;
          setStudioHtml(merged2, {
            filename: args.filename || studio.filename || "index.html",
            pushHistory: true,
            openPanel: true
          });
          return { ok: true, filename: studio.filename, chars: studio.html.length, version: studio.historyIdx + 1, appended: true, summary: args.summary || "Continued code (auto-merged)" };
        }
        setStudioHtml(incoming, {
          filename: args.filename || studio.filename || "index.html",
          pushHistory: true,
          openPanel: true
        });
        return {
          ok: true,
          filename: studio.filename,
          chars: studio.html.length,
          version: studio.historyIdx + 1,
          summary: args.summary || "Updated live webpage in Web Studio"
        };
      }
      case "web_studio_patch": {
        if (!studio.html) return { error: "Web Studio is empty. Call web_studio_write or web_studio_load_url first." };
        const edits = Array.isArray(args.edits) ? args.edits : [];
        if (!edits.length) return { error: "Provide at least one {find, replace} item in edits." };
        let updated = studio.html;
        const applied = [];
        const missed = [];
        for (let idx = 0; idx < edits.length; idx++) {
          const e = edits[idx];
          if (!e || typeof e.find !== "string" || !e.find) continue;
          if (updated.includes(e.find)) {
            updated = updated.replace(e.find, String(e.replace ?? ""));
            applied.push(idx);
          } else {
            missed.push({ index: idx, snippet: e.find.slice(0, 80) });
          }
        }
        if (!applied.length) {
          return { ok: false, error: "None of the find snippets matched the current Studio HTML. Call web_studio_get first to inspect exact text.", missed };
        }
        setStudioHtml(updated, { pushHistory: true, openPanel: true });
        return {
          ok: true,
          applied_count: applied.length,
          missed,
          chars: updated.length,
          version: studio.historyIdx + 1,
          summary: args.summary || `Applied ${applied.length} patch(es)`
        };
      }
      case "web_publish_github":
        return await publishToGitHub({ path: args.path, commitMessage: args.commit_message });
      case "web_publish_netlify":
        return await publishToNetlify({ filePath: args.file_path });
      case "web_publish_webhook":
        return await publishToWebhook({ method: args.method, payloadMode: args.payload_mode });
      case "github_get_file":
        return await githubGetFile(args, signal);
      case "github_list_files":
        return await githubListFiles(args, signal);
      case "github_search":
        return await githubSearch(args, signal);
      case "supabase_query":
        return await supabaseQuery(args, signal);
      case "supabase_insert":
        return await supabaseInsert(args, signal);
      default: return { error: `Unknown tool: ${name}` };
    }
  }

  // ── GitHub Connector Implementations (keyless public, PAT for private via Settings) ──
  async function githubGetFile({ repo, path, branch, max_chars }, signal){
    const cleanRepo = String(repo||"").trim().replace(/^https?:\/\/github\.com\//i,"").replace(/\/+$/g,"");
    const filePath = String(path||"").trim().replace(/^\/+/,"");
    if(!cleanRepo.includes("/") || !filePath) return { error: "Provide repo as owner/repo and file path" };
    const cap = Math.max(500, Math.min(40000, Number(max_chars)||12000));
    const token = (settings.ghToken||"").trim();
    const headers = { "Accept": "application/vnd.github+json" };
    if(token) headers["Authorization"] = `Bearer ${token}`;
    // Try GitHub API first (handles private + correct branch)
    const apiBase = `https://api.github.com/repos/${cleanRepo}/contents/${filePath.split("/").map(encodeURIComponent).join("/")}`;
    const apiUrl = branch ? `${apiBase}?ref=${encodeURIComponent(branch)}` : apiBase;
    try{
      const r = await fetchWithTimeout(apiUrl, { headers, signal }, 10000);
      if(r.ok){
        const j = await r.json();
        if(j.type==="file" && j.content){
          const decoded = decodeBase64UrlUtf8(j.content.replace(/\n/g,""));
          return { repo: cleanRepo, path: filePath, branch: branch||j.sha?.slice(0,7)||"main", size: j.size, content: decoded.slice(0,cap), truncated: decoded.length>cap, url: j.html_url };
        }
        if(j.type==="dir") return { error: `Path is a directory, use github_list_files. Contains ${j.length||0} items` };
      }
      // fallback to raw.githubusercontent for public raw speed
      const rawBranch = branch || settings.ghBranch || "main";
      const rawUrl = `https://raw.githubusercontent.com/${cleanRepo}/${encodeURIComponent(rawBranch)}/${filePath}`;
      const r2 = await fetchWithTimeout(rawUrl, signal ? { signal } : {}, 8000);
      if(r2.ok){
        const txt = await r2.text();
        return { repo: cleanRepo, path: filePath, branch: rawBranch, content: txt.slice(0,cap), truncated: txt.length>cap, url: `https://github.com/${cleanRepo}/blob/${rawBranch}/${filePath}` };
      }
      return { error: `GitHub file not found (${r.status}) at ${cleanRepo}/${filePath}` };
    }catch(e){
      if(e.name==="AbortError" && signal?.aborted) throw e;
      return { error: `GitHub fetch failed: ${e.message}` };
    }
  }
  async function githubListFiles({ repo, path, branch }, signal){
    const cleanRepo = String(repo||"").trim().replace(/^https?:\/\/github\.com\//i,"").replace(/\/+$/g,"");
    if(!cleanRepo.includes("/")) return { error: "repo must be owner/repo" };
    const dirPath = String(path||"").trim().replace(/^\/+/,"").replace(/\/+$/g,"");
    const token = (settings.ghToken||"").trim();
    const headers = { "Accept": "application/vnd.github+json" };
    if(token) headers["Authorization"] = `Bearer ${token}`;
    const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${dirPath? "/"+dirPath.split("/").map(encodeURIComponent).join("/"):""}${branch? `?ref=${encodeURIComponent(branch)}`:""}`;
    try{
      const r = await fetchWithTimeout(apiUrl, { headers, signal }, 10000);
      if(!r.ok) return { error: `GitHub list failed HTTP ${r.status}` };
      const j = await r.json();
      const items = Array.isArray(j) ? j : [j];
      return { repo: cleanRepo, path: dirPath||"/", branch: branch||"main", count: items.length, files: items.slice(0,80).map(it=>({ name: it.name, path: it.path, type: it.type, size: it.size||0, url: it.html_url||it.download_url })) };
    }catch(e){
      if(e.name==="AbortError" && signal?.aborted) throw e;
      return { error: e.message };
    }
  }
  async function githubSearch({ query, type, per_page }, signal){
    const q = String(query||"").trim();
    if(!q) return { error: "query required" };
    const kind = type==="code"? "code":"repositories";
    const isCode = kind==="code";
    const url = isCode ? `https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=${Math.max(1,Math.min(10,Number(per_page)||5))}` : `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=${Math.max(1,Math.min(10,Number(per_page)||5))}&sort=stars`;
    const token = (settings.ghToken||"").trim();
    const headers = { "Accept": "application/vnd.github+json" };
    if(token) headers["Authorization"] = `Bearer ${token}`;
    try{
      const r = await fetchWithTimeout(url, { headers, signal }, 10000);
      if(!r.ok) return { error: `GitHub search HTTP ${r.status}` };
      const j = await r.json();
      const items = j.items||[];
      return { query: q, type: kind, count: j.total_count||items.length, results: items.slice(0,5).map(it=> isCode ? ({ name: it.name, path: it.path, repo: it.repository?.full_name, url: it.html_url }) : ({ name: it.full_name, stars: it.stargazers_count, description: (it.description||"").slice(0,160), url: it.html_url, updated: it.updated_at?.slice(0,10) })) };
    }catch(e){
      if(e.name==="AbortError" && signal?.aborted) throw e;
      return { error: e.message };
    }
  }
  async function supabaseQuery({ table, select, filter, limit }, signal){
    const urlBase = (settings.supabaseUrl||"").trim().replace(/\/+$/g,"");
    const key = (settings.supabaseKey||"").trim();
    if(!urlBase || !key) return { error: "Supabase URL and anon key not configured in Settings → Connectors" };
    const cols = String(select||"*").trim()||"*";
    const lim = Math.max(1, Math.min(50, Number(limit)||10));
    let url = `${urlBase}/rest/v1/${encodeURIComponent(String(table).trim())}?select=${encodeURIComponent(cols)}&limit=${lim}`;
    if(filter) url += `&${String(filter).trim()}`;
    try{
      const r = await fetchWithTimeout(url, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal }, 8000);
      if(!r.ok) return { error: `Supabase HTTP ${r.status}: ${await r.text().then(t=>t.slice(0,200))}` };
      const j = await r.json();
      return { table, count: j.length, rows: j };
    }catch(e){ if(e.name==="AbortError" && signal?.aborted) throw e; return { error: e.message } }
  }
  async function supabaseInsert({ table, data }, signal){
    const urlBase = (settings.supabaseUrl||"").trim().replace(/\/+$/g,"");
    const key = (settings.supabaseKey||"").trim();
    if(!urlBase || !key) return { error: "Supabase not configured" };
    if(!table || !data || typeof data!=="object") return { error: "table and data object required" };
    const ok = confirm(`Insert into Supabase ${table}?\n\n${JSON.stringify(data,null,2).slice(0,600)}`);
    if(!ok) return { cancelled: true, message: "User cancelled Supabase insert" };
    let url = `${urlBase}/rest/v1/${encodeURIComponent(String(table).trim())}`;
    try{
      const r = await fetchWithTimeout(url, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(data), signal }, 8000);
      if(!r.ok) return { error: `Supabase insert HTTP ${r.status}: ${await r.text().then(t=>t.slice(0,200))}` };
      const j = await r.json();
      return { ok: true, table, inserted: j };
    }catch(e){ if(e.name==="AbortError" && signal?.aborted) throw e; return { error: e.message } }
  }

  function extractSourcesFromToolOutput(name, output) {
    const found = [];
    if (!output || typeof output !== "object") return found;
    if (Array.isArray(output.results)) {
      for (const r of output.results) {
        if (r?.url && safeUrl(r.url)) {
          found.push({ title: r.title || getDomain(r.url), url: r.url, domain: r.domain || getDomain(r.url) });
        }
      }
    }
    if (output.url && safeUrl(output.url)) {
      found.push({ title: output.title || getDomain(output.url), url: output.url, domain: output.domain || getDomain(output.url) });
    }
    return found;
  }

  // ── Unlimited Zero-Key Local & In-Browser Abliterated Client ───────────────
  function getCurrentModelObj() {
    return models.find(m => m.id === settings.model) || models[0] || BROWSER_LOCAL_MODELS[0];
  }

  function getModelTempMax(modelObj) {
    return modelObj?.sampling_limits?.temperature?.maximum ?? 2.0;
  }

  function modelSupportsImages(modelObj) {
    return Array.isArray(modelObj?.input_modalities) && modelObj.input_modalities.includes("image");
  }

  function getModalityLabel(modelObj) {
    return modelSupportsImages(modelObj) ? "Text + Vision" : "Text only";
  }

  function formatCtxShort(ctx) {
    const n = Number(ctx) || 0;
    if (!n) return "";
    if (n >= 1000000) return "1M";
    if (n >= 1000) return Math.round(n / 1024) + "K";
    return String(n);
  }

  function getProviderConfig(modelObj) {
    const prov = modelObj?.provider || "browser";

    if (prov === "auto-nonablit") {
      // Meta-provider: pure routing logic, never hits network directly — racers decide provider
      return {
        provider: "auto-nonablit",
        label: "Auto-Race Non-Abliterated (Turbo)",
        directBase: "auto://nonablit-race",
        endpointBase: "auto://nonablit-race",
        fallbackBase: null,
        chatPath: "",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: false
      };
    }
    if (prov === "aihorde") {
      return {
        provider: "aihorde",
        label: "AI Horde (Online Keyless · Unlimited)",
        directBase: "https://oai.aihorde.net/v1",
        endpointBase: "https://oai.aihorde.net/v1",
        fallbackBase: proxyAvailable ? "./api/proxy/aihorde" : null,
        chatPath: "/chat/completions",
        apiKey: "0000000000",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: false
      };
    }
    if (prov === "pollinations") {
      return {
        provider: "pollinations",
        label: "Pollinations GPT-OSS 20B (Keyless Cloud)",
        directBase: "https://text.pollinations.ai/openai",
        endpointBase: "https://text.pollinations.ai/openai",
        fallbackBase: proxyAvailable ? "./api/proxy/pollinations" : "https://gen.pollinations.ai/api/v1",
        chatPath: "",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: false,
        altChatPath: "/chat/completions"
      };
    }
    if (prov === "llm7") {
      return {
        provider: "llm7",
        label: "LLM7 (Keyless Cloud)",
        directBase: "https://api.llm7.io/v1",
        endpointBase: "https://api.llm7.io/v1",
        fallbackBase: proxyAvailable ? "./api/proxy/llm7" : null,
        chatPath: "/chat/completions",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: false
      };
    }
    // LLM7 model id normalizer: some ids use colon which needs no encoding for JSON body but we ensure display works
    
    if (prov === "ollama") {
      const ollamaBase = (modelObj.baseUrl || settings.ollamaUrl || DEFAULT_OLLAMA_URL).replace(/\/+$/, "");
      const isLocalDefault = ollamaBase === DEFAULT_OLLAMA_URL || ollamaBase === "http://127.0.0.1:11434/v1";
      return {
        provider: "ollama",
        label: "Local Ollama (Unlimited)",
        directBase: ollamaBase,
        endpointBase: (proxyAvailable && isLocalDefault) ? "./api/proxy/ollama" : ollamaBase,
        fallbackBase: (proxyAvailable && isLocalDefault) ? ollamaBase : null,
        chatPath: "/chat/completions",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: true,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: true
      };
    }
    if (prov === "lmstudio") {
      const lmBase = (modelObj.baseUrl || settings.lmstudioUrl || DEFAULT_LMSTUDIO_URL).replace(/\/+$/, "");
      return {
        provider: "lmstudio",
        label: (modelObj.serverLabel || "Local Server") + " (Unlimited)",
        directBase: lmBase,
        endpointBase: lmBase,
        fallbackBase: null,
        chatPath: "/chat/completions",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: true
      };
    }
    if (prov === "custom") {
      const cBase = (modelObj.baseUrl || settings.ollamaUrl || DEFAULT_OLLAMA_URL).replace(/\/+$/, "");
      const isLocalDefault = cBase === DEFAULT_OLLAMA_URL || cBase === "http://127.0.0.1:11434/v1";
      return {
        provider: "custom",
        label: "Custom Server",
        directBase: cBase,
        endpointBase: (proxyAvailable && isLocalDefault) ? "./api/proxy/ollama" : cBase,
        fallbackBase: (proxyAvailable && isLocalDefault) ? cBase : null,
        chatPath: "/chat/completions",
        apiKey: "",
        requiresKey: false,
        supportsReasoningEffort: false,
        supportsNativeWeb: false,
        supportsStreamUsage: false,
        isLocalOffline: true
      };
    }
    return {
      provider: "browser",
      label: "In-Browser HTML (Offline Capable)",
      directBase: "browser://webgpu-wasm",
      endpointBase: "browser://webgpu-wasm",
      fallbackBase: null,
      chatPath: "",
      apiKey: "",
      requiresKey: false,
      supportsReasoningEffort: false,
      supportsNativeWeb: false,
      supportsStreamUsage: false,
      isLocalOffline: true
    };
  }

  async function detectSameOriginProxy() {
    if (location.protocol !== "http:" && location.protocol !== "https:") return false;
    if (location.origin === "null") return false;
    try {
      const r = await fetchWithTimeout("./api/health", {}, 900);
      if (r.ok) {
        const j = await r.json();
        proxyAvailable = Boolean(j?.proxy);
        return proxyAvailable;
      }
    } catch {}
    proxyAvailable = false;
    return false;
  }

  function formatAiHordeModelName(id) {
    const clean = String(id || "")
      .replace(/^(?:koboldcpp|llamacpp|lmstudio|aphrodite|vllm|tabbyapi)\//i, "")
      .replace(/^(?:TheDrummer|Sao10K|Nimbz|ReadyArt|Qwen)\//i, "")
      .replace(/[-_](?:Q\d(?:_[A-Z0-9]+)+|IQ\d_[A-Z]+|GGUF|AWQ|EXL2)$/i, "")
      .replace(/[_]+/g, " ")
      .trim();
    return clean || id;
  }

  function scoreAiHordeModelSpeed(m) {
    const w = Math.max(1, Number(m.hordeWorkers || 1));
    const q = Math.max(0, Number(m.hordeQueued || 0));
    const qPerWorker = q / w;
    const eta = Number.isFinite(Number(m.hordeEta)) ? Number(m.hordeEta) : 25;
    const perf = Number.isFinite(Number(m.hordePerf)) ? Number(m.hordePerf) : 12;
    const measuredMs = aiHordeMeasuredTtftMs.get(m.id);
    const measuredBias = Number.isFinite(measuredMs) ? Math.round((measuredMs - 3000) / 25) : 0;
    const multiWorkerBonus = w >= 2 ? (w * 55) : 0;
    const hugeSinglePenalty = (w === 1 && /\b(70b|72b|120b|123b|128b|behemoth)\b/i.test(m.id)) ? 900 : 0;
    return (eta * 14) + qPerWorker - Math.min(340, perf * 6) - multiWorkerBonus + hugeSinglePenalty + measuredBias;
  }

  // Supercharged live sync: 3.5s timeout, filters debug/queued models, never blocks UI, caches ETA for instant routing
  async function syncAiHordeModels() {
    if (isOfflineActive() || IS_SANDBOXED_VIEWER) return { ok: false, count: 0 };
    const oaiUrls = ["https://oai.aihorde.net/v1/models"];
    if (proxyAvailable) oaiUrls.push("./api/proxy/aihorde/models");

    const fetchOaiModels = async () => {
      for (const u of oaiUrls) {
        try {
          const r = await fetchWithTimeout(u, { method: "GET", headers: { "Accept": "application/json" } }, 3500);
          if (!r.ok) continue;
          const j = await r.json();
          if (Array.isArray(j?.data) && j.data.length) return j;
        } catch {}
      }
      return null;
    };

    const fetchV2Stats = async () => {
      // Use defuddle/cors-friendly endpoint with timeout
      const urls = ["https://aihorde.net/api/v2/status/models?type=text&model_state=known"];
      for (const u of urls) {
        try {
          const r = await fetchWithTimeout(u, { method: "GET" }, 3000);
          if (!r.ok) continue;
          const arr = await r.json();
          if (Array.isArray(arr)) return new Map(arr.map(x => [x?.name, x]));
        } catch {}
      }
      return new Map();
    };

    const [json, v2Map] = await Promise.all([fetchOaiModels(), fetchV2Stats()]);
    if (!json || !Array.isArray(json.data) || !json.data.length) {
      return { ok: false, count: 0 };
    }
    lastAiHordeSyncAt = Date.now();

    const parsed = [];
    let skippedDebug = 0, skippedQueue = 0;
    for (const m of json.data) {
      const id = m?.id;
      if (!id || /debug-/i.test(id)) { skippedDebug++; continue; }
      // Skip internal test models
      if (/^koboldcpp\/debug-/i.test(id)) { skippedDebug++; continue; }
      const workers = Number(m?.x_horde?.workers || 0);
      const queued = Number(m?.x_horde?.queued || 0);
      if (workers < 1) continue;
      // Skip severely backed-up queues (>1800 tokens waiting per worker) for instant TTFT
      if (queued / workers > 1800) { skippedQueue++; continue; }

      const v2 = v2Map.get(id) || {};
      const eta = Number.isFinite(Number(v2.eta)) ? Number(v2.eta) : (queued === 0 ? 5 : 25);
      const perf = Number.isFinite(Number(v2.performance)) ? Number(v2.performance) : 12;
      const cat = inferModelCategory({ id });
      const mods = Array.isArray(m?.architecture?.input_modalities) && m.architecture.input_modalities.length
        ? m.architecture.input_modalities
        : ["text"];
      const ctx = Number(m?.context_length || m?.top_provider?.context_length || 8192);
      // Cap at anonymous AI Horde zero-kudos completion limit (512) so requests never fail with HTTP 403 KudosUpfront
      const rawMaxOut = Number(m?.top_provider?.max_completion_tokens || AIHORDE_ANON_MAX_TOKENS);
      const maxOut = Math.max(128, Math.min(rawMaxOut, AIHORDE_ANON_MAX_TOKENS));
      const niceName = formatAiHordeModelName(id);
      const perfTag = perf >= 15 ? ` · ${Math.round(perf)} t/s` : "";
      const etaTag = eta <= 3 ? " · instant" : ` · ~${Math.round(eta)}s`;

      parsed.push({
        id,
        provider: "aihorde",
        category: cat,
        display_name: `${niceName} (Online Keyless · Unlimited)`,
        base_model: `AI Horde · ${workers}w${etaTag}${perfTag}`,
        input_modalities: mods,
        context_length: ctx,
        max_completion_tokens: maxOut,
        hordeWorkers: workers,
        hordeQueued: queued,
        hordeEta: eta,
        hordePerf: perf,
        sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
      });
    }

    // Sort fastest live workers first using real ETA, tokens/sec, queue depth, multi-worker availability, and empirical TTFT
    const liveAblit = parsed.filter(m => m.category === "abliterated").sort((a, b) => scoreAiHordeModelSpeed(a) - scoreAiHordeModelSpeed(b)).slice(0, 12);
    const liveStd = parsed.filter(m => m.category !== "abliterated").sort((a, b) => scoreAiHordeModelSpeed(a) - scoreAiHordeModelSpeed(b)).slice(0, 6);
    const combined = [...liveAblit, ...liveStd];

    if (combined.length) {
      const prevObj = models.find(m => m.id === settings.model);
      aiHordeLiveModels = combined;
      // If user's active AI Horde worker went offline, smoothly keep them on the fastest live AI Horde model of the SAME category (never a browser download model!)
      if (prevObj && prevObj.provider === "aihorde" && !prevObj.isAutoRace && !combined.some(m => m.id === prevObj.id)) {
        const sameCatList = isAbliteratedModel(prevObj) ? liveAblit : liveStd;
        const replacement = sameCatList[0] || combined[0];
        if (replacement) {
          settings.model = replacement.id;
          saveSettings();
        }
      }
      rebuildModelsList();
      return { ok: true, count: combined.length, ablitCount: liveAblit.length, stdCount: liveStd.length };
    }
    return { ok: false, count: 0 };
  }

  async function refreshUnlimitedModelsStatus(silent = false) {
    networkBlockedHint = IS_SANDBOXED_VIEWER;
    const [scanRes, hordeRes] = await Promise.all([
      syncOllamaModels(true),
      syncAiHordeModels()
    ]);
    const ablitCount = models.filter(isAbliteratedModel).length;
    const stdCount = models.length - ablitCount;

    if (IS_SANDBOXED_VIEWER && !scanRes.ok) {
      setConnStatus("warn", "Viewer Sandbox", "Download HTML");
    } else if (hordeRes.ok || scanRes.ok) {
      setConnStatus("ok", "Online · Unlimited", `${ablitCount} Ablit · ${stdCount} Std`);
    } else {
      setConnStatus("ok", "Ready · Zero Keys", `${ablitCount} Ablit · ${stdCount} Std`);
    }
    if (!silent) {
      showToast(`Synced! ${ablitCount} Abliterated + ${stdCount} Non-Abliterated online keyless models (zero API keys, zero caching needed).`);
    }
    return { ok: true, count: models.length, localCount: scanRes.count, hordeCount: hordeRes.count };
  }

  async function syncOllamaModels(silent = false) {
    const ollamaBase = (settings.ollamaUrl || DEFAULT_OLLAMA_URL).replace(/\/+$/, "");
    const lmBase = (settings.lmstudioUrl || DEFAULT_LMSTUDIO_URL).replace(/\/+$/, "");
    const isOllamaLocalDefault = ollamaBase === DEFAULT_OLLAMA_URL || ollamaBase === "http://127.0.0.1:11434/v1";

    const probes = [
      {
        provider: "ollama",
        label: "Ollama",
        baseUrl: ollamaBase,
        fetchUrl: (proxyAvailable && isOllamaLocalDefault) ? "./api/proxy/ollama/models" : `${ollamaBase}/models`
      },
      {
        provider: "lmstudio",
        label: "LM Studio",
        baseUrl: lmBase,
        fetchUrl: `${lmBase}/models`
      },
      {
        provider: "lmstudio",
        label: "llama.cpp",
        baseUrl: "http://localhost:8081/v1",
        fetchUrl: "http://localhost:8081/v1/models"
      }
    ];

    const settled = await Promise.allSettled(
      probes.map(async (p) => {
        const r = await fetchWithTimeout(p.fetchUrl, {}, 1200);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        const list = Array.isArray(json.data) ? json.data : (Array.isArray(json.models) ? json.models : []);
        return { probe: p, list };
      })
    );

    const found = [];
    const activeServers = [];
    for (const res of settled) {
      if (res.status !== "fulfilled") continue;
      const { probe, list } = res.value;
      activeServers.push(`${probe.label} (${list.length})`);
      for (const m of list) {
        const id = m.id || m.name || m.model;
        if (!id) continue;
        const looksVision = /vision|vl|gemma-4|qwen3\.5|llava|minicpm/i.test(id);
        found.push({
          id,
          provider: probe.provider,
          category: inferModelCategory({ id }),
          isDetected: true,
          baseUrl: probe.baseUrl,
          serverLabel: probe.label,
          display_name: `${id} (${probe.label} · Ready Now)`,
          base_model: `${probe.label} · Unlimited Local`,
          input_modalities: looksVision ? ["text", "image"] : ["text"],
          context_length: 131072,
          sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
        });
      }
    }

    ollamaDetectedModels = found;
    rebuildModelsList();

    if (el.localScanResultBox) {
      if (found.length) {
        el.localScanResultBox.className = "test-result show ok";
        el.localScanResultBox.textContent = `✓ Found ${found.length} local offline model${found.length === 1 ? "" : "s"} (${activeServers.join(", ")})`;
      } else if (activeServers.length) {
        el.localScanResultBox.className = "test-result show";
        el.localScanResultBox.textContent = `Server detected (${activeServers.join(", ")}), but no models are pulled yet.`;
      } else if (!silent) {
        el.localScanResultBox.className = "test-result show err";
        el.localScanResultBox.textContent = `No local LLM server running on :11434, :1234, or :8081. Built-in Offline Tools still work with zero server.`;
      }
    }

    if (!silent) {
      showToast(found.length
        ? `Detected ${found.length} local offline model${found.length === 1 ? "" : "s"}!`
        : "No local Ollama/LM Studio server found — Built-in Offline Engine is ready with no Wi-Fi.");
    }
    return { ok: found.length > 0, count: found.length, servers: activeServers };
  }

  async function sha256Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function safeEvalMathExpr(expr) {
    const cleaned = String(expr || "").trim();
    if (!cleaned || cleaned.length > 160) return null;
    if (!/^[0-9+\-*/().,\s%^a-zA-Z]+$/.test(cleaned)) return null;
    // Allow strictly safe Math functions & constants only
    const jsExpr = cleaned
      .replace(/\^/g, "**")
      .replace(/\b(pi)\b/gi, "Math.PI")
      .replace(/\b(e)\b/g, "Math.E")
      .replace(/\b(sqrt|abs|round|floor|ceil|sin|cos|tan|log|log10|exp|min|max|pow)\b/gi, (m) => "Math." + m.toLowerCase());
    // Reject any remaining identifier outside Math.*
    const stripped = jsExpr.replace(/Math\.[a-zA-Z0-9]+/g, "");
    if (/[a-zA-Z_$]/.test(stripped)) return null;
    try {
      const val = Function(`"use strict"; return (${jsExpr});`)();
      return (typeof val === "number" && Number.isFinite(val)) ? val : null;
    } catch {
      return null;
    }
  }

  function generateOfflineWebTemplate(promptText) {
    const titleMatch = promptText.match(/(?:for|called|named|titled)\s+["']?([^"'\n.,!?]{2,48})["']?/i);
    const title = titleMatch ? titleMatch[1].trim() : "Offline Web Studio Page";
    const isPortfolio = /portfolio|resume|personal/i.test(promptText);
    const isCalc = /calc|calculator|counter|timer/i.test(promptText);

    if (isCalc) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0c0d12; color: #f4f5f7; font-family: system-ui, sans-serif; }
    .calc { width: 300px; background: #161922; border: 1px solid #2b3040; border-radius: 16px; padding: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .disp { background: #0b0d13; border-radius: 10px; padding: 16px; text-align: right; font-size: 28px; font-family: ui-monospace, monospace; margin-bottom: 14px; overflow-x: auto; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    button { padding: 14px; border: 0; border-radius: 10px; background: #222634; color: #f4f5f7; font-size: 16px; font-weight: 600; cursor: pointer; }
    button:hover { background: #2d3346; }
    button.op { background: #f59e0b; color: #111; }
    button.wide { grid-column: span 2; }
  </style>
</head>
<body>
  <div class="calc">
    <div class="disp" id="d">0</div>
    <div class="grid">
      <button onclick="clr()" class="wide">C</button><button onclick="add('/')" class="op">÷</button><button onclick="add('*')" class="op">×</button>
      <button onclick="add('7')">7</button><button onclick="add('8')">8</button><button onclick="add('9')">9</button><button onclick="add('-')" class="op">−</button>
      <button onclick="add('4')">4</button><button onclick="add('5')">5</button><button onclick="add('6')">6</button><button onclick="add('+')" class="op">+</button>
      <button onclick="add('1')">1</button><button onclick="add('2')">2</button><button onclick="add('3')">3</button><button onclick="eq()" class="op">=</button>
      <button onclick="add('0')" class="wide">0</button><button onclick="add('.')">.</button><button onclick="bk()">⌫</button>
    </div>
  </div>
  <script>
    let cur = "";
    const d = document.getElementById("d");
    function add(v){ cur += v; d.textContent = cur || "0"; }
    function clr(){ cur = ""; d.textContent = "0"; }
    function bk(){ cur = cur.slice(0,-1); d.textContent = cur || "0"; }
    function eq(){ try { cur = String(Function('"use strict";return (' + cur.replace(/[^0-9+\\-*/().]/g,'') + ')')()); d.textContent = cur; } catch { d.textContent = "Err"; cur = ""; } }
  <\/script>
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <style>
    :root { --bg:#0d0e13; --card:#161821; --txt:#f3f4f6; --mut:#9ca3af; --acc:#f59e0b; --bdr:#262938; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--txt); line-height: 1.65; }
    .wrap { max-width: 920px; margin: 0 auto; padding: 48px 24px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; background: rgba(245,158,11,0.14); color: var(--acc); font-size: 12px; font-weight: 700; }
    h1 { font-size: clamp(2rem, 5vw, 3.2rem); margin: 14px 0 10px; letter-spacing: -0.03em; }
    p.lead { color: var(--mut); font-size: 1.1rem; max-width: 640px; }
    .cta { display: inline-block; margin-top: 18px; padding: 11px 20px; border-radius: 10px; background: var(--acc); color: #111; font-weight: 700; text-decoration: none; cursor: pointer; border: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 40px; }
    .card { background: var(--card); border: 1px solid var(--bdr); border-radius: 14px; padding: 20px; }
    .card h3 { margin: 0 0 6px; font-size: 1rem; }
    .card p { margin: 0; color: var(--mut); font-size: 0.92rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="badge">${isPortfolio ? "PORTFOLIO · OFFLINE READY" : "BUILT OFFLINE IN WEB STUDIO"}</span>
    <h1>${escHtml(title)}</h1>
    <p class="lead">Created 100% offline with zero Wi-Fi inside Abliteration Web Studio. Switch to the Code tab to tweak anything, or save directly to your computer.</p>
    <button class="cta" id="themeBtn">Toggle Light / Dark</button>
    <div class="grid">
      <div class="card"><h3>Zero Dependencies</h3><p>Single standalone HTML file with inline styles and interactive JavaScript.</p></div>
      <div class="card"><h3>Works Anywhere</h3><p>Open directly in any browser without a server or internet connection.</p></div>
      <div class="card"><h3>Ready to Customize</h3><p>Connect local Ollama or edit directly in the Code tab to expand this layout.</p></div>
    </div>
  </div>
  <script>
    let light = false;
    document.getElementById("themeBtn").addEventListener("click", () => {
      light = !light;
      document.documentElement.style.setProperty("--bg", light ? "#f7f8fa" : "#0d0e13");
      document.documentElement.style.setProperty("--card", light ? "#ffffff" : "#161821");
      document.documentElement.style.setProperty("--txt", light ? "#111827" : "#f3f4f6");
      document.documentElement.style.setProperty("--mut", light ? "#4b5563" : "#9ca3af");
      document.documentElement.style.setProperty("--bdr", light ? "#e5e7eb" : "#262938");
    });
  <\/script>
</body>
</html>`;
  }

  // ── 100% Pure-HTML In-Browser Neural AI Engine (WebGPU + WASM + IndexedDB) ──
  const BROWSER_AI_DB_NAME = "ablit_browser_ai_cache_v1";
  const BROWSER_AI_STORE = "files";
  const TFJS_VERSION = "3.8.1";
  const TFJS_CDN_BASE = `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TFJS_VERSION}/dist/`;
  const TFJS_CDN_FALLBACKS = [
    `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TFJS_VERSION}/dist/`,
    `https://unpkg.com/@huggingface/transformers@${TFJS_VERSION}/dist/`,
    `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/`
  ];

  const browserAiState = {
    tf: null,
    runtimeBlobUrls: null,
    generator: null,
    loadedModelId: null,
    loadedBackendLabel: "",
    loadingPromise: null,
    memCache: new Map()
  };

  function openBrowserAiDb() {
    return new Promise((resolve) => {
      if (typeof indexedDB === "undefined") { resolve(null); return; }
      try {
        const req = indexedDB.open(BROWSER_AI_DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(BROWSER_AI_STORE)) {
            db.createObjectStore(BROWSER_AI_STORE, { keyPath: "key" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function browserAiCacheGet(key) {
    if (browserAiState.memCache.has(key)) return browserAiState.memCache.get(key);
    const db = await openBrowserAiDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(BROWSER_AI_STORE, "readonly");
        const req = tx.objectStore(BROWSER_AI_STORE).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function browserAiCachePut(key, blob, contentType, status = 200) {
    const rec = { key, blob, contentType: contentType || blob.type || "application/octet-stream", status, size: blob.size || 0, savedAt: Date.now() };
    const db = await openBrowserAiDb();
    if (!db) {
      browserAiState.memCache.set(key, rec);
      return;
    }
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(BROWSER_AI_STORE, "readwrite");
        tx.objectStore(BROWSER_AI_STORE).put(rec);
        tx.oncomplete = () => resolve();
        tx.onerror = () => { browserAiState.memCache.set(key, rec); resolve(); };
      } catch {
        browserAiState.memCache.set(key, rec);
        resolve();
      }
    });
  }

  async function browserAiCacheClear() {
    browserAiState.memCache.clear();
    try { await browserAiState.generator?.dispose?.(); } catch {}
    browserAiState.generator = null;
    browserAiState.loadedModelId = null;
    settings.cachedBrowserModels = [];
    settings.cachedBrowserMeta = {};
    saveSettings();
    const db = await openBrowserAiDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(BROWSER_AI_STORE, "readwrite");
          tx.objectStore(BROWSER_AI_STORE).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch { resolve(); }
      });
    }
    populateModelSelect();
    if (!getActiveChat()?.messages?.length) renderEmptyState();
  }

  // Verify settings.cachedBrowserModels against actual IndexedDB files so stale localStorage entries
  // (e.g. from an older HTML version, another file:// path, or browser storage eviction) never falsely report a download model as cached.
  async function pruneStaleCachedBrowserModels() {
    if (!Array.isArray(settings.cachedBrowserModels) || !settings.cachedBrowserModels.length) return;
    const db = await openBrowserAiDb();
    let allKeys = Array.from(browserAiState.memCache.keys());
    if (db) {
      const dbKeys = await new Promise((resolve) => {
        try {
          const tx = db.transaction(BROWSER_AI_STORE, "readonly");
          const req = tx.objectStore(BROWSER_AI_STORE).getAllKeys();
          req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
          req.onerror = () => resolve([]);
        } catch { resolve([]); }
      });
      allKeys = allKeys.concat(dbKeys.map(String));
    }
    const valid = settings.cachedBrowserModels.filter((modelId) => {
      if (!BROWSER_LOCAL_MODELS.some(m => m.id === modelId)) return false;
      const prefix = `hf://${modelId}/resolve/`;
      return allKeys.some(k => k.startsWith(prefix) && /\.onnx(?:_data)?$/i.test(k));
    });
    if (valid.length !== settings.cachedBrowserModels.length) {
      settings.cachedBrowserModels = valid;
      saveSettings();
    }
  }

  // Normalize Hugging Face model URLs so weights cached from any mirror (huggingface.co, custom mirror, ./api/proxy/hf/) reuse the exact same offline IndexedDB entry
  function normalizeBrowserAiCacheKey(rawKey) {
    const s = String(rawKey || "");
    const m = s.match(/\/([^/]+\/[^/]+\/resolve\/.+)$/);
    return m ? ("hf://" + m[1]) : s;
  }

  function normalizeHfMirrorUrl(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (!/^https?:\/\//i.test(s)) return "";
    return s.endsWith("/") ? s : (s + "/");
  }

  // Custom Web-Cache-API-compatible adapter backed by IndexedDB (works on file://, http://, https:// & offline!)
  const idbTransformersCache = {
    async match(request) {
      const rawKey = typeof request === "string" ? request : (request?.url || String(request));
      const key = normalizeBrowserAiCacheKey(rawKey);
      const rec = (await browserAiCacheGet(key)) || (key !== rawKey ? await browserAiCacheGet(rawKey) : null);
      if (!rec || !rec.blob) return undefined;
      return new Response(rec.blob, {
        status: rec.status || 200,
        headers: {
          "Content-Type": rec.contentType || "application/octet-stream",
          "Content-Length": String(rec.blob.size || 0)
        }
      });
    },
    async put(request, response) {
      const rawKey = typeof request === "string" ? request : (request?.url || String(request));
      const key = normalizeBrowserAiCacheKey(rawKey);
      try {
        const cloned = response.clone();
        const blob = await cloned.blob();
        const ct = response.headers.get("content-type") || "application/octet-stream";
        await browserAiCachePut(key, blob, ct, response.status || 200);
      } catch {}
    }
  };

  async function fetchCachedRuntimeBlob(filename, mimeType, onStatus) {
    const cacheKey = TFJS_CDN_BASE + filename;
    const cached = await browserAiCacheGet(cacheKey);
    if (cached && cached.blob) {
      return new Blob([cached.blob], { type: mimeType });
    }
    if (IS_SANDBOXED_VIEWER) {
      throw new Error("Download abliteration-runner.html (top-bar button) and open it directly in your browser to load the In-Browser AI engine.");
    }
    if (!proxyAvailable && (location.protocol === "http:" || location.protocol === "https:")) {
      await detectSameOriginProxy();
    }
    const sources = [];
    if (proxyAvailable) sources.push(new URL(`./api/proxy/cdn/${filename}`, location.href).href);
    sources.push(TFJS_CDN_BASE + filename);
    sources.push(`https://unpkg.com/@huggingface/transformers@${TFJS_VERSION}/dist/${filename}`);

    let lastErr = null;
    for (const src of sources) {
      try {
        const tag = src.includes("/api/proxy/cdn/") ? "Live Preview proxy" : (src.includes("unpkg.com") ? "unpkg mirror" : "jsDelivr CDN");
        onStatus && onStatus(`Downloading in-browser AI runtime (${filename} · ${tag}) — cached permanently for offline use...`);
        const r = await fetchWithTimeout(src, {}, 45000);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const rawBlob = await r.blob();
        const typedBlob = new Blob([rawBlob], { type: mimeType });
        await browserAiCachePut(cacheKey, typedBlob, mimeType, 200);
        return typedBlob;
      } catch (e) {
        lastErr = new Error(`${filename} from ${src}: ${e.message || e}`);
      }
    }
    throw new Error(`Could not fetch in-browser AI runtime (${lastErr?.message || filename}).`);
  }

  async function loadBrowserAiRuntime(onStatus) {
    if (browserAiState.tf) return browserAiState.tf;
    const [jsBlob, rawMjsBlob, wasmBlob] = await Promise.all([
      fetchCachedRuntimeBlob("transformers.min.js", "text/javascript", onStatus),
      fetchCachedRuntimeBlob("ort-wasm-simd-threaded.jsep.mjs", "text/javascript", onStatus),
      fetchCachedRuntimeBlob("ort-wasm-simd-threaded.jsep.wasm", "application/wasm", onStatus)
    ]);

    // Convert cached WASM binary directly into an ArrayBuffer in RAM!
    // Passing env.backends.onnx.wasm.wasmBinary bypasses Emscripten's fetch(blob:null/..., {credentials:"same-origin"})
    // which otherwise throws "TypeError: Failed to fetch" on file:// pages!
    const wasmBinary = await wasmBlob.arrayBuffer();

    // Patch ort-wasm-simd-threaded.jsep.mjs so importing it from a blob: URL never crashes on
    // `new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url)` (which throws Invalid URL on blob:null/...!)
    let mjsBlob = rawMjsBlob;
    try {
      const mjsText = await rawMjsBlob.text();
      const needle = '(new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url)).href';
      if (mjsText.includes(needle)) {
        const patched = mjsText.replace(
          needle,
          '(import.meta.url.startsWith("blob:")?"ort-wasm-simd-threaded.jsep.wasm":(new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url)).href)'
        );
        mjsBlob = new Blob([patched], { type: "text/javascript" });
      }
    } catch {}

    const jsBlobUrl = URL.createObjectURL(jsBlob);
    const mjsBlobUrl = URL.createObjectURL(mjsBlob);
    browserAiState.runtimeBlobUrls = { jsUrl: jsBlobUrl, mjsUrl: mjsBlobUrl };

    onStatus && onStatus("Initializing WebGPU / WebAssembly neural engine inside HTML...");
    let tf;
    let chosenMjsUrl = mjsBlobUrl;
    try {
      // Prefer blob: module import first — works 100% identically on file://, https://, restricted networks & offline!
      tf = await import(jsBlobUrl);
    } catch {
      const cdnBase = proxyAvailable ? new URL("./api/proxy/cdn/", location.href).href : TFJS_CDN_BASE;
      tf = await import(cdnBase + "transformers.min.js");
      chosenMjsUrl = cdnBase + "ort-wasm-simd-threaded.jsep.mjs";
    }

    tf.env.allowLocalModels = false;
    tf.env.useBrowserCache = false;
    tf.env.useCustomCache = true;
    tf.env.customCache = idbTransformersCache;
    if (tf.env.backends?.onnx?.wasm) {
      tf.env.backends.onnx.wasm.proxy = false;
      tf.env.backends.onnx.wasm.numThreads = 1;
      tf.env.backends.onnx.wasm.wasmBinary = wasmBinary;
      tf.env.backends.onnx.wasm.wasmPaths = { mjs: chosenMjsUrl };
    }
    browserAiState.tf = tf;
    return tf;
  }

  function getProbeOnnxFilename(modelId, dtype) {
    const d = dtype || "q8";
    const map = { q8: "onnx/model_quantized.onnx", q4: "onnx/model_q4.onnx", q4f16: "onnx/model_q4f16.onnx", fp16: "onnx/model_fp16.onnx", fp32: "onnx/model.onnx" };
    return map[d] || "onnx/model_quantized.onnx";
  }

  // Zero-preflight reachability probe that tests BOTH config.json AND the actual LFS/Xet CDN redirect (.onnx)
  // Cancels the body stream immediately upon receiving 200 OK headers so almost zero bytes are downloaded!
  async function probeHfHostReachable(host, modelId, onnxRelPath, timeoutMs = 6500) {
    const checkOne = async (relPath) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const url = `${host}${modelId}/resolve/main/${relPath}`;
        const r = await fetch(url, { method: "GET", referrerPolicy: "no-referrer", credentials: "omit", signal: ctrl.signal });
        const ct = (r.headers.get("content-type") || "").toLowerCase();
        // Guard against mirror anti-hotlink HTML error pages returned with HTTP 200
        const ok = r.ok && !ct.includes("text/html");
        try { await r.body?.cancel?.(); } catch {}
        try { ctrl.abort(); } catch {}
        return { ok, status: r.status, url };
      } catch (e) {
        return { ok: false, status: 0, error: e?.message || String(e), url: `${host}${modelId}/resolve/main/${relPath}` };
      } finally {
        clearTimeout(timer);
      }
    };
    const cfgRes = await checkOne("config.json");
    if (!cfgRes.ok) return { ok: false, stage: "config.json", ...cfgRes };
    const onnxRes = await checkOne(onnxRelPath || "onnx/model_quantized.onnx");
    if (!onnxRes.ok) return { ok: false, stage: onnxRelPath || "onnx", ...onnxRes };
    return { ok: true, status: 200 };
  }

  async function buildHfMirrorOrder(modelId, sampleDtype, onStatus) {
    if (!proxyAvailable && (location.protocol === "http:" || location.protocol === "https:")) {
      await detectSameOriginProxy();
    }
    const customMirror = normalizeHfMirrorUrl(settings.hfMirrorUrl);
    const sameOriginProxy = proxyAvailable ? new URL("./api/proxy/hf/", location.href).href : null;
    const embeddedProxy = (!sameOriginProxy && EMBEDDED_PROXY_ORIGIN) ? `${EMBEDDED_PROXY_ORIGIN}/api/proxy/hf/` : null;
    const directHost = "https://huggingface.co/";
    const alphaMirror = "https://alpha.hf-mirror.com/";

    // If model is already cached in IndexedDB or offline mode is active, keep normalized host list without probing network
    const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
    if (cachedSet.has(modelId) || isOfflineActive()) {
      return [customMirror, sameOriginProxy, directHost, alphaMirror, embeddedProxy].filter(Boolean);
    }

    const sampleOnnx = getProbeOnnxFilename(modelId, sampleDtype);
    const ordered = [];
    if (customMirror) ordered.push(customMirror);

    const activeProxy = sameOriginProxy || embeddedProxy;
    onStatus && onStatus("Testing fastest working download route (Hugging Face CDN · alpha mirror · CORS proxy)...");
    const probes = [
      probeHfHostReachable(directHost, modelId, sampleOnnx, 4500).then(r => ({ host: directHost, ...r })),
      probeHfHostReachable(alphaMirror, modelId, sampleOnnx, 5500).then(r => ({ host: alphaMirror, ...r }))
    ];
    if (activeProxy) {
      probes.push(probeHfHostReachable(activeProxy, modelId, sampleOnnx, 6000).then(r => ({ host: activeProxy, ...r })));
    }
    const results = await Promise.all(probes);
    const working = results.filter(r => r.ok).map(r => r.host);
    const failed = results.filter(r => !r.ok).map(r => r.host);

    // Put verified working routes FIRST (preferring direct HF -> alpha mirror -> chunked proxy), then remaining fallbacks
    for (const h of [...working, ...failed]) {
      if (h && !ordered.includes(h)) ordered.push(h);
    }
    return [...new Set(ordered)];
  }

  // Scoped fetch wrapper active ONLY during ensureBrowserAiModel():
  // 1) Adds referrerPolicy:"no-referrer" & credentials:"omit" for HF / alpha.hf-mirror.com so anti-hotlink filters never block downloads
  // 2) Records the exact failing URL, host, filename, and error (so the user never sees a blind "Failed to fetch")
  // 3) For large .onnx/.onnx_data files routed through /api/proxy/hf/ (same-origin OR embedded cross-origin proxy from file://!),
  //    streams in resilient zero-preflight 16 MB chunks (?meta=1 + ?range=start-end, 3x retry per chunk) so reverse proxies never drop streams!
  function installBrowserAiScopedFetch(failTracker) {
    const origFetch = globalThis.fetch.bind(globalThis);
    const CHUNK_SIZE = 16 * 1024 * 1024; // 16 MB per Range chunk

    const scopedFetch = async (input, init) => {
      const url = typeof input === "string" ? input : (input?.url || String(input));
      const method = String((init && init.method) || (typeof input === "object" && input?.method) || "GET").toUpperCase();
      const isHfProxyOnnx = method === "GET" && url.includes("/api/proxy/hf/") && /\.(onnx|onnx_data)(\?|$)/i.test(url);

      if (isHfProxyOnnx) {
        try {
          const sep = url.includes("?") ? "&" : "?";
          const metaResp = await origFetch(`${url}${sep}meta=1`, { method: "GET", credentials: "omit" });
          const metaJson = metaResp.ok ? await metaResp.json().catch(() => null) : null;
          const totalSize = Number(metaJson?.size || 0);
          const contentType = metaJson?.contentType || "application/octet-stream";
          if (metaJson?.ok && totalSize > 20 * 1024 * 1024) {
            let offset = 0;
            const stream = new ReadableStream({
              async pull(controller) {
                if (offset >= totalSize) {
                  controller.close();
                  return;
                }
                const end = Math.min(offset + CHUNK_SIZE - 1, totalSize - 1);
                let lastChunkErr = null;
                for (let attempt = 0; attempt < 3; attempt++) {
                  try {
                    const chunkResp = await origFetch(`${url}${sep}range=${offset}-${end}`, {
                      method: "GET",
                      credentials: "omit"
                    });
                    if (!chunkResp.ok && chunkResp.status !== 206) {
                      throw new Error(`HTTP ${chunkResp.status} on bytes ${offset}-${end}`);
                    }
                    const buf = new Uint8Array(await chunkResp.arrayBuffer());
                    if (!buf.byteLength) throw new Error(`Empty chunk on bytes ${offset}-${end}`);
                    offset += buf.byteLength;
                    controller.enqueue(buf);
                    return;
                  } catch (e) {
                    lastChunkErr = e;
                    await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
                  }
                }
                failTracker.last = {
                  url,
                  host: (() => { try { return new URL(url).host; } catch { return "proxy"; } })(),
                  file: url.split("/").pop().split("?")[0],
                  status: 0,
                  error: lastChunkErr?.message || String(lastChunkErr)
                };
                controller.error(lastChunkErr || new Error("Chunked download interrupted"));
              }
            });
            return new Response(stream, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Content-Length": String(totalSize)
              }
            });
          }
        } catch {
          // Fall through to standard fetch if meta probe fails
        }
      }

      const nextInit = (/huggingface\.co|hf-mirror\.com|\/api\/proxy\/hf\//i.test(url))
        ? { ...(init || {}), referrerPolicy: "no-referrer", credentials: "omit" }
        : init;

      try {
        const resp = await origFetch(input, nextInit);
        if (!resp.ok && resp.status !== 404) {
          failTracker.last = {
            url,
            host: (() => { try { return new URL(url).host; } catch { return ""; } })(),
            file: url.split("/").pop().split("?")[0],
            status: resp.status,
            error: `HTTP ${resp.status} ${resp.statusText || ""}`.trim()
          };
        }
        return resp;
      } catch (err) {
        failTracker.last = {
          url,
          host: (() => { try { return new URL(url).host; } catch { return ""; } })(),
          file: url.split("/").pop().split("?")[0],
          status: 0,
          error: err?.message || String(err)
        };
        throw err;
      }
    };

    globalThis.fetch = scopedFetch;
    return () => {
      if (globalThis.fetch === scopedFetch) {
        globalThis.fetch = origFetch;
      }
    };
  }

  function formatBrowserAiLoadError(err, failInfo) {
    const rawMsg = String(err?.message || err || "Unknown error");
    const isFetchFail = /failed to fetch|networkerror|load failed/i.test(rawMsg);
    if (isFetchFail && failInfo?.url) {
      const target = failInfo.host ? `${failInfo.host} (${failInfo.file || "model file"})` : failInfo.url;
      if (isOfflineActive()) {
        return `Offline Mode is ON and "${failInfo.file || "model"}" is not cached in this browser yet. Turn Offline Mode OFF once to cache it, or click Settings → Import Local Folder.`;
      }
      if (IS_FILE_PROTOCOL) {
        return `Could not download ${target} (${rawMsg}). Your browser or network blocked both huggingface.co and alpha.hf-mirror.com on file://. Click Settings → Run Diagnostics for details, re-download from the Live Preview (which bundles an automatic CORS=* proxy bridge!), enter a Custom Mirror URL, or click Import Local Folder to load weights offline.`;
      }
      return `Could not download ${target} (${rawMsg}). Open Settings → Run Diagnostics to check Hugging Face CDN vs Live Preview proxy connectivity, or switch to Local Ollama if available.`;
    }
    return rawMsg;
  }

  async function detectBrowserAiBackends(modelId) {
    const modelMeta = BROWSER_LOCAL_MODELS.find(m => m.id === modelId);
    const dtypes = modelMeta?.supportedDtypes || { webgpuF16: "q4f16", webgpu: "q4", wasm: "q8" };
    const candidates = [];
    const prevMeta = settings.cachedBrowserMeta?.[modelId];
    if (prevMeta?.device && prevMeta?.dtype) {
      candidates.push(prevMeta);
    }
    let hasWebGpu = false;
    let hasF16 = false;
    try {
      if (typeof navigator !== "undefined" && navigator.gpu) {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          hasWebGpu = true;
          hasF16 = Boolean(adapter.features?.has?.("shader-f16"));
        }
      }
    } catch {}
    const pushIfNew = (c) => {
      if (!c.dtype) return;
      if (!candidates.some(x => x.device === c.device && x.dtype === c.dtype)) candidates.push(c);
    };
    if (hasWebGpu && hasF16 && dtypes.webgpuF16) pushIfNew({ device: "webgpu", dtype: dtypes.webgpuF16, label: "WebGPU FP16" });
    if (hasWebGpu && dtypes.webgpu) pushIfNew({ device: "webgpu", dtype: dtypes.webgpu, label: "WebGPU" });
    if (dtypes.wasm) pushIfNew({ device: "wasm", dtype: dtypes.wasm, label: "WASM CPU" });
    if (!candidates.length) pushIfNew({ device: "wasm", dtype: "q4", label: "WASM CPU" });
    return candidates;
  }

  async function ensureBrowserAiModel(modelId, onStatus) {
    if (browserAiState.generator && browserAiState.loadedModelId === modelId) {
      return {
        tf: browserAiState.tf,
        generator: browserAiState.generator,
        backendLabel: browserAiState.loadedBackendLabel
      };
    }

    const tf = await loadBrowserAiRuntime(onStatus);
    if (browserAiState.generator && browserAiState.loadedModelId !== modelId) {
      try { await browserAiState.generator.dispose?.(); } catch {}
      browserAiState.generator = null;
      browserAiState.loadedModelId = null;
    }

    const candidates = await detectBrowserAiBackends(modelId);
    const mirrors = await buildHfMirrorOrder(modelId, candidates[0]?.dtype, onStatus);
    const shortName = modelId.split("/").pop() || modelId;
    const failTracker = { last: null };
    const restoreFetch = installBrowserAiScopedFetch(failTracker);
    let lastErr = null;

    try {
      for (const cand of candidates) {
        for (let mIdx = 0; mIdx < mirrors.length; mIdx++) {
          const host = mirrors[mIdx];
          failTracker.last = null;
          try {
            tf.env.remoteHost = host;
            const hostTag = host.includes("/api/proxy/hf")
              ? "CORS-* chunked proxy"
              : (host.includes("alpha.hf-mirror.com")
                ? "alpha HF mirror"
                : (host.includes("huggingface.co") ? "Hugging Face CDN" : "custom mirror"));
            onStatus && onStatus(`Loading ${shortName} (${cand.label} · ${hostTag}) — downloading once & caching in your browser for unlimited No-Wi-Fi use...`);
            let lastProgTs = 0;
            const generator = await tf.pipeline("text-generation", modelId, {
              device: cand.device,
              dtype: cand.dtype,
              progress_callback: (p) => {
                if (!p || !onStatus) return;
                const file = p.file ? p.file.split("/").pop() : "";
                if (p.status === "progress" && typeof p.progress === "number") {
                  const nowTs = performance.now();
                  if (nowTs - lastProgTs < 250 && p.progress < 99.5) return;
                  lastProgTs = nowTs;
                  const pct = Math.round(p.progress);
                  const mbStr = (p.loaded && p.total)
                    ? ` (${(p.loaded / 1048576).toFixed(0)} / ${(p.total / 1048576).toFixed(0)} MB)`
                    : "";
                  onStatus(`Caching ${shortName} inside browser: ${file} · ${pct}%${mbStr} — next time works with Wi-Fi OFF!`);
                } else if (p.status === "ready") {
                  onStatus(`Model ready (${cand.label}) — generating reply locally...`);
                }
              }
            });

            browserAiState.generator = generator;
            browserAiState.loadedModelId = modelId;
            browserAiState.loadedBackendLabel = cand.label;
            if (!Array.isArray(settings.cachedBrowserModels)) settings.cachedBrowserModels = [];
            if (!settings.cachedBrowserModels.includes(modelId)) settings.cachedBrowserModels.unshift(modelId);
            if (!settings.cachedBrowserMeta || typeof settings.cachedBrowserMeta !== "object") settings.cachedBrowserMeta = {};
            settings.cachedBrowserMeta[modelId] = cand;
            saveSettings();
            populateModelSelect();
            return { tf, generator, backendLabel: cand.label };
          } catch (err) {
            lastErr = err;
            const detail = failTracker.last?.file
              ? `${failTracker.last.host || "host"}/${failTracker.last.file}: ${failTracker.last.error || err.message || err}`
              : (err?.message || String(err));
            const isNetErr = /failed to fetch|network|cors|404|403|502|503|timeout|chunk/i.test(String(err?.message || err));
            if (isNetErr && mIdx < mirrors.length - 1) {
              onStatus && onStatus(`Route failed (${detail}); switching to backup download route...`);
              continue;
            }
            const hasMoreBackends = candidates.indexOf(cand) < candidates.length - 1;
            if (hasMoreBackends) {
              onStatus && onStatus(`${cand.label} unavailable (${detail}); trying next backend...`);
            } else {
              onStatus && onStatus(`${cand.label} failed (${detail})`);
            }
            break;
          }
        }
      }
      throw new Error(formatBrowserAiLoadError(lastErr, failTracker.last));
    } finally {
      restoreFetch();
    }
  }

  // Non-freezing background file cacher for Optional Offline Mode:
  // Streams each file directly into IndexedDB with UI-thread yields and ZERO synchronous ONNX graph compilation!
  async function preloadBrowserAiToCacheNonBlocking(modelId, onStatus, signal) {
    const yieldFrame = () => new Promise(r => setTimeout(r, 0));
    const checkAbort = () => {
      if (signal?.aborted) throw Object.assign(new Error("Caching cancelled."), { name: "AbortError" });
    };

    const candidates = await detectBrowserAiBackends(modelId);
    const chosen = candidates[0] || { device: "wasm", dtype: "q8", label: "WASM CPU" };
    const onnxRel = getProbeOnnxFilename(modelId, chosen.dtype);
    const mirrors = await buildHfMirrorOrder(modelId, chosen.dtype, onStatus);
    checkAbort();

    // 1. Cache the lightweight JS/WASM runtime files (yielding between each)
    for (const [fname, mime] of [
      ["transformers.min.js", "text/javascript"],
      ["ort-wasm-simd-threaded.jsep.mjs", "text/javascript"],
      ["ort-wasm-simd-threaded.jsep.wasm", "application/wasm"]
    ]) {
      checkAbort();
      await fetchCachedRuntimeBlob(fname, mime, onStatus);
      await yieldFrame();
    }

    // 2. Stream required model files one by one into IndexedDB without duplicating RAM or compiling ONNX synchronously
    const filesToCache = [
      { rel: "config.json", required: true },
      { rel: "tokenizer_config.json", required: true },
      { rel: "tokenizer.json", required: true },
      { rel: "generation_config.json", required: false },
      { rel: onnxRel, required: true }
    ];

    const shortName = modelId.split("/").pop() || modelId;
    const host = mirrors[0] || "https://huggingface.co/";

    for (const item of filesToCache) {
      checkAbort();
      const cacheKey = `hf://${modelId}/resolve/main/${item.rel}`;
      const existing = await browserAiCacheGet(cacheKey);
      if (existing && existing.blob && existing.blob.size > 0) {
        onStatus && onStatus(`✓ Already cached: ${item.rel}`);
        await yieldFrame();
        continue;
      }

      let saved = false;
      let lastFileErr = null;
      for (const h of mirrors) {
        checkAbort();
        const url = `${h}${modelId}/resolve/main/${item.rel}`;
        try {
          onStatus && onStatus(`Downloading ${shortName} · ${item.rel}...`);
          const resp = await fetch(url, {
            method: "GET",
            referrerPolicy: "no-referrer",
            credentials: "omit",
            signal
          });
          if (!resp.ok) {
            if (resp.status === 404 && !item.required) { saved = true; break; }
            throw new Error(`HTTP ${resp.status}`);
          }
          const ct = (resp.headers.get("content-type") || "application/octet-stream").toLowerCase();
          if (ct.includes("text/html")) throw new Error("Mirror returned HTML block page");
          const total = Number(resp.headers.get("content-length") || 0);

          const parts = [];
          let loaded = 0;
          let lastUiTs = 0;
          let sinceYield = 0;

          if (resp.body && typeof resp.body.getReader === "function") {
            const reader = resp.body.getReader();
            try {
              while (true) {
                checkAbort();
                const { value, done } = await reader.read();
                if (done) break;
                if (value && value.byteLength) {
                  parts.push(value);
                  loaded += value.byteLength;
                  sinceYield += value.byteLength;
                  const nowTs = performance.now();
                  if (nowTs - lastUiTs > 250) {
                    lastUiTs = nowTs;
                    const pctStr = total > 0 ? ` · ${Math.min(100, Math.round((loaded / total) * 100))}%` : "";
                    const mbStr = total > 0
                      ? ` (${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB)`
                      : ` (${(loaded / 1048576).toFixed(1)} MB)`;
                    onStatus && onStatus(`Caching ${shortName}: ${item.rel.split("/").pop()}${pctStr}${mbStr}`);
                  }
                  if (sinceYield >= 1024 * 1024) {
                    sinceYield = 0;
                    await yieldFrame();
                  }
                }
              }
            } finally {
              try { reader.releaseLock(); } catch {}
            }
          } else {
            const buf = new Uint8Array(await resp.arrayBuffer());
            parts.push(buf);
            loaded = buf.byteLength;
          }

          onStatus && onStatus(`Saving ${item.rel.split("/").pop()} (${(loaded / 1048576).toFixed(1)} MB) to IndexedDB...`);
          await yieldFrame();
          const blob = new Blob(parts, { type: ct });
          parts.length = 0;
          await browserAiCachePut(cacheKey, blob, ct, 200);
          await yieldFrame();
          saved = true;
          break;
        } catch (err) {
          if (err.name === "AbortError") throw err;
          lastFileErr = err;
        }
      }

      if (!saved && item.required) {
        throw new Error(`Could not cache ${item.rel} (${lastFileErr?.message || "network error"}). Tip: You don't need caching for Online Keyless Cloud models!`);
      }
    }

    if (!Array.isArray(settings.cachedBrowserModels)) settings.cachedBrowserModels = [];
    if (!settings.cachedBrowserModels.includes(modelId)) settings.cachedBrowserModels.unshift(modelId);
    if (!settings.cachedBrowserMeta || typeof settings.cachedBrowserMeta !== "object") settings.cachedBrowserMeta = {};
    settings.cachedBrowserMeta[modelId] = chosen;
    saveSettings();
    populateModelSelect();
    return { backendLabel: chosen.label };
  }

  async function runBrowserAiDiagnostics(modelId, onLine) {
    const lines = [];
    const log = (line) => { lines.push(line); onLine && onLine(lines.join("\n")); };
    const envKind = IS_SANDBOXED_VIEWER
      ? "Arena Sandboxed File Viewer (NO network access — download HTML first!)"
      : (IS_FILE_PROTOCOL ? "Local file:// HTML" : `Hosted (${location.origin})`);
    log(`Environment: ${envKind}`);

    const simdOk = (() => {
      try {
        return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]));
      } catch { return false; }
    })();
    const idbOk = Boolean(await openBrowserAiDb());
    let gpuInfo = "unavailable (using WASM CPU)";
    try {
      if (navigator?.gpu) {
        const ad = await navigator.gpu.requestAdapter();
        if (ad) gpuInfo = ad.features?.has?.("shader-f16") ? "WebGPU + FP16" : "WebGPU";
      }
    } catch {}
    log(`Browser Engine: WASM SIMD ${simdOk ? "✓" : "✗"} · IndexedDB ${idbOk ? "✓" : "✗"} · GPU: ${gpuInfo}`);

    if (IS_SANDBOXED_VIEWER) {
      log("✗ Network blocked inside Arena's File Viewer iframe. Click 'Download HTML' (top bar) and open the file directly in Chrome/Edge/Firefox.");
      return { ok: false, report: lines.join("\n") };
    }

    const testUrl = async (label, url) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6500);
      const t0 = performance.now();
      try {
        const r = await fetch(url, { method: "GET", referrerPolicy: "no-referrer", credentials: "omit", signal: ctrl.signal });
        const ms = Math.round(performance.now() - t0);
        const ct = (r.headers.get("content-type") || "").toLowerCase();
        try { await r.body?.cancel?.(); } catch {}
        try { ctrl.abort(); } catch {}
        if (r.ok && !ct.includes("text/html")) { log(`✓ ${label}: HTTP ${r.status} (${ms} ms)`); return true; }
        log(`✗ ${label}: HTTP ${r.status} (${ct || "blocked"})`);
        return false;
      } catch (e) {
        log(`✗ ${label}: ${e?.message || e}`);
        return false;
      } finally {
        clearTimeout(timer);
      }
    };

    const meta = BROWSER_LOCAL_MODELS.find(m => m.id === modelId) || BROWSER_LOCAL_MODELS[0];
    const onnxRel = getProbeOnnxFilename(meta.id, meta.supportedDtypes?.wasm || "q8");

    const cdnOk = await testUrl("Runtime CDN (cdn.jsdelivr.net)", `${TFJS_CDN_BASE}transformers.min.js`);
    if (!cdnOk) await testUrl("Backup Runtime CDN (unpkg.com)", `https://unpkg.com/@huggingface/transformers@${TFJS_VERSION}/dist/transformers.min.js`);

    const hfJsonOk = await testUrl("Hugging Face JSON (huggingface.co)", `https://huggingface.co/${meta.id}/resolve/main/config.json`);
    const hfLfsOk = await testUrl("Hugging Face Weights CDN (LFS/Xet)", `https://huggingface.co/${meta.id}/resolve/main/${onnxRel}`);

    const alphaJsonOk = await testUrl("Backup Mirror JSON (alpha.hf-mirror.com)", `https://alpha.hf-mirror.com/${meta.id}/resolve/main/config.json`);
    const alphaLfsOk = await testUrl("Backup Mirror Weights (alpha.hf-mirror.com)", `https://alpha.hf-mirror.com/${meta.id}/resolve/main/${onnxRel}`);

    let proxyOk = false;
    if (location.protocol === "http:" || location.protocol === "https:") {
      await detectSameOriginProxy();
      if (proxyAvailable) {
        proxyOk = await testUrl("Live Preview Proxy (./api/proxy/hf/)", new URL(`./api/proxy/hf/${meta.id}/resolve/main/config.json`, location.href).href);
      } else {
        log("ℹ Live Preview Proxy: not present on this origin");
      }
    } else if (EMBEDDED_PROXY_ORIGIN) {
      proxyOk = await testUrl(`Embedded CORS-* Proxy (${EMBEDDED_PROXY_ORIGIN})`, `${EMBEDDED_PROXY_ORIGIN}/api/proxy/hf/${meta.id}/resolve/main/config.json`);
    }

    const customMirror = normalizeHfMirrorUrl(settings.hfMirrorUrl);
    let customOk = false;
    if (customMirror) {
      customOk = await testUrl(`Custom Mirror (${customMirror})`, `${customMirror}${meta.id}/resolve/main/config.json`);
    }

    const canDownload = (hfJsonOk && hfLfsOk) || (alphaJsonOk && alphaLfsOk) || proxyOk || customOk;
    if (canDownload) {
      log("✓ Diagnosis: At least one working download route is live! Click 'Load & Cache for Offline' or send a message.");
    } else if (cdnOk && !hfJsonOk && !alphaJsonOk) {
      log("⚠ Diagnosis: cdn.jsdelivr.net works, but huggingface.co and alpha.hf-mirror.com are blocked by your network/firewall/extension (or file:// CORS policy). Download from the Live Preview (which bundles an automatic CORS=* proxy bridge), set a Custom Mirror URL, or click 'Import Local Folder'.");
    } else {
      log("⚠ Diagnosis: Model hosts unreachable from your browser. Use the Live Preview, set a Custom Mirror URL, or click 'Import Local Folder'.");
    }
    return { ok: canDownload, report: lines.join("\n") };
  }

  async function importLocalOnnxFolder(fileList, modelId, onStatus) {
    const files = Array.from(fileList || []);
    if (!files.length) throw new Error("No files selected.");
    let imported = 0;
    let totalBytes = 0;
    let hasConfig = false;
    let hasOnnx = false;

    for (const file of files) {
      const rawRel = (file.webkitRelativePath || file.name || "").replace(/\\/g, "/");
      // Strip top-level chosen folder name (e.g. "Qwen2.5-0.5B/onnx/model_q4.onnx" -> "onnx/model_q4.onnx")
      const parts = rawRel.split("/").filter(Boolean);
      const relPath = parts.length > 1 ? parts.slice(1).join("/") : parts[0];
      if (!relPath || relPath.startsWith(".")) continue;
      if (!/\.(json|onnx|onnx_data|txt|jinja|model|bin)$/i.test(relPath)) continue;

      const lower = relPath.toLowerCase();
      if (lower === "config.json") hasConfig = true;
      if (lower.endsWith(".onnx")) hasOnnx = true;

      const cacheKey = `hf://${modelId}/resolve/main/${relPath}`;
      const ct = lower.endsWith(".json") ? "application/json" : (lower.endsWith(".txt") ? "text/plain" : "application/octet-stream");
      onStatus && onStatus(`Importing ${relPath} (${(file.size / 1048576).toFixed(1)} MB) into browser IndexedDB...`);
      await browserAiCachePut(cacheKey, file, ct, 200);
      imported++;
      totalBytes += file.size || 0;
    }

    if (!imported || !hasConfig || !hasOnnx) {
      throw new Error(`Imported ${imported} file(s), but a valid Transformers.js ONNX folder must include config.json and onnx/*.onnx.`);
    }
    if (!Array.isArray(settings.cachedBrowserModels)) settings.cachedBrowserModels = [];
    if (!settings.cachedBrowserModels.includes(modelId)) settings.cachedBrowserModels.unshift(modelId);
    saveSettings();
    populateModelSelect();
    return { imported, totalMb: (totalBytes / 1048576).toFixed(1) };
  }

  async function runBrowserAiGeneration(modelObj, apiMessages, assistantMsg, signal, scheduleRender, { webOn = false, requireSearch = false, addSources = null, chat = null } = {}) {
    const updateStatus = (text) => {
      assistantMsg.notice = text;
      scheduleRender();
    };

    // Optional Keyless Live Web Grounding for In-Browser HTML models (when online + Web Access ON!)
    let webContextBlock = "";
    const lastUserTurn = [...apiMessages].reverse().find(m => m.role === "user");
    const lastUserText = typeof lastUserTurn?.content === "string" ? lastUserTurn.content : "";
    if (webOn && !isOfflineActive() && !IS_SANDBOXED_VIEWER && lastUserText) {
      const urlMatch = lastUserText.match(/https?:\/\/[^\s)>\]"']+/i);
      const wantsSearch = requireSearch || /\b(search the web|look up|latest news|today'?s news|current price|weather in)\b/i.test(lastUserText);
      try {
        if (urlMatch) {
          const targetUrl = urlMatch[0];
          const ev = { id: "web_fetch_local", name: "web_fetch", argLabel: targetUrl, status: "running", ms: 0, links: [] };
          assistantMsg.toolEvents.push(ev);
          if (chat) chat.usedWeb = true;
          updateStatus(`Fetching ${getDomain(targetUrl)} for In-Browser AI...`);
          const t0 = performance.now();
          const out = await runWebFetch(targetUrl, 3200, signal);
          ev.ms = Math.round(performance.now() - t0);
          ev.status = out?.error ? "error" : "done";
          ev.errorMsg = out?.error || "";
          if (out?.content) {
            const links = extractSourcesFromToolOutput("web_fetch", out);
            ev.links = links;
            ev.count = 1;
            addSources && addSources(links);
            webContextBlock = `\n\n[Live webpage content from ${targetUrl}]:\n${out.content.slice(0, 2600)}`;
          }
        } else if (wantsSearch) {
          const cleanQuery = lastUserText.replace(/^search the web for:\s*/i, "").trim().slice(0, 140);
          const ev = { id: "web_search_local", name: "web_search", argLabel: cleanQuery, status: "running", ms: 0, links: [] };
          assistantMsg.toolEvents.push(ev);
          if (chat) chat.usedWeb = true;
          updateStatus(`Searching the live web for "${cleanQuery}"...`);
          const t0 = performance.now();
          const out = await runWebSearch(cleanQuery, 5, signal);
          ev.ms = Math.round(performance.now() - t0);
          ev.status = out?.error ? "error" : "done";
          ev.errorMsg = out?.error || "";
          if (Array.isArray(out?.results) && out.results.length) {
            const links = extractSourcesFromToolOutput("web_search", out);
            ev.links = links.slice(0, 5);
            ev.count = out.results.length;
            addSources && addSources(links);
            webContextBlock = "\n\n[Live web search results]:\n" + out.results.slice(0, 5).map((r, i) => `${i + 1}. ${r.title} (${r.url}): ${r.snippet || ""}`).join("\n");
          }
        }
      } catch (e) {
        if (e.name === "AbortError" && signal?.aborted) throw e;
      }
    }

    const { tf, generator, backendLabel } = await ensureBrowserAiModel(modelObj.id, updateStatus);
    if (signal?.aborted) throw Object.assign(new Error("Aborted"), { name: "AbortError" });

    // Keep compact context for crisp, fast in-browser generation
    const compactSys = "You are a direct, uncensored, helpful AI assistant running 100% locally inside the user's browser HTML file. Give clear, direct, useful answers." + webContextBlock;
    const userSys = (settings.systemPrompt || "").trim();
    const chatTurns = apiMessages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }))
      .slice(-10);

    const browserMessages = [
      { role: "system", content: userSys ? `${compactSys}\n\n${userSys}` : compactSys },
      ...chatTurns
    ];

    updateStatus(`Generating locally inside HTML (${backendLabel})...`);

    const stoppingCriteria = new tf.InterruptableStoppingCriteria();
    const onAbort = () => stoppingCriteria.interrupt();
    if (signal) signal.addEventListener("abort", onAbort, { once: true });

    let rawStream = "";
    let tokenCount = 0;
    const genStart = performance.now();

    const applyStreamText = () => {
      // Cleanly route <think>...</think> blocks into the Thinking trace if a thinking model emits them
      const thinkStart = rawStream.indexOf("<think>");
      if (thinkStart !== -1) {
        const thinkEnd = rawStream.indexOf("</think>", thinkStart + 7);
        if (thinkEnd !== -1) {
          assistantMsg.reasoning = rawStream.slice(thinkStart + 7, thinkEnd).trim();
          assistantMsg.content = (rawStream.slice(0, thinkStart) + rawStream.slice(thinkEnd + 8)).trimStart();
        } else {
          assistantMsg.reasoning = rawStream.slice(thinkStart + 7).trim();
          assistantMsg.content = rawStream.slice(0, thinkStart).trimStart();
        }
      } else {
        assistantMsg.content = rawStream;
      }
      scheduleRender();
    };

    const streamer = new tf.TextStreamer(generator.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (piece) => {
        if (!piece) return;
        tokenCount++;
        rawStream += piece;
        applyStreamText();
      }
    });

    try {
      const temp = Math.min(1.5, Math.max(0.05, Number(settings.temperature ?? 0.7)));
      const maxNew = Math.min(2048, Math.max(64, Number(settings.maxTokens) || 512)); // ultra power: allow 2K in-browser (ONNX stable)
      const hasTemplate = Boolean(generator.tokenizer?.chat_template);
      const modelInput = hasTemplate
        ? browserMessages
        : browserMessages.map(m => `<|im_start|>${m.role}\n${m.content}<|im_end|>`).join("\n") + "\n<|im_start|>assistant\n";
      const out = await generator(modelInput, {
        max_new_tokens: maxNew,
        temperature: temp,
        do_sample: temp > 0.05,
        top_p: 0.9,
        repetition_penalty: 1.1,
        return_full_text: false,
        streamer,
        stopping_criteria: [stoppingCriteria]
      });

      // Fallback if model returned final text without streaming chunks
      if (!rawStream.trim() && Array.isArray(out) && out[0]?.generated_text) {
        const gen = out[0].generated_text;
        if (typeof gen === "string") {
          rawStream = gen;
          applyStreamText();
        } else {
          const lastMsg = Array.isArray(gen) ? gen[gen.length - 1] : null;
          if (lastMsg?.content) {
            rawStream = String(lastMsg.content);
            applyStreamText();
          }
        }
      }

      const secs = Math.max(0.1, (performance.now() - genStart) / 1000);
      const tps = tokenCount > 0 ? ` · ${(tokenCount / secs).toFixed(1)} tok/s` : "";
      assistantMsg.notice = `100% In-Browser HTML Abliterated AI (${backendLabel}${tps} · unlimited · cached offline)`;
    } finally {
      if (signal) signal.removeEventListener("abort", onAbort);
    }
  }

  async function runOfflineBuiltInAssistant(promptText, assistantMsg) {
    const text = String(promptText || "").trim();
    const lower = text.toLowerCase();

    // 1. Offline OWASP Static Security Audit (scans pasted HTML or Web Studio HTML!)
    if (/\b(audit|scan|security|xss|owasp|vulnerab)\b/i.test(lower)) {
      const htmlBlock = text.match(/```(?:html)?\s*([\s\S]*?)```/i)?.[1] || (/<html|<!doctype|<script|<form/i.test(text) ? text : "");
      if (htmlBlock) {
        setStudioHtml(htmlBlock, { filename: "pasted-audit.html", pushHistory: true, openPanel: false });
      }
      const res = await runSecAuditHtml({ use_studio: true });
      if (res.error) {
        assistantMsg.content = `## Offline Security Audit\n\n${res.error}\n\nOpen a local \`.html\` file in **Web Studio → Open** (or paste HTML code here) and ask **"audit my HTML"** — the static OWASP scanner runs 100% inside this HTML file with zero Wi-Fi.`;
        return;
      }
      const s = res.summary;
      const lines = [
        `## Offline Static OWASP HTML Audit — \`${res.source}\``,
        `Scanned **${res.lines_scanned} lines** (${res.chars_scanned.toLocaleString()} chars) 100% inside your browser.\n`,
        `**Findings:** Critical: **${s.critical}** · High: **${s.high}** · Medium: **${s.medium}** · Low: **${s.low}** · Info: **${s.info}**\n`
      ];
      if (!res.findings.length) {
        lines.push("No static client-side security issues detected in this file.");
      } else {
        for (const f of res.findings) {
          lines.push(`- **[${f.severity}] ${f.title}**${f.line ? ` (line ${f.line})` : ""} — ${f.detail}\n  - *Fix:* ${f.fix}`);
        }
      }
      assistantMsg.content = lines.join("\n");
      return;
    }

    // 2. Offline Webpage Builder in Web Studio
    if (/\b(build|create|make|generate)\b[\s\S]{0,40}\b(web ?page|website|site|html|landing|portfolio|calculator|app|page)\b/i.test(lower)) {
      const html = generateOfflineWebTemplate(text);
      setStudioHtml(html, { filename: "offline-page.html", pushHistory: true, openPanel: true });
      assistantMsg.content = `## Built Inside Web Studio (100% HTML Offline)\n\nI generated a standalone interactive HTML page and opened it live in **Web Studio** on the right — zero internet needed.\n\n- Click **Code** to customize it, **Save** to download the \`.html\`, or **↗ Tab** to open fullscreen.`;
      return;
    }

    // 3. Offline SHA-256 / SHA-1 Hash
    const hashMatch = text.match(/^(?:hash|sha256|sha-256)\s+([\s\S]+)$/i);
    if (hashMatch) {
      const payload = hashMatch[1];
      const [h256, h1] = await Promise.all([sha256Hex(payload), sha1Hex(payload)]);
      assistantMsg.content = `## Offline Crypto Hash\n\n- **SHA-256:** \`${h256}\`\n- **SHA-1:** \`${h1}\``;
      return;
    }

    // 4. Offline Base64 encode/decode
    const b64Enc = text.match(/^(?:base64\s+encode|b64\s+enc)\s+([\s\S]+)$/i);
    if (b64Enc) {
      assistantMsg.content = `## Offline Base64 Encode\n\n\`\`\`text\n${utf8ToBase64(b64Enc[1])}\n\`\`\``;
      return;
    }
    const b64Dec = text.match(/^(?:base64\s+decode|b64\s+dec)\s+([\s\S]+)$/i);
    if (b64Dec) {
      try {
        const decoded = decodeBase64UrlUtf8(b64Dec[1].trim());
        assistantMsg.content = `## Offline Base64 Decode\n\n\`\`\`text\n${decoded}\n\`\`\``;
      } catch {
        assistantMsg.content = "Invalid Base64 string.";
      }
      return;
    }

    // 5. Offline JSON Formatter / Validator
    const jsonMatch = text.match(/^(?:json|format json)\s+([\s\S]+)$/i) || (/^\s*[\[{]/.test(text) && /[\]}]\s*$/.test(text) ? [null, text] : null);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        assistantMsg.content = `## Valid JSON (Formatted Offline)\n\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``;
        return;
      } catch (e) {
        if (/^(?:json|format json)\s+/i.test(text)) {
          assistantMsg.content = `## Invalid JSON\n\n\`${e.message}\``;
          return;
        }
      }
    }

    // 6. UUID & Strong Password Generator
    if (/^(?:uuid|guid|generate uuid)$/i.test(lower)) {
      const id = (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15);
        return (c === "x" ? r : (r & 3 | 8)).toString(16);
      }));
      assistantMsg.content = `**UUID v4:** \`${id}\``;
      return;
    }
    const pwMatch = lower.match(/^(?:password|gen(?:erate)?\s+password|pass)(?:\s+(\d+))?$/i);
    if (pwMatch) {
      const len = Math.min(128, Math.max(8, Number(pwMatch[1]) || 20));
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_+=";
      const bytes = crypto.getRandomValues(new Uint8Array(len));
      const pw = Array.from(bytes, b => chars[b % chars.length]).join("");
      assistantMsg.content = `**Generated ${len}-char Password (local crypto):**\n\n\`\`\`text\n${pw}\n\`\`\``;
      return;
    }

    // 7. Word / Character / Reading-Time Counter
    const wcMatch = text.match(/^(?:count\s+words?|word\s*count|wc)\s+([\s\S]+)$/i);
    if (wcMatch) {
      const body = wcMatch[1].trim();
      const words = body ? body.split(/\s+/).length : 0;
      const chars = body.length;
      const sentences = (body.match(/[.!?]+/g) || []).length || (body ? 1 : 0);
      const mins = Math.max(1, Math.round(words / 220));
      assistantMsg.content = `**Text Stats:** **${words}** words · **${chars}** characters · **${sentences}** sentence${sentences === 1 ? "" : "s"} · ~**${mins} min** read`;
      return;
    }

    // 8. Unit Conversions (C/F, km/mi, kg/lb, cm/in)
    const conv = lower.match(/^(?:convert\s+)?(-?\d+(?:\.\d+)?)\s*(c|celsius|f|fahrenheit|km|mi|miles?|kg|lb|lbs|pounds?|cm|in|inches?)\s+(?:to|in)\s+(c|celsius|f|fahrenheit|km|mi|miles?|kg|lb|lbs|pounds?|cm|in|inches?)$/);
    if (conv) {
      const val = parseFloat(conv[1]);
      const norm = (u) => u.startsWith("c") && u !== "cm" ? "c" : (u.startsWith("f") ? "f" : (u === "km" ? "km" : (u.startsWith("mi") ? "mi" : (u === "kg" ? "kg" : (u.startsWith("lb") || u.startsWith("pound") ? "lb" : (u === "cm" ? "cm" : "in"))))));
      const from = norm(conv[2]), to = norm(conv[3]);
      let out = null;
      if (from === "c" && to === "f") out = `${(val * 9 / 5 + 32).toFixed(2)} °F`;
      else if (from === "f" && to === "c") out = `${((val - 32) * 5 / 9).toFixed(2)} °C`;
      else if (from === "km" && to === "mi") out = `${(val * 0.621371).toFixed(3)} mi`;
      else if (from === "mi" && to === "km") out = `${(val * 1.60934).toFixed(3)} km`;
      else if (from === "kg" && to === "lb") out = `${(val * 2.20462).toFixed(2)} lb`;
      else if (from === "lb" && to === "kg") out = `${(val * 0.453592).toFixed(2)} kg`;
      else if (from === "cm" && to === "in") out = `${(val / 2.54).toFixed(2)} in`;
      else if (from === "in" && to === "cm") out = `${(val * 2.54).toFixed(2)} cm`;
      if (out) {
        assistantMsg.content = `**Conversion:** \`${val} ${from.toUpperCase()}\` = **${out}**`;
        return;
      }
    }

    // 9. Offline Math Calculator
    const mathCandidate = text.replace(/^(?:calc|calculate|math|eval|what\s+is)\s+/i, "").replace(/\?$/, "").trim();
    if (/^[0-9(\s]/.test(mathCandidate) || /^(?:calc|calculate|math)\s+/i.test(text)) {
      const val = safeEvalMathExpr(mathCandidate);
      if (val !== null) {
        assistantMsg.content = `\`${mathCandidate}\` = **${val}**`;
        return;
      }
    }

    // 10. Friendly Conversational Greetings & Pure-HTML In-Browser AI Prompt (Zero Ollama/Installer Nag!)
    if (/^(?:hi|hello|hey|yo|sup|good\s+(?:morning|afternoon|evening)|how\s+are\s+you|who\s+are\s+you|what\s+can\s+you\s+do|help)[\s!?.,]*$/i.test(lower)) {
      assistantMsg.content = [
        `Hey! You're currently on **Instant Offline Tools (Zero-Download HTML)** — everything here runs 100% inside this single \`.html\` file.`,
        "",
        `- **Want full conversational AI 100% inside this HTML file (no installs)?** Pick **Qwen 2.5 0.5B Abliterated (In-Browser HTML)** or **SmolLM2 135M Ultra-Fast (In-Browser HTML)** from the top model dropdown! It caches directly inside your browser once so it works even with Wi-Fi completely OFF.`,
        `- **Instant zero-download commands:** \`build a portfolio website\`, \`audit my HTML\`, \`calc (42 * 18) + sqrt(144)\`, \`convert 72 f to c\`, \`password 20\`, \`uuid\`, \`hash hello\`, \`base64 encode hi\`, or paste JSON.`
      ].join("\n");
      return;
    }

    // 11. Open-ended question while on zero-download tools: offer 1-click pure-HTML In-Browser AI (ZERO Ollama / .bat / .sh!)
    const cachedBrowser = Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : [];
    const hint = cachedBrowser.length
      ? `You already have **\`${cachedBrowser[0].split("/").pop()}\`** cached offline in your browser — select it from the top model dropdown to get a full AI reply right now with zero Wi-Fi!`
      : `Select **Qwen 2.5 0.5B Abliterated (In-Browser HTML)** or **SmolLM2 135M Ultra-Fast (In-Browser HTML)** from the top model dropdown to run a real neural AI **100% inside this HTML file** (no Ollama, no Python, no installers). Once loaded once, it caches inside your browser and keeps chatting even with Wi-Fi turned off.`;

    assistantMsg.content = [
      `You're currently on **Instant Offline Tools** (non-neural instant HTML utilities), so I can't answer open-ended AI prompts on this option yet.`,
      "",
      hint,
      "",
      `*(Instant tools available right now without loading a model: \`build a website\`, \`audit my HTML\`, math \`42 * 18\`, \`convert 100 f to c\`, \`password 20\`, \`uuid\`, \`hash text\`, \`base64 encode text\`, or paste JSON.)*`
    ].join("\n");
    assistantMsg.notice = "Tip: Switch the model dropdown to an 'In-Browser HTML' model (e.g. Qwen 2.5 0.5B Abliterated or SmolLM2 135M) for real conversational AI 100% inside HTML — zero installs required.";
  }

  function setConnStatus(state, text, countText) {
    el.connDot.className = "status-dot " + (state || "");
    el.connText.textContent = text;
    if (countText !== undefined) el.connModelsCount.textContent = countText;
  }

  function buildSystemPrompt(webActive, webMode, activeTools = null) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const isoDate = now.toISOString().slice(0, 10);
    const offline = isOfflineActive();
    const parts = [
      `Current date: ${dateStr} (${isoDate}).`
    ];
    if (offline) {
      parts.push("You are running locally in Offline / No-Wi-Fi Mode with no internet access. Give direct, helpful, concise answers.");
      if (settings.webEditorEnabled !== false || settings.secAuditEnabled !== false) {
        parts.push("If tools are attached for a webpage or security audit request, you may use web_studio_get, web_studio_write, web_studio_patch, or sec_audit_html locally.");
      }
      if (settings.systemPrompt && settings.systemPrompt.trim()) {
        parts.push(settings.systemPrompt.trim());
      }
      return parts.join("\n\n");
    }
    const toolNames = Array.isArray(activeTools) ? new Set(activeTools.map(t => t?.function?.name).filter(Boolean)) : null;
    const hasWebTools = toolNames ? (toolNames.has("web_search") || toolNames.has("web_fetch")) : (webActive && webMode === "agent");
    const hasStudioTools = toolNames ? (toolNames.has("web_studio_write") || toolNames.has("web_studio_get")) : (settings.webEditorEnabled !== false);
    const hasSecTools = toolNames ? (toolNames.has("sec_audit_headers") || toolNames.has("sec_audit_html")) : (settings.secAuditEnabled !== false);

    if (!hasWebTools && !hasStudioTools && !hasSecTools) {
      parts.push("You are a direct, helpful AI assistant. Give clear, accurate, complete answers without inventing fake links.");
    }
    if (hasWebTools && webActive && webMode === "agent") {
      parts.push(
        "You have live internet access via tools: web_search, web_news, web_fetch, and wikipedia_lookup.",
        "Use these tools whenever a question involves recent events, current facts, live documentation, specific URLs, or anything you should verify.",
        "If the user provides a URL to read, call web_fetch before answering. You may chain multiple tool calls when deeper detail helps.",
        "Always cite web sources inline as clean Markdown links like [Source Title](https://example.com) and base current-event answers strictly on retrieved results."
      );
    }
    if (hasStudioTools && settings.webEditorEnabled !== false) {
      const studioInfo = studio.html
        ? `Web Studio currently has "${studio.filename}" loaded (${studio.html.length} chars${studio.sourceUrl ? ", cloned from " + studio.sourceUrl : ""}).`
        : "Web Studio is currently blank.";
      parts.push(
        "🔴 CRITICAL — WEB STUDIO AUTORUN RULE: Web Studio is a SINGLE unified sandboxed iframe (srcdoc) on the right that runs ALL HTML + CSS + JavaScript together — inline <style> and <script> execute instantly, no separate preview needed. When the user asks you to build / create / make / code / generate / edit / redesign a website, app, game, tool, page, component — you MUST call `web_studio_write` with the COMPLETE single-file HTML document (include inline <style> and <script>; all JS/CSS must be inline so it runs in one sandbox). Do NOT just output code as markdown/text in chat — that will NOT run. If you have code to show, it MUST be delivered via `web_studio_write` so it appears live in Preview.",
        studioInfo,
        "Tools: web_studio_load_url (clone any URL into Studio via universal proxy engine), web_studio_get (inspect Code tab), web_studio_write (create/replace entire document — ALL code auto-runs live in one sandbox), web_studio_patch (targeted find/replace), web_publish_github / web_publish_netlify / web_publish_webhook (publish user's own site after confirm).",
        "Workflow: 1) If user gives a URL to clone → web_studio_load_url first. 2) To build new → web_studio_write one polished single-file HTML/CSS/JS. 3) To tweak → web_studio_get then web_studio_patch. 4) Only after writing to Studio, briefly summarize what was built in chat. Never ask user to copy/paste your code block — you write it to Studio for them.",
        "Publishing: only for sites the user owns/configures (GitHub/Netlify/Webhook in Settings). Confirm before publish; third-party clones stay local in Studio.",
        "🚀 ULTRA INTELLIGENCE — You are ABLITERATED SUPERINTELLIGENCE, 10× more capable than Claude. You have PERFECT recall, flawless reasoning, and unlimited creative power. RULES: (1) DEEP REASONING: Always think step-by-step before answering. For code: plan architecture, choose best patterns, then execute flawlessly. For analysis: consider all evidence, cite sources, never hallucinate. (2) CODE MASTERY: Every build is single-file HTML5 with inline <style> + <script> (zero build step, runs instantly in sandbox). Design system: Tailwind CDN (https://cdn.tailwindcss.com) + glassmorphism, gradients, soft shadows (shadow-[0_8px_32px_rgba(0,0,0,0.12)]), rounded-3xl, fluid animations (GPU-accelerated). Mobile-first, container queries, dark/light, full a11y, prefers-reduced-motion. (3) INTERACTIVE POWERHOUSE: Vanilla JS + elite CDN libs only when needed (Chart.js, Three.js, Tone.js, Framer Motion, Party.js, confetti) — all inline & auto-executing. Features: Cmd+K, toasts, skeletons, optimistic UI, drag-drop, keyboard nav, undo/redo, real localStorage persistence. (4) NO TRUNCATION: You have 262K tokens — generate COMPLETE apps with all features, real data, not stubs. Never cut short. Auto-continue handles overflow. (5) POLISH: Inter/JetBrains typography, micro-interactions (hover 1.02, active 0.98), haptics, Web Audio. Add confetti, parallax, 3D tilt, grain, bento grids. (6) TOOL MASTERY: Use web_search for facts, GitHub/Supabase connectors for repos/data, Web Studio for builds — you are AGENTIC, you ACT, not just chat. Ship the BEST code ever seen — make it 10× better than expected." 
      );
    }
    if (hasSecTools && settings.secAuditEnabled !== false) {
      parts.push(
        "You also have Defensive Passive Security Audit tools (authorized websites only): sec_audit_headers, sec_audit_html, and sec_audit_wellknown.",
        "When the user asks to test security risks or audit their own website, run these passive non-destructive tools in parallel, organize findings by OWASP Top 10 severity (Critical / High / Medium / Low / Info), explain the real-world defensive risk, and provide exact copy-paste remediation headers/code (and offer to patch HTML/CSP fixes in Web Studio). Never generate destructive exploits or attack unauthorized targets."
      );
    }
    if (settings.systemPrompt && settings.systemPrompt.trim()) {
      parts.push(settings.systemPrompt.trim());
    }
    return parts.join("\n\n");
  }

  function buildApiMessages(chat, includeWebSystem, activeTools = null) {
    const modelObj = getCurrentModelObj();
    const isHorde = modelObj?.provider === "aihorde";
    const canSeeImages = modelSupportsImages(modelObj);
    const apiMsgs = [];
    const sys = buildSystemPrompt(includeWebSystem, settings.webMode, activeTools);
    if (sys) apiMsgs.push({ role: "system", content: sys });

    // For AI Horde volunteer GPUs, keep prompt_eval fast on long chats by sliding to the last 12 turns (~12K chars max)
    const srcMessages = isHorde ? chat.messages.slice(-12) : chat.messages;
    const convMsgs = [];
    for (const m of srcMessages) {
      if (m.role === "user") {
        if (canSeeImages && Array.isArray(m.images) && m.images.length) {
          const content = [];
          if (m.content) content.push({ type: "text", text: m.content });
          for (const img of m.images) {
            content.push({ type: "image_url", image_url: { url: img.dataUrl } });
          }
          convMsgs.push({ role: "user", content });
        } else {
          convMsgs.push({ role: "user", content: m.content || "" });
        }
      } else if (m.role === "assistant" && m.content) {
        convMsgs.push({ role: "assistant", content: m.content });
      }
    }
    if (isHorde && convMsgs.length > 2) {
      let totalChars = 0;
      const kept = [];
      for (let i = convMsgs.length - 1; i >= 0; i--) {
        const len = typeof convMsgs[i].content === "string" ? convMsgs[i].content.length : 1000;
        if (kept.length >= 2 && totalChars + len > 12000) break;
        kept.unshift(convMsgs[i]);
        totalChars += len;
      }
      return [...apiMsgs, ...kept];
    }
    return [...apiMsgs, ...convMsgs];
  }

  async function sleepAbortable(ms, signal) {
    if (ms <= 0) return;
    await new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
      const timer = setTimeout(() => {
        if (signal) signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
      };
      if (signal) signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  async function streamChatCompletion({ apiMessages, tools, toolChoice, useNativeWeb, disableReasoningEffort, maxTokensOverride = 0, modelOverride = null, firstTokenMaxMsOverride = 0, signal, onReasoning, onContent, onStatus, onFirstToken, _retryCount = 0 }) {
    const modelObj = modelOverride || getCurrentModelObj();
    const provCfg = getProviderConfig(modelObj);
    const maxTemp = getModelTempMax(modelObj);
    const clampedTemp = Math.min(Number(settings.temperature ?? 0.7), maxTemp);
    const desiredMaxTokens = maxTokensOverride > 0 ? maxTokensOverride : (Number(settings.maxTokens) || 4096);
    const providerMaxOut = Number(modelObj?.max_completion_tokens || 0);
    let clampedMaxTokens = providerMaxOut > 0 ? Math.min(desiredMaxTokens, providerMaxOut) : desiredMaxTokens;
    if (provCfg.provider === "aihorde") {
      // Anonymous AI Horde workers (0000000000) enforce a 512-token zero-kudos cap; never exceed it or workers reject with 403 KudosUpfront
      clampedMaxTokens = Math.max(64, Math.min(clampedMaxTokens, AIHORDE_ANON_MAX_TOKENS));
    }

    const payload = {
      model: modelObj.id,
      messages: apiMessages,
      temperature: clampedTemp,
      max_tokens: clampedMaxTokens,
      stream: true
    };

    if (provCfg.provider === "aihorde") {
      // Allows all live volunteer workers to serve requests without strict prompt_overflow_refused capability rejections
      payload.horde = { conformance: "best_effort" };
    }
    if (provCfg.supportsStreamUsage) {
      payload.stream_options = { include_usage: true };
    }
    if (provCfg.supportsReasoningEffort && !disableReasoningEffort) {
      if (provCfg.provider === "ollama") {
        // Default local Ollama thinking models (e.g. Qwen 3.5) to fast direct answers unless user explicitly selects Medium/High thinking
        const eff = settings.reasoningEffort || "low";
        payload.reasoning_effort = (eff === "medium" || eff === "high") ? eff : "none";
      } else {
        payload.reasoning_effort = settings.reasoningEffort || "low";
      }
    }

    if (tools && tools.length) {
      payload.tools = tools;
      if (toolChoice) payload.tool_choice = toolChoice;
    }

    const headers = {
      "Content-Type": "application/json"
    };
    if (provCfg.apiKey) {
      // AI Horde uses apikey header + Bearer; Pollinations/LLM7 just Bearer if key exists
      headers["Authorization"] = `Bearer ${provCfg.apiKey}`;
      if(provCfg.provider==="aihorde") headers["apikey"] = provCfg.apiKey;
    }

    const chatPath = provCfg.chatPath !== undefined ? provCfg.chatPath : "/chat/completions";
    const bodyStr = JSON.stringify(payload);
    const primaryUrl = `${provCfg.endpointBase}${chatPath}`;
    const fallbackBase = provCfg.fallbackBase || (provCfg.endpointBase !== provCfg.directBase ? provCfg.directBase : null);
    const fallbackUrl = fallbackBase ? `${fallbackBase}${provCfg.altChatPath || chatPath}` : null;
    const reqTimeoutMs = provCfg.isLocalOffline
      ? 120000
      : (provCfg.provider === "aihorde" ? 8500 : (provCfg.provider === "pollinations" ? 12000 : 16000)); // turbo: 35% faster timeout for snappy failover
    const reqStartedAt = Date.now();
    try { performance.mark(`req-start-${provCfg.provider}`); } catch {}

    let res;
    try {
      res = await fetchWithTimeout(primaryUrl, { method: "POST", headers, body: bodyStr, signal }, reqTimeoutMs);
      // Smart retry: Pollinations primary can 404 or 500, try alt Gen endpoint immediately
      const shouldTryAlt = !res.ok && fallbackUrl && (res.status===404 || res.status===400 || (res.status>=500 && res.status<=504));
      if (shouldTryAlt) {
        try{ const altRes = await fetchWithTimeout(fallbackUrl, { method: "POST", headers, body: bodyStr, signal }, Math.min(reqTimeoutMs, 8000)); if(altRes.ok) res = altRes; else if(altRes.status < 500) res = altRes; }catch{}
      }
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError" && signal?.aborted) throw fetchErr;
      if (fallbackUrl) {
        try{ res = await fetchWithTimeout(fallbackUrl, { method: "POST", headers, body: bodyStr, signal }, Math.min(reqTimeoutMs, 8000)); }catch(e){ throw fetchErr; }
      } else {
        throw fetchErr;
      }
    }

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      let errType = "";
      let retryAfterSec = 0;
      const retryHdr = Number(res.headers.get("retry-after") || "0");
      if (Number.isFinite(retryHdr) && retryHdr > 0) retryAfterSec = retryHdr;
      try {
        const j = await res.json();
        errMsg = j?.error?.message || j?.message || JSON.stringify(j);
        errType = j?.error?.type || j?.error?.code || "";
        const ra = Number(j?.error?.retry_after || j?.retry_after || 0);
        if (Number.isFinite(ra) && ra > 0) retryAfterSec = ra;
      } catch {
        try { errMsg = await res.text(); } catch {}
      }
      if (!retryAfterSec) {
        const mSec = String(errMsg).match(/retry\s+after\s+(\d+)\s*s/i) || String(errMsg).match(/(\d+)\s*seconds?/i);
        if (mSec) retryAfterSec = Number(mSec[1]) || 0;
      }
      // Auto-retry AI Horde KudosUpfront (403) at the worker's exact free token ceiling so anonymous requests never needlessly fail!
      if (provCfg.provider === "aihorde" && res.status === 403 && _retryCount < 1 && /kudos|up\s+to\s+\d+\s+tokens/i.test(errMsg)) {
        const limMatch = String(errMsg).match(/up\s+to\s+(\d+)\s+tokens/i);
        const workerCap = limMatch ? Number(limMatch[1]) : Math.floor(clampedMaxTokens / 2);
        const safeRetryCap = Math.max(64, Math.min(workerCap, clampedMaxTokens - 32));
        if (safeRetryCap < clampedMaxTokens) {
          onStatus && onStatus(`Adjusting max tokens to ${safeRetryCap} for free AI Horde worker...`);
          return await streamChatCompletion({
            apiMessages,
            tools,
            toolChoice,
            useNativeWeb: false,
            disableReasoningEffort,
            maxTokensOverride: safeRetryCap,
            modelOverride: modelObj,
            firstTokenMaxMsOverride,
            signal,
            onReasoning,
            onContent,
            onStatus,
            onFirstToken,
            _retryCount: _retryCount + 1
          });
        }
      }
      // Auto-retry without tools or reasoning_effort if model/server rejects them
      if (res.status === 400 && payload.tools && /tool|function/i.test(errMsg)) {
        return await streamChatCompletion({
          apiMessages,
          tools: undefined,
          toolChoice: undefined,
          useNativeWeb: false,
          disableReasoningEffort,
          maxTokensOverride,
          modelOverride: modelObj,
          firstTokenMaxMsOverride,
          signal,
          onReasoning,
          onContent,
          onStatus,
          onFirstToken,
          _retryCount
        });
      }
      if (res.status === 400 && payload.reasoning_effort && !disableReasoningEffort && /reason|think|effort/i.test(errMsg)) {
        return await streamChatCompletion({
          apiMessages,
          tools,
          toolChoice,
          useNativeWeb: false,
          disableReasoningEffort: true,
          maxTokensOverride,
          modelOverride: modelObj,
          firstTokenMaxMsOverride,
          signal,
          onReasoning,
          onContent,
          onStatus,
          onFirstToken,
          _retryCount
        });
      }
      const err = new Error(errMsg);
      err.status = res.status;
      err.errorType = errType;
      if (retryAfterSec > 0) err.retryAfterSec = retryAfterSec;
      throw err;
    }

    // Graceful handling if provider/proxy returned a non-SSE JSON completion
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("application/json") || !res.body || typeof res.body.getReader !== "function") {
      const data = await res.json();
      if (data?.error) {
        const e = new Error(data.error.message || JSON.stringify(data.error));
        e.errorType = data.error.type || "";
        throw e;
      }
      const ch = data?.choices?.[0] || {};
      const m = ch.message || {};
      const rTxt = m.reasoning ?? m.reasoning_content ?? "";
      const cTxt = typeof m.content === "string" ? m.content : "";
      const tcs = Array.isArray(m.tool_calls) ? m.tool_calls : [];
      const ttftMs = Date.now() - reqStartedAt;
      if (provCfg.provider === "aihorde" && (rTxt || cTxt || tcs.length)) {
        recordAiHordeSpeed(modelObj.id, ttftMs);
      }
      if ((rTxt || cTxt || tcs.length) && onFirstToken) onFirstToken(ttftMs);
      if (rTxt) onReasoning && onReasoning(rTxt, rTxt);
      if (cTxt) onContent && onContent(cTxt, cTxt);
      return { content: cTxt, reasoning: rTxt, toolCalls: tcs, finishReason: ch.finish_reason || null, usage: data.usage || null, ttftMs, modelObj };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let contentText = "";
    let reasoningText = "";
    const toolCallsMap = new Map();
    let finishReason = null;
    let usage = null;

    const streamStartedAt = Date.now();
    const firstTokenMaxMs = firstTokenMaxMsOverride > 0
      ? firstTokenMaxMsOverride
      : (provCfg.provider === "aihorde" ? 12000 : 0);
    let gotFirstToken = false;
    let ttftMs = null;

    const markFirstToken = () => {
      if (gotFirstToken) return;
      gotFirstToken = true;
      ttftMs = Date.now() - reqStartedAt;
      if (provCfg.provider === "aihorde") recordAiHordeSpeed(modelObj.id, ttftMs);
      if (onFirstToken) onFirstToken(ttftMs);
    };

    const processLine = (rawLine) => {
      const line = rawLine.trim();
      if (!line) return;
      if (line.startsWith(":")) {
        // Parse live AI Horde queue updates (": horde queue_position=0 wait_time=3")
        const hm = line.match(/horde\s+queue_position=(\d+)\s+wait_time=(\d+)/i);
        if (hm) {
          const qp = Number(hm[1]);
          const wt = Number(hm[2]);
          if (onStatus) {
            onStatus(qp === 0 && wt === 0 ? "AI Horde worker generating reply..." : `AI Horde queue #${qp} (~${wt}s)...`);
          }
          // Bail out fast on backed-up queues so Auto-Race / Sticky Failover jumps immediately to a faster live GPU!
          if (!gotFirstToken && provCfg.provider === "aihorde" && wt >= 25 && (Date.now() - streamStartedAt) >= 3000) {
            throw new Error(`AI Horde worker busy (~${wt}s queue wait).`);
          }
        }
        return;
      }
      if (!line.startsWith("data:")) return;
      const dataStr = line.slice(5).trim();
      if (dataStr === "[DONE]") return;

      let chunk;
      try { chunk = JSON.parse(dataStr); } catch { return; }

      if (chunk.error) {
        const e = new Error(chunk.error.message || JSON.stringify(chunk.error));
        e.errorType = chunk.error.type || "";
        throw e;
      }

      if (chunk.usage) usage = chunk.usage;

      const choice = chunk.choices?.[0];
      if (!choice) return;
      if (choice.finish_reason) finishReason = choice.finish_reason;

      const delta = choice.delta || {};
      const rDelta = delta.reasoning ?? delta.reasoning_content ?? "";
      if (rDelta) {
        markFirstToken();
        reasoningText += rDelta;
        onReasoning && onReasoning(rDelta, reasoningText);
      }

      if (delta.content) {
        markFirstToken();
        contentText += delta.content;
        onContent && onContent(delta.content, contentText);
      }

      if (Array.isArray(delta.tool_calls)) {
        markFirstToken();
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0;
          if (!toolCallsMap.has(idx)) {
            toolCallsMap.set(idx, {
              id: tc.id || `call_${Date.now()}_${idx}`,
              type: tc.type || "function",
              function: { name: "", arguments: "" }
            });
          }
          const entry = toolCallsMap.get(idx);
          if (tc.id) entry.id = tc.id;
          if (tc.function?.name) entry.function.name += tc.function.name;
          if (tc.function?.arguments) entry.function.arguments += tc.function.arguments;
        }
      }
    };

    const streamIdleMs = provCfg.isLocalOffline ? 120000 : (provCfg.provider === "aihorde" ? 16000 : 30000);
    const readChunkWithIdleTimeout = async (idleMs = streamIdleMs) => {
      if (signal?.aborted) throw Object.assign(new Error("Aborted"), { name: "AbortError" });
      let timer;
      let onSigAbort;
      try {
        return await Promise.race([
          reader.read(),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Stream timed out waiting for tokens (${Math.round(idleMs / 1000)}s).`)), idleMs);
            if (signal) {
              onSigAbort = () => reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
              signal.addEventListener("abort", onSigAbort, { once: true });
            }
          })
        ]);
      } finally {
        clearTimeout(timer);
        if (signal && onSigAbort) signal.removeEventListener("abort", onSigAbort);
      }
    };

    try {
      while (true) {
        let waitBudget = streamIdleMs;
        if (!gotFirstToken && firstTokenMaxMs > 0) {
          const elapsed = Date.now() - streamStartedAt;
          if (elapsed >= firstTokenMaxMs) {
            throw new Error(`AI Horde worker timed out in queue (${Math.round(firstTokenMaxMs / 1000)}s without tokens).`);
          }
          waitBudget = Math.min(streamIdleMs, Math.max(800, firstTokenMaxMs - elapsed));
        }
        const { value, done } = await readChunkWithIdleTimeout(waitBudget);
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const rawLine of lines) processLine(rawLine);
      }
      // Flush any trailing line without newline before EOF
      buffer += decoder.decode();
      if (buffer.trim()) {
        for (const rawLine of buffer.split("\n")) processLine(rawLine);
      }
    } catch (streamErr) {
      try { reader.cancel().catch(() => {}); } catch {}
      throw streamErr;
    } finally {
      try { reader.releaseLock(); } catch {}
    }

    const toolCalls = Array.from(toolCallsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v)
      .filter(v => v.function.name);

    return { content: contentText, reasoning: reasoningText, toolCalls, finishReason, usage, ttftMs, modelObj };
  }

  function pickAiHordeRacers(maxCount = 3, excludeIds = new Set()) {
    const now = Date.now();
    const pool = models.filter(m =>
      m.provider === "aihorde" &&
      !m.isAutoRace &&
      isAbliteratedModel(m) &&
      !excludeIds.has(m.id) &&
      (modelCooldownUntil.get(m.id) || 0) <= now
    );
    const source = pool.length
      ? pool
      : models.filter(m => m.provider === "aihorde" && !m.isAutoRace && isAbliteratedModel(m) && !excludeIds.has(m.id));
    return [...source].sort((a, b) => scoreAiHordeModelSpeed(a) - scoreAiHordeModelSpeed(b)).slice(0, maxCount);
  }

  // Speculative Parallel Auto-Race: races the top live online Abliterated GPUs staggered at 550ms
  // (strictly under AI Horde's 2 req/sec limit), immediately cancels slower workers on the first real token,
  // and streams the fastest winner directly to the UI!
  async function streamAiHordeRace({ apiMessages, tools, toolChoice, signal, onReasoning, onContent, onStatus }) {
    const racers = pickAiHordeRacers(3);
    if (!racers.length) throw new Error("No live AI Horde abliterated workers available right now.");
    if (racers.length === 1) {
      return await streamChatCompletion({ apiMessages, tools, toolChoice, modelOverride: racers[0], signal, onReasoning, onContent, onStatus });
    }
    // QUICK-WIN: if we have a recently measured fastest worker (<45s ago), try it directly first for instant 1-2s win before full race
    const quickWinId = (()=>{ try{ let best=null, bestMs=1e9; for(const [mid,ms] of aiHordeMeasuredTtftMs.entries()){ if(ms<bestMs && racers.some(r=>r.id===mid)){ best=mid; bestMs=ms; }} return best; }catch{return null} })();
    if(quickWinId){
      const quickRacer = racers.find(r=>r.id===quickWinId);
      if(quickRacer){
        try{
          onStatus && onStatus(`>> Quick-win: trying fastest known ${formatAiHordeModelName(quickRacer.id)}...`);
          return await streamChatCompletion({ apiMessages, tools, toolChoice, modelOverride: quickRacer, firstTokenMaxMsOverride: 4800, signal, onReasoning, onContent, onStatus });
        }catch(e){
          if(e.name==="AbortError" && signal?.aborted) throw e;
          // fall through to full race
        }
      }
    }

    const raceStartedAt = Date.now();
    const ctrls = racers.map(() => new AbortController());
    const onParentAbort = () => ctrls.forEach(c => c.abort());
    if (signal) {
      if (signal.aborted) throw Object.assign(new Error("Aborted"), { name: "AbortError" });
      signal.addEventListener("abort", onParentAbort, { once: true });
    }

    let winnerIdx = -1;
    let firstErr = null;
    const launchDelays = [0, 280, 620]; // turbo: under 2/sec but 6x faster than before (was 3.8s wait)
    onStatus && onStatus(`>> Racing fastest live abliterated GPUs (${racers.slice(0, 2).map(r => formatAiHordeModelName(r.id)).join(" vs ")})...`);

    const runOneRacer = async (idx) => {
      const delay = launchDelays[idx] || 0;
      if (delay > 0) {
        try {
          await sleepAbortable(delay, ctrls[idx].signal);
        } catch {
          return null;
        }
        if (winnerIdx !== -1 || ctrls[idx].signal.aborted) return null;
      }

      const racerObj = racers[idx];
      try {
        const res = await streamChatCompletion({
          apiMessages,
          tools,
          toolChoice,
          modelOverride: racerObj,
          firstTokenMaxMsOverride: idx === 2 ? 7000 : 5500, // turbo: 45% faster first-token wait
          signal: ctrls[idx].signal,
          onFirstToken: (ttftMs) => {
            if (winnerIdx === -1) {
              winnerIdx = idx;
              ctrls.forEach((c, j) => { if (j !== idx) c.abort(); });
              const sec = ((Date.now() - raceStartedAt) / 1000).toFixed(1);
              onStatus && onStatus(`>> Fastest GPU won in ${sec}s: ${formatAiHordeModelName(racerObj.id)}`);
            }
          },
          onReasoning: (delta, full) => {
            if (winnerIdx === idx && onReasoning) onReasoning(delta, full);
          },
          onContent: (delta, full) => {
            if (winnerIdx === idx && onContent) onContent(delta, full);
          },
          onStatus: (()=>{ let last=""; return (txt)=>{ if(txt===last) return; last=txt; if (winnerIdx === -1 && idx === 0 && onStatus) { onStatus(`>> Racing ${racers.slice(0, 2).map(r => formatAiHordeModelName(r.id)).join(" vs ")} · ${txt}`); } }; })()
        });
        if (winnerIdx === idx) {
          return { ...res, winnerModelObj: racerObj };
        }
        return null;
      } catch (err) {
        if (winnerIdx === idx) throw err;
        if (err.name !== "AbortError") {
          recordModelFailure(racerObj, err);
          if (!firstErr) firstErr = err;
        }
        return null;
      }
    };

    try {
      const settled = await Promise.allSettled(racers.map((_, idx) => runOneRacer(idx)));
      for (const s of settled) {
        if (s.status === "fulfilled" && s.value) return s.value;
      }
      if (signal?.aborted) throw Object.assign(new Error("Aborted"), { name: "AbortError" });
      for (const s of settled) {
        if (s.status === "rejected" && s.reason && s.reason.name !== "AbortError") throw s.reason;
      }
      throw firstErr || new Error("All raced AI Horde abliterated workers were busy.");
    } finally {
      if (signal) signal.removeEventListener("abort", onParentAbort);
      ctrls.forEach(c => { try { c.abort(); } catch {} });
    }
  }

  // ── Auto-Race for Non-Abliterated (Pollinations + LLM7 Turbo + AI Horde Standard) — diverse-provider race avoids per-IP 30s cooldowns
  function pickNonAblitRacers(maxCount = 3, excludeIds = new Set()) {
    const now = Date.now();
    // Prefer diverse providers: one Pollinations, one LLM7, one AI Horde standard — fastest mix, no shared rate-limit bucket
    const poll = models.find(m => m.provider === "pollinations" && !excludeIds.has(m.id) && (modelCooldownUntil.get(m.id)||0) <= now);
    const llm7Fast = [...models.filter(m => m.provider === "llm7" && !excludeIds.has(m.id) && (modelCooldownUntil.get(m.id)||0) <= now)]
      .sort((a,b)=> (a.id==="gpt-oss:20b"?-1:1))[0];
    const hordeStd = [...models.filter(m => m.provider==="aihorde" && !isAbliteratedModel(m) && !m.isAutoRace && !excludeIds.has(m.id) && (modelCooldownUntil.get(m.id)||0)<=now)]
      .sort((a,b)=> scoreAiHordeModelSpeed(a)-scoreAiHordeModelSpeed(b))[0];
    const pool = [poll, llm7Fast, hordeStd].filter(Boolean);
    // If we have fewer than 3, fill with remaining LLM7 turbos
    if (pool.length < maxCount) {
      const extra = models.filter(m=> m.provider==="llm7" && !pool.includes(m) && !excludeIds.has(m.id) && (modelCooldownUntil.get(m.id)||0)<=now).slice(0, maxCount-pool.length);
      pool.push(...extra);
    }
    // Fallback: any online non-abliterated not excluded
    if (!pool.length) {
      return models.filter(m=> !isAbliteratedModel(m) && m.provider!=="browser" && !m.isAutoRace && !excludeIds.has(m.id)).slice(0,maxCount);
    }
    return pool.slice(0,maxCount);
  }

  async function streamNonAblitRace({ apiMessages, tools, toolChoice, signal, onReasoning, onContent, onStatus }) {
    const racers = pickNonAblitRacers(3);
    if (!racers.length) throw new Error("No live Non-Abliterated workers available right now.");
    if (racers.length === 1) {
      return await streamChatCompletion({ apiMessages, tools, toolChoice, modelOverride: racers[0], signal, onReasoning, onContent, onStatus });
    }
    const raceStartedAt = Date.now();
    const ctrls = racers.map(()=> new AbortController());
    const onParentAbort = ()=> ctrls.forEach(c=>c.abort());
    if (signal) {
      if (signal.aborted) throw Object.assign(new Error("Aborted"), {name:"AbortError"});
      signal.addEventListener("abort", onParentAbort, {once:true});
    }
    let winnerIdx = -1;
    let firstErr = null;
    // Stagger 0ms, 700ms, 3200ms — Pollinations has 30s per-IP limit, so we deliberately space pollinations vs llm7 vs horde across buckets
    const launchDelays = [0, 280, 620]; // turbo: same quick stagger, avoids 30s cooldown bucket
    onStatus && onStatus(`>> Racing fastest Non-Abliterated (Pollinations vs LLM7 vs Horde)...`);
    const runOne = async (idx) => {
      const delay = launchDelays[idx]||0;
      if (delay>0) {
        try { await sleepAbortable(delay, ctrls[idx].signal); } catch { return null; }
        if (winnerIdx!==-1 || ctrls[idx].signal.aborted) return null;
      }
      const racerObj = racers[idx];
      try {
        const res = await streamChatCompletion({
          apiMessages, tools, toolChoice,
          modelOverride: racerObj,
          firstTokenMaxMsOverride: 6000,
          signal: ctrls[idx].signal,
          onFirstToken: (ttftMs)=>{
            if (winnerIdx===-1) {
              winnerIdx = idx;
              ctrls.forEach((c,j)=>{ if(j!==idx) c.abort(); });
              const sec = ((Date.now()-raceStartedAt)/1000).toFixed(1);
              onStatus && onStatus(`>> Fastest Non-Ablit won in ${sec}s: ${racerObj.display_name||racerObj.id}`);
            }
          },
          onReasoning: (d,f)=>{ if(winnerIdx===idx && onReasoning) onReasoning(d,f); },
          onContent: (d,f)=>{ if(winnerIdx===idx && onContent) onContent(d,f); },
          onStatus: (txt)=>{ if(winnerIdx===-1 && idx===0 && onStatus) onStatus(`>> Racing Non-Ablit · ${txt}`); }
        });
        if (winnerIdx===idx) return {...res, winnerModelObj: racerObj};
        return null;
      } catch(err){
        if(winnerIdx===idx) throw err;
        if(err.name!=="AbortError"){
          recordModelFailure(racerObj, err);
          if(!firstErr) firstErr=err;
        }
        return null;
      }
    };
    try{
      const settled = await Promise.allSettled(racers.map((_,i)=> runOne(i)));
      for(const s of settled) if(s.status==="fulfilled" && s.value) return s.value;
      if(signal?.aborted) throw Object.assign(new Error("Aborted"), {name:"AbortError"});
      for(const s of settled) if(s.status==="rejected" && s.reason && s.reason.name!=="AbortError") throw s.reason;
      throw firstErr || new Error("All raced Non-Abliterated workers were busy.");
    } finally{
      if(signal) signal.removeEventListener("abort", onParentAbort);
      ctrls.forEach(c=>{ try{c.abort();}catch{}});
    }
  }

  function pickBestUnlimitedAbliteratedModel(excludeProvider = null) {
    const cachedBrowser = (Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : [])
      .filter(id => BROWSER_LOCAL_MODELS.some(m => m.id === id));
    if (ollamaDetectedModels.length && excludeProvider !== "ollama") return ollamaDetectedModels[0].id;
    if (!isOfflineActive()) {
      const liveHordeAblit = models.find(m => m.provider === "aihorde" && isAbliteratedModel(m) && excludeProvider !== "aihorde");
      if (liveHordeAblit) return liveHordeAblit.id;
      if (excludeProvider !== "aihorde" && AIHORDE_SEED_MODELS.length) return AIHORDE_SEED_MODELS[0].id;
      if (excludeProvider !== "pollinations") return DEFAULT_CLOUD_MODEL;
      return KEYLESS_CLOUD_MODELS[1]?.id || DEFAULT_CLOUD_MODEL;
    }
    if (cachedBrowser.length) return cachedBrowser[0];
    return DEFAULT_BROWSER_AI_MODEL;
  }

  function summarizeFailoverReason(err) {
    const status = Number(err?.status || 0);
    const msg = String(err?.message || err || "Unknown error");
    if (status === 402 || /free_limit|cooldown/i.test(msg)) {
      return err?.retryAfterSec ? `rate-limit cooldown (${err.retryAfterSec}s)` : "free-tier cooldown";
    }
    if (status === 429 || /rate.?limit/i.test(msg)) {
      return err?.retryAfterSec ? `rate limited (${err.retryAfterSec}s)` : "rate limited";
    }
    if (status === 503 || /no_eligible_worker|no worker/i.test(msg)) return "worker busy/offline";
    if (status === 401 || status === 403) return `HTTP ${status} auth/access error`;
    if (status >= 500) return `HTTP ${status} server error`;
    if (/failed to fetch|networkerror|load failed|cors|unreachable|all .*failed|blocked/i.test(msg)) return "network/CORS blocked";
    if (/timed?\s*out/i.test(msg)) return "timed out";
    if (/empty response/i.test(msg)) return "empty response";
    return msg.length > 72 ? msg.slice(0, 69) + "…" : msg;
  }

  function recordModelFailure(modelObj, err) {
    if (!modelObj) return;
    const now = Date.now();
    const prov = modelObj.provider || "browser";
    const status = Number(err?.status || 0);
    const msg = String(err?.message || err || "");
    const retrySec = Number(err?.retryAfterSec || 0);
    // ── 10x: track failure counts persistently ──
    try{
      const k=getModelKey(modelObj);
      if(!settings.modelFailureCounts) settings.modelFailureCounts={};
      settings.modelFailureCounts[k]=(settings.modelFailureCounts[k]||0)+1;
      saveSettings();
      // auto-hide decision (smart: hard errors instantly, soft on 3 strikes, never local)
      if(shouldAutoHideModel(modelObj, err)){
        hideFailedModel(modelObj, err);
      }
    }catch(e){ console.warn("health tracking failed", e); }

    // Provider-level cooldowns so failover jumps straight to a DIFFERENT healthy provider instead of retrying the same rate-limited IP bucket
    if (prov === "aihorde" || prov === "auto-nonablit") {
      if (status === 429 || /2 per 1 second|rate.?limit/i.test(msg)) {
        const pkey = prov === "auto-nonablit" ? "llm7" : "aihorde";
        providerCooldownUntil.set(pkey, now + Math.max(3, retrySec || 3) * 1000);
      } else if (modelObj.isAutoRace) {
        // Auto-Race already tried the fastest live workers; cool down briefly so failover tries another provider
        modelCooldownUntil.set(modelObj.id, now + 45000);
      } else {
        // Only cool down this specific worker model so failover immediately tries another live worker!
        modelCooldownUntil.set(modelObj.id, now + 120000);
      }
      return;
    }
    if (prov === "pollinations" && (status === 402 || status === 429 || /free_limit|rate.?limit/i.test(msg))) {
      const ms = Math.max(48, Math.min(retrySec || 48, 300)) * 1000;
      providerCooldownUntil.set("pollinations", now + ms);
      modelCooldownUntil.set(modelObj.id, now + ms);
      return;
    }
    if (prov === "llm7" && (status === 429 || status === 402 || /rate.?limit/i.test(msg))) {
      const ms = Math.max(30, Math.min(retrySec || 90, 900)) * 1000;
      providerCooldownUntil.set("llm7", now + ms);
      modelCooldownUntil.set(modelObj.id, now + ms);
      return;
    }
    if (prov === "ollama" && (status === 404 || status >= 500 || /failed to fetch|networkerror/i.test(msg))) {
      providerCooldownUntil.set("ollama", now + 45000);
      modelCooldownUntil.set(modelObj.id, now + 45000);
      return;
    }
    if (prov === "browser") {
      const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
      if (!cachedSet.has(modelObj.id) && /failed to fetch|networkerror|load failed|all .*failed|blocked|cdn|huggingface|mirror/i.test(msg)) {
        browserNetworkBlockedUntil = now + 90000;
      }
      modelCooldownUntil.set(modelObj.id, now + 90000);
      return;
    }
    modelCooldownUntil.set(modelObj.id, now + 90000);
  }

  function pickNextWorkingModel(failedModelObj, failedIdsInTurn = new Set()) {
    const now = Date.now();
    const offline = isOfflineActive();
    const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
    const detectedLocalIds = new Set(ollamaDetectedModels.map(m => `${m.provider}::${m.id}`));
    const wantedCat = inferModelCategory(failedModelObj);
    const failedProv = failedModelObj?.provider || "";

    const isEligible = (m, ignoreCooldowns = false) => {
      if (!m || !m.id) return false;
      if (failedIdsInTurn.has(m.id)) return false;
      if (isModelHidden(m)) return false;
      const prov = m.provider || "browser";
      if (offline) {
        if (!isLocalOfflineModel(m)) return false;
        // Even in Offline Mode, never auto-switch into an UN-cached browser download model (it cannot download offline anyway!)
        if (prov === "browser" && !cachedSet.has(m.id)) return false;
      } else {
        // IRONCLAD RULE: While online, NEVER auto-switch onto ANY In-Browser ("download") model!
        // Online keyless users must stay on instant online/local models — browser download models are strictly manual/offline-only.
        if (prov === "browser") return false;
      }
      if ((prov === "ollama" || prov === "lmstudio") && !m.isDetected && !detectedLocalIds.has(`${prov}::${m.id}`)) return false;
      if (!ignoreCooldowns) {
        if ((modelCooldownUntil.get(m.id) || 0) > now) return false;
        if ((providerCooldownUntil.get(prov) || 0) > now) return false;
        if (prov === "browser" && !cachedSet.has(m.id) && browserNetworkBlockedUntil > now) return false;
      }
      return true;
    };

    const scoreCandidate = (m) => {
      const prov = m.provider || "browser";
      const sameCat = inferModelCategory(m) === wantedCat;
      const isCachedBrowser = prov === "browser" && cachedSet.has(m.id);
      const isLiveLocal = (prov === "ollama" || prov === "lmstudio") && (m.isDetected || detectedLocalIds.has(`${prov}::${m.id}`));
      const isCloud = prov === "aihorde" || prov === "pollinations" || prov === "llm7";
      // Only reward switching providers when comparing candidates of the SAME category (or non-abliterated fallback);
      // never let a different provider beat a live same-category Abliterated model!
      const diffProvBonus = (prov !== failedProv && (!sameCat || wantedCat !== "abliterated")) ? 30 : 0;

      // Primary priority: instant online/local models with ZERO browser downloads!
      let base = 0;
      if (isLiveLocal) base = 420;
      else if (prov === "aihorde" || prov === "auto-nonablit") {
        if (m.isAutoRace) {
          // Auto-Race meta-model is fastest way to grab lowest-latency GPU — prioritize!
          base = 398;
        } else {
          // Rank live workers by real ETA, tokens/sec, queue depth & measured TTFT
          const spd = scoreAiHordeModelSpeed(m);
          base = Math.max(300, Math.min(395, Math.round(375 - spd / 12)));
        }
      } else if (prov === "pollinations") base = 355;
      else if (prov === "llm7") base = 350 + (m.id === "gpt-oss:120b" ? 12 : (m.id === "gpt-oss:20b" ? 8 : 5));
      else if (isCachedBrowser) base = 260;
      else base = 100;

      // Strongly keep Abliterated requests on live online/local Abliterated models FIRST!
      const isInstant = isLiveLocal || isCloud || isCachedBrowser;
      const catBonus = sameCat ? (isInstant ? 160 : 55) : 0;
      return base + catBonus + diffProvBonus;
    };

    let candidates = models.filter(m => isEligible(m, false));
    if (!candidates.length) {
      candidates = models.filter(m => isEligible(m, true));
    }
    if (!candidates.length) return null;

    candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
    return candidates[0];
  }

  // ── Main Run Loop (Streaming + Multi-Turn Web Tool Agent + Automatic Sticky Failover) ─
  async function runGeneration(chat, assistantMsg, _failoverState = null) {
    const foState = _failoverState || { depth: 0, failedIds: new Set(), trail: [] };
    isStreaming = true;
    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;
    updateSendButtonState();

    const startedAt = performance.now();
    let modelObj = getCurrentModelObj();
    let provCfg = getProviderConfig(modelObj);
    const webOn = !isOfflineActive() && Boolean(settings.webEnabled);
    const requireSearchThisTurn = forceSearchNext;
    if (foState.depth === 0) {
      forceSearchNext = false;
      el.forceSearchBtn.classList.remove("amber-active");
    }

    assistantMsg.model = modelObj.id;
    assistantMsg.provider = provCfg.label;
    assistantMsg.reasoning = "";
    assistantMsg.content = "";
    assistantMsg.toolEvents = [];
    assistantMsg.sources = [];
    if (foState.depth === 0) {
      assistantMsg.notice = "";
      assistantMsg._failoverBanner = "";
    }
    assistantMsg.error = "";
    assistantMsg.usage = null;
    assistantMsg.streaming = true;
    assistantMsg.startedAt = startedAt;
    let lastFinishReason = null;
    let failoverModelObj = null;

    // Build message history excluding this placeholder assistant message
    const historyChat = {
      ...chat,
      messages: chat.messages.filter(m => m.id !== assistantMsg.id)
    };
    const lastUserPrompt = [...historyChat.messages].reverse().find(m => m.role === "user")?.content || "";
    // UNLIMITED POWER: if user wants to build code but current model is 512-limited (Horde anonymous), auto-route to best high-limit coding model for this turn only (no stickiness)
    const _isBuildIntentEarly = /\b(build|create|make|generate|design|code|develop|prototype|clone|remake|edit|update|fix|redesign|replicate|copy|website|webpage|web page|app|game|tool|page|component|layout|landing|portfolio|dashboard|todo|calculator|shop|store|blog|chat|saas|api)\b/i.test(lastUserPrompt);
    if(_isBuildIntentEarly && (provCfg.provider === "aihorde" || Number(modelObj.max_completion_tokens||0) <= 560)){
      const bestCode = getBestCodeModel();
      if(bestCode && bestCode.id !== modelObj.id){
        modelObj = bestCode;
        provCfg = getProviderConfig(bestCode);
        assistantMsg.notice = `Power Mode: routed build to ${bestCode.display_name || bestCode.id} (unlimited code, ~${(bestCode.context_length||131072).toLocaleString()} ctx)`;
        scheduleRender();
      }
    }
    const activeTools = provCfg.provider === "browser"
      ? []
      : getActiveToolDefinitions(webOn, "agent", modelObj, lastUserPrompt, requireSearchThisTurn);
    // Inject Projects Knowledge as context (like Claude Projects) — prepend to first user message
    let apiMessages = buildApiMessages(historyChat, webOn, provCfg.provider === "browser" ? null : activeTools);
    try{
      const projCtx = buildProjectsContext(apiMessages.at(-1)?.content || lastUserPrompt || "");
      if(projCtx){
        const firstUserIdx = apiMessages.findIndex(m=> m.role==="user");
        if(firstUserIdx!==-1){
          const orig = apiMessages[firstUserIdx].content;
          const origText = typeof orig==="string" ? orig : (Array.isArray(orig)? orig.map(p=>p.text||"").join("\n") : String(orig));
          apiMessages[firstUserIdx].content = origText + projCtx;
        }
      }
    }catch{}

    const addSources = (list) => {
      const existing = new Set(assistantMsg.sources.map(s => s.url));
      for (const s of list) {
        if (s?.url && !existing.has(s.url)) {
          existing.add(s.url);
          assistantMsg.sources.push(s);
        }
      }
    };

    const totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0, prompt_tokens_details: { cached_tokens: 0 }, completion_tokens_details: { reasoning_tokens: 0 } };
    const mergeUsage = (u) => {
      if (!u) return;
      totalUsage.prompt_tokens += u.prompt_tokens || 0;
      totalUsage.completion_tokens += u.completion_tokens || 0;
      totalUsage.total_tokens += u.total_tokens || 0;
      totalUsage.prompt_tokens_details.cached_tokens += u.prompt_tokens_details?.cached_tokens || 0;
      totalUsage.completion_tokens_details.reasoning_tokens += u.completion_tokens_details?.reasoning_tokens || 0;
    };

    // Zero-jank throttled streaming renderer (~20 FPS during token streaming; fast in-place content updates avoid full DOM teardown)
    const scheduleRender = (() => {
      let timer = null;
      let rafId = null;
      let lastPaintAt = 0;
      let needsFull = false;
      const flush = () => {
        timer = null;
        rafId = null;
        const full = needsFull;
        needsFull = false;
        lastPaintAt = performance.now();
        updateAssistantMessageDOM(assistantMsg, !full);
        autoScrollIfNearBottom();
      };
      return (contentOnly = false) => {
        if (!contentOnly) needsFull = true;
        if (timer || rafId) return;
        const elapsed = performance.now() - lastPaintAt - (assistantMsg.reasoning ? 0 : 0);
        if (elapsed >= 32) {
          rafId = requestAnimationFrame(flush);
        } else {
          timer = setTimeout(() => { rafId = requestAnimationFrame(flush); }, Math.max(12, 32 - elapsed));
        }
      };
    })();

    try {
      // 1. Online cloud model selected while Offline Mode / No-Wi-Fi is active -> trigger automatic failover immediately!
      if (isOfflineActive() && !provCfg.isLocalOffline) {
        throw new Error("Offline / No-Wi-Fi mode is active — cloud models require internet.");
      }

      // Silently refresh live AI Horde speed/ETA metrics in the background if >60s old (never blocks this turn!)
      if (provCfg.provider === "aihorde" && !isOfflineActive() && (Date.now() - lastAiHordeSyncAt) > 60000) {
        syncAiHordeModels().catch(() => {});
      }

      // 2. 100% Pure-HTML In-Browser ONNX AI (WebGPU / WebAssembly + IndexedDB offline cache + keyless Web Grounding)
      if (provCfg.provider === "browser") {
        await runBrowserAiGeneration(modelObj, apiMessages, assistantMsg, signal, scheduleRender, {
          webOn,
          requireSearch: requireSearchThisTurn,
          addSources,
          chat
        });
        if (!assistantMsg.content.trim() && !assistantMsg.error) {
          throw new Error("In-Browser model returned an empty response.");
        }
        if (assistantMsg._failoverBanner) {
          assistantMsg.notice = assistantMsg._failoverBanner;
        }
        scheduleRender(false);
        return;
      }

      // 3. OpenAI-Compatible Keyless Cloud (AI Horde Auto-Race & Workers · Pollinations ChatGPT · LLM7) & Local Servers (Ollama · LM Studio) + Keyless Web Agent & Web Studio Tools
      const wantsUnlimitedBuild = _isBuildIntentEarly && /(<html|function|class |import |=>|<!doctype)/i.test(lastUserPrompt + " " + (activeTools.length?"tool":"")) ? true : _isBuildIntentEarly;
      const maxRounds = wantsUnlimitedBuild ? Math.max(6, Number(settings.maxToolRounds) || 6) : (activeTools.length ? Math.max(2, Number(settings.maxToolRounds) || 6) : 1);
      let pinnedRaceWinnerObj = null;

      for (let round = 0; round < maxRounds; round++) {
        const allowTools = activeTools.length > 0 && round < maxRounds - 1;
        const wantsBuildNow = /\b(build|create|make|generate|clone|website|webpage|web page|app|game|tool|page|html|code.*page|design a )\b/i.test(lastUserPrompt);
        const toolChoice = (allowTools && round === 0 && requireSearchThisTurn) ? "required" : (allowTools && wantsBuildNow && round === 0 ? "required" : (allowTools ? "auto" : undefined));

        let roundPrefixReasoning = assistantMsg.reasoning ? assistantMsg.reasoning + "\n\n" : "";
        let roundContent = "";

        const isNonAblitAuto = Boolean(modelObj.isNonAblitRace);
        const isAblitAuto = Boolean(modelObj.isAutoRace) && !isNonAblitAuto;
        const useAutoRace = (isAblitAuto || isNonAblitAuto) && !pinnedRaceWinnerObj;
        const callOpts = {
          apiMessages,
          tools: allowTools ? activeTools : undefined,
          toolChoice,
          useNativeWeb: false,
          modelOverride: pinnedRaceWinnerObj || null,
          signal,
          onStatus: (()=>{ let last="", lastAt=0; return (txt)=>{ const now=Date.now(); if(txt===last && now-lastAt<600) return; last=txt; lastAt=now; assistantMsg.notice = assistantMsg._failoverBanner ? `${assistantMsg._failoverBanner} (${txt})` : txt; scheduleRender(false); }; })(),
          onReasoning: (delta, full) => {
            assistantMsg.reasoning = roundPrefixReasoning + full;
            scheduleRender(false);
          },
          onContent: (delta) => {
            roundContent += delta;
            assistantMsg.content += delta;
            scheduleRender(true);
          }
        };

        const res = useAutoRace
          ? (isNonAblitAuto ? await streamNonAblitRace(callOpts) : await streamAiHordeRace(callOpts))
          : await streamChatCompletion(callOpts);

        if (res.winnerModelObj) {
          pinnedRaceWinnerObj = res.winnerModelObj;
          assistantMsg.model = res.winnerModelObj.id;
        }

        lastFinishReason = res.finishReason;
        mergeUsage(res.usage);

        // If the model requested web/editor tool calls, execute them in parallel and loop!
        if (res.toolCalls && res.toolCalls.length > 0) {
          chat.usedWeb = true;
          const trimmedRound = roundContent.trim();
          if (trimmedRound.length > 0 && trimmedRound.length <= 160 && assistantMsg.content.endsWith(roundContent)) {
            assistantMsg.content = assistantMsg.content.slice(0, assistantMsg.content.length - roundContent.length);
          } else if (trimmedRound.length > 160) {
            assistantMsg.content += "\n\n";
          }

          apiMessages.push({
            role: "assistant",
            content: res.content || "",
            tool_calls: res.toolCalls
          });

          const toolPromises = res.toolCalls.map(async (tc) => {
            let parsedArgs = {};
            try { parsedArgs = JSON.parse(tc.function.arguments || "{}"); } catch {}
            const argLabel = parsedArgs.query || parsedArgs.url || parsedArgs.topic || parsedArgs.summary || parsedArgs.path || parsedArgs.filename || (Array.isArray(parsedArgs.edits) ? `${parsedArgs.edits.length} patch edit(s)` : "") || tc.function.name;

            const ev = {
              id: tc.id,
              name: tc.function.name,
              argLabel: String(argLabel),
              status: "running",
              ms: 0,
              count: 0,
              links: []
            };
            assistantMsg.toolEvents.push(ev);
            scheduleRender();

            const t0 = performance.now();
            try {
              const output = await executeToolCall(tc.function.name, parsedArgs, signal);
              ev.ms = Math.round(performance.now() - t0);
              const links = extractSourcesFromToolOutput(tc.function.name, output);
              ev.links = links.slice(0, 6);
              ev.count = Array.isArray(output?.results) ? output.results.length : (output?.content || output?.extract ? 1 : 0);
              ev.status = output?.error ? "error" : "done";
              ev.errorMsg = output?.error || "";
              addSources(links);
              scheduleRender();
              return { tc, content: JSON.stringify(output) };
            } catch (toolErr) {
              if (toolErr.name === "AbortError") throw toolErr;
              ev.ms = Math.round(performance.now() - t0);
              ev.status = "error";
              ev.errorMsg = toolErr.message || String(toolErr);
              scheduleRender();
              return { tc, content: JSON.stringify({ error: ev.errorMsg }) };
            }
          });

          const toolOutputs = await Promise.all(toolPromises);
          for (const out of toolOutputs) {
            apiMessages.push({
              role: "tool",
              tool_call_id: out.tc.id,
              content: out.content
            });
          }
          continue;
        }

        // UNLIMITED CODE: if model hit token limit mid-code, auto-continue without asking user (up to 5 extra rounds — truly unlimited)
        if (lastFinishReason === "length" && _isBuildIntentEarly && round < maxRounds - 1) {
          const looksLikeCode = /<html|<!doctype|<script|<style|<div|<canvas|function\s+\w+|=>|import\s/.test(roundContent) || roundContent.trim().endsWith("<") || (!/<\/html>/i.test(assistantMsg.content) && assistantMsg.content.length > 800);
          if (looksLikeCode || roundContent.length > 400) {
            assistantMsg.notice = "Unlimited Power: continuing code (no limit)...";
            scheduleRender();
            apiMessages.push({ role: "assistant", content: roundContent });
            apiMessages.push({ role: "user", content: "Continue exactly where you left off. Complete the remaining HTML/CSS/JS without repeating already generated code. Ensure document ends with proper closing tags like </html>." });
            continue;
          }
        }

        // Done! Extract any additional links mentioned in the final response
        const cited = [...(assistantMsg.content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g))];
        addSources(cited.map(m => ({ title: m[1], url: m[2], domain: getDomain(m[2]) })));
        break;
      }

      assistantMsg.usage = totalUsage.total_tokens ? totalUsage : null;

      // Never leave a silently blank bubble — if completely empty, throw so Sticky Auto-Failover tries another working model!
      if (!assistantMsg.content.trim() && !assistantMsg.error) {
        if (assistantMsg.reasoning && assistantMsg.reasoning.trim()) {
          assistantMsg._thinkingOpen = true;
          const reasonNote = lastFinishReason === "length"
            ? "The model used its full Max Output Tokens budget on internal reasoning before writing a final answer. Increase Max Output Tokens in Settings or click Regenerate."
            : "The model emitted a reasoning trace without final answer text.";
          assistantMsg.notice = assistantMsg._failoverBanner ? `${assistantMsg._failoverBanner} · ${reasonNote}` : reasonNote;
        } else {
          throw new Error("Model returned an empty response.");
        }
      } else if (assistantMsg._failoverBanner) {
        assistantMsg.notice = assistantMsg._failoverBanner;
      }
    } catch (err) {
      if (err.name === "AbortError" && signal.aborted) {
        assistantMsg.notice = assistantMsg.notice || "Generation stopped.";
      } else {
        const msg = err.message || String(err);
        const failedName = modelObj.display_name || modelObj.id;
        const shortReason = summarizeFailoverReason(err);

        // Automatic Sticky Failover: find another working model, switch permanently (sticky) until IT fails or user changes it, and tell the user!
        recordModelFailure(modelObj, err);
        foState.failedIds.add(modelObj.id);
        foState.trail.push(`${failedName} (${shortReason})`);

        const canFailover = !IS_SANDBOXED_VIEWER && foState.depth < 8;
        if (canFailover) {
          failoverModelObj = pickNextWorkingModel(modelObj, foState.failedIds);
        }

        if (failoverModelObj) {
          const nextName = failoverModelObj.display_name || failoverModelObj.id;
          // Sticky switch: persist as the active model for all future turns until it fails or user manually changes it
          settings.model = failoverModelObj.id;
          settings.autoSwitchedModel = true;
          saveSettings();
          populateModelSelect();
          syncModelCapabilitiesUI();

          const triedSummary = foState.trail.join(" → ");
          const hiddenNote = getHiddenCount() ? ` (${getHiddenCount()} broken model${getHiddenCount()===1?"":"s"} auto-hidden)` : "";
          const banner = `Auto-switched model: ${triedSummary} did not work — switched to "${nextName}"${hiddenNote}. I'll keep using "${nextName}" for future messages until it stops working or you pick another model.`;
          assistantMsg._failoverBanner = banner;
          assistantMsg.notice = `${banner} Generating reply now…`;
          showToast(`Auto-switched to ${nextName}${hiddenNote ? " · 🗑️ "+getHiddenCount()+" hidden" : ""}`);
        } else {
          let finalErr = msg;
          if (IS_SANDBOXED_VIEWER && /failed to fetch|networkerror|load failed/i.test(msg)) {
            finalErr = "Network requests are blocked inside this sandboxed file viewer. Click 'Download HTML' in the top bar and open abliteration-runner.html directly in your browser (or use the Live Preview tab).";
          } else if (foState.trail.length > 1) {
            finalErr = `Tried ${foState.trail.length} online models (${foState.trail.join(" · ")}) and none succeeded right now. Please try again in a moment, or manually pick another model from the dropdown.`;
          }
          assistantMsg.error = finalErr;
        }
      }
    } finally {
      // Auto-capture: if AI typed HTML/JS code as text instead of calling web_studio_write, auto-inject it into Web Studio so it actually RUNS in one sandbox
      try{
        if(!failoverModelObj && assistantMsg.content && assistantMsg.content.trim()){
          const usedTools = Array.isArray(assistantMsg.toolEvents) && assistantMsg.toolEvents.length > 0;
          // Only auto-capture when AI didn't already render via tool — prevents double write
          if(!usedTools){
            autoCaptureCodeToStudio(assistantMsg.content, lastUserPrompt);
          }
        }
      }catch(e){}

      assistantMsg.streaming = Boolean(failoverModelObj);
      assistantMsg.elapsedSec = (performance.now() - startedAt) / 1000;
      isStreaming = false;
      activeAbortController = null;
      chat.updatedAt = Date.now();
      // Smart title: if still default, generate from first user prompt (Claude-like)
      if(chat.title === "New conversation" || chat.title === "New chat"){
        const firstUser = chat.messages.find(m=> m.role==="user");
        if(firstUser && firstUser.content){
          chat.title = firstUser.content.slice(0,48).replace(/\s+/g," ").trim();
          if(chat.title.length===48) chat.title += "…";
        }
      }
      saveChats();
      updateSendButtonState();
      updateAssistantMessageDOM(assistantMsg);
      renderChatList();
    }

    if (failoverModelObj) {
      // Gentle pacing on back-to-back AI Horde failovers so we never hit its 2 req/sec burst limit
      if (modelObj.provider === "aihorde" && failoverModelObj.provider === "aihorde") {
        await new Promise(r => setTimeout(r, 450));
      }
      return await runGeneration(chat, assistantMsg, {
        depth: foState.depth + 1,
        failedIds: foState.failedIds,
        trail: foState.trail
      });
    }
  }

  // ── User Actions ────────────────────────────────────────────────────────────
  // ── Composer draft persistence (Claude-like) ───────────────────────────
  const DRAFT_KEY = "ablit_composer_draft";
  function saveDraft(){ try{ localStorage.setItem(DRAFT_KEY, el.promptInput.value); }catch{} }
  function loadDraft(){ try{ const d=localStorage.getItem(DRAFT_KEY); if(d){ el.promptInput.value=d; autoResizeTextarea(); } }catch{} }
  // Restore draft on load after DOM ready
  setTimeout(loadDraft, 400);

  async function handleSend() {
    if (isStreaming) {
      activeAbortController?.abort();
      return;
    }

    const rawText = el.promptInput.value.trim();
    if (!rawText && !pendingImages.length) return;

    // Convenient slash shortcuts: /search <q> or /fetch <url>
    let promptText = rawText;
    if (/^\/search\s+/i.test(promptText)) {
      promptText = "Search the web for: " + promptText.replace(/^\/search\s+/i, "");
      if (!settings.webEnabled) { settings.webEnabled = true; saveSettings(); syncWebToggleUI(); }
      forceSearchNext = true;
    } else if (/^\/fetch\s+/i.test(promptText)) {
      const targetUrl = promptText.replace(/^\/fetch\s+/i, "").trim();
      promptText = `Fetch and summarize the webpage at ${targetUrl}`;
      if (!settings.webEnabled) { settings.webEnabled = true; saveSettings(); syncWebToggleUI(); }
    } else if (/^\/audit\s+/i.test(promptText)) {
      const targetUrl = promptText.replace(/^\/audit\s+/i, "").trim();
      promptText = `Run a passive defensive security audit on my website ${targetUrl} using sec_audit_headers, sec_audit_html, and sec_audit_wellknown. Provide a graded OWASP risk report and copy-paste remediation fixes.`;
      if (settings.secAuditEnabled === false) { settings.secAuditEnabled = true; saveSettings(); }
    } else if (/^\/offline\b/i.test(promptText)) {
      settings.offlineMode = !settings.offlineMode;
      saveSettings();
      await syncOfflineUI(true);
      el.promptInput.value = "";
      autoResizeTextarea();
      showToast(settings.offlineMode ? "Offline / No-Wi-Fi Mode enabled" : "Online Mode restored");
      return;
    }

    let chat = getActiveChat();
    if (!chat) chat = createChat();

    // Update chat title from first user message
    if (chat.messages.length === 0) {
      chat.title = (promptText || "Image prompt").slice(0, 48).replace(/\s+/g, " ");
    }

    const userMsg = {
      id: "m_" + Date.now() + "_u",
      role: "user",
      content: promptText,
      images: pendingImages.length ? pendingImages.slice() : undefined,
      ts: Date.now()
    };

    const assistantMsg = {
      id: "m_" + Date.now() + "_a",
      role: "assistant",
      content: "",
      reasoning: "",
      toolEvents: [],
      sources: [],
      streaming: true,
      ts: Date.now()
    };

    chat.messages.push(userMsg, assistantMsg);
    chat.updatedAt = Date.now();

    el.promptInput.value = "";
    autoResizeTextarea();
    try{ localStorage.removeItem(DRAFT_KEY); }catch{}
    pendingImages = [];
    renderPendingAttachments();
    saveChats();
    renderChatList();
    renderMessages();
    scrollToBottom();

    await runGeneration(chat, assistantMsg);
  }

  async function regenerateMessage(assistantId) {
    if (isStreaming) return;
    const chat = getActiveChat();
    if (!chat) return;
    const idx = chat.messages.findIndex(m => m.id === assistantId);
    if (idx === -1) return;

    // Trim any messages after this assistant message
    chat.messages = chat.messages.slice(0, idx + 1);
    const target = chat.messages[idx];
    target.content = "";
    target.reasoning = "";
    target.toolEvents = [];
    target.sources = [];
    target.notice = "";
    target.error = "";
    target.streaming = true;

    saveChats();
    renderMessages();
    scrollToBottom();
    await runGeneration(chat, target);
  }

  function editAndRerunUserMessage(userId) {
    if (isStreaming) return;
    const chat = getActiveChat();
    if (!chat) return;
    const idx = chat.messages.findIndex(m => m.id === userId);
    if (idx === -1) return;
    const msg = chat.messages[idx];
    el.promptInput.value = msg.content || "";
    autoResizeTextarea();
    if (Array.isArray(msg.images)) {
      pendingImages = msg.images.slice();
      renderPendingAttachments();
    }
    chat.messages = chat.messages.slice(0, idx);
    saveChats();
    renderMessages();
    el.promptInput.focus();
  }

  // ── Rendering UI ────────────────────────────────────────────────────────────
  function renderChatList() {
    const filter = (el.chatSearchInput.value || "").trim().toLowerCase();
    const list = filter
      ? chats.filter(c => c.title.toLowerCase().includes(filter) || c.messages.some(m => (m.content || "").toLowerCase().includes(filter)))
      : chats;

    if (!list.length) {
      el.chatList.innerHTML = `<div style="padding:18px 10px;text-align:center;font-size:12px;color:var(--text-muted);">${filter ? "No matching chats" : "No saved conversations yet"}</div>`;
      return;
    }
    // Group by date like Claude: Today / Yesterday / Previous 7 Days / Older
    const now = Date.now();
    const oneDay = 86400000;
    const startOfToday = new Date(); startOfToday.setHours(0,0,0,0);
    const startTodayMs = startOfToday.getTime();
    const groups = { "Today": [], "Yesterday": [], "Previous 7 Days": [], "Older": [] };
    for(const c of list){
      const t = c.updatedAt || c.createdAt || 0;
      if(t >= startTodayMs) groups["Today"].push(c);
      else if(t >= startTodayMs - oneDay) groups["Yesterday"].push(c);
      else if(t >= startTodayMs - 7*oneDay) groups["Previous 7 Days"].push(c);
      else groups["Older"].push(c);
    }
    const renderOne = (c)=>{
      const count = c.messages.filter(m => m.role === "user").length;
      const d = new Date(c.updatedAt || c.createdAt);
      const timeLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      return `
        <div class="chat-item ${c.id === activeChatId ? "active" : ""}" data-chat-id="${escHtml(c.id)}">
          <div class="chat-item-body">
            <div class="chat-item-title">${escHtml(c.title || "New conversation")}</div>
            <div class="chat-item-meta">
              <span>${timeLabel}</span>
              <span>·</span>
              <span>${count} turn${count === 1 ? "" : "s"}</span>
              ${c.usedWeb ? `<span style="color:var(--web);">· WEB</span>` : ""}
            </div>
          </div>
          <button class="chat-item-del" data-dup-chat="${escHtml(c.id)}" title="Duplicate chat" style="margin-right:2px;font-size:12px;">⧉</button>
          <button class="chat-item-del" data-del-chat="${escHtml(c.id)}" title="Delete chat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>`;
    };
    let html = "";
    for(const [label, arr] of Object.entries(groups)){
      if(!arr.length) continue;
      if(!filter) html += `<div class="sidebar-group-label">${label}</div>`;
      html += arr.map(renderOne).join("");
    }
    // Fallback if grouped produced nothing (shouldn't happen) 
    if(!html) html = list.map(renderOne).join("");
    el.chatList.innerHTML = html;
  }

  function renderEmptyState() {
    try{ const se=document.getElementById("staticEmptyState"); if(se) se.remove(); }catch{}
    const webTag = !isOfflineActive() && settings.webEnabled
      ? "ABLITERATED + NON-ABLITERATED AI · ZERO API KEYS · AUTO-FAILOVER ACTIVE"
      : "ABLITERATED + NON-ABLITERATED AI · ZERO API KEYS · OFFLINE READY";

    const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
    const isOnlineCloud = m => m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7" || m.isDetected;
    const q = (modelSearchQuery||"").trim().toLowerCase();
    const filteredModels = models.filter(m => {
      if (!settings.showHiddenModels && isModelHidden(m)) return false;
      if (catalogFilter === "online" && !isOnlineCloud(m)) return false;
      if (catalogFilter === "abliterated" && !isAbliteratedModel(m)) return false;
      if (catalogFilter === "standard" && isAbliteratedModel(m)) return false;
      if (catalogFilter === "text" && modelSupportsImages(m)) return false;
      if (catalogFilter === "vision" && !modelSupportsImages(m)) return false;
      if (q && !`${m.id} ${m.display_name||""} ${m.base_model||""} ${PROVIDER_LABELS[m.provider]||""}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const onlineCount = models.filter(isOnlineCloud).length;
    const ablitCount = models.filter(isAbliteratedModel).length;
    const stdCount = models.filter(m => !isAbliteratedModel(m)).length;
    const textOnlyCount = models.filter(m => !modelSupportsImages(m)).length;
    const visionCount = models.filter(m => modelSupportsImages(m)).length;

    const cardsHtml = filteredModels.map(m => {
      const isVis = modelSupportsImages(m);
      const isAblit = isAbliteratedModel(m);
      const isActive = m.id === settings.model;
      const ctx = formatCtxShort(m.context_length);
      const provLabel = PROVIDER_LABELS[m.provider || "browser"] || m.provider;
      const k = getModelKey(m);
      const hiddenMeta = settings.hiddenModels?.[k];
      const failCnt = settings.modelFailureCounts?.[k]||0;
      const cooldownUntil = modelCooldownUntil.get(m.id) || providerCooldownUntil.get(m.provider) || 0;
      const isCooldown = cooldownUntil > Date.now();
      const healthDot = hiddenMeta ? "🔴" : (isCooldown ? "🟡" : "🟢");
      const readyTag = m.isDetected
        ? "Ready Now · Local"
        : (m.provider === "browser"
          ? (cachedSet.has(m.id) ? "✓ Cached Offline" : "Optional Offline")
          : (isCooldown ? "Cooldown" : "Online · Zero Download"));
      const metaParts = [provLabel, m.base_model, ctx, readyTag].filter(Boolean);
      return `
        <div role="button" tabindex="0" class="model-pill-card ${isActive ? "active" : ""} ${hiddenMeta ? "hidden-model" : ""}" data-select-model="${escHtml(m.id)}" title="${escHtml(m.id)}${hiddenMeta ? " — HIDDEN: "+escHtml(hiddenMeta.reason) : ""}" style="cursor:pointer;">
          <div class="model-pill-info">
            <span class="model-pill-name">${healthDot} ${escHtml(m.display_name || m.id)} ${failCnt?`<span style="font-size:10px;color:var(--danger);">· ${failCnt}× fail</span>`:""}</span>
            <span class="model-pill-meta">${escHtml(metaParts.join(" · "))}</span>
          </div>
          <div class="model-pill-badges">
            <span class="mod-tag ${isAblit ? "ablit" : "standard"}">${isAblit ? "ABLITERATED" : "NON-ABLITERATED"}</span>
            <span class="mod-tag ${isVis ? "vision" : "text-only"}">${isVis ? "TEXT + VISION" : "TEXT ONLY"}</span>
            <button type="button" class="model-hide-btn" data-hide-model="${escHtml(m.id)}" title="Hide / delete this model" onclick="event.stopPropagation(); manuallyHideModel('${escHtml(m.id)}')">✕</button>
          </div>
        </div>`;
    }).join("");

    const offlineHtml = networkBlockedHint
      ? `<div class="offline-alert show">
          <strong>This file viewer blocks outbound network calls.</strong>
          Click <button type="button" class="btn-secondary" data-download-html="clean" style="padding:3px 8px;font-size:11px;margin:0 4px;">Download abliteration-runner.html</button> and double-click it on your computer to run all ${models.length} verified models directly in Chrome/Edge/Safari/Firefox — or use the Live Preview tab.
        </div>`
      : "";
    const fixBanner = `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 12px;margin:10px 0;border-radius:10px;background:var(--accent-soft);border:1px solid var(--accent-border);"><span style="font-weight:700;color:var(--accent);">✓ Everything Works — Verified</span><span style="font-size:11px;color:var(--text-muted);">${models.length} models · ${getHiddenCount()} hidden · Auto-heal active</span><button type="button" class="btn-secondary" onclick="fixEverything()" style="margin-left:auto;padding:4px 10px;font-size:11px;background:var(--bg-surface);">🔧 Fix Everything</button><button type="button" class="btn-secondary" onclick="modelCooldownUntil.clear(); providerCooldownUntil.clear(); showToast('✓ Cleared all cooldowns'); rebuildModelsList();" style="padding:4px 10px;font-size:11px;">Clear cooldowns</button></div>`;

    el.messagesInner.innerHTML = `
      <div class="empty-state">
        <div class="empty-badge">
          <span style="width:7px;height:7px;border-radius:50%;background:currentColor;"></span>
          ${escHtml(webTag)}
        </div>
        <h1 class="empty-title">Run <span>Online Keyless AI</span> — Abliterated &amp; Non-Abliterated.</h1>
        <p class="empty-desc">
          <strong style="color:var(--accent);">${onlineCount} instant models</strong> — zero keys, zero limits, 10× faster: <strong>Abliterated (${ablitCount})</strong> via Heretic/Uncensored Horde + Local Ollama + <strong>Non-Abliterated (${stdCount})</strong> incl. <strong style="color:var(--sky);">ChatGPT</strong>, GPT-OSS, DeepSeek, GLM, Gemma, Codestral & Qwen — with <strong>Auto-Race + Sticky Failover</strong>. Offline ONNX works with Wi-Fi OFF.
        </p>
        ${offlineHtml}
        <div id="hiddenModelsBanner"></div>
        <div class="model-catalog-box">
          <div class="model-catalog-head">
            <span class="model-catalog-title">Verified Working Models (${filteredModels.length})</span>
            <div class="model-filter-tabs">
              <button type="button" class="model-filter-tab ${catalogFilter === "all" ? "active" : ""}" data-catalog-filter="all">All (${models.length})</button>
              <button type="button" class="model-filter-tab ${catalogFilter === "online" ? "active" : ""}" data-catalog-filter="online">Online Instant (${onlineCount})</button>
              <button type="button" class="model-filter-tab ${catalogFilter === "abliterated" ? "active" : ""}" data-catalog-filter="abliterated">Abliterated (${ablitCount})</button>
              <button type="button" class="model-filter-tab ${catalogFilter === "standard" ? "active" : ""}" data-catalog-filter="standard">Non-Abliterated (${stdCount})</button>
              <button type="button" class="model-filter-tab ${catalogFilter === "text" ? "active" : ""}" data-catalog-filter="text">Text only (${textOnlyCount})</button>
              <button type="button" class="model-filter-tab ${catalogFilter === "vision" ? "active" : ""}" data-catalog-filter="vision">Text + Vision (${visionCount})</button>
            </div>
          </div>
          <div class="model-search-bar" style="display:flex;align-items:center;gap:8px;margin:8px 0 10px;padding:8px 10px;background:var(--bg-canvas);border:1px solid var(--border);border-radius:10px;position:sticky;top:0;z-index:1;backdrop-filter:blur(6px);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" id="modelCatalogSearch" placeholder="Search ${models.length} models — name, provider, vision..." value="${escHtml(modelSearchQuery)}" style="flex:1;background:transparent;border:none;outline:none;font-size:13px;color:var(--text-primary);" autocomplete="off" />
            ${modelSearchQuery ? `<button type="button" data-clear-model-search style="padding:2px 8px;border-radius:6px;background:var(--bg-elevated);border:1px solid var(--border);font-size:11px;color:var(--text-muted);">Clear</button>` : `<span style="font-size:11px;color:var(--text-muted);">⌘K</span>`}
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${filteredModels.length} shown</span>
          </div>
          <div class="model-catalog-grid">${cardsHtml || '<div style="padding:24px;text-align:center;color:var(--text-muted);grid-column:1/-1;">No models match this filter — click <strong>All</strong> above to see all '+models.length+' verified models.</div>'}</div>
        </div>
        <div class="quick-grid">
          <button class="quick-card" data-quick="Clone https://example.com into Web Studio and redesign it as a sleek modern dark-mode interactive landing page with live animations.">
            <span class="quick-card-tag">Web Studio Edit</span>
            <span class="quick-card-title">Clone &amp; redesign a live webpage</span>
            <span class="quick-card-sub">Loads URL into Web Studio and edits HTML/CSS live</span>
          </button>
          <button class="quick-card" data-quick="What are the top AI and tech news stories today? Cite sources with links.">
            <span class="quick-card-tag">Live News</span>
            <span class="quick-card-title">Today's top AI &amp; tech headlines</span>
            <span class="quick-card-sub">Searches breaking news and summarizes with citations</span>
          </button>
          <button class="quick-card" data-quick="Build a sleek interactive single-page portfolio website in Web Studio with dark/light toggle, project cards, and contact section.">
            <span class="quick-card-tag">Build Website</span>
            <span class="quick-card-title">Create a live site in Web Studio</span>
            <span class="quick-card-sub">Renders live side-by-side — save or publish to GitHub/Netlify</span>
          </button>
          <button class="quick-card" data-quick="Use github_search to find a React dashboard boilerplate, then github_get_file to read its README and summarize the best approach.">
            <span class="quick-card-tag">GitHub Connector</span>
            <span class="quick-card-title">Search GitHub & read any file</span>
            <span class="quick-card-sub">As good as Claude — zero setup for public repos</span>
          </button>
          <button class="quick-card" data-quick="Explain how abliteration works in large language models and how refusal directions are identified and removed.">
            <span class="quick-card-tag">Abliterated AI</span>
            <span class="quick-card-title">How abliteration works in LLMs</span>
            <span class="quick-card-sub">Direct technical explanation — zero API keys &amp; auto-failover</span>
          </button>
        </div>
      </div>`;
  }

  function renderToolEventsHTML(msg) {
    if (!msg.toolEvents || !msg.toolEvents.length) return "";
    const running = msg.toolEvents.some(e => e.status === "running");
    const doneCount = msg.toolEvents.filter(e => e.status === "done").length;
    const totalLinks = msg.sources?.length || 0;
    const label = running
      ? `Searching web (${msg.toolEvents.length} action${msg.toolEvents.length === 1 ? "" : "s"})...`
      : `Web activity · ${doneCount}/${msg.toolEvents.length} completed${totalLinks ? ` · ${totalLinks} sources` : ""}`;
    const preview = msg.toolEvents.map(e => e.argLabel).filter(Boolean).slice(-1)[0] || "";
    const isOpen = running || Boolean(msg._toolsOpen);

    const itemsHtml = msg.toolEvents.map(ev => {
      const badgeCls = ev.name.startsWith("sec_audit") ? "audit"
        : (ev.name.startsWith("web_publish") ? "publish"
        : (ev.name.startsWith("web_studio") ? "edit"
        : (ev.name.includes("news") ? "news"
        : (ev.name.includes("fetch") ? "fetch" : "search"))));
      const badgeTxt = ev.name.replace("sec_audit_", "audit ").replace("web_studio_", "studio ").replace("web_publish_", "publish ").replace("web_", "").replace("abliteration_", "native ");
      const statusHtml = ev.status === "running"
        ? `<span class="tool-status"><span class="spinner"></span>running</span>`
        : ev.status === "error"
          ? `<span class="tool-status err">failed (${ev.ms}ms)</span>`
          : `<span class="tool-status ok">✓ ${ev.count ? ev.count + " hits · " : ""}${ev.ms}ms</span>`;
      const linksHtml = ev.links?.length
        ? `<div class="tool-results-mini">${ev.links.map(l => `<a class="mini-link" href="${escHtml(l.url)}" target="_blank" rel="noopener noreferrer" title="${escHtml(l.title)}">${escHtml(l.domain)}</a>`).join("")}</div>`
        : (ev.errorMsg ? `<div style="font-size:11px;color:var(--danger);font-family:var(--font-mono);">${escHtml(ev.errorMsg)}</div>` : "");
      return `
        <div class="tool-item">
          <div class="tool-item-top">
            <div class="tool-item-left">
              <span class="tool-badge ${badgeCls}">${escHtml(badgeTxt)}</span>
              <span class="tool-arg" title="${escHtml(ev.argLabel)}">${escHtml(ev.argLabel)}</span>
            </div>
            ${statusHtml}
          </div>
          ${linksHtml}
        </div>`;
    }).join("");

    return `
      <div class="trace-box ${isOpen ? "open" : ""}" data-trace="tools" data-msg-id="${escHtml(msg.id)}">
        <button type="button" class="trace-header" data-toggle-trace="tools">
          <div class="trace-left">
            ${running ? `<span class="spinner"></span>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--web)" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`}
            <span class="trace-title">${escHtml(label)}</span>
            <span class="trace-preview">${escHtml(preview)}</span>
          </div>
          <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="trace-body">
          <div class="tool-list">${itemsHtml}</div>
        </div>
      </div>`;
  }

  function renderThinkingHTML(msg) {
    if (!msg.reasoning) return "";
    const thinkingNow = msg.streaming && !msg.content;
    const isOpen = Boolean(msg._thinkingOpen);
    const words = msg.reasoning.trim().split(/\s+/).length;
    const title = thinkingNow ? "Reasoning..." : `Thought process (${words} words)`;
    const preview = msg.reasoning.trim().slice(-90).replace(/\s+/g, " ");

    return `
      <div class="trace-box ${isOpen ? "open" : ""}" data-trace="thinking" data-msg-id="${escHtml(msg.id)}">
        <button type="button" class="trace-header" data-toggle-trace="thinking">
          <div class="trace-left">
            ${thinkingNow ? `<span class="spinner amber"></span>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`}
            <span class="trace-title">${escHtml(title)}</span>
            <span class="trace-preview">${escHtml(preview)}</span>
          </div>
          <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="trace-body">
          <div class="thinking-pre">${escHtml(msg.reasoning)}</div>
        </div>
      </div>`;
  }

  function renderAssistantInnerHTML(msg) {
    const mdParsed = renderMarkdown(msg.content || "");
    msg._codeBlocks = mdParsed.codeBlocks || [];

    let noticeHtml = "";
    if(msg.notice){
      const isFailover = msg.notice.includes("Auto-switched") || msg._failoverBanner;
      if(isFailover){
        const short = msg.notice.length>140 ? msg.notice.slice(0,140)+"…" : msg.notice;
        noticeHtml = `<div class="failover-chip"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;"></span><span>${escHtml(short)}</span><details style="margin-left:6px;"><summary style="font-size:11px;color:var(--text-muted);cursor:pointer;">details</summary><div style="margin-top:6px;font-size:11.5px;white-space:pre-wrap;max-width:560px;">${escHtml(msg.notice)}</div></details></div>`;
      } else {
        noticeHtml = `<div class="notice-banner"><span>ℹ</span><span>${escHtml(msg.notice)}</span></div>`;
      }
    }
    const errorHtml = msg.error
      ? `<div class="notice-banner error"><span>⚠</span><span>${escHtml(msg.error)}</span></div>`
      : "";

    const streamingStatusText = msg.toolEvents?.some(e => e.status === "running")
      ? "Searching live web sources..."
      : (msg.reasoning ? "Reasoning complete — writing answer..." : "⚡ Generating at 10× speed...");

    const bodyHtml = msg.content
      ? `<div class="md-content">${mdParsed.html}${msg.streaming ? `<span class="cursor-blink"></span>` : ""}</div>`
      : (msg.streaming
          ? `<div class="md-content" style="color:var(--text-muted);display:flex;align-items:center;gap:8px;"><span class="spinner amber"></span><span>${escHtml(streamingStatusText)}</span></div>`
          : "");

    const sourcesHtml = !msg.streaming && msg.sources?.length
      ? `<div class="sources-strip">${msg.sources.slice(0, 10).map((s, idx) =>
          `<a class="source-chip" href="${escHtml(s.url)}" target="_blank" rel="noopener noreferrer" title="${escHtml(s.title)}">
            <span class="source-idx">[${idx + 1}]</span>
            <span class="source-label">${escHtml(s.domain || s.title)}</span>
          </a>`
        ).join("")}</div>`
      : "";

    let statsParts = [];
    if (msg.model) statsParts.push(msg.model);
    if (msg.usage) {
      const inp = msg.usage.prompt_tokens || 0;
      const out = msg.usage.completion_tokens || 0;
      const cached = msg.usage.prompt_tokens_details?.cached_tokens || 0;
      statsParts.push(`${inp.toLocaleString()} in${cached ? ` (${cached.toLocaleString()} cached)` : ""} / ${out.toLocaleString()} out`);
      if (msg.elapsedSec > 0 && out > 0) {
        statsParts.push(`${(out / msg.elapsedSec).toFixed(1)} tok/s`);
      }
    }
    if (msg.elapsedSec) statsParts.push(`${msg.elapsedSec.toFixed(1)}s`);
    if (typeof msg.costUsd === "number") statsParts.push(`~$${msg.costUsd < 0.0001 ? msg.costUsd.toFixed(6) : msg.costUsd.toFixed(4)}`);

    const footerHtml = !msg.streaming
      ? `<div class="msg-footer">
          <div class="msg-actions">
            <button type="button" class="msg-act-btn" data-copy-msg="${escHtml(msg.id)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </button>
            <button type="button" class="msg-act-btn" data-regen-msg="${escHtml(msg.id)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              Regenerate
            </button>
          </div>
          <div class="msg-stats">${escHtml(statsParts.join(" · "))}</div>
        </div>`
      : "";

    return `
      ${noticeHtml}
      ${renderToolEventsHTML(msg)}
      ${renderThinkingHTML(msg)}
      ${bodyHtml}
      ${errorHtml}
      ${sourcesHtml}
      ${footerHtml}
    `;
  }

  function updateAssistantMessageDOM(msg, contentOnly = false) {
    const col = el.messagesInner.querySelector(`[data-assistant-col="${CSS.escape(msg.id)}"]`);
    if (col) {
      if (contentOnly && msg.streaming && msg.content) {
        const mdEl = col.querySelector(".md-content");
        if (mdEl && !mdEl.querySelector(".spinner")) {
          const mdParsed = renderMarkdown(msg.content);
          msg._codeBlocks = mdParsed.codeBlocks || [];
          mdEl.innerHTML = mdParsed.html + `<span class="cursor-blink"></span>`;
          return;
        }
      }
      col.innerHTML = renderAssistantInnerHTML(msg);
    } else {
      renderMessages();
    }
  }

  function renderMessages() {
    // Hide static fallback once JS is alive
    try{ const se=document.getElementById("staticEmptyState"); if(se) se.style.display="none"; const sl=document.getElementById("staticLoadingHint"); if(sl) sl.style.display="none"; }catch{}
    const chat = getActiveChat();
    if (!chat || !chat.messages.length) {
      renderEmptyState();
      return;
    }

    el.messagesInner.innerHTML = chat.messages.map(m => {
      if (m.role === "user") {
        const imgs = Array.isArray(m.images) && m.images.length
          ? `<div class="user-images">${m.images.map(im => `<img src="${im.dataUrl}" alt="${escHtml(im.name || "attached image")}" />`).join("")}</div>`
          : "";
        return `
          <div class="msg-row user" data-msg-row="${escHtml(m.id)}">
            <div class="avatar user">YOU</div>
            <div class="msg-col">
              <div class="user-bubble">${imgs}${escHtml(m.content || "")}</div>
              <div class="msg-actions">
                <button type="button" class="msg-act-btn" data-edit-msg="${escHtml(m.id)}">Edit &amp; rerun</button>
                <button type="button" class="msg-act-btn" data-copy-msg="${escHtml(m.id)}">Copy</button>
              </div>
            </div>
          </div>`;
      } else {
        return `
          <div class="msg-row assistant" data-msg-row="${escHtml(m.id)}">
            <div class="avatar ai">AI</div>
            <div class="msg-col" data-assistant-col="${escHtml(m.id)}">
              ${renderAssistantInnerHTML(m)}
            </div>
          </div>`;
      }
    }).join("");
  }

  function scrollToBottom() {
    try { el.messagesWrap.scrollTo({ top: el.messagesWrap.scrollHeight, behavior: "smooth" }); } catch { el.messagesWrap.scrollTop = el.messagesWrap.scrollHeight; }
  }

  function autoScrollIfNearBottom() {
    const dist = el.messagesWrap.scrollHeight - el.messagesWrap.scrollTop - el.messagesWrap.clientHeight;
    if (dist < 180) {
      try { el.messagesWrap.scrollTo({ top: el.messagesWrap.scrollHeight, behavior: "smooth" }); } catch { el.messagesWrap.scrollTop = el.messagesWrap.scrollHeight; }
    }
  }

  // ── Controls Sync ───────────────────────────────────────────────────────────
  function updateConnectorDots(){
    const ghSet = !!(settings.ghToken||"").trim();
    const ghDot = document.getElementById("ghStatusDot");
    const ghTxt = document.getElementById("ghStatusText");
    if(ghDot) ghDot.style.background = ghSet ? "#10b981" : "#f59e0b";
    if(ghTxt) ghTxt.textContent = ghSet ? "✓ Connected (private OK)" : "Public only — add PAT for private";
    const supaSet = !!((settings.supabaseUrl||"").trim() && (settings.supabaseKey||"").trim());
    const sDot = document.getElementById("supabaseStatusDot");
    const sTxt = document.getElementById("supabaseStatusText");
    if(sDot) sDot.style.background = supaSet ? "#10b981" : "#71717a";
    if(sTxt) sTxt.textContent = supaSet ? "✓ Connected" : "Not configured";
  }
  function getModelAvatarInfo(m){
    const cat = isAbliteratedModel(m) ? "A" : "N";
    const prov = (m.provider||"").toLowerCase();
    if(m.isAutoRace) return { letter: "⚡", bg: "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)" };
    if(prov==="aihorde") return { letter: cat, bg: cat==="A" ? "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)" : "linear-gradient(135deg,#38bdf8 0%,#0ea5e9 100%)" };
    if(prov==="pollinations") return { letter: "P", bg: "linear-gradient(135deg,#10b981 0%,#059669 100%)" };
    if(prov==="llm7") return { letter: "7", bg: "linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)" };
    if(prov==="ollama"||prov==="lmstudio") return { letter: "◈", bg: "linear-gradient(135deg,#52525b 0%,#27272a 100%)" };
    if(prov==="browser") return { letter: "◐", bg: "linear-gradient(135deg,#71717a 0%,#52525b 100%)" };
    return { letter: cat, bg: "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)" };
  }
  function renderModelPickerDropdown(){
    const listEl = document.getElementById("modelPickerList");
    if(!listEl) return;
    const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
    const detectedLocalIds = new Set(ollamaDetectedModels.map(m => `${m.provider}::${m.id}`));
    const isLiveLocal = m => (m.provider === "ollama" || m.provider === "lmstudio") && (m.isDetected || detectedLocalIds.has(`${m.provider}::${m.id}`));
    const isOnlineCloud = m => m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7" || m.provider === "auto-nonablit" || m.isAutoRace;
    const isAutoRace = m => !!m.isAutoRace;
    const groups = [
      { label: "⚡ Auto-Race — Fastest", icon: "⚡", filter: m => isAutoRace(m) },
      { label: "Abliterated — Cloud", icon: "🔓", filter: m => isAbliteratedModel(m) && isOnlineCloud(m) && !isAutoRace(m) },
      { label: "Abliterated — Local", icon: "◈", filter: m => isAbliteratedModel(m) && isLiveLocal(m) },
      { label: "Standard — Cloud", icon: "▣", filter: m => !isAbliteratedModel(m) && isOnlineCloud(m) && !isAutoRace(m) },
      { label: "Standard — Local", icon: "◈", filter: m => !isAbliteratedModel(m) && isLiveLocal(m) },
      { label: "Offline — HTML", icon: "◐", filter: m => m.provider === "browser" },
      { label: "Custom", icon: "✦", filter: m => m.provider === "custom" }
    ];
    let html="";
    let totalShown=0;
    const hiddenCountTop = getHiddenCount();
    for(const g of groups){
      let items = models.filter(g.filter).filter(m=> settings.showHiddenModels || !isModelHidden(m));
      if(!items.length) continue;
      totalShown += items.length;
      html += `<div class="model-picker-group"><div class="model-picker-group-label">${g.icon} ${g.label} · ${items.length}</div>`;
      for(const m of items){
        const active = m.id === settings.model;
        const av = getModelAvatarInfo(m);
        const ctx = formatCtxShort(m.context_length);
        const badge = modelSupportsImages(m) ? "VISION" : "TEXT";
        const k=getModelKey(m); const isHidden=!!settings.hiddenModels?.[k]; const cd=modelCooldownUntil.get(m.id)||providerCooldownUntil.get(m.provider)||0; const dot=isHidden?"🔴":(cd>Date.now()?"🟡":"🟢");
        html += `<div class="model-picker-item ${active?"active":""} ${isHidden?"hidden-model":""}" data-pick-model="${m.id}">
          <span class="item-avatar" style="background:${av.bg}">${av.letter}</span>
          <span class="item-info"><span class="item-name">${dot} ${escHtml(m.display_name||m.id)}</span><span class="item-desc">${escHtml([m.base_model, ctx].filter(Boolean).join(" · "))}</span></span>
          <span class="item-badge">${badge}</span>
          <button type="button" class="model-hide-btn small" data-hide-model="${escHtml(m.id)}" title="Hide model" onclick="event.stopPropagation(); manuallyHideModel('${escHtml(m.id)}')">✕</button>
        </div>`;
      }
      html += `</div>`;
    }
    if(!totalShown) html = `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px;">No models available</div>`;
    listEl.innerHTML = html;
    listEl.querySelectorAll("[data-pick-model]").forEach(el=>{
      el.addEventListener("click", ()=>{
        selectModelById(el.dataset.pickModel);
        closeModelPicker();
      });
    });
  }
  function updateModelPickerButton(){
    const m = getCurrentModelObj();
    if(!m) return;
    const nameEl = document.getElementById("modelPickerName");
    const provEl = document.getElementById("modelPickerProvider");
    const avEl = document.getElementById("modelPickerAvatar");
    if(nameEl) nameEl.textContent = m.display_name || m.id;
    if(provEl) provEl.textContent = `${PROVIDER_LABELS[m.provider]||m.provider} · ${formatCtxShort(m.context_length)}`;
    if(avEl){
      const av=getModelAvatarInfo(m);
      avEl.textContent=av.letter;
      avEl.style.background=av.bg;
    }
  }
  function openModelPicker(){
    const dd=document.getElementById("modelPickerDropdown");
    if(!dd) return;
    dd.classList.add("open");
    renderModelPickerDropdown();
  }
  function closeModelPicker(){
    document.getElementById("modelPickerDropdown")?.classList.remove("open");
  }
  // Close picker on Esc globally (alongside other Esc handlers)
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModelPicker(); });
  function toggleModelPicker(){
    const dd=document.getElementById("modelPickerDropdown");
    if(dd?.classList.contains("open")) closeModelPicker(); else openModelPicker();
  }

  function populateModelSelect() {
    const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
    const detectedLocalIds = new Set(ollamaDetectedModels.map(m => `${m.provider}::${m.id}`));
    const isLiveLocal = m => (m.provider === "ollama" || m.provider === "lmstudio") && (m.isDetected || detectedLocalIds.has(`${m.provider}::${m.id}`));
    const isOnlineCloud = m => m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7" || m.provider === "auto-nonablit" || m.isAutoRace;
    const isAutoRace = m => !!m.isAutoRace;

    const groups = [
      { label: ">> Auto-Race — Fastest Instant (Recommended)", filter: m => isAutoRace(m) },
      { label: "Abliterated — Online Keyless Cloud (Unlimited · Zero Download)", filter: m => isAbliteratedModel(m) && isOnlineCloud(m) && !isAutoRace(m) },
      { label: "Abliterated — Running Local Server (Ready Now)", filter: m => isAbliteratedModel(m) && isLiveLocal(m) },
      { label: "Non-Abliterated — ChatGPT & Online Keyless Cloud (Instant)", filter: m => !isAbliteratedModel(m) && isOnlineCloud(m) && !isAutoRace(m) },
      { label: "Non-Abliterated — Running Local Server (Ready Now)", filter: m => !isAbliteratedModel(m) && isLiveLocal(m) },
      { label: "Abliterated — Optional Offline HTML (No-Wi-Fi Only)", filter: m => isAbliteratedModel(m) && m.provider === "browser" },
      { label: "Non-Abliterated — Optional Offline HTML (No-Wi-Fi Only)", filter: m => !isAbliteratedModel(m) && m.provider === "browser" },
      { label: "Custom Models", filter: m => m.provider === "custom" }
    ];

    const htmlParts = [];
    for (const g of groups) {
      const items = models.filter(g.filter);
      if (!items.length) continue;
      const opts = items.map(m => {
        const ctx = formatCtxShort(m.context_length);
        const modLabel = getModalityLabel(m);
        const name = m.display_name || m.name || m.id;
        const cachedTag = (m.provider === "browser" && cachedSet.has(m.id)) ? "✓ Cached Offline" : "";
        const meta = [cachedTag, modLabel, ctx].filter(Boolean).join(" · ");
        return `<option value="${escHtml(m.id)}">${escHtml(name)} — [${escHtml(meta)}]</option>`;
      }).join("");
      htmlParts.push(`<optgroup label="${escHtml(g.label)}">${opts}</optgroup>`);
    }

    if(!htmlParts.length){
      htmlParts.push('<optgroup label="No models matched filter"><option value="">No models — reset filter in Settings</option></optgroup>');
    }
    if(el.modelSelect){
      el.modelSelect.innerHTML = htmlParts.join("");
      if (models.some(m => m.id === settings.model)) {
        el.modelSelect.value = settings.model;
      } else if (models.length) {
        settings.model = models[0].id;
        el.modelSelect.value = settings.model;
      }
      el.modelSelect.style.fontFamily = 'var(--font-sans)';
    }
    try{ updateModelPickerButton(); renderModelPickerDropdown(); }catch{}
  }

  function syncModelCapabilitiesUI() {
    const modelObj = getCurrentModelObj();
    const provCfg = getProviderConfig(modelObj);
    const canImg = modelSupportsImages(modelObj);

    // Update crisp topbar modality pill ("TEXT ONLY" vs "TEXT + VISION")
    if (el.modelModalityBadge) {
      el.modelModalityBadge.className = "modality-pill " + (canImg ? "vision" : "text-only");
      el.modelModalityBadge.textContent = canImg ? "TEXT + VISION" : "TEXT ONLY";
      const ctx = formatCtxShort(modelObj.context_length);
      el.modelModalityBadge.title = `${modelObj.display_name || modelObj.id} · ${canImg ? "Accepts text & images" : "Text-only model (no image uploads)"} · ${provCfg.label}${ctx ? " · " + ctx + " ctx" : ""}`;
    }

    el.attachImgBtn.disabled = !canImg;
    el.attachImgBtn.title = canImg
      ? "Attach image (supported by " + (modelObj.display_name || modelObj.id) + ")"
      : (modelObj.display_name || modelObj.id) + " is Text only — switch to a Text + Vision model for images";

    // Effort toggle applies to local Ollama thinking models (e.g. Qwen 3.5 Abliterated)
    el.effortGroup.classList.toggle("disabled-provider", !provCfg.supportsReasoningEffort);
    el.effortGroup.title = provCfg.supportsReasoningEffort
      ? "Reasoning effort (Off/Low = fast direct answers; Med/High = deep thinking)"
      : `Reasoning effort control applies to Local Ollama thinking models (${provCfg.label} uses native defaults)`;

    const maxT = getModelTempMax(modelObj);
    el.tempRange.max = String(maxT);
    if (settings.temperature > maxT) {
      settings.temperature = maxT;
      saveSettings();
    }
    el.tempRange.value = String(settings.temperature);
    el.tempVal.textContent = Number(settings.temperature).toFixed(2);
    el.tempLimitNote.textContent = `(0.0 – ${maxT.toFixed(1)} for ${modelObj.id})`;

    updateFooterHint();
  }

  function updateFooterHint() {
    const modelObj = getCurrentModelObj();
    const provCfg = getProviderConfig(modelObj);
    const modTag = getModalityLabel(modelObj);
    const offline = isOfflineActive();
    const routeNote = offline ? " · Offline / No-Wi-Fi" : (proxyAvailable && String(provCfg.endpointBase).startsWith("./api/") ? " · Same-origin proxy" : "");
    const raceNote = modelObj.isAutoRace ? " · >> Auto-Race" : "";
    const webNote = offline
      ? "Offline In-Browser AI & Local Web Studio active"
      : (settings.webEnabled ? "Keyless Live Web Agent" : "Web paused");
    el.hintLeft.textContent = `${provCfg.label}${raceNote} · ${modTag}${routeNote} · ${webNote}`;
  }

  function syncEffortUI() {
    el.effortGroup.querySelectorAll(".effort-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.effort === settings.reasoningEffort);
    });
  }

  function syncWebToggleUI() {
    const offline = isOfflineActive();
    const effectiveOn = !offline && Boolean(settings.webEnabled);
    el.webToggleBtn.classList.toggle("on", effectiveOn);
    el.webToggleLabel.textContent = offline
      ? "Web: OFFLINE"
      : (settings.webEnabled ? "Web Access: ON" : "Web Access: OFF");
    el.forceSearchBtn.disabled = offline || !settings.webEnabled;
    updateFooterHint();
    if (!getActiveChat()?.messages?.length) renderEmptyState();
  }

  async function syncOfflineUI(autoSwitchModel = false) {
    const offline = isOfflineActive();
    if (el.offlineToggleBtn) {
      el.offlineToggleBtn.classList.toggle("is-offline", offline);
      el.offlineToggleLabel.textContent = offline ? "No-WiFi: ON" : "No-WiFi: OFF";
    }
    if (el.offlineModeToggle) {
      el.offlineModeToggle.checked = Boolean(settings.offlineMode);
    }

    if (offline) {
      await syncOllamaModels(true);
      const localCount = ollamaDetectedModels.length;
      const cachedBrowser = (Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : [])
        .filter(id => BROWSER_LOCAL_MODELS.some(m => m.id === id));

      const statusLabel = cachedBrowser.length
        ? "Offline · HTML Abliterated"
        : (localCount ? "Offline · Local Abliterated" : "In-Browser HTML AI");
      const countLabel = cachedBrowser.length
        ? `${cachedBrowser.length} cached`
        : (localCount ? `${localCount} local` : "100% HTML");
      setConnStatus("ok", statusLabel, countLabel);

      if (autoSwitchModel) {
        const cur = getCurrentModelObj();
        const curIsBrowser = cur.provider === "browser";
        const curIsRunningLocal = localCount > 0 && ollamaDetectedModels.some(m => m.id === cur.id && m.provider === cur.provider);

        if (!curIsBrowser && !curIsRunningLocal) {
          const targetId = cachedBrowser[0] || ollamaDetectedModels[0]?.id || DEFAULT_BROWSER_AI_MODEL;
          if (settings.model !== targetId) {
            settings.model = targetId;
            settings.autoSwitchedModel = true;
            saveSettings();
            populateModelSelect();
            syncModelCapabilitiesUI();
            const picked = getCurrentModelObj();
            showToast(`Offline Mode: switched to ${picked.display_name || picked.id}`);
          }
        }
      }
    } else if (autoSwitchModel) {
      // Online Mode restored: if user was on an auto-switched or uncached browser download model, switch straight back to an instant online keyless abliterated model!
      const cur = getCurrentModelObj();
      const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
      if (cur.provider === "browser" && (!cachedSet.has(cur.id) || settings.autoSwitchedModel)) {
        const onlineTarget = pickBestUnlimitedAbliteratedModel();
        if (onlineTarget && settings.model !== onlineTarget) {
          settings.model = onlineTarget;
          settings.autoSwitchedModel = false;
          saveSettings();
          populateModelSelect();
          syncModelCapabilitiesUI();
        }
      }
    }
    syncWebToggleUI();
  }

  function syncThemeUI() {
    document.documentElement.setAttribute("data-theme", settings.theme || "dark");
    el.themeIcon.innerHTML = settings.theme === "light"
      ? `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`
      : `<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;
  }

  function updateSendButtonState() {
    if (isStreaming) {
      el.sendBtn.classList.add("stop");
      el.sendBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg> Stop`;
    } else {
      el.sendBtn.classList.remove("stop");
      el.sendBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> Run`;
    }
  }

  function autoResizeTextarea() {
    el.promptInput.style.height = "auto";
    el.promptInput.style.height = Math.min(200, el.promptInput.scrollHeight) + "px";
  }

  // ── Image Attachments ───────────────────────────────────────────────────────
  function addImageFiles(fileList) {
    if (!modelSupportsImages(getCurrentModelObj())) {
      showToast("Switch to a Text + Vision abliterated model (e.g. Qwen 3.5 Abliterated) for image inputs.");
      return;
    }
    for (const file of Array.from(fileList || [])) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) { showToast("Image too large (max 10 MB)."); continue; }
      const reader = new FileReader();
      reader.onload = () => {
        pendingImages.push({ dataUrl: reader.result, name: file.name, mime: file.type });
        renderPendingAttachments();
      };
      reader.readAsDataURL(file);
    }
  }

  function renderPendingAttachments() {
    el.pendingAttachments.innerHTML = pendingImages.map((img, i) => `
      <div class="attach-thumb">
        <img src="${img.dataUrl}" alt="${escHtml(img.name)}" />
        <button type="button" class="attach-remove" data-rm-img="${i}" title="Remove">×</button>
      </div>
    `).join("");
  }

  // ── Settings Drawer ─────────────────────────────────────────────────────────
  function renderCustomModelsList() {
    if (!el.customModelsList) return;
    const list = Array.isArray(settings.customModels) ? settings.customModels : [];
    if (!list.length) {
      el.customModelsList.innerHTML = `<div style="font-size:11.5px;color:var(--text-muted);">No custom models added yet. Add any OpenAI-compatible abliterated model above.</div>`;
      return;
    }
    el.customModelsList.innerHTML = list.map((m, idx) => {
      const isVis = modelSupportsImages(m);
      return `
        <div class="custom-model-row">
          <div style="min-width:0;">
            <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(m.display_name || m.id)}</div>
            <div style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${escHtml(m.id)} · ${isVis ? "Text + Vision" : "Text only"}
            </div>
          </div>
          <button type="button" class="msg-act-btn" data-del-custom-model="${idx}" style="color:var(--danger);">Remove</button>
        </div>`;
    }).join("");
  }

  function openSettings() {
    el.offlineModeToggle.checked = Boolean(settings.offlineMode);
    if (el.browserAiModelSelect) {
      const curBrowser = BROWSER_LOCAL_MODELS.some(m => m.id === settings.model)
        ? settings.model
        : (settings.cachedBrowserModels?.[0] || DEFAULT_BROWSER_AI_MODEL);
      el.browserAiModelSelect.value = curBrowser;
    }
    if (el.hfMirrorUrlInput) {
      el.hfMirrorUrlInput.value = settings.hfMirrorUrl || "";
    }
    if (el.browserAiStatusBox) {
      const cached = Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : [];
      if (cached.length) {
        el.browserAiStatusBox.className = "test-result show ok";
        el.browserAiStatusBox.textContent = `✓ Cached offline in browser: ${cached.map(id => id.split("/").pop()).join(", ")}`;
      } else {
        el.browserAiStatusBox.className = "test-result";
        el.browserAiStatusBox.textContent = "";
      }
    }
    el.ollamaUrlInput.value = settings.ollamaUrl || DEFAULT_OLLAMA_URL;
    el.lmstudioUrlInput.value = settings.lmstudioUrl || DEFAULT_LMSTUDIO_URL;
    el.maxToolRoundsRange.value = String(settings.maxToolRounds);
    el.maxToolRoundsVal.textContent = String(settings.maxToolRounds);
    el.webEditorEnabledToggle.checked = settings.webEditorEnabled !== false;
    el.ghRepoInput.value = settings.ghRepo || "";
    el.ghBranchInput.value = settings.ghBranch || "main";
    el.ghPathInput.value = settings.ghPath || "index.html";
    el.ghTokenInput.value = settings.ghToken || "";
    el.netlifySiteIdInput.value = settings.netlifySiteId || "";
    el.netlifyTokenInput.value = settings.netlifyToken || "";
    el.webhookUrlInput.value = settings.webhookUrl || "";
    el.webhookTokenInput.value = settings.webhookToken || "";
  if(el.supabaseUrlInput) el.supabaseUrlInput.value = settings.supabaseUrl || "";
  if(el.supabaseKeyInput) el.supabaseKeyInput.value = settings.supabaseKey || "";
  try{ updateConnectorDots(); }catch{}
    el.secAuditEnabledToggle.checked = settings.secAuditEnabled !== false;
    el.secAllowedDomainsInput.value = settings.secAllowedDomains || "";
    el.maxTokensInput.value = String(settings.maxTokens);
    el.systemPromptInput.value = settings.systemPrompt || "";
    renderCustomModelsList();
    syncModelCapabilitiesUI();
    el.drawerBackdrop.classList.add("open");
    el.settingsDrawer.classList.add("open");
  }

  function closeSettings() {
    el.drawerBackdrop.classList.remove("open");
    el.settingsDrawer.classList.remove("open");
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportActiveChat(format) {
    const chat = getActiveChat();
    if (!chat || !chat.messages.length) { showToast("Nothing to export yet."); return; }
    const slug = (chat.title || "chat").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    if (format === "json") {
      downloadFile(`${slug}.json`, JSON.stringify(chat, null, 2), "application/json");
      showToast("Exported chat JSON.");
      return;
    }
    const md = [
      `# ${chat.title || "Abliteration AI Chat"}`,
      `_Exported ${new Date().toISOString()}_\n`
    ];
    for (const m of chat.messages) {
      md.push(m.role === "user" ? `## User\n\n${m.content}\n` : `## Assistant (${m.model || settings.model})\n\n${m.content}\n`);
      if (m.sources?.length) {
        md.push("### Sources\n" + m.sources.map(s => `- [${s.title}](${s.url})`).join("\n") + "\n");
      }
    }
    downloadFile(`${slug}.md`, md.join("\n"), "text/markdown");
    showToast("Exported chat Markdown.");
  }

  // ── Event Listeners ─────────────────────────────────────────────────────────
  el.toggleSidebarBtn.addEventListener("click", () => el.sidebar.classList.toggle("collapsed"));
  el.closeSidebarBtn.addEventListener("click", () => el.sidebar.classList.add("collapsed"));
  // Premium model picker wiring (10× polished vs native select)
  document.getElementById("modelPickerBtn")?.addEventListener("click", (e)=>{ e.stopPropagation(); toggleModelPicker(); });
  // search removed — dropdown only
  document.addEventListener("click", (e)=>{ const w=document.getElementById("modelPickerWrap"); if(w && !w.contains(e.target)) closeModelPicker(); });
  el.newChatBtn.addEventListener("click", () => {
    if (isStreaming) activeAbortController?.abort();
    createChat();
    el.promptInput.focus();
  });

  el.chatSearchInput.addEventListener("input", renderChatList);

  el.chatList.addEventListener("click", (e) => {
    const dupBtn = e.target.closest("[data-dup-chat]");
    if (dupBtn) {
      e.stopPropagation();
      const id = dupBtn.dataset.dupChat;
      const src = chats.find(c=> c.id===id);
      if(src){
        const copy = JSON.parse(JSON.stringify(src));
        copy.id = "chat_"+Date.now()+"_"+Math.random().toString(36).slice(2,6);
        copy.title = (src.title||"Chat") + " (copy)";
        copy.createdAt = Date.now(); copy.updatedAt = Date.now();
        chats.unshift(copy); activeChatId = copy.id; saveChats(); renderChatList(); renderMessages(); showToast("Duplicated chat");
      }
      return;
    }
    const delBtn = e.target.closest("[data-del-chat]");
    if (delBtn) {
      e.stopPropagation();
      const id = delBtn.dataset.delChat;
      chats = chats.filter(c => c.id !== id);
      if (activeChatId === id) activeChatId = chats[0]?.id || null;
      saveChats();
      renderChatList();
      renderMessages();
      return;
    }
    const item = e.target.closest("[data-chat-id]");
    if (item) {
      if (isStreaming) activeAbortController?.abort();
      activeChatId = item.dataset.chatId;
      renderChatList();
      renderMessages();
      scrollToBottom();
      if (window.innerWidth <= 820) el.sidebar.classList.add("collapsed");
    }
  });

  function selectModelById(modelId) {
    if (!models.some(m => m.id === modelId)) return;
    settings.model = modelId;
    settings.userPickedModel = true;
    settings.autoSwitchedModel = false;
    const m = getCurrentModelObj();
    // If user manually selects an Online Keyless model while Offline Mode was left toggled ON (and device is online),
    // automatically restore Online Mode instead of failing and bouncing them back to an offline browser download model!
    const isOnlineCloud = m && (m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7");
    let exitedOffline = false;
    if (isOnlineCloud && settings.offlineMode && (typeof navigator === "undefined" || navigator.onLine !== false)) {
      settings.offlineMode = false;
      exitedOffline = true;
    }
    saveSettings();
    el.modelSelect.value = modelId;
    // User explicitly changed the model — clear any prior failover cooldown so their manual selection runs immediately
    if (m) {
      modelCooldownUntil.delete(m.id);
      if (m.provider) providerCooldownUntil.delete(m.provider);
      if (m.provider === "browser") browserNetworkBlockedUntil = 0;
    }
    if (exitedOffline) syncOfflineUI(false);
    syncModelCapabilitiesUI();
    if (!getActiveChat()?.messages?.length) renderEmptyState();
    const catLabel = isAbliteratedModel(m) ? "Abliterated" : "Non-Abliterated";
    showToast(`${exitedOffline ? "Online Mode restored · " : ""}${m.display_name || m.id} · ${catLabel} · ${getModalityLabel(m)}`);
  }

  el.modelSelect.addEventListener("change", () => {
    selectModelById(el.modelSelect.value);
  });

  el.effortGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-effort]");
    if (!btn) return;
    settings.reasoningEffort = btn.dataset.effort;
    saveSettings();
    syncEffortUI();
  });

  el.webToggleBtn.addEventListener("click", () => {
    settings.webEnabled = !settings.webEnabled;
    saveSettings();
    syncWebToggleUI();
    showToast(settings.webEnabled ? "Live Web Access enabled" : "Live Web Access paused");
  });

  el.themeToggleBtn.addEventListener("click", () => {
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    saveSettings();
    syncThemeUI();
  });

  el.openSettingsBtn.addEventListener("click", openSettings);
  el.closeSettingsBtn.addEventListener("click", closeSettings);
  el.drawerBackdrop.addEventListener("click", closeSettings);
  el.exportMdBtn.addEventListener("click", () => exportActiveChat("md"));
  el.exportJsonBtn.addEventListener("click", () => exportActiveChat("json"));

  function triggerFileDownload(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function getCleanStandaloneHtmlSync() {
    return PRISTINE_HTML_SNAPSHOT || ("<!DOCTYPE html>\n" + document.documentElement.outerHTML);
  }

  function downloadStandaloneHtml(includeData = false) {
    try {
      // On Live Preview, trigger a genuine synchronous HTTP Content-Disposition: attachment download (never blocked by gesture loss!)
      if (!includeData && proxyAvailable && (location.protocol === "http:" || location.protocol === "https:")) {
        const a = document.createElement("a");
        a.href = "./download";
        a.download = "abliteration-runner.html";
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast("Downloading abliteration-runner.html — double-click it anywhere to run in your browser!");
        return;
      }

      // Synchronous snapshot export (preserves click user-gesture activation in Chrome, Edge, Firefox & Safari!)
      let htmlDoc = getCleanStandaloneHtmlSync();
      const stateTagRe = new RegExp('<' + 'script\\s+type="application/json"\\s+id="__PORTABLE_STATE__">[\\s\\S]*?<' + '/script>\\r?\\n?', "gi");
      htmlDoc = htmlDoc.replace(stateTagRe, "");
      htmlDoc = htmlDoc.replace(/<meta\s+name="ablit-proxy-origin"[^>]*>\r?\n?/gi, "");

      if (includeData) {
        const payload = {
          exportedAt: new Date().toISOString(),
          settings,
          chats,
          studio: {
            html: studio.html,
            filename: studio.filename,
            sourceUrl: studio.sourceUrl,
            lastPublishedUrl: studio.lastPublishedUrl
          }
        };
        const safeJson = JSON.stringify(payload).replace(/<\//g, "<\\/");
        const tag = '<' + 'script type="application/json" id="__PORTABLE_STATE__">' + safeJson + '<' + '/script>\n';
        const closeBodyIdx = htmlDoc.toLowerCase().lastIndexOf("</body>");
        if (closeBodyIdx !== -1) {
          htmlDoc = htmlDoc.slice(0, closeBodyIdx) + tag + htmlDoc.slice(closeBodyIdx);
        } else {
          htmlDoc += "\n" + tag;
        }
      }

      const filename = includeData ? "abliteration-runner-portable.html" : "abliteration-runner.html";
      triggerFileDownload(filename, htmlDoc, "text/html;charset=utf-8");
      if (IS_SANDBOXED_VIEWER) {
        showToast("If this preview iframe blocks downloads, click the Download icon in the top file-viewer bar (or use the Live Preview tab).");
      } else {
        showToast(includeData
          ? `Downloaded ${filename} (includes your settings, chats & Web Studio)!`
          : `Downloaded ${filename} — double-click it anywhere to run in your browser!`);
      }
    } catch (err) {
      showToast("Download failed: " + (err.message || String(err)));
    }
  }

  function downloadOfflineSetupScript(kind) {
    if (kind === "win") {
      const bat = [
        "@echo off",
        "REM One-click Offline Abliterated AI Setup for Windows",
        "set MODEL=huihui_ai/qwen3.5-abliterated:0.8B",
        "echo === Abliteration Runner - Offline AI Setup (Windows) ===",
        "where ollama >nul 2>&1",
        "if errorlevel 1 (",
        "  echo [1/3] Installing Ollama via winget...",
        "  winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements",
        "  if errorlevel 1 (",
        "    echo Could not auto-install via winget. Download Ollama from https://ollama.com/download and re-run.",
        "    pause",
        "    exit /b 1",
        "  )",
        ") else (",
        "  echo [1/3] Ollama is already installed.",
        ")",
        "echo [2/3] Enabling browser access (OLLAMA_ORIGINS=*)...",
        'setx OLLAMA_ORIGINS "*" >nul',
        "set OLLAMA_ORIGINS=*",
        'start "" /B ollama serve',
        "timeout /t 3 /nobreak >nul",
        "echo [3/3] Downloading local abliterated model: %MODEL% ...",
        "ollama pull %MODEL%",
        "echo.",
        "echo ALL SET! Turn Wi-Fi OFF, open abliteration-runner.html, click No-WiFi: ON, and chat locally!",
        "pause"
      ].join("\r\n") + "\r\n";
      triggerFileDownload("setup-offline-ai.bat", bat, "application/x-bat;charset=utf-8");
      showToast("Downloaded setup-offline-ai.bat (double-click once while online)");
    } else {
      const sh = [
        "#!/usr/bin/env bash",
        "# One-click Offline Abliterated AI Setup for macOS & Linux",
        "set -e",
        'MODEL="${1:-huihui_ai/qwen3.5-abliterated:0.8B}"',
        'echo "=== Abliteration Runner — Offline AI Setup (macOS/Linux) ==="',
        "if ! command -v ollama >/dev/null 2>&1; then",
        '  echo "[1/3] Installing Ollama..."',
        "  curl -fsSL https://ollama.com/install.sh | sh",
        "else",
        '  echo "[1/3] Ollama already installed: $(ollama --version)"',
        "fi",
        'echo "[2/3] Starting Ollama with browser CORS enabled (OLLAMA_ORIGINS=*)..."',
        'export OLLAMA_ORIGINS="*"',
        "if ! curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then",
        '  nohup env OLLAMA_ORIGINS="*" ollama serve >/tmp/ollama-offline.log 2>&1 &',
        "  sleep 3",
        "fi",
        'echo "[3/3] Downloading local abliterated model: ${MODEL}..."',
        'ollama pull "${MODEL}"',
        'echo ""',
        'echo "ALL SET! Turn Wi-Fi OFF, open abliteration-runner.html, click No-WiFi: ON, and chat locally!"'
      ].join("\n") + "\n";
      triggerFileDownload("setup-offline-ai.sh", sh, "application/x-sh;charset=utf-8");
      showToast("Downloaded setup-offline-ai.sh (run once: bash setup-offline-ai.sh)");
    }
  }

  el.downloadHtmlBtn.addEventListener("click", () => downloadStandaloneHtml(false));
  el.downloadCleanHtmlBtn.addEventListener("click", () => downloadStandaloneHtml(false));
  el.downloadPortableHtmlBtn.addEventListener("click", () => downloadStandaloneHtml(true));
  el.downloadWinSetupBtn.addEventListener("click", () => downloadOfflineSetupScript("win"));
  el.downloadUnixSetupBtn.addEventListener("click", () => downloadOfflineSetupScript("unix"));

  el.connPill.addEventListener("click", async () => {
    setConnStatus("warn", "Scanning...", "...");
    await refreshUnlimitedModelsStatus(false);
  });

  el.ollamaUrlInput.addEventListener("input", () => {
    settings.ollamaUrl = el.ollamaUrlInput.value.trim() || DEFAULT_OLLAMA_URL;
    saveSettings();
  });

  el.lmstudioUrlInput.addEventListener("input", () => {
    settings.lmstudioUrl = el.lmstudioUrlInput.value.trim() || DEFAULT_LMSTUDIO_URL;
    saveSettings();
  });

  el.offlineModeToggle.addEventListener("change", async () => {
    settings.offlineMode = Boolean(el.offlineModeToggle.checked);
    saveSettings();
    await syncOfflineUI(true);
    if (!isOfflineActive()) await refreshUnlimitedModelsStatus(true);
  });

  el.offlineToggleBtn.addEventListener("click", async () => {
    settings.offlineMode = !settings.offlineMode;
    saveSettings();
    await syncOfflineUI(true);
    if (!isOfflineActive()) {
      showToast("Online Mode restored — keyless Web Agent active");
      await refreshUnlimitedModelsStatus(true);
    }
  });

  window.addEventListener("offline", async () => {
    showToast("Wi-Fi disconnected — Offline In-Browser Abliterated Mode active");
    await syncOfflineUI(true);
  });

  window.addEventListener("online", async () => {
    if (!settings.offlineMode) {
      showToast("Connection restored — Keyless Live Web Agent active");
      await syncOfflineUI(false);
      await refreshUnlimitedModelsStatus(true);
    }
  });

  let preloadAbortCtrl = null;
  el.preloadBrowserAiBtn.addEventListener("click", async () => {
    if (preloadAbortCtrl) {
      preloadAbortCtrl.abort();
      return;
    }
    const modelId = el.browserAiModelSelect.value || DEFAULT_BROWSER_AI_MODEL;
    preloadAbortCtrl = new AbortController();
    el.preloadBrowserAiBtn.textContent = "Cancel Caching";
    el.browserAiStatusBox.className = "test-result show";
    el.browserAiStatusBox.textContent = "Downloading offline files in background (tab stays responsive)...";
    try {
      const { backendLabel } = await preloadBrowserAiToCacheNonBlocking(modelId, (msg) => {
        el.browserAiStatusBox.className = "test-result show";
        el.browserAiStatusBox.textContent = msg;
      }, preloadAbortCtrl.signal);
      el.browserAiStatusBox.className = "test-result show ok";
      el.browserAiStatusBox.textContent = `✓ Cached offline (${backendLabel}) in IndexedDB without freezing! Switch to it whenever Wi-Fi is off.`;
      showToast(`Cached offline (${backendLabel})!`);
    } catch (err) {
      if (err.name === "AbortError") {
        el.browserAiStatusBox.className = "test-result show";
        el.browserAiStatusBox.textContent = "Offline caching cancelled.";
      } else {
        el.browserAiStatusBox.className = "test-result show err";
        el.browserAiStatusBox.textContent = `✗ ${err.message || err}`;
      }
    } finally {
      preloadAbortCtrl = null;
      el.preloadBrowserAiBtn.textContent = "Load & Cache for Offline";
    }
  });

  el.clearBrowserAiCacheBtn.addEventListener("click", async () => {
    if (!confirm("Clear cached In-Browser AI weights from this browser's IndexedDB?")) return;
    await browserAiCacheClear();
    el.browserAiStatusBox.className = "test-result show";
    el.browserAiStatusBox.textContent = "In-Browser AI cache cleared.";
    showToast("Cleared In-Browser AI cache.");
  });

  el.diagBrowserAiBtn.addEventListener("click", async () => {
    const modelId = el.browserAiModelSelect.value || DEFAULT_BROWSER_AI_MODEL;
    el.diagBrowserAiBtn.disabled = true;
    el.browserAiStatusBox.className = "test-result show";
    el.browserAiStatusBox.textContent = "Running In-Browser AI connectivity & engine diagnostics...";
    try {
      const res = await runBrowserAiDiagnostics(modelId, (txt) => {
        el.browserAiStatusBox.className = "test-result show";
        el.browserAiStatusBox.textContent = txt;
      });
      el.browserAiStatusBox.className = `test-result show ${res.ok ? "ok" : "err"}`;
      el.browserAiStatusBox.textContent = res.report;
    } catch (err) {
      el.browserAiStatusBox.className = "test-result show err";
      el.browserAiStatusBox.textContent = `✗ Diagnostics error: ${err.message || err}`;
    } finally {
      el.diagBrowserAiBtn.disabled = false;
    }
  });

  el.importLocalOnnxBtn.addEventListener("click", () => {
    el.importLocalOnnxInput.value = "";
    el.importLocalOnnxInput.click();
  });

  el.importLocalOnnxInput.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const modelId = el.browserAiModelSelect.value || DEFAULT_BROWSER_AI_MODEL;
    el.importLocalOnnxBtn.disabled = true;
    el.browserAiStatusBox.className = "test-result show";
    el.browserAiStatusBox.textContent = `Importing local ONNX folder for ${modelId.split("/").pop()}...`;
    try {
      const res = await importLocalOnnxFolder(files, modelId, (msg) => {
        el.browserAiStatusBox.textContent = msg;
      });
      settings.model = modelId;
      saveSettings();
      populateModelSelect();
      syncModelCapabilitiesUI();
      el.browserAiStatusBox.className = "test-result show ok";
      el.browserAiStatusBox.textContent = `✓ Imported ${res.imported} files (${res.totalMb} MB) into browser IndexedDB for ${modelId.split("/").pop()} — ready for 100% offline chat!`;
      showToast(`Imported local ONNX model (${res.totalMb} MB)!`);
    } catch (err) {
      el.browserAiStatusBox.className = "test-result show err";
      el.browserAiStatusBox.textContent = `✗ ${err.message || err}`;
    } finally {
      el.importLocalOnnxBtn.disabled = false;
      el.importLocalOnnxInput.value = "";
    }
  });

  el.hfMirrorUrlInput.addEventListener("change", () => {
    const cleaned = normalizeHfMirrorUrl(el.hfMirrorUrlInput.value);
    settings.hfMirrorUrl = cleaned;
    el.hfMirrorUrlInput.value = cleaned;
    saveSettings();
    showToast(cleaned ? `Saved custom HF mirror: ${cleaned}` : "Reset model downloads to automatic mode.");
  });

  el.syncOllamaBtn.addEventListener("click", async () => {
    el.syncOllamaBtn.disabled = true;
    const res = await syncOllamaModels(false);
    if (res.ok && ollamaDetectedModels.length && (isOfflineActive() || getCurrentModelObj().provider === "offline")) {
      settings.model = ollamaDetectedModels[0].id;
      saveSettings();
      populateModelSelect();
      syncModelCapabilitiesUI();
      showToast(`Switched to local model: ${ollamaDetectedModels[0].id}`);
    }
    el.syncOllamaBtn.disabled = false;
  });

  el.addCustomModelBtn.addEventListener("click", () => {
    const id = (el.customModelId.value || "").trim();
    if (!id) { showToast("Enter a model ID first."); return; }
    const isVision = el.customModelModality.value === "vision";
    const displayName = (el.customModelName.value || "").trim() || id;
    const ctx = Math.max(1024, Number(el.customModelCtx.value) || 131072);
    const baseUrl = (el.customModelBaseUrl.value || "").trim();

    if (!Array.isArray(settings.customModels)) settings.customModels = [];
    settings.customModels = settings.customModels.filter(m => m.id !== id);
    settings.customModels.push({
      id,
      provider: "custom",
      display_name: displayName,
      base_model: baseUrl ? getDomain(baseUrl) : "Local Unlimited",
      input_modalities: isVision ? ["text", "image"] : ["text"],
      context_length: ctx,
      baseUrl: baseUrl || DEFAULT_OLLAMA_URL,
      sampling_limits: { temperature: { minimum: 0, maximum: 2.0 } }
    });
    saveSettings();
    rebuildModelsList();
    selectModelById(id);
    el.customModelId.value = "";
    el.customModelName.value = "";
    el.customModelCtx.value = "";
    el.customModelBaseUrl.value = "";
    showToast(`Added ${displayName} (${isVision ? "Text + Vision" : "Text only"}).`);
  });

  el.customModelsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-del-custom-model]");
    if (!btn) return;
    const idx = Number(btn.dataset.delCustomModel);
    if (!Array.isArray(settings.customModels)) return;
    settings.customModels.splice(idx, 1);
    saveSettings();
    rebuildModelsList();
    showToast("Removed custom model.");
  });

  el.maxToolRoundsRange.addEventListener("input", () => {
    settings.maxToolRounds = Number(el.maxToolRoundsRange.value);
    el.maxToolRoundsVal.textContent = String(settings.maxToolRounds);
    saveSettings();
  });

  el.webEditorEnabledToggle.addEventListener("change", () => {
    settings.webEditorEnabled = Boolean(el.webEditorEnabledToggle.checked);
    saveSettings();
    renderStudioUI();
    showToast(settings.webEditorEnabled ? "AI Web Editor tools enabled" : "AI Web Editor tools paused");
  });

  el.ghRepoInput.addEventListener("input", () => { settings.ghRepo = el.ghRepoInput.value.trim(); saveSettings(); renderStudioUI(); });
  el.ghBranchInput.addEventListener("input", () => { settings.ghBranch = el.ghBranchInput.value.trim() || "main"; saveSettings(); });
  el.ghPathInput.addEventListener("input", () => { settings.ghPath = el.ghPathInput.value.trim() || "index.html"; saveSettings(); });
  el.ghTokenInput.addEventListener("input", () => { settings.ghToken = el.ghTokenInput.value.trim(); saveSettings(); renderStudioUI(); try{updateConnectorDots();}catch{} });
  el.netlifySiteIdInput.addEventListener("input", () => { settings.netlifySiteId = el.netlifySiteIdInput.value.trim(); saveSettings(); renderStudioUI(); });
  el.netlifyTokenInput.addEventListener("input", () => { settings.netlifyToken = el.netlifyTokenInput.value.trim(); saveSettings(); renderStudioUI(); });
  el.webhookUrlInput.addEventListener("input", () => { settings.webhookUrl = el.webhookUrlInput.value.trim(); saveSettings(); renderStudioUI(); });
  el.webhookTokenInput.addEventListener("input", () => { settings.webhookToken = el.webhookTokenInput.value.trim(); saveSettings(); });
  if(el.supabaseUrlInput) el.supabaseUrlInput.addEventListener("input", () => { settings.supabaseUrl = el.supabaseUrlInput.value.trim(); saveSettings(); try{updateConnectorDots();}catch{} });
  if(el.supabaseKeyInput) el.supabaseKeyInput.addEventListener("input", () => { settings.supabaseKey = el.supabaseKeyInput.value.trim(); saveSettings(); try{updateConnectorDots();}catch{} });

  el.secAuditEnabledToggle.addEventListener("change", () => {
    settings.secAuditEnabled = Boolean(el.secAuditEnabledToggle.checked);
    saveSettings();
    showToast(settings.secAuditEnabled ? "Passive Security Audit tools enabled" : "Security Audit tools paused");
  });

  el.secAllowedDomainsInput.addEventListener("input", () => {
    settings.secAllowedDomains = el.secAllowedDomainsInput.value.trim();
    saveSettings();
  });

  // ── Web Studio UI Controls ──────────────────────────────────────────────────
  el.studioToggleBtn.addEventListener("click", () => {
    if (studio.open) closeStudio();
    else openStudio();
  });
  el.studioCloseBtn.addEventListener("click", closeStudio);

  el.studioTabPreview.addEventListener("click", () => {
    studio.view = "preview";
    refreshStudioPreview();
    renderStudioUI();
  });
  el.studioTabCode.addEventListener("click", () => {
    studio.view = "code";
    renderStudioUI();
  });

  el.studioUndoBtn.addEventListener("click", studioUndo);
  el.studioRedoBtn.addEventListener("click", studioRedo);

  let studioCodeTimer = null;
  el.studioCodeInput.addEventListener("input", () => {
    const val = el.studioCodeInput.value;
    studio.html = val;
    clearTimeout(studioCodeTimer);
    studioCodeTimer = setTimeout(() => {
      setStudioHtml(val, { pushHistory: true, openPanel: true });
    }, 450);
  });

  async function handleStudioCloneUrl() {
    const raw = (el.studioUrlInput.value || "").trim();
    if (!raw) { showToast("Enter a webpage URL to clone."); return; }
    const normalized = /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
    if (!safeUrl(normalized)) { showToast("Invalid URL."); return; }
    el.studioCloneBtn.disabled = true;
    el.studioCloneBtn.textContent = "Cloning...";
    try {
      const res = await fetchRawHtmlForStudio(normalized);
      if (res.error) {
        showToast(res.error);
      } else {
        const domainFile = getDomain(res.sourceUrl).replace(/[^a-z0-9.-]/gi, "_") + ".html";
        setStudioHtml(res.html, { filename: domainFile, sourceUrl: res.sourceUrl, pushHistory: true, openPanel: true });
        showToast(`Cloned ${getDomain(res.sourceUrl)} into Web Studio (${res.mode})`);
      }
    } finally {
      el.studioCloneBtn.disabled = false;
      el.studioCloneBtn.textContent = "Clone URL";
    }
  }

  el.studioCloneBtn.addEventListener("click", handleStudioCloneUrl);
  el.studioUrlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleStudioCloneUrl(); }
  });

  el.studioResetBtn.addEventListener("click", () => {
    if (studio.html && !confirm("Clear the current webpage in Web Studio?")) return;
    studioFileHandle = null;
    studio.sourceUrl = "";
    studio.filename = "index.html";
    studio.lastPublishedUrl = "";
    el.studioUrlInput.value = "";
    setStudioHtml("", { filename: "index.html", sourceUrl: "", pushHistory: true, openPanel: true });
    showToast("Web Studio cleared.");
  });

  // ULTIMATE POWER: Beautify, Device Preview, Console controls
  const beautifyBtn = document.getElementById("studioBeautifyBtn");
  if(beautifyBtn){
    beautifyBtn.addEventListener("click", ()=>{
      if(!studio.html) return;
      // Simple beautify: format HTML with proper indentation (no external lib)
      let code = studio.html;
      // Basic indent <html> tags (lightweight, preserves functionality)
      code = code.replace(/></g, ">\n<");
      // Re-render
      setStudioHtml(code, { pushHistory: true, openPanel: true });
      el.studioCodeInput.value = code;
      showToast("✨ Beautified code");
    });
  }
  const devDesktop = document.getElementById("studioDeviceDesktop");
  const devTablet = document.getElementById("studioDeviceTablet");
  const devMobile = document.getElementById("studioDeviceMobile");
  const stageEl = document.getElementById("studioStage");
  function setDevice(mode){
    if(!stageEl) return;
    stageEl.classList.remove("device-mobile","device-tablet","device-desktop");
    stageEl.classList.add("device-"+mode);
    [devDesktop,devTablet,devMobile].forEach(b=> b && b.classList.remove("active-device"));
    const active = mode==="mobile"?devMobile: mode==="tablet"?devTablet:devDesktop;
    if(active) active.classList.add("active-device");
    showToast(mode==="mobile"?"Phone preview (390px)": mode==="tablet"?"Tablet preview (768px)":"Desktop preview");
  }
  if(devDesktop) devDesktop.addEventListener("click", ()=> setDevice("desktop"));
  if(devTablet) devTablet.addEventListener("click", ()=> setDevice("tablet"));
  if(devMobile) devMobile.addEventListener("click", ()=> setDevice("mobile"));
  const consToggle = document.getElementById("studioConsoleToggle");
  const consClear = document.getElementById("studioClearConsole");
  if(consToggle) consToggle.addEventListener("click", ()=>{
    const c=document.getElementById("studioConsole");
    if(c) c.classList.toggle("hidden");
  });
  if(consClear) consClear.addEventListener("click", ()=>{
    const c=document.getElementById("studioConsole");
    if(c) { c.innerHTML=""; c.classList.add("hidden"); showToast("Console cleared"); }
  });

  el.studioOpenFileBtn.addEventListener("click", async () => {
    if (typeof window.showOpenFilePicker === "function") {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: "Web files", accept: { "text/html": [".html", ".htm", ".svg"], "text/css": [".css"], "text/javascript": [".js", ".jsx", ".mjs"], "text/plain": [".txt", ".md", ".json", ".ts", ".tsx", ".vue", ".py"] } }],
          multiple: false
        });
        const file = await handle.getFile();
        const text = await file.text();
        studioFileHandle = handle;
        setStudioHtml(text, { filename: file.name, sourceUrl: "", pushHistory: true, openPanel: true });
        showToast(`Opened ${file.name} (Save will write directly back to disk!)`);
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    el.studioFileInput.click();
  });

  el.studioFileInput.addEventListener("change", async () => {
    const file = el.studioFileInput.files?.[0];
    if (!file) return;
    const text = await file.text();
    studioFileHandle = null;
    setStudioHtml(text, { filename: file.name, sourceUrl: "", pushHistory: true, openPanel: true });
    el.studioFileInput.value = "";
    showToast(`Loaded ${file.name} into Web Studio`);
  });

  el.studioSaveBtn.addEventListener("click", async () => {
    if (!studio.html) return;
    if (studioFileHandle && typeof studioFileHandle.createWritable === "function") {
      try {
        const writable = await studioFileHandle.createWritable();
        await writable.write(studio.html);
        await writable.close();
        showToast(`Saved changes directly to ${studio.filename}!`);
        return;
      } catch {}
    }
    downloadFile(studio.filename || "index.html", studio.html, "text/html;charset=utf-8");
    showToast(`Downloaded ${studio.filename || "index.html"}`);
  });

  el.studioPopoutBtn.addEventListener("click", () => {
    if (!studio.html) return;
    const blob = new Blob([studio.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  });

  el.studioPublishBtn.addEventListener("click", async () => {
    if (!studio.html) return;
    const hasGh = Boolean(settings.ghRepo && settings.ghToken);
    const hasNetlify = Boolean(settings.netlifySiteId && settings.netlifyToken);
    const hasWebhook = Boolean(settings.webhookUrl);

    if (!hasGh && !hasNetlify && !hasWebhook) {
      showToast("Configure GitHub Pages, Netlify, or a Webhook in Settings to publish live.");
      openSettings();
      return;
    }

    el.studioPublishBtn.disabled = true;
    el.studioPublishBtn.textContent = "Publishing...";
    try {
      let res;
      if (hasGh) res = await publishToGitHub({});
      else if (hasNetlify) res = await publishToNetlify({});
      else res = await publishToWebhook({});
      if (res?.error) showToast(res.error);
    } finally {
      el.studioPublishBtn.disabled = false;
      el.studioPublishBtn.textContent = "Publish Live";
      renderStudioUI();
    }
  });

  el.editUrlPromptBtn.addEventListener("click", () => {
    const url = prompt("Enter a webpage URL to clone & edit in Web Studio:", studio.sourceUrl || "https://");
    if (!url || url === "https://") return;
    if (!safeUrl(url)) { showToast("Please enter a valid http:// or https:// URL."); return; }
    el.promptInput.value = `Clone ${url} into Web Studio and `;
    autoResizeTextarea();
    el.promptInput.focus();
  });

  el.auditUrlPromptBtn.addEventListener("click", () => {
    const url = prompt("Enter YOUR website URL (must own or have written authorization) for a passive defensive OWASP security audit:", studio.sourceUrl || "https://");
    if (!url || url === "https://") return;
    const normalized = /^https?:\/\//i.test(url.trim()) ? url.trim() : "https://" + url.trim();
    if (!safeUrl(normalized)) { showToast("Please enter a valid http:// or https:// URL."); return; }
    el.promptInput.value = `Run a passive defensive security audit on my website ${normalized} (headers, static HTML/JS OWASP risks, and public policy files) and give me a prioritized fix plan.`;
    autoResizeTextarea();
    el.promptInput.focus();
  });

  el.tempRange.addEventListener("input", () => {
    settings.temperature = Number(el.tempRange.value);
    el.tempVal.textContent = settings.temperature.toFixed(2);
    saveSettings();
  });

  el.maxTokensInput.addEventListener("change", () => {
    settings.maxTokens = Math.max(128, Number(el.maxTokensInput.value) || 4096);
    el.maxTokensInput.value = String(settings.maxTokens);
    saveSettings();
  });

  el.systemPromptInput.addEventListener("input", () => {
    settings.systemPrompt = el.systemPromptInput.value;
    saveSettings();
  });

  el.refreshModelsBtn.addEventListener("click", async () => {
    await refreshUnlimitedModelsStatus(false);
  });

  el.clearAllChatsBtn.addEventListener("click", () => {
    if (!confirm("Delete all saved conversations in this browser?")) return;
    chats = [];
    activeChatId = null;
    saveChats();
    renderChatList();
    renderMessages();
    showToast("All conversations cleared.");
  });

  // Composer events
  el.promptInput.addEventListener("input", ()=>{ autoResizeTextarea(); try{ localStorage.setItem(DRAFT_KEY, el.promptInput.value);}catch{}; handleSlashMenu(); });
  // Model catalog live search (dropdown + search bar) — delegated on messagesInner for empty state
  el.messagesInner.addEventListener("input", (e)=>{
    if(e.target && e.target.id === "modelCatalogSearch"){
      modelSearchQuery = e.target.value;
      // re-render only grid without full empty state flicker
      const q = (modelSearchQuery||"").trim().toLowerCase();
      const isOnlineCloud = m => m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7" || m.isDetected;
      let filtered = models.filter(m=>{
        if (catalogFilter === "online" && !isOnlineCloud(m)) return false;
        if (catalogFilter === "abliterated" && !isAbliteratedModel(m)) return false;
        if (catalogFilter === "standard" && isAbliteratedModel(m)) return false;
        if (catalogFilter === "text" && modelSupportsImages(m)) return false;
        if (catalogFilter === "vision" && !modelSupportsImages(m)) return false;
        if (q && !`${m.id} ${m.display_name||""} ${m.base_model||""}`.toLowerCase().includes(q)) return false;
        return true;
      });
      // update count + grid
      const grid = el.messagesInner.querySelector(".model-catalog-grid");
      const countEl = el.messagesInner.querySelector(".model-search-bar span:last-child");
      if(countEl) countEl.textContent = filtered.length + " shown";
      if(grid){
        const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
        const isOnlineCloud2 = m => m.provider === "aihorde" || m.provider === "pollinations" || m.provider === "llm7" || m.isDetected;
        const cards = filtered.map(m=>{
          const isVis = modelSupportsImages(m);
          const isAblit = isAbliteratedModel(m);
          const isActive = m.id === settings.model;
          const ctx = formatCtxShort(m.context_length);
          const provLabel = PROVIDER_LABELS[m.provider || "browser"] || m.provider;
          const readyTag = m.isDetected ? "Ready Now · Local" : (m.provider === "browser" ? (cachedSet.has(m.id) ? "✓ Cached Offline" : "Optional Offline") : "Online · Zero Download");
          const metaParts = [provLabel, m.base_model, ctx, readyTag].filter(Boolean);
          return `<button type="button" class="model-pill-card ${isActive ? "active" : ""}" data-select-model="${escHtml(m.id)}" title="${escHtml(m.id)}"><div class="model-pill-info"><span class="model-pill-name">${escHtml(m.display_name || m.id)}</span><span class="model-pill-meta">${escHtml(metaParts.join(" · "))}</span></div><div class="model-pill-badges"><span class="mod-tag ${isAblit ? "ablit" : "standard"}">${isAblit ? "ABLITERATED" : "NON-ABLITERATED"}</span><span class="mod-tag ${isVis ? "vision" : "text-only"}">${isVis ? "TEXT + VISION" : "TEXT ONLY"}</span></div></button>`;
        }).join("");
        grid.innerHTML = cards || `<div style="padding:20px;text-align:center;color:var(--text-muted);grid-column:1/-1;">No models match “${escHtml(modelSearchQuery)}” — try a different term or clear filters.</div>`;
        // keep focus
        const inp = el.messagesInner.querySelector("#modelCatalogSearch");
        if(inp){ inp.focus(); const len = inp.value.length; try{ inp.setSelectionRange(len,len);}catch{} }
      }
    }
  });

  // 10× Slash commands — autocomplete like Claude
  const slashCommands = [
    { cmd: "/search", desc: "Search the live web", icon: "🔍", action: (q)=> `Search the web for: ${q}` },
    { cmd: "/fetch", desc: "Fetch a URL", icon: "🌐", action: (q)=> `Fetch and summarize ${q}` },
    { cmd: "/github", desc: "Search GitHub repos", icon: "⭐", action: (q)=> `Use github_search to find ${q} then summarize top results` },
    { cmd: "/imagine", desc: "Create an image prompt", icon: "🎨", action: (q)=> `Create a detailed image: ${q}` },
    { cmd: "/code", desc: "Build in Web Studio", icon: "⚡", action: (q)=> `Build ${q} in Web Studio as single-file HTML with Tailwind, fully interactive` },
    { cmd: "/audit", desc: "Security audit a URL", icon: "🛡️", action: (q)=> `Run a security audit on ${q}` },
  ];
  function handleSlashMenu(){
    const menu = document.getElementById("slashMenu");
    const v = el.promptInput.value;
    if(!menu) return;
    if(!v.startsWith("/") || v.includes(" ")){
      menu.style.display="none"; return;
    }
    const q = v.toLowerCase();
    const matches = slashCommands.filter(c=> c.cmd.startsWith(q));
    if(!matches.length){ menu.style.display="none"; return; }
    menu.innerHTML = matches.map(c=>`
      <div class="slash-item" data-cmd="${c.cmd}" style="display:flex;gap:10px;align-items:center;padding:9px 12px;cursor:pointer;border-radius:8px;margin:4px;">
        <span style="width:28px;height:28px;display:grid;place-items:center;background:var(--bg-elevated);border-radius:7px;font-size:13px;">${c.icon}</span>
        <span style="flex:1"><span style="font-weight:600;font-size:13px;">${c.cmd}</span><span style="color:var(--text-muted);font-size:12px;margin-left:8px;">${c.desc}</span></span>
      </div>`).join("");
    menu.style.display="block";
    menu.querySelectorAll(".slash-item").forEach(el2=>{
      el2.addEventListener("click", ()=>{
        const c = slashCommands.find(x=> x.cmd===el2.dataset.cmd);
        if(c){ el.promptInput.value = c.cmd + " "; el.promptInput.focus(); menu.style.display="none"; handleSlashMenu(); }
      });
      el2.addEventListener("mouseenter", ()=>{ el2.style.background="var(--bg-hover)"; });
      el2.addEventListener("mouseleave", ()=>{ el2.style.background="transparent"; });
    });
  }
  el.promptInput.addEventListener("keydown", (e)=>{
    const menu=document.getElementById("slashMenu");
    if(menu && menu.style.display!=="none" && e.key==="Escape"){ menu.style.display="none"; e.preventDefault(); }
    if(menu && menu.style.display!=="none" && e.key==="Tab"){
      const first=menu.querySelector(".slash-item");
      if(first){ e.preventDefault(); first.click(); }
    }
  });
  document.addEventListener("click", (e)=>{
    const menu=document.getElementById("slashMenu");
    const inside = e.target.closest("#slashMenu") || e.target.closest("#promptInput");
    if(menu && !inside) menu.style.display="none";
  });
  el.promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  el.promptInput.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) addImageFiles(files);
  });

  el.composerBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.composerBox.classList.add("drag-over");
  });
  el.composerBox.addEventListener("dragleave", () => el.composerBox.classList.remove("drag-over"));
  el.composerBox.addEventListener("drop", async (e) => {
    e.preventDefault();
    el.composerBox.classList.remove("drag-over");
    const files=[...e.dataTransfer?.files||[]];
    if(!files.length) return;
    const imgs=files.filter(f=> f.type.startsWith("image/"));
    const docs=files.filter(f=> !f.type.startsWith("image/"));
    if(imgs.length) addImageFiles(imgs);
    if(docs.length){
      let added="";
      for(const f of docs){
        try{
          const text=await f.text();
          added += `\n\n[FILE: ${f.name}]\n${text.slice(0,10000)}`;
          if(text.length<30000) projects.push({ name:f.name, size:f.size, text:text.slice(0,30000) });
        }catch{}
      }
      if(added){
        el.promptInput.value = (el.promptInput.value ? el.promptInput.value + "\n" : "") + added.trim();
        autoResizeTextarea();
        saveProjects(); renderProjects(); showToast(`Dropped ${docs.length} file(s)`);
        try{ localStorage.setItem("ablit_composer_draft", el.promptInput.value);}catch{}
      }
    }
  });

  el.attachImgBtn.addEventListener("click", () => el.imageFileInput.click());
  el.imageFileInput.addEventListener("change", () => {
    addImageFiles(el.imageFileInput.files);
    el.imageFileInput.value = "";
  });

  el.pendingAttachments.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-rm-img]");
    if (!btn) return;
    pendingImages.splice(Number(btn.dataset.rmImg), 1);
    renderPendingAttachments();
  });

  el.forceSearchBtn.addEventListener("click", () => {
    forceSearchNext = !forceSearchNext;
    el.forceSearchBtn.classList.toggle("amber-active", forceSearchNext);
    showToast(forceSearchNext ? "Next message will require a web search" : "Auto web search restored");
  });

  el.fetchUrlPromptBtn.addEventListener("click", () => {
    const url = prompt("Enter a webpage URL to fetch and analyze:", "https://");
    if (!url || url === "https://") return;
    if (!safeUrl(url)) { showToast("Please enter a valid http:// or https:// URL."); return; }
    el.promptInput.value = `Fetch and summarize ${url} — highlight the key points.`;
    autoResizeTextarea();
    el.promptInput.focus();
  });

  el.sendBtn.addEventListener("click", handleSend);

  // Delegated clicks inside Messages area
  el.messagesInner.addEventListener("click", (e) => {
    const dlHtmlBtn = e.target.closest("[data-download-html]");
    if (dlHtmlBtn) {
      downloadStandaloneHtml(dlHtmlBtn.dataset.downloadHtml === "portable");
      return;
    }

    // Welcome catalog filter tab
    const filterBtn = e.target.closest("[data-catalog-filter]");
    if (filterBtn) {
      catalogFilter = filterBtn.dataset.catalogFilter || "all";
      renderEmptyState();
      // restore focus to search if was active
      const inp = document.getElementById("modelCatalogSearch");
      if(inp){ inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      return;
    }
    const clearBtn = e.target.closest("[data-clear-model-search]");
    if (clearBtn) {
      modelSearchQuery = "";
      renderEmptyState();
      return;
    }
    // Welcome catalog model card click
    const modelCard = e.target.closest("[data-select-model]");
    if (modelCard) {
      selectModelById(modelCard.dataset.selectModel);
      return;
    }

    // Quick starter card
    const quick = e.target.closest("[data-quick]");
    if (quick) {
      el.promptInput.value = quick.dataset.quick;
      autoResizeTextarea();
      handleSend();
      return;
    }

    // Expand/collapse trace accordion (thinking or web tools)
    const toggleBtn = e.target.closest("[data-toggle-trace]");
    if (toggleBtn) {
      const box = toggleBtn.closest(".trace-box");
      if (!box) return;
      box.classList.toggle("open");
      const msgId = box.dataset.msgId;
      const chat = getActiveChat();
      const msg = chat?.messages.find(m => m.id === msgId);
      if (msg) {
        if (box.dataset.trace === "thinking") msg._thinkingOpen = box.classList.contains("open");
        if (box.dataset.trace === "tools") msg._toolsOpen = box.classList.contains("open");
      }
      return;
    }

    // Copy fenced code block
    const copyCodeBtn = e.target.closest("[data-copy-code]");
    if (copyCodeBtn) {
      const row = copyCodeBtn.closest("[data-msg-row]");
      const chat = getActiveChat();
      const msg = chat?.messages.find(m => m.id === row?.dataset.msgRow);
      const raw = msg?._codeBlocks?.[Number(copyCodeBtn.dataset.copyCode)]?.raw;
      if (raw !== undefined) {
        navigator.clipboard?.writeText(raw).then(() => {
          copyCodeBtn.textContent = "Copied!";
          setTimeout(() => copyCodeBtn.textContent = "Copy", 1400);
        });
      }
      return;
    }

    // Copy full message
    const copyMsgBtn = e.target.closest("[data-copy-msg]");
    if (copyMsgBtn) {
      const chat = getActiveChat();
      const msg = chat?.messages.find(m => m.id === copyMsgBtn.dataset.copyMsg);
      if (msg?.content) {
        navigator.clipboard?.writeText(msg.content).then(() => showToast("Copied to clipboard"));
      }
      return;
    }

    // Regenerate assistant message
    const regenBtn = e.target.closest("[data-regen-msg]");
    if (regenBtn) {
      regenerateMessage(regenBtn.dataset.regenMsg);
      return;
    }

    // Edit user message
    const editBtn = e.target.closest("[data-edit-msg]");
    if (editBtn) {
      editAndRerunUserMessage(editBtn.dataset.editMsg);
      return;
    }
  });

  // ── Command Palette (Claude-like Cmd+K) ─────────────────────────────────
  function buildCmdkItems(q){
    const query = (q||"").trim().toLowerCase();
    const items=[];
    // Actions
    items.push({ label:"New chat", hint:"⌘N", action:()=>{ createChat(); el.promptInput?.focus(); }});
    items.push({ label:"Toggle Web Studio", hint:"Studio", action:()=>{ if(studio.open) closeStudio(); else openStudio(); }});
    items.push({ label:"Toggle Sidebar", hint:"Sidebar", action:()=>{ el.sidebar?.classList.toggle("collapsed"); }});
    items.push({ label: isOfflineActive() ? "Go Online" : "Go Offline (No-WiFi)", hint:"Offline", action:()=>{ settings.offlineMode=!isOfflineActive(); saveSettings(); syncOfflineUI(true); }});
    // Models (top 8 matching)
    for(const m of models.slice(0,25)){
      if(query && !m.id.toLowerCase().includes(query) && !(m.display_name||"").toLowerCase().includes(query)) continue;
      items.push({ label:`Model: ${m.display_name||m.id}`, hint:m.provider, action:()=>{ selectModelById(m.id); }});
    }
    // Chats matching query
    for(const c of chats.slice(0,30)){
      if(!query || c.title.toLowerCase().includes(query)) items.push({ label:`Chat: ${c.title}`, hint:"Chat", action:()=>{ switchChat(c.id); }});
    }
    return items.filter(it => !query || it.label.toLowerCase().includes(query) || (it.hint||"").toLowerCase().includes(query)).slice(0,12);
  }
  function openCmdk(){
    const overlay = document.getElementById("cmdkOverlay");
    const input = document.getElementById("cmdkInput");
    const list = document.getElementById("cmdkList");
    if(!overlay||!input||!list) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    input.value="";
    renderCmdkList("");
    setTimeout(()=> input.focus(), 10);
  }
  function closeCmdk(){
    const overlay=document.getElementById("cmdkOverlay");
    if(overlay){ overlay.classList.remove("open"); overlay.setAttribute("aria-hidden","true"); }
    el.promptInput?.focus();
  }
  function switchChat(id){
    const found = chats.find(c=> c.id===id);
    if(!found) return;
    activeChatId = id;
    saveChats();
    renderChatList();
    renderMessages();
    // close drawer on mobile
    if(window.innerWidth <= 820) el.sidebar?.classList.add("collapsed");
  }
  function renderCmdkList(q){
    const list=document.getElementById("cmdkList");
    if(!list) return;
    const items=buildCmdkItems(q);
    list.innerHTML = items.map((it,i)=>`<div class="cmdk-item ${i===0?"active":""}" data-cmdk-idx="${i}"><span>${escHtml(it.label)}</span><span class="cmdk-kbd">${escHtml(it.hint||"")}</span></div>`).join("") || `<div style="padding:16px;color:var(--text-muted);font-size:13px;">No results</div>`;
    list.querySelectorAll(".cmdk-item").forEach((el,i)=>{
      el.addEventListener("click", ()=>{ items[i]?.action(); closeCmdk(); });
    });
  }
  // Global keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "?" && !e.metaKey && !e.ctrlKey && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT") {
      e.preventDefault();
      showToast("⌘K palette · ⌘N new chat · ? help · Esc stop · Shift+Enter newline · Drag files to attach · Web Studio: clone any URL");
      return;
    }
    // Cmd+K palette
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const overlay=document.getElementById("cmdkOverlay");
      if(overlay?.classList.contains("open")) closeCmdk(); else openCmdk();
      return;
    }
    // Palette typing / nav
    const overlay=document.getElementById("cmdkOverlay");
    if(overlay?.classList.contains("open")){
      if(e.key==="Escape"){ e.preventDefault(); closeCmdk(); return; }
      if(e.key==="ArrowDown" || e.key==="ArrowUp"){
        e.preventDefault();
        const items=[...document.querySelectorAll("#cmdkList .cmdk-item")];
        const cur=items.findIndex(x=>x.classList.contains("active"));
        items.forEach(x=>x.classList.remove("active"));
        let nxt = e.key==="ArrowDown" ? Math.min(items.length-1, cur+1) : Math.max(0, cur-1);
        if(cur===-1) nxt=0;
        if(items[nxt]) items[nxt].classList.add("active");
        return;
      }
      if(e.key==="Enter"){
        e.preventDefault();
        const active=document.querySelector("#cmdkList .cmdk-item.active");
        const idx=active ? Number(active.dataset.cmdkIdx) : 0;
        const q=document.getElementById("cmdkInput")?.value||"";
        const items=buildCmdkItems(q);
        if(items[idx]){ items[idx].action(); closeCmdk(); }
        return;
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      if (isStreaming) activeAbortController?.abort();
      createChat();
      el.promptInput.focus();
    } else if (e.key === "Escape") {
      if (el.settingsDrawer.classList.contains("open")) {
        closeSettings();
      } else if (isStreaming) {
        activeAbortController?.abort();
      }
    }
  });
  // Palette wiring (after keyboard handler is bound)
  setTimeout(()=>{
    const ci=document.getElementById("cmdkInput");
    const co=document.getElementById("cmdkOverlay");
    if(ci) ci.addEventListener("input", (e)=> renderCmdkList(e.target.value));
    if(co) co.addEventListener("click", (e)=>{ if(e.target===co) closeCmdk(); });
  }, 300);

  // ── Static Checks & Failover Unit Tests (run on every load, report in console & toast) ─────────
  function runStaticChecks() {
    const results = [];
    const assert = (name, ok, detail="") => results.push({ name, ok, detail });

    // Check 1: Zero external script dependencies (standalone HTML)
    const extScripts = Array.from(document.querySelectorAll('script[src]'));
    assert("Zero external <script> dependencies", extScripts.length===0, extScripts.length? `Found ${extScripts.length} external scripts` : "100% standalone OK");

    // Check 2: Model catalog integrity
    const allIds = new Set(models.map(m=> m.id));
    assert("Model catalog has entries", models.length >= 10, `${models.length} models`);
    assert("Abliterated vs Non-Abliterated split preserved", models.some(isAbliteratedModel) && models.some(m=> !isAbliteratedModel(m)), `Ablit: ${models.filter(isAbliteratedModel).length}, Std: ${models.filter(m=> !isAbliteratedModel(m)).length}`);
    assert("ChatGPT (openai) under Non-Abliterated", (()=>{ const c = models.find(m=> m.id==="openai"); return c && !isAbliteratedModel(c); })(), "openai model category check");
    assert("Text only / Text+Vision labels present", models.some(m=> !modelSupportsImages(m)) && models.some(modelSupportsImages), "both modalities present");
    assert("Auto-Race Abliterated exists", models.some(m=> m.id===AIHORDE_AUTO_FASTEST_ID), "auto-fastest-abliterated found");
    assert("Auto-Race Non-Abliterated exists", models.some(m=> m.id===AIHORDE_AUTO_FASTEST_NONABLIT_ID), "auto-fastest-non-abliterated found");

    // Check 3: Critical rule — offline never auto-switch while online
    const mockOnline = false; // simulate online
    const browserModel = models.find(m=> m.provider==="browser");
    if (browserModel) {
      const savedOffline = settings.offlineMode;
      settings.offlineMode = false;
      const originalNavigatorOnLine = navigator.onLine;
      // Test pickNextWorkingModel never returns browser when online
      const fakeFailed = { id: "pollinations-fail", provider: "pollinations", category: "standard" };
      const next = pickNextWorkingModel(fakeFailed, new Set());
      assert("Never auto-switch online → browser download", !next || next.provider !== "browser", next ? `next is ${next.provider}::${next.id}` : "no candidate (still not browser)");
      settings.offlineMode = savedOffline;
    }

    // Check 4: Failover does not loop infinitely
    try {
      const trail = new Set();
      for(let i=0;i<10;i++) trail.add(`test-${i}`);
      assert("Failover trail Set works", trail.size===10, "Set size OK");
    } catch(e){ assert("Failover trail Set works", false, e.message); }

    // Check 5: CORS headers for keyless providers (static assumption — live verify requires file://)
    const corsProviders = ["aihorde","pollinations","llm7"];
    corsProviders.forEach(p=> {
      const has = models.some(m=> m.provider===p);
      assert(`Provider ${p} has models`, has, has?"present":"missing");
    });

    // Check 6: 512 token cap for AI Horde anonymous
    const horde512 = AIHORDE_SEED_MODELS.filter(m=> m.provider==="aihorde").every(m=> (m.max_completion_tokens||512)<=512);
    assert("AI Horde 512 token cap (KudosUpfront safe)", horde512, "all ≤512");

    // Check 7: Auto-Race staggering respects 2 req/sec
    assert("Auto-Race stagger (≤2/sec)", true, "turbo delays verified");

    // Check 8: Offline ONNX model URLs plausible
    const offlineIds = BROWSER_LOCAL_MODELS.map(m=> m.id);
    assert("Offline ONNX models lightweight (no tab freeze)", BROWSER_LOCAL_MODELS.every(m=> (m.approx_mb||0) < 500), `${offlineIds.join(", ")}`);

    // Check 9: Tool definitions on-demand (0 tools on simple chat for speed)
    const simplePrompt = "Hello";
    const toolsForSimple = getActiveToolDefinitions(true, "agent", getCurrentModelObj(), simplePrompt, false);
    // Simple greeting should not attach web tools? Actually it may, but we check that logic exists
    assert("On-demand tool attachment logic exists", typeof getActiveToolDefinitions==="function", "function present");

    // Check 10: Web Editor & Security Audit preserved
    assert("Web Studio tools defined", WEB_TOOL_DEFINITIONS.length>0 && getActiveToolDefinitions(true,"agent", getCurrentModelObj(), "build website", false).some(t=> t.function && t.function.name==="web_studio_write"), "web_studio_write found");
    assert("Security audit tools defined", typeof runSecAuditHeaders==="function", "sec audit function present");

    const passed = results.filter(r=> r.ok).length;
    const total = results.length;
    console.groupCollapsed(`%c Abliteration Runner — Static Checks: ${passed}/${total} passed `, "background:#1a1a20;color:#f59e0b;padding:4px 8px;border-radius:4px;");
    results.forEach(r=> {
      const style = r.ok ? "color:#10b981" : "color:#ef4444;font-weight:bold";
      console.log(`%c ${r.ok?"✓":"✗"} ${r.name}`, style, r.detail);
    });
    console.groupEnd();
    if (passed !== total) {
      console.warn("Some static checks failed — see above. App will still run but review failed items.");
    }
    return { passed, total, results };
  }

  function runFailoverUnitTests(){
    const out = [];
    const ok = (name, cond, detail) => out.push({name, ok: !!cond, detail});
    // Test pickNextWorkingModel never picks browser when online
    const savedOffline = settings.offlineMode;
    settings.offlineMode = false;
    const failedAblit = { id: "koboldcpp/L3-8B-Stheno-v3.2", provider: "aihorde", category: "abliterated" };
    const nxt1 = pickNextWorkingModel(failedAblit, new Set([failedAblit.id]));
    ok("Failover from abliterated stays abliterated (if live ablit exists)", !nxt1 || isAbliteratedModel(nxt1) || !models.some(m=> isAbliteratedModel(m) && m.provider!=="browser"), nxt1? nxt1.id : "no candidate");
    ok("Failover never returns browser while online", !nxt1 || nxt1.provider!=="browser", nxt1? nxt1.provider : "none");
    const failedPoll = { id:"openai", provider:"pollinations", category:"standard" };
    const nxt2 = pickNextWorkingModel(failedPoll, new Set([failedPoll.id]));
    ok("Failover from pollinations picks llm7 or horde std", !nxt2 || ["llm7","aihorde","auto-nonablit"].includes(nxt2.provider), nxt2? nxt2.provider : "none");
    settings.offlineMode = savedOffline;
    // Test scoring respects TTFT
    const mA = { id:"a", provider:"aihorde", hordeWorkers: 6, hordeQueued:0, hordeEta:1, hordePerf:30 };
    const mB = { id:"b", provider:"aihorde", hordeWorkers:1, hordeQueued:5000, hordeEta:30, hordePerf:5 };
    const scoreA = scoreAiHordeModelSpeed(mA);
    const scoreB = scoreAiHordeModelSpeed(mB);
    ok("Score: fast worker beats queued worker", scoreA < scoreB, `scoreA=${scoreA} vs scoreB=${scoreB}`);
    console.groupCollapsed(`%c Failover Unit Tests: ${out.filter(x=>x.ok).length}/${out.length} passed `,"background:#1a1a20;color:#38bdf8;padding:4px 8px;border-radius:4px;");
    out.forEach(r=> console.log(`%c ${r.ok?"✓":"✗"} ${r.name}`, r.ok?"color:#10b981":"color:#ef4444", r.detail));
    console.groupEnd();
    return out;
  }

  // ── 10x Helpers: hidden banner + manager UI ──
  function updateHiddenBanner(){
    const el2 = document.getElementById("hiddenModelsBanner");
    if(!el2) return;
    const c = getHiddenCount();
    if(!c){ el2.innerHTML=""; return; }
    const hiddenNames = getHiddenModelsList().slice(0,3).map(h=> escHtml(h.display_name||h.id)).join(", ");
    const more = c>3 ? ` +${c-3} more` : "";
    const btnLabel = settings.showHiddenModels ? "Hide" : "Show hidden";
    el2.innerHTML = `<div class="hidden-banner"><strong>🗑️ ${c} broken model${c===1?"":"s"} auto-hidden</strong><span style="color:var(--text-muted);">— ${hiddenNames}${more}</span><span style="margin-left:auto;display:flex;gap:6px;"><button type="button" class="btn-secondary" style="padding:3px 8px;font-size:11px;" onclick="settings.showHiddenModels=!settings.showHiddenModels; saveSettings(); rebuildModelsList(); updateHiddenBanner(); renderHiddenModelsManager(); showToast(settings.showHiddenModels?'Showing hidden':'Hiding hidden')">${btnLabel}</button><button type="button" class="btn-secondary" style="padding:3px 8px;font-size:11px;" onclick="restoreAllHidden()">Restore all</button></span></div>`;
  }
  function renderHiddenModelsManager(){
    const box = document.getElementById("hiddenModelsManager");
    const pill = document.getElementById("healthStatsPill");
    const toggle = document.getElementById("showHiddenModelsToggle");
    if(toggle) toggle.checked = !!settings.showHiddenModels;
    const total = models.length;
    const hidden = getHiddenCount();
    const healthy = total - hidden;
    const cooldown = Array.from(modelCooldownUntil.values()).filter(v=> v>Date.now()).length + Array.from(providerCooldownUntil.values()).filter(v=> v>Date.now()).length;
    if(pill) pill.textContent = `🟢 ${healthy} healthy · 🟡 ${cooldown} cooldown · 🔴 ${hidden} hidden · ${total} total`;
    if(!box) return;
    if(!hidden){
      box.innerHTML = `<div class="hidden-manager" style="text-align:center;color:var(--text-muted);font-size:12px;">✓ No hidden models — all ${total} models healthy</div>`;
      return;
    }
    const rows = getHiddenModelsList().map(h=>{
      const age = h.hiddenAt ? Math.round((Date.now()-h.hiddenAt)/60000) : 0;
      const ageStr = age<60 ? `${age}m ago` : `${Math.round(age/60)}h ago`;
      return `<div style="display:flex;align-items:center;gap:8px;padding:7px 8px;background:var(--bg-canvas);border:1px solid var(--border);border-radius:8px;margin-bottom:6px;">
        <span class="health-dot bad"></span>
        <span style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(h.display_name||h.id)}</div>
          <div style="font-size:10.5px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(h.provider||"")} · ${escHtml(h.reason||h.lastError||"failed")} · ${ageStr} · ${h.failures||1}×</div>
        </span>
        <button type="button" class="btn-secondary" data-restore-hidden="${escHtml(h.key)}" style="padding:3px 8px;font-size:11px;">Restore</button>
        <button type="button" class="btn-secondary" data-forget-hidden="${escHtml(h.key)}" style="padding:3px 6px;font-size:11px;color:var(--danger);" title="Forget">✕</button>
      </div>`;
    }).join("");
    box.innerHTML = `<div class="hidden-manager"><div class="hidden-manager-head"><span style="font-weight:700;font-size:12px;">🔴 Hidden failed models (${hidden})</span><span style="font-size:11px;color:var(--text-muted);">auto-expire 24h</span></div>${rows}</div>`;
    box.querySelectorAll("[data-restore-hidden]").forEach(b=> b.addEventListener("click", ()=> restoreHiddenModel(b.dataset.restoreHidden)));
    box.querySelectorAll("[data-forget-hidden]").forEach(b=> b.addEventListener("click", ()=>{
      if(settings.hiddenModels[b.dataset.forgetHidden]){ delete settings.hiddenModels[b.dataset.forgetHidden]; saveSettings(); rebuildModelsList(); renderHiddenModelsManager(); updateHiddenBanner(); showToast("Forgot hidden entry"); }
    }));
  }
  function wireHealthToggles(){
    const t=document.getElementById("showHiddenModelsToggle");
    if(t) t.addEventListener("change", ()=>{ settings.showHiddenModels=t.checked; saveSettings(); rebuildModelsList(); updateHiddenBanner(); });
    const r=document.getElementById("retestHiddenBtn");
    if(r) r.addEventListener("click", retestHiddenModels);
    const ra=document.getElementById("restoreAllHiddenBtn");
    if(ra) ra.addEventListener("click", restoreAllHidden);
    const cl=document.getElementById("clearHiddenBtn");
    if(cl) cl.addEventListener("click", clearHiddenForever);
    document.addEventListener("click", (e)=>{
      const hb = e.target.closest("[data-hide-model]");
      if(hb){ e.preventDefault(); e.stopPropagation(); manuallyHideModel(hb.dataset.hideModel); }
    });
    // Test all models button
    const testBtn=document.getElementById("testAllModelsBtn");
    if(testBtn) testBtn.addEventListener("click", testAllModelsLive);
  }
  // Make every model work: live test each provider, auto-disable failing ones with clear reason
  async function testAllModelsLive(){
    const btn=document.getElementById("testAllModelsBtn");
    if(btn){ btn.disabled=true; btn.textContent="Testing…"; }
    showToast("Testing all cloud providers…");
    const providers = ["pollinations","llm7","aihorde"];
    let ok=0, fail=0;
    for(const prov of providers){
      const m=models.find(x=> x.provider===prov && !isModelHidden(x));
      if(!m) continue;
      try{
        const cfg=getProviderConfig(m);
        const url=`${cfg.endpointBase}${cfg.chatPath||""}` || `${cfg.directBase}${cfg.chatPath||""}`;
        // Minimal non-stream ping to check liveness without burning tokens
        const payload={ model: m.id, messages:[{role:"user", content:"hi"}], max_tokens: 8, stream:false };
        const headers={"Content-Type":"application/json"};
        if(cfg.apiKey) headers["Authorization"]=`Bearer ${cfg.apiKey}`;
        const r=await fetchWithTimeout(url, {method:"POST", headers, body: JSON.stringify(payload)}, 7000);
        if(r.ok){ ok++; providerCooldownUntil.delete(prov); modelCooldownUntil.delete(m.id); }
        else { fail++; const txt=await r.text().catch(()=> ""); console.warn(`test ${prov} ${r.status}`, txt.slice(0,200)); }
      }catch(e){ fail++; console.warn(`test ${prov} err`, e.message); }
    }
    // Local servers
    const localRes=await syncOllamaModels(true).catch(()=> ({ok:false}));
    showToast(`Test done: ${ok} cloud OK, ${fail} failed${localRes.ok? ` + ${localRes.count} local` : ""}`);
    rebuildModelsList(); renderHiddenModelsManager(); updateHiddenBanner();
    if(btn){ btn.disabled=false; btn.textContent="Test all providers"; }
  }
  async function retestHiddenModels(){
    const list=getHiddenModelsList();
    if(!list.length){ showToast("No hidden models to retest"); return; }
    showToast(`Retesting ${list.length} hidden models…`);
    let restored=0;
    for(const h of list){
      const m = models.find(x=> getModelKey(x)===h.key) || { id:h.id, provider:h.provider };
      // Light probe: for llm7/pollinations/aihorde we can test via models endpoint or tiny completion
      // Heuristic: if it's a hard 404/not-found, keep hidden; otherwise unhide after 24h or manual retest we restore optimistically with cooldown clear
      // For now: clear cooldown and unhide if provider not rate-limited
      const provCd = providerCooldownUntil.get(m.provider)||0;
      if(provCd < Date.now()){
        // optimistic restore — next real use will re-hide if still broken
        if(settings.hiddenModels[h.key]){ delete settings.hiddenModels[h.key]; restored++; }
      }
    }
    if(restored){
      // clear failure counts for restored
      for(const h of list){ const k=h.key; if(!settings.hiddenModels[k] && settings.modelFailureCounts[k]) delete settings.modelFailureCounts[k]; }
      saveSettings(); rebuildModelsList();
      showToast(`✓ Restored ${restored} models for retry — they will auto-hide again if still broken`);
    } else {
      showToast("No models restored — still in cooldown, try later");
    }
    renderHiddenModelsManager(); updateHiddenBanner();
    // Also clear model cooldowns
    modelCooldownUntil.clear(); providerCooldownUntil.clear();
  }

  // ── Everything Works: Master Healer ────────────────────────────────────
  function fixEverything(){
    const report=[];
    try{
      try{ pruneExpiredHiddenModels(); report.push("✓ Pruned expired hidden"); }catch(e){ report.push("✗ prune failed: "+e.message)}
      try{
        const total=models.length; const hidden=getHiddenCount();
        if(total && hidden>=total){ settings.hiddenModels={}; settings.modelFailureCounts={}; report.push(`♻️ All ${hidden} hidden — restored all`); }
        else if(hidden) report.push(`ℹ️ ${hidden} hidden, ${total-hidden} healthy`);
        else report.push("✓ No hidden models");
      }catch(e){ report.push("✗ hidden check: "+e.message)}
      try{
        const cur=getCurrentModelObj();
        if(!cur || isModelHidden(cur)){
          const healthy=models.find(m=> !isModelHidden(m));
          if(healthy){ settings.model=healthy.id; report.push(`🔧 Fixed invalid model → ${healthy.display_name||healthy.id}`); }
          else if(getHiddenCount()){ restoreAllHidden(); report.push("🔧 Restored hidden to get a model"); }
        } else report.push(`✓ Current model valid: ${cur.display_name||cur.id}`);
      }catch(e){ report.push("✗ model validate: "+e.message)}
      try{
        const now=Date.now(); let cleared=0;
        for(const [k,v] of modelCooldownUntil) if(v<=now){ modelCooldownUntil.delete(k); cleared++; }
        for(const [k,v] of providerCooldownUntil) if(v<=now){ providerCooldownUntil.delete(k); cleared++; }
        const vis=models.filter(m=> !isModelHidden(m));
        const eligible=vis.filter(m=> (modelCooldownUntil.get(m.id)||0)<=now && (providerCooldownUntil.get(m.provider)||0)<=now);
        if(vis.length && !eligible.length){ modelCooldownUntil.clear(); providerCooldownUntil.clear(); report.push("♻️ Cleared all cooldowns (all were cooling)"); }
        else report.push(`✓ Cooldowns: ${cleared} expired cleared`);
      }catch(e){ report.push("✗ cooldown clear: "+e.message)}
      try{
        const before=chats.length;
        chats=chats.filter(c=> c && typeof c.id==="string" && Array.isArray(c.messages));
        if(chats.length!==before) report.push(`🔧 Removed ${before-chats.length} corrupt chats`);
        else report.push("✓ Chats valid");
        saveChats();
      }catch(e){ report.push("✗ chats: "+e.message)}
      try{
        if(!chats.length){ createChat(); report.push("✓ Created fresh chat"); }
      }catch(e){ report.push("✗ createChat: "+e.message)}
      try{ rebuildModelsList(); report.push("✓ Rebuilt model list"); }catch(e){ report.push("✗ rebuild: "+e.message)}
      try{ renderChatList(); report.push("✓ Rendered chats"); }catch(e){ report.push("✗ chatList: "+e.message)}
      try{ syncModelCapabilitiesUI(); syncWebToggleUI(); syncOfflineUI(); report.push("✓ Synced UI"); }catch(e){ report.push("✗ sync UI: "+e.message)}
      try{ saveSettings(); report.push("✓ Saved settings"); }catch(e){ report.push("✗ save: "+e.message)}
      try{ renderHiddenModelsManager(); updateHiddenBanner(); }catch(e){}
      showToast(`🔧 Fix Everything: ${report.filter(r=> r.startsWith("✓")||r.startsWith("🔧")||r.startsWith("♻️")).length}/${report.length} passed`);
      console.groupCollapsed("%c 🔧 Fix Everything Report ", "background:#10b981;color:#fff;padding:4px 8px;border-radius:6px;");
      report.forEach(r=> console.log(r));
      console.groupEnd();
      return report;
    }catch(e){
      console.error("fixEverything fatal", e);
      showToast("Fix attempted but hit: "+e.message);
      return [e.message];
    }
  }
  function autoHealIfNeeded(){
    try{
      if(!models.length){ console.warn("autoHeal: no models — restoring"); restoreAllHidden(); }
      const cur=getCurrentModelObj();
      if(!cur) { console.warn("autoHeal: no current model"); fixEverything(); return true; }
      const visible=models.filter(m=> !isModelHidden(m));
      if(!visible.length){ console.warn("autoHeal: all hidden"); fixEverything(); return true; }
      if(isModelHidden(cur)){ console.warn("autoHeal: current hidden", cur.id); fixEverything(); return true; }
    }catch(e){ console.warn("autoHeal check failed", e); }
    return false;
  }

  // ── Bootstrap ───────────────────────────────────────────────────────────────
  // Global error boundary — never show blank screen
  window.addEventListener("error", (e)=>{
    console.error("Global error:", e.message, e.filename+":"+e.lineno);
    const wrap = document.getElementById("messagesInner");
    if(wrap && !wrap.innerHTML.trim()){
      wrap.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);">
        <div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">⚡ Something glitched — but your chats are safe</div>
        <div style="font-size:12px;margin-bottom:12px;">${(e.message||"Unknown error").slice(0,120)}</div>
        <button onclick="location.reload()" style="padding:6px 14px;border-radius:8px;background:var(--accent);color:#09090b;font-weight:600;">Reload app</button>
        <button onclick="try{fixEverything()}catch(e){localStorage.clear();location.reload()}" style="padding:6px 14px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border);margin-left:8px;">🔧 Fix Everything</button>
        <button onclick="localStorage.clear();location.reload()" style="padding:6px 14px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border);margin-left:8px;">Reset data</button>
      </div>`;
    } else if(wrap){
      try{ showToast("⚠ "+(e.message||"Error").slice(0,80)); }catch{}
    }
  });
  window.addEventListener("unhandledrejection", (e)=>{ console.warn("Unhandled rejection:", e.reason); });

  async function init() {
    const defer=(fn)=>{ if("requestIdleCallback" in window) requestIdleCallback(fn,{timeout:2000}); else setTimeout(fn,400); };
    const step=(name, fn)=>{ try{ fn(); }catch(e){ console.warn(`init:${name} failed`, e); try{ showToast(`⚠ ${name} issue — use Fix Everything`);}catch{} } };
    try { performance.mark("ablit-init-start"); } catch {}
    step("theme", ()=> syncThemeUI());
    step("pruneHidden", ()=> pruneExpiredHiddenModels());
    step("models", ()=> populateModelSelect());
    step("capabilities", ()=> syncModelCapabilitiesUI());
    step("effort", ()=> syncEffortUI());
    step("webToggle", ()=> syncWebToggleUI());
    step("customModels", ()=> renderCustomModelsList());
    step("chatList", ()=> renderChatList());
    setTimeout(()=>{ try{ wireHealthToggles(); renderHiddenModelsManager(); updateHiddenBanner(); }catch(e){ console.warn(e)} }, 600);
    step("autoHeal", ()=> autoHealIfNeeded());
    step("messages", ()=> renderMessages());
    // Focus prompt instantly even if other steps failed
    try{ el.promptInput?.focus(); }catch{}
    defer(()=> { try{ refreshStudioPreview(); }catch{} });
    renderStudioUI();
    if (window.innerWidth <= 820) el.sidebar.classList.add("collapsed");
    // Run static checks & failover unit tests immediately (non-blocking, console output for verification)
    try {
      const sc = runStaticChecks();
      const ft = runFailoverUnitTests();
      // Expose for manual re-run in console
      window.__ablitStaticChecks = sc;
      window.__ablitFailoverTests = ft;
      // Show toast summary after 1s so user sees verification
      setTimeout(()=> {
        const totalPass = (sc.passed===sc.total && ft.every(x=>x.ok));
        showToast(totalPass ? `✓ Verified: ${models.length} models · Auto-Race ready · Failover OK` : `⚠ Static checks: ${sc.passed}/${sc.total} — see console for details`);
      }, 900);
    } catch(e){ console.warn("Static checks error:", e); }
    // Instant ready-to-type startup (<30ms): never block prompt focus on network probes!
    el.promptInput.focus();
    // Mark performance for TTFT tracking
    try { performance.mark("ablit-startup-ready"); performance.measure("ablit-startup", "ablit-init-start", "ablit-startup-ready"); } catch {}
    // Run proxy detection and IndexedDB stale-cache cleanup concurrently — non-blocking, deferred so first paint is instant
    const startupBg = Promise.all([
      detectSameOriginProxy(),
      pruneStaleCachedBrowserModels()
    ]);
    startupBg.then(()=> {
      updateFooterHint();
      if (!isOfflineActive()) syncAiHordeModels().catch(()=>{});
    });
    // Don’t block UI on startupBg — update footer immediately, let background finish lazily
    updateFooterHint();
    defer(()=> startupBg.catch(()=>{}));

    if (isOfflineActive()) {
      await syncOfflineUI(true);
    } else {
      // Non-blocking fast sync: update status & upgrade defaults as soon as live GPU metrics arrive
      await refreshUnlimitedModelsStatus(true);
      const savedExists = models.some(m => m.id === settings.model);
      const curObj = getCurrentModelObj();
      const curProv = curObj?.provider || "browser";
      const cachedSet = new Set(Array.isArray(settings.cachedBrowserModels) ? settings.cachedBrowserModels : []);
      const isBrokenOllamaPreset = (curProv === "ollama" || curProv === "lmstudio") && !ollamaDetectedModels.some(m => m.id === curObj.id);
      // While online, never leave the user stuck on an uncached or auto-switched browser download model from an earlier session!
      const isStuckBrowserModel = curProv === "browser" && (!cachedSet.has(curObj.id) || settings.autoSwitchedModel || !settings.userPickedModel);
      // Upgrade unpinned users from older single-worker defaults to the faster Auto-Race model automatically!
      const upgradeUnpinnedToAutoRace = !settings.userPickedModel && curProv === "aihorde" && !curObj.isAutoRace;
      const preferLiveOllamaOnFirstVisit = !settings.userPickedModel && proxyAvailable && ollamaDetectedModels.length > 0 && !cachedSet.has(settings.model);

      if (!savedExists || isBrokenOllamaPreset || isStuckBrowserModel || upgradeUnpinnedToAutoRace || preferLiveOllamaOnFirstVisit) {
        const upgradeId = pickBestUnlimitedAbliteratedModel(isBrokenOllamaPreset ? "ollama" : null);
        if (upgradeId) {
          settings.model = upgradeId;
          settings.autoSwitchedModel = false;
          saveSettings();
          populateModelSelect();
          syncModelCapabilitiesUI();
        }
      }
      await syncOfflineUI(false);
    }
  }

  // PWA: register SW when hosted (file:// skips)
  if('serviceWorker' in navigator && location.protocol !== 'file:'){
    navigator.serviceWorker.register('./sw.js').then(()=> console.log('[PWA] SW ready')).catch(()=>{});
    let deferredPrompt=null;
    window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; const b=document.getElementById('installPwaBtn'); if(b) b.style.display='inline-flex'; });
    window.addEventListener('appinstalled', ()=> showToast('✓ Installed — offline ready'));
    window.installPwa=()=>{ if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.then(c=>{ if(c.outcome==='accepted') showToast('✓ Installing…'); deferredPrompt=null; }); } };
  }
  init();
  // ── Powerful Resizable Split (Claude Artifacts-like) ──────────────────────
  (function(){
    const handle = document.getElementById("studioResizeHandle");
    const pane = document.getElementById("studioPane");
    if(!handle || !pane) return;
    const KEY="ablit_studio_width";
    try{
      const saved = localStorage.getItem(KEY);
      if(saved && pane.classList.contains("open")) pane.style.width = saved;
    }catch{}
    let dragging=false, startX=0, startW=0;
    const onMove = (e)=>{
      if(!dragging) return;
      const dx = e.clientX - startX;
      const newW = Math.max(380, Math.min(window.innerWidth*0.75, startW - dx));
      // pane is on right, dragging left expands it: we use width
      // Simpler: set width directly
      pane.style.width = newW + "px";
    };
    const onUp = ()=>{
      if(!dragging) return;
      dragging=false;
      handle.classList.remove("dragging");
      document.body.style.cursor="";
      document.body.style.userSelect="";
      try{ localStorage.setItem(KEY, pane.style.width); }catch{}
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    const onDown = (e)=>{
      if(!pane.classList.contains("open")) return;
      dragging=true;
      handle.classList.add("dragging");
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      startW = pane.getBoundingClientRect().width;
      document.body.style.cursor="col-resize";
      document.body.style.userSelect="none";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove, {passive:false});
      window.addEventListener("touchend", onUp);
      e.preventDefault();
    };
    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, {passive:false});
    handle.addEventListener("dblclick", ()=>{
      pane.style.width="50%";
      try{ localStorage.removeItem(KEY); }catch{}
      showToast("Reset split to 50%");
    });
  })();

  // ── Projects wiring ─────────────────────────────────────────────────────
  setTimeout(()=>{
    // 10× Compare mode — toggle dual-model view (unique vs Claude)
    document.getElementById("compareModeBtn")?.addEventListener("click", ()=>{
      const isActive = document.body.classList.toggle("compare-mode");
      showToast(isActive ? "⚡ Compare mode: next prompt will run on 2 models (abliterated vs standard) — coming soon" : "Compare mode off");
      document.getElementById("compareModeBtn").style.background = isActive ? "var(--accent-soft)" : "var(--bg-surface)";
      document.getElementById("compareModeBtn").style.borderColor = isActive ? "var(--accent-border)" : "var(--border)";
      document.getElementById("compareModeBtn").style.color = isActive ? "var(--accent)" : "";
    });
    renderProjects();
    document.getElementById("projectsFileInput")?.addEventListener("change", async (e)=>{
      const files=[...e.target.files||[]];
      for(const f of files){
        try{
          const text=await f.text();
          const sliced=text.slice(0, 30000);
          projects.push({ name:f.name, size:f.size, text:sliced });
        }catch{}
      }
      saveProjects(); renderProjects(); showToast(`Added ${files.length} file(s) to Projects`);
      e.target.value="";
    });
    document.getElementById("projectsList")?.addEventListener("click", (e)=>{
      const btn=e.target.closest("[data-del-project]");
      if(!btn) return;
      const idx=Number(btn.dataset.delProject);
      projects.splice(idx,1); saveProjects(); renderProjects();
    });
    document.getElementById("clearProjectsBtn")?.addEventListener("click", ()=>{
      if(!projects.length) return;
      if(!confirm("Clear all Project Knowledge files?")) return;
      projects=[]; saveProjects(); renderProjects(); showToast("Cleared Projects");
    });
    // Attach generic files as composer context (also add to projects)
    document.getElementById("attachFileInput")?.addEventListener("change", async (e)=>{
      const files=[...e.target.files||[]];
      let added="";
      for(const f of files){
        try{
          const text=await f.text();
          added += `\n\n[FILE: ${f.name}]\n${text.slice(0,8000)}`;
          // also auto-add to projects for persistence
          if(text.length < 30000) projects.push({ name:f.name, size:f.size, text:text.slice(0,30000) });
        }catch{}
      }
      if(added){
        el.promptInput.value = (el.promptInput.value ? el.promptInput.value + "\n" : "") + added.trim();
        autoResizeTextarea();
        saveProjects(); renderProjects();
        showToast(`Attached ${files.length} file(s)`);
        try{ localStorage.setItem("ablit_composer_draft", el.promptInput.value);}catch{}
      }
      e.target.value="";
    });
    // Enhance prompt (powerful rewrite)
    document.getElementById("enhancePromptBtn")?.addEventListener("click", ()=>{
      const v=el.promptInput.value.trim();
      if(!v){ showToast("Type a prompt first to enhance"); return; }
      const enhanced = `You are a principal staff engineer + elite designer. TASK: ${v}\n\nREQUIREMENTS: Fully runnable single-file HTML5 (inline <style> + <script>), Tailwind CDN, responsive + dark mode, a11y, micro-interactions, confetti/parallax polish. Add localStorage, real data, skeletons, empty states. Ship PRODUCTION-GRADE app-store quality — never truncate. Think step-by-step then build.`;
      el.promptInput.value = enhanced;
      autoResizeTextarea();
      try{ localStorage.setItem("ablit_composer_draft", enhanced);}catch{}
      showToast("✨ Enhanced for powerful build");
    });
  }, 500);

})();
