// Coordenadas aproximadas de los recintos de Mataró.
// Ajústalas con precisión cuando puedas (basta con editar lat/lng).
export const venues = {
  ajuntament:        { name: "Ajuntament de Mataró",            lat: 41.5380, lng: 2.4451 },
  basilica:          { name: "Basílica de Santa Maria",          lat: 41.5388, lng: 2.4453 },
  placa_santa_anna:  { name: "Plaça de Santa Anna",              lat: 41.5378, lng: 2.4438 },
  placa_santa_maria: { name: "Plaça de Santa Maria",             lat: 41.5390, lng: 2.4452 },
  llar_cabanellas:   { name: "Llar Cabanellas",                  lat: 41.5365, lng: 2.4395 },
  teatre_monumental: { name: "Teatre Monumental",                lat: 41.5365, lng: 2.4413 },
  mac_preso:         { name: "M|A|C Presó",                      lat: 41.5395, lng: 2.4445 },
  parc_central:      { name: "Parc Central / Nou Parc Central",  lat: 41.5425, lng: 2.4380 },
  espai_firal:       { name: "Espai Firal del Nou Parc Central", lat: 41.5430, lng: 2.4385 },
  passeig_callao:    { name: "Passeig del Callao",               lat: 41.5345, lng: 2.4475 },
  residencia_sj:     { name: "Pati Residència Sant Josep",       lat: 41.5395, lng: 2.4410 },
  casa_coll_regas:   { name: "Casa Coll i Regàs",                lat: 41.5400, lng: 2.4445 },
  biblio_pompeu:     { name: "Biblioteca Pompeu Fabra",          lat: 41.5400, lng: 2.4400 },
  biblio_comas:      { name: "Biblioteca Antoni Comas",          lat: 41.5310, lng: 2.4540 },
  casal_alianca:     { name: "Casal L'Aliança",                  lat: 41.5375, lng: 2.4458 },
  pati_esmandies:    { name: "Pati Esmandies",                   lat: 41.5402, lng: 2.4420 },
  cafe_nou:          { name: "Pati del Cafè Nou",                lat: 41.5380, lng: 2.4445 },
  destileria:        { name: "La Destil·leria Espai Cultural",    lat: 41.5365, lng: 2.4495 },
  port:              { name: "Port de Mataró",                   lat: 41.5285, lng: 2.4480 },
  platja_varador:    { name: "Platja del Varador",               lat: 41.5300, lng: 2.4520 },
  passeig_maritim:   { name: "Passeig Marítim",                  lat: 41.5310, lng: 2.4490 },
  esglesia_sta_anna: { name: "Església de Santa Anna",           lat: 41.5378, lng: 2.4440 },
  placa_cuba:        { name: "Plaça Cuba",                       lat: 41.5390, lng: 2.4488 },
  carrer_pujol:      { name: "Carrer d'en Pujol",                lat: 41.5390, lng: 2.4448 },
  diversos:          { name: "Diversos indrets",                 lat: 41.5388, lng: 2.4449 }
};

export function mapsUrl(v) {
  return `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`;
}
