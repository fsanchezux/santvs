// Programa de Les Santes 2026 (extraído de lessantes.cat el 2026-06-28).
// Cada acto referencia un venueId de venues.js
export const events = [
  // Viernes 17
  { id: "v17-1",  day: "2026-07-17", time: "19:00", title: "Helena Molinos. No n'hi ha prou!", venueId: "mac_preso" },

  // Sábado 18
  { id: "s18-1",  day: "2026-07-18", time: "todo el día", title: "Les Dissantes", venueId: "espai_firal" },
  { id: "s18-2",  day: "2026-07-18", time: "11:00-20:30", title: "Mercat Santero", venueId: "placa_santa_maria" },
  { id: "s18-3",  day: "2026-07-18", time: "12:00", title: "Helena Molinos. No n'hi ha prou! (Visita guiada)", venueId: "mac_preso" },
  { id: "s18-4",  day: "2026-07-18", time: "19:00", title: "Vespreig amb PD Bingos", venueId: "cafe_nou" },
  { id: "s18-5",  day: "2026-07-18", time: "19:15", title: "Toc de novena", venueId: "basilica" },
  { id: "s18-6",  day: "2026-07-18", time: "19:30", title: "Seny i rauxa, ritual i foc", venueId: "destileria" },
  { id: "s18-7",  day: "2026-07-18", time: "20:00", title: "Orquestra de Mataró. La gran gala", venueId: "teatre_monumental" },
  { id: "s18-8",  day: "2026-07-18", time: "21:00", title: "Dissantes Flashmob", venueId: "espai_firal" },
  { id: "s18-9",  day: "2026-07-18", time: "22:00", title: "Beth + Hotel Cochambre + DJ Aksis", venueId: "espai_firal" },

  // Domingo 19
  { id: "d19-1",  day: "2026-07-19", time: "09:15", title: "33a Travessa nedant al Port", venueId: "port" },
  { id: "d19-2",  day: "2026-07-19", time: "11:00", title: "Els castells, una epopeia popular", venueId: "ajuntament" },
  { id: "d19-3",  day: "2026-07-19", time: "12:00", title: "Proclama de Festa Major", venueId: "ajuntament" },
  { id: "d19-4",  day: "2026-07-19", time: "19:00", title: "L'Encesa", venueId: "diversos" },
  { id: "d19-5",  day: "2026-07-19", time: "19:30", title: "Coral La Nota", venueId: "residencia_sj" },

  // Lunes 20
  { id: "l20-1",  day: "2026-07-20", time: "21:30", title: "Ínsula", venueId: "mac_preso" },

  // Martes 21
  { id: "m21-1",  day: "2026-07-21", time: "18:00", title: "Xefs", venueId: "biblio_pompeu" },
  { id: "m21-2",  day: "2026-07-21", time: "21:30", title: "Candela. LaDiénaba", venueId: "mac_preso" },

  // Miércoles 22
  { id: "x22-1",  day: "2026-07-22", time: "19:00", title: "Clowny Red & Musics", venueId: "biblio_comas" },
  { id: "x22-2",  day: "2026-07-22", time: "22:00", title: "Incontinuo", venueId: "llar_cabanellas" },

  // Jueves 23
  { id: "j23-1",  day: "2026-07-23", time: "18:00-21:00", title: "Signatura de cartells", venueId: "placa_santa_anna" },
  { id: "j23-2",  day: "2026-07-23", time: "19:00", title: "Broadway Santes", venueId: "teatre_monumental" },
  { id: "j23-3",  day: "2026-07-23", time: "21:30", title: "Kol·lect-if. Kapadocia", venueId: "mac_preso" },

  // Viernes 24
  { id: "v24-1",  day: "2026-07-24", time: "17:30", title: "Gegantada", venueId: "diversos" },
  { id: "v24-2",  day: "2026-07-24", time: "18:15", title: "Estem de festa", venueId: "llar_cabanellas" },
  { id: "v24-3",  day: "2026-07-24", time: "19:00", title: "Rau-rau", venueId: "llar_cabanellas" },
  { id: "v24-4",  day: "2026-07-24", time: "20:00", title: "GospelSons", venueId: "passeig_callao" },
  { id: "v24-5",  day: "2026-07-24", time: "20:15", title: "Una vida plena de colors", venueId: "llar_cabanellas" },
  { id: "v24-6",  day: "2026-07-24", time: "21:00", title: "Aleta", venueId: "llar_cabanellas" },
  { id: "v24-7",  day: "2026-07-24", time: "21:00", title: "Assaig Capgrossos de Mataró", venueId: "placa_santa_anna" },
  { id: "v24-8",  day: "2026-07-24", time: "22:00", title: "Havaneres i rom cremat", venueId: "passeig_callao" },
  { id: "v24-9",  day: "2026-07-24", time: "22:30", title: "Big Band Jazz Maresme", venueId: "llar_cabanellas" },
  { id: "v24-10", day: "2026-07-24", time: "23:00", title: "Allioli + DJ Hochi", venueId: "placa_santa_anna" },

  // Sábado 25
  { id: "s25-1",  day: "2026-07-25", time: "17:00", title: "Diada castellera", venueId: "placa_santa_anna" },
  { id: "s25-2",  day: "2026-07-25", time: "17:00", title: "Una casa de sorpreses santeres!", venueId: "casa_coll_regas" },
  { id: "s25-3",  day: "2026-07-25", time: "17:30", title: "Banda de l'Agrupació Musical", venueId: "residencia_sj" },
  { id: "s25-4",  day: "2026-07-25", time: "18:15", title: "La festa d'aniversari", venueId: "llar_cabanellas" },
  { id: "s25-5",  day: "2026-07-25", time: "19:00", title: "Embolic", venueId: "llar_cabanellas" },
  { id: "s25-6",  day: "2026-07-25", time: "19:30", title: "Cap a la Crida", venueId: "diversos" },
  { id: "s25-7",  day: "2026-07-25", time: "20:00", title: "Crida de Festa Major", venueId: "ajuntament" },
  { id: "s25-8",  day: "2026-07-25", time: "20:15", title: "Tots els petons del món", venueId: "llar_cabanellas" },
  { id: "s25-9",  day: "2026-07-25", time: "21:00", title: "Ruta", venueId: "llar_cabanellas" },
  { id: "s25-10", day: "2026-07-25", time: "22:30", title: "Alba Carmona i Jesús Guerrero", venueId: "llar_cabanellas" },
  { id: "s25-11", day: "2026-07-25", time: "23:30", title: "DJ Òscar", venueId: "espai_firal" },
  { id: "s25-12", day: "2026-07-25", time: "23:30", title: "Desvetllament bellugós", venueId: "ajuntament" },
  { id: "s25-13", day: "2026-07-25", time: "00:00", title: "La Cosina", venueId: "placa_santa_anna" },
  { id: "s25-14", day: "2026-07-25", time: "01:30", title: "Escapada a negra nit", venueId: "ajuntament" },
  { id: "s25-15", day: "2026-07-25", time: "03:00", title: "Pujada tabalada", venueId: "ajuntament" },
  { id: "s25-16", day: "2026-07-25", time: "04:00", title: "La Ruixada", venueId: "espai_firal" },

  // Domingo 26
  { id: "d26-1",  day: "2026-07-26", time: "10:00-14:00", title: "Gegants i nans passats per aigua", venueId: "mac_preso" },
  { id: "d26-2",  day: "2026-07-26", time: "11:00", title: "Una casa de sorpreses santeres!", venueId: "casa_coll_regas" },
  { id: "d26-3",  day: "2026-07-26", time: "12:00", title: "Concert de Barram", venueId: "residencia_sj" },
  { id: "d26-4",  day: "2026-07-26", time: "12:00", title: "Concert vermut. Espora", venueId: "pati_esmandies" },
  { id: "d26-5",  day: "2026-07-26", time: "12:00", title: "El cel de Les Santes", venueId: "casal_alianca" },
  { id: "d26-6",  day: "2026-07-26", time: "14:00", title: "Barram i repicada", venueId: "basilica" },
  { id: "d26-7",  day: "2026-07-26", time: "17:00", title: "Recepció oficial Julianes y Sempronianes", venueId: "ajuntament" },
  { id: "d26-8",  day: "2026-07-26", time: "18:00", title: "De parranda!", venueId: "ajuntament" },
  { id: "d26-9",  day: "2026-07-26", time: "18:15", title: "Contes de Festa Major", venueId: "llar_cabanellas" },
  { id: "d26-10", day: "2026-07-26", time: "18:30", title: "Convidadeta. Filomena", venueId: "placa_santa_anna" },
  { id: "d26-11", day: "2026-07-26", time: "19:00", title: "Full House", venueId: "llar_cabanellas" },
  { id: "d26-12", day: "2026-07-26", time: "20:00", title: "Correguspira", venueId: "ajuntament" },
  { id: "d26-13", day: "2026-07-26", time: "20:15", title: "Els contes d'en Joan", venueId: "llar_cabanellas" },
  { id: "d26-14", day: "2026-07-26", time: "20:30", title: "Cor Madrigalista", venueId: "esglesia_sta_anna" },
  { id: "d26-15", day: "2026-07-26", time: "21:00", title: "Manifesto", venueId: "llar_cabanellas" },
  { id: "d26-16", day: "2026-07-26", time: "21:30", title: "Pujada tabaladeta", venueId: "ajuntament" },
  { id: "d26-17", day: "2026-07-26", time: "22:00", title: "La Ruixadeta", venueId: "espai_firal" },
  { id: "d26-18", day: "2026-07-26", time: "22:00", title: "Ballada de sardanes", venueId: "placa_santa_anna" },
  { id: "d26-19", day: "2026-07-26", time: "22:30", title: "Magalí Sare", venueId: "llar_cabanellas" },
  { id: "d26-20", day: "2026-07-26", time: "23:30", title: "Revetlla de Festa Major", venueId: "espai_firal" },

  // Lunes 27 — Les Santes
  { id: "l27-1",  day: "2026-07-27", time: "07:00", title: "Matinades", venueId: "diversos" },
  { id: "l27-2",  day: "2026-07-27", time: "09:00", title: "Toc d'ofici", venueId: "basilica" },
  { id: "l27-3",  day: "2026-07-27", time: "09:30", title: "Anada a ofici", venueId: "ajuntament" },
  { id: "l27-4",  day: "2026-07-27", time: "10:00", title: "Missa de les Santes", venueId: "basilica" },
  { id: "l27-5",  day: "2026-07-27", time: "12:00", title: "Ballada de sardanes", venueId: "carrer_pujol" },
  { id: "l27-6",  day: "2026-07-27", time: "13:00", title: "Desfilada", venueId: "placa_santa_maria" },
  { id: "l27-7",  day: "2026-07-27", time: "18:00", title: "La Passada", venueId: "ajuntament" },
  { id: "l27-8",  day: "2026-07-27", time: "18:15", title: "Una barqueta petiteta", venueId: "llar_cabanellas" },
  { id: "l27-9",  day: "2026-07-27", time: "19:00", title: "Dolce Salato", venueId: "llar_cabanellas" },
  { id: "l27-10", day: "2026-07-27", time: "20:15", title: "De peixos, ones i sirenes", venueId: "llar_cabanellas" },
  { id: "l27-11", day: "2026-07-27", time: "21:00", title: "Refugi", venueId: "llar_cabanellas" },
  { id: "l27-12", day: "2026-07-27", time: "23:00", title: "Castell de focs", venueId: "diversos" },
  { id: "l27-13", day: "2026-07-27", time: "23:30", title: "Baix a marc", venueId: "passeig_maritim" },
  { id: "l27-14", day: "2026-07-27", time: "23:45", title: "Sardanes i xindriada", venueId: "placa_santa_anna" },
  { id: "l27-15", day: "2026-07-27", time: "00:00", title: "Aziza Brahim", venueId: "llar_cabanellas" },
  { id: "l27-16", day: "2026-07-27", time: "00:15", title: "Svetlana + The Tyets", venueId: "parc_central" },
  { id: "l27-17", day: "2026-07-27", time: "00:30", title: "David Oleart", venueId: "platja_varador" },

  // Martes 28
  { id: "m28-1",  day: "2026-07-28", time: "09:00", title: "46a Cursa Popular", venueId: "parc_central" },
  { id: "m28-2",  day: "2026-07-28", time: "10:30", title: "Anada a Residència Sant Josep", venueId: "ajuntament" },
  { id: "m28-3",  day: "2026-07-28", time: "11:30", title: "Ballada de sardanes", venueId: "residencia_sj" },
  { id: "m28-4",  day: "2026-07-28", time: "13:30", title: "Tornada a l'Ajuntament", venueId: "residencia_sj" },
  { id: "m28-5",  day: "2026-07-28", time: "18:15", title: "Contes per plorar de riure", venueId: "llar_cabanellas" },
  { id: "m28-6",  day: "2026-07-28", time: "18:30", title: "Postal de Gegants", venueId: "diversos" },
  { id: "m28-7",  day: "2026-07-28", time: "19:00", title: "L'Y. Ànsia per volar", venueId: "llar_cabanellas" },
  { id: "m28-8",  day: "2026-07-28", time: "19:15", title: "Concert de sardanes", venueId: "residencia_sj" },
  { id: "m28-9",  day: "2026-07-28", time: "20:15", title: "Gat i bruixa", venueId: "llar_cabanellas" },
  { id: "m28-10", day: "2026-07-28", time: "21:00", title: "Tenet", venueId: "llar_cabanellas" },
  { id: "m28-11", day: "2026-07-28", time: "21:00", title: "Marrinxa", venueId: "platja_varador" },
  { id: "m28-12", day: "2026-07-28", time: "21:30", title: "Ball de dracs", venueId: "placa_santa_maria" },
  { id: "m28-13", day: "2026-07-28", time: "22:30", title: "La Baula", venueId: "llar_cabanellas" },
  { id: "m28-14", day: "2026-07-28", time: "23:00", title: "Requisits de Festa Major", venueId: "parc_central" },
  { id: "m28-15", day: "2026-07-28", time: "02:00", title: "DJ Nilvard", venueId: "parc_central" },
  { id: "m28-16", day: "2026-07-28", time: "02:00", title: "No n'hi ha prou!", venueId: "ajuntament" },

  // Miércoles 29
  { id: "x29-1",  day: "2026-07-29", time: "12:30", title: "Vermut de bastons", venueId: "placa_cuba" },
  { id: "x29-2",  day: "2026-07-29", time: "18:00", title: "Enfigura't", venueId: "diversos" },
  { id: "x29-3",  day: "2026-07-29", time: "18:15", title: "Contes que fan festa", venueId: "llar_cabanellas" },
  { id: "x29-4",  day: "2026-07-29", time: "19:15", title: "La iaia embolica la troca", venueId: "llar_cabanellas" },
  { id: "x29-5",  day: "2026-07-29", time: "19:15", title: "Anem a tancar", venueId: "ajuntament" },
  { id: "x29-6",  day: "2026-07-29", time: "19:30", title: "Concert de Festa Major", venueId: "parc_central" },
  { id: "x29-7",  day: "2026-07-29", time: "20:00", title: "Xiulant", venueId: "llar_cabanellas" },
  { id: "x29-8",  day: "2026-07-29", time: "22:00", title: "El so de la paraula", venueId: "llar_cabanellas" },
  { id: "x29-9",  day: "2026-07-29", time: "00:00", title: "Tronada de fi de festa", venueId: "espai_firal" },
  { id: "x29-10", day: "2026-07-29", time: "00:10", title: "Espetec final", venueId: "parc_central" },
  { id: "x29-11", day: "2026-07-29", time: "06:00", title: "L'Albada", venueId: "diversos" }
];

export const dayLabels = {
  "2026-07-17": "Divendres 17",
  "2026-07-18": "Dissabte 18",
  "2026-07-19": "Diumenge 19",
  "2026-07-20": "Dilluns 20",
  "2026-07-21": "Dimarts 21",
  "2026-07-22": "Dimecres 22",
  "2026-07-23": "Dijous 23",
  "2026-07-24": "Divendres 24",
  "2026-07-25": "Dissabte 25",
  "2026-07-26": "Diumenge 26",
  "2026-07-27": "Dilluns 27 (Les Santes)",
  "2026-07-28": "Dimarts 28",
  "2026-07-29": "Dimecres 29"
};
