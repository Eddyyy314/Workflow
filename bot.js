const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const POSTS = [
  "Oggi mi sento completamente scarico.",
  "Qualcun altro ha la sensazione che tutto sia finto?",
  "Le 2 di notte sono il momento perfetto per pensare troppo.",
  "La gente parla troppo e ascolta poco.",
  "Ho bisogno di staccare da tutto per un po'.",
  "A volte vorrei solo sparire per qualche giorno.",
  "Perché le persone cambiano così in fretta?",
  "Mi sto rendendo conto che fidarsi è sempre più difficile.",
  "Le notti lunghe hanno sempre i pensieri più pesanti.",
  "Mi manca la versione di me di qualche anno fa."
];

const AUTHORS = [
  "fra_bestia",
  "vale_stra",
  "bro_che_bro",
  "gia_manic",
  "tomm_etto",
  "sary_loca",
  "niko_stress",
  "ale_senza_pace",
  "mic_notturno",
  "x_insonnia"
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {

  const text = pickRandom(POSTS);
  const author = pickRandom(AUTHORS);

  const payload = {
    language: "it",
    category: "Pensieri",
    mood: "",
    author,
    text,
    group_id: "public",
    group_name: "public"
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select();

  if (error) {
    console.error("Errore inserimento:", error);
    process.exit(1);
  }

  console.log("Post pubblicato:", data);
}

main();