// Rutas de ejemplo. En el futuro las subirán los usuarios.
// modality: "hardcore" | "chill" | "infantil"
// path: [[lat,lng], ...]
// eventIds: ids de actos que forman parte de la ruta (orden = orden de visita)
export const routes = [
  {
    id: "r-hardcore-1",
    name: "Hardcore — Tour santero nocturn",
    modality: "hardcore",
    distanceKm: 9.8,
    elevationM: 145,
    durationMin: 180,
    author: "@xavi.runs",
    description: "De L'Encesa fins al castell de focs sense parar.",
    color: "#dc2626",
    eventIds: [
      "d19-4",   // L'Encesa
      "s25-7",   // Crida de Festa Major
      "s25-12",  // Desvetllament bellugós
      "s25-14",  // Escapada a negra nit
      "s25-15",  // Pujada tabalada
      "s25-16",  // La Ruixada
      "l27-12",  // Castell de focs
      "l27-13",  // Baix a marc
      "l27-16"   // Svetlana + The Tyets
    ],
    path: [
      [41.5380, 2.4451], [41.5388, 2.4453], [41.5390, 2.4452],
      [41.5378, 2.4438], [41.5365, 2.4395], [41.5345, 2.4475],
      [41.5310, 2.4490], [41.5300, 2.4520], [41.5285, 2.4480],
      [41.5365, 2.4413], [41.5395, 2.4445], [41.5425, 2.4380],
      [41.5430, 2.4385], [41.5380, 2.4451]
    ]
  },
  {
    id: "r-chill-1",
    name: "Chill — Vermut i sardanes",
    modality: "chill",
    distanceKm: 3.4,
    elevationM: 22,
    durationMin: 60,
    author: "@maria.chill",
    description: "Recorregut tranquil pels actes de tarda.",
    color: "#0ea5e9",
    eventIds: [
      "d19-5",   // Coral La Nota
      "d26-4",   // Concert vermut. Espora
      "d26-14",  // Cor Madrigalista
      "d26-18",  // Ballada de sardanes
      "l27-14",  // Sardanes i xindriada
      "x29-1"    // Vermut de bastons
    ],
    path: [
      [41.5402, 2.4420], [41.5400, 2.4445], [41.5395, 2.4410],
      [41.5388, 2.4453], [41.5390, 2.4452], [41.5378, 2.4438],
      [41.5380, 2.4451]
    ]
  },
  {
    id: "r-infantil-1",
    name: "Infantil — Gegants i nans",
    modality: "infantil",
    distanceKm: 1.6,
    elevationM: 8,
    durationMin: 35,
    author: "@família.santes",
    description: "Ruta curta i ombrejada per fer amb els menuts.",
    color: "#16a34a",
    eventIds: [
      "v24-1",   // Gegantada
      "s25-2",   // Una casa de sorpreses santeres!
      "d26-1",   // Gegants i nans passats per aigua
      "d26-9",   // Contes de Festa Major
      "d26-10",  // Convidadeta. Filomena
      "m28-5",   // Contes per plorar de riure
      "m28-6"    // Postal de Gegants
    ],
    path: [
      [41.5395, 2.4445], [41.5400, 2.4445], [41.5390, 2.4452],
      [41.5378, 2.4438], [41.5380, 2.4451], [41.5395, 2.4445]
    ]
  }
];

export const modalityLabels = {
  hardcore: "Hardcore",
  chill:    "Chill",
  infantil: "Infantil"
};
