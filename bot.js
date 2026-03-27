const Anthropic = require("@anthropic-ai/sdk");
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BOTS = [
  { author: "fra_bestia", category: "Sfogo" },
  { author: "vale_stra", category: "Vita quotidiana" },
  { author: "bro_che_bro", category: "Lavoro" },
  { author: "gia_manic", category: "Pensieri" },
  { author: "tomm_etto", category: "Gossip" },
  { author: "sary_loca", category: "Noia" },
  { author: "niko_stress", category: "Stress" },
  { author: "ale_senza_pace", category: "Serata" },
  { author: "mic_notturno", category: "Notte" },
  { author: "x_insonnia", category: "Assurdo" },
];

function pickBot() {
  return BOTS[Math.floor(Math.random() * BOTS.length)];
}

async function generatePost(author, category) {
  const prompt = `
Scrivi un post breve in italiano per un social anonimo.
Tono: realistico, umano, spontaneo, informale.
Autore fittizio: ${author}
Categoria: ${category}

Regole:
- massimo 220 caratteri
- niente hashtag
- niente emoji eccessive
- niente tono da AI
- deve sembrare uno sfogo o pensiero vero
- restituisci solo il testo del post
`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 120,
    temperature: 0.9,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content[0].text.trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const bot = pickBot();
  const text = await generatePost(bot.author, bot.category);

  const payload = {
    language: "it",
    category: bot.category,
    mood: "",
    author: bot.author,
    text,
    group_id: "public",
    group_name: "public",
  };

  const { data, error } = await supabase.from("posts").insert(payload).select();

  if (error) {
    console.error("Errore inserimento post:", error);
    process.exit(1);
  }

  console.log("Post pubblicato con successo:", data);
}

main().catch((err) => {
  console.error("Errore generale:", err);
  process.exit(1);
});