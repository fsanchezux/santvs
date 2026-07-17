// Categorías de los actos.
// Se derivan automáticamente del título con `categoryFor()`.
// Si quieres forzar una categoría para un acto concreto, añade `category: "id"`
// en el objeto del acto en data/events.js (tiene prioridad).

// `icon` is a Font Awesome 6 (free, solid) class used for the map pins.
export const CATEGORIES = {
  musica:     { label: "Música",     color: "#9333ea", emoji: "🎵",  icon: "fa-solid fa-music" },
  tradicio:   { label: "Tradició",   color: "#0891b2", emoji: "⛪",  icon: "fa-solid fa-church" },
  cercavila:  { label: "Cercavila",  color: "#ea580c", emoji: "🥁",  icon: "fa-solid fa-drum" },
  foc:        { label: "Foc",        color: "#dc2626", emoji: "🔥",  icon: "fa-solid fa-fire" },
  sardanes:   { label: "Sardanes",   color: "#0284c7", emoji: "💃",  icon: "fa-solid fa-people-group" },
  espectacle: { label: "Espectacle", color: "#db2777", emoji: "🎭",  icon: "fa-solid fa-masks-theater" },
  infantil:   { label: "Infantil",   color: "#16a34a", emoji: "🧸",  icon: "fa-solid fa-child-reaching" },
  mercat:     { label: "Mercat",     color: "#a16207", emoji: "🛍️", icon: "fa-solid fa-bag-shopping" },
  exposicio:  { label: "Exposició",  color: "#7c3aed", emoji: "🖼️", icon: "fa-solid fa-image" },
  esport:     { label: "Esport",     color: "#059669", emoji: "🏃",  icon: "fa-solid fa-person-running" },
  festa:      { label: "Festa",      color: "#f59e0b", emoji: "🎉",  icon: "fa-solid fa-champagne-glasses" },
  altres:     { label: "Altres",     color: "#737373", emoji: "📍",  icon: "fa-solid fa-location-dot" }
};

// El orden importa: la primera regla que case manda.
const RULES = [
  [/conte|contes|filomena|barqueta|petons|sirenes|gegants i nans|convidadeta|casa de sorpreses|postal de gegants|enfigura|iaia embolica|xiulant|gat i bruixa|clowny/i, "infantil"],
  [/encesa|castell de focs|pujada tabalad|escapada a negra nit|espetec|tronada|correguspira|ruixad|ball de dracs/i, "foc"],
  [/sardan/i, "sardanes"],
  [/cercavila|gegantada|matinades|albada|anem a tancar|de parranda|desvetllament|la passada|anada a|tornada|vermut de bastons|desfilada/i, "cercavila"],
  [/exposi|visita guiada|signatura/i, "exposicio"],
  [/mercat/i, "mercat"],
  [/travessa|cursa popular|esport/i, "esport"],
  [/circ|aleta|incontinuo|broadway|musical|clown|tenet|refugi|dolce salato|ínsula|ànsia per volar|full house|manifesto|ruta|embolic|la baula|estem de festa|rau-rau|aleta|una vida plena|tots els petons|festa d'aniversari|requisits/i, "espectacle"],
  [/missa|toc d|toc de|proclama|crida|recepci|barram|repicada|ofici|novena|castells, una epopeia|capgrossos|castellera/i, "tradicio"],
  [/concert|orquestra|coral|cor |madrigal|big band|gospel|jazz|^dj |banda|magalí|aziza|tyets|svetlana|alba carmona|david oleart|partidaris|marrinxa|baix a marc|revetlla|beth|cochambre|aksis|hochi|nilvard|òscar|candela|kapadocia|kol·lect|so de la paraula|festa major$|allioli|havaneres|rom cremat|vespreig|seny i rauxa|dissantes flashmob|les dissantes|cel de les santes|el cel|la cosina/i, "musica"],
  [/no n'hi ha prou|xefs/i, "festa"]
];

export function categoryFor(title = "") {
  for (const [re, cat] of RULES) {
    if (re.test(title)) return cat;
  }
  return "altres";
}

export function resolveCategory(event) {
  return event.category || categoryFor(event.title);
}
