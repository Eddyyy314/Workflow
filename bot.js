const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return response.output_text.trim().replace(/^["']|["']$/g, "");
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

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select();

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