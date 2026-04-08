// Shine Pro — Booking Data

export const VEHICLES = [
  { id: 'small_sedan', labelEn: 'Small Sedan', labelEs: 'Sedan Pequeño', icon: '🚗' },
  { id: 'small_pickup', labelEn: 'Small Pickup / SUV', labelEs: 'Pickup Pequeño / SUV', icon: '🚙' },
  { id: 'mid_size', labelEn: 'Mid Size Truck / SUV', labelEs: 'Truck / SUV Mediano', icon: '🛻' },
  { id: 'full_size', labelEn: 'Full Size Vehicle', labelEs: 'Vehículo Grande', icon: '🚐' },
];

export const SERVICES = {
  small_sedan: [
    {
      id: 'super-wash', duration: 45,
      priceEn: 50, priceEs: 50,
      nameEn: 'Super Wash', nameEs: 'Super Wash',
      descEn: 'A thorough exterior & interior clean for everyday maintenance.',
      descEs: 'Limpieza exterior e interior completa para mantenimiento diario.',
      featuresEn: ['Exterior hand wash', 'Vacuum', 'Clean windows inside & out', 'Interior wipe down', 'Clean door jams', 'Clean wheels', 'Tire shine'],
      featuresEs: ['Lavado manual exterior', 'Aspirado', 'Limpieza de ventanas int/ext', 'Limpieza de superficies interior', 'Limpieza de marcos de puertas', 'Limpieza de rines', 'Acondicionador de llantas'],
    },
    {
      id: 'wash-and-wax', duration: 75,
      priceEn: 85, priceEs: 85,
      nameEn: 'Wash & Wax', nameEs: 'Wash & Wax',
      descEn: 'Everything in Super Wash plus premium wax protection.',
      descEs: 'Todo lo de Super Wash más protección premium con cera.',
      popular: true,
      featuresEn: ['Everything in Super Wash', 'Apply cream wax with D/A Polisher', 'Extra shine & paint protection'],
      featuresEs: ['Todo lo de Super Wash', 'Cera en crema con pulidora D/A', 'Brillo extra y protección de pintura'],
    },
    {
      id: 'mini-detail', duration: 90,
      priceEn: 150, priceEs: 150,
      nameEn: 'Mini Detail', nameEs: 'Mini Detail',
      descEn: 'Deep clean with leather treatment and floor mat shampoo.',
      descEs: 'Limpieza profunda con tratamiento de cuero y lavado de tapetes.',
      featuresEn: ['Everything in Wash & Wax', 'Express wax coat', 'Leather treatment (dashboard & console)', 'Shampoo floor mats'],
      featuresEs: ['Todo lo de Wash & Wax', 'Capa de cera express', 'Tratamiento de cuero (tablero y consola)', 'Lavado de tapetes'],
    },
    {
      id: 'complete-detail', duration: 120,
      priceEn: 275, priceEs: 275,
      nameEn: 'Complete Detail', nameEs: 'Complete Detail',
      descEn: 'The full premium experience — steam, clay bar, and flawless finish.',
      descEs: 'La experiencia premium completa — vapor, clay bar y acabado impecable.',
      featuresEn: ['Everything in Mini Detail', 'Interior steam cleaning', 'Full sanitization', 'Leather/vinyl UV protection', 'Exterior clay bar treatment', "Meguiar's finishing wax coat"],
      featuresEs: ['Todo lo de Mini Detail', 'Limpieza interior a vapor', 'Sanitización completa', 'Protección UV para cuero/vinilo', 'Tratamiento exterior con Clay Bar', 'Capa de cera final Meguiars'],
    },
  ],
  small_pickup: [
    { id: 'super-wash', duration: 50, priceEn: 65, priceEs: 65, nameEn: 'Super Wash', nameEs: 'Super Wash', descEn: 'A thorough exterior & interior clean for everyday maintenance.', descEs: 'Limpieza exterior e interior completa para mantenimiento diario.', featuresEn: ['Exterior hand wash', 'Vacuum', 'Clean windows inside & out', 'Interior wipe down', 'Clean door jams', 'Clean wheels', 'Tire shine'], featuresEs: ['Lavado manual exterior', 'Aspirado', 'Limpieza de ventanas int/ext', 'Limpieza de superficies interior', 'Limpieza de marcos de puertas', 'Limpieza de rines', 'Acondicionador de llantas'] },
    { id: 'wash-and-wax', duration: 80, priceEn: 100, priceEs: 100, nameEn: 'Wash & Wax', nameEs: 'Wash & Wax', descEn: 'Everything in Super Wash plus premium wax protection.', descEs: 'Todo lo de Super Wash más protección premium con cera.', popular: true, featuresEn: ['Everything in Super Wash', 'Apply cream wax with D/A Polisher', 'Extra shine & paint protection'], featuresEs: ['Todo lo de Super Wash', 'Cera en crema con pulidora D/A', 'Brillo extra y protección de pintura'] },
    { id: 'mini-detail', duration: 100, priceEn: 165, priceEs: 165, nameEn: 'Mini Detail', nameEs: 'Mini Detail', descEn: 'Deep clean with leather treatment and floor mat shampoo.', descEs: 'Limpieza profunda con tratamiento de cuero y lavado de tapetes.', featuresEn: ['Everything in Wash & Wax', 'Express wax coat', 'Leather treatment (dashboard & console)', 'Shampoo floor mats'], featuresEs: ['Todo lo de Wash & Wax', 'Capa de cera express', 'Tratamiento de cuero (tablero y consola)', 'Lavado de tapetes'] },
    { id: 'complete-detail', duration: 130, priceEn: 295, priceEs: 295, nameEn: 'Complete Detail', nameEs: 'Complete Detail', descEn: 'The full premium experience — steam, clay bar, and flawless finish.', descEs: 'La experiencia premium completa — vapor, clay bar y acabado impecable.', featuresEn: ['Everything in Mini Detail', 'Interior steam cleaning', 'Full sanitization', 'Leather/vinyl UV protection', 'Exterior clay bar treatment', "Meguiar's finishing wax coat"], featuresEs: ['Todo lo de Mini Detail', 'Limpieza interior a vapor', 'Sanitización completa', 'Protección UV para cuero/vinilo', 'Tratamiento exterior con Clay Bar', 'Capa de cera final Meguiars'] },
  ],
  mid_size: [
    { id: 'super-wash', duration: 55, priceEn: 75, priceEs: 75, nameEn: 'Super Wash', nameEs: 'Super Wash', descEn: 'A thorough exterior & interior clean for everyday maintenance.', descEs: 'Limpieza exterior e interior completa para mantenimiento diario.', featuresEn: ['Exterior hand wash', 'Vacuum', 'Clean windows inside & out', 'Interior wipe down', 'Clean door jams', 'Clean wheels', 'Tire shine'], featuresEs: ['Lavado manual exterior', 'Aspirado', 'Limpieza de ventanas int/ext', 'Limpieza de superficies interior', 'Limpieza de marcos de puertas', 'Limpieza de rines', 'Acondicionador de llantas'] },
    { id: 'wash-and-wax', duration: 90, priceEn: 115, priceEs: 115, nameEn: 'Wash & Wax', nameEs: 'Wash & Wax', descEn: 'Everything in Super Wash plus premium wax protection.', descEs: 'Todo lo de Super Wash más protección premium con cera.', popular: true, featuresEn: ['Everything in Super Wash', 'Apply cream wax with D/A Polisher', 'Extra shine & paint protection'], featuresEs: ['Todo lo de Super Wash', 'Cera en crema con pulidora D/A', 'Brillo extra y protección de pintura'] },
    { id: 'mini-detail', duration: 110, priceEn: 180, priceEs: 180, nameEn: 'Mini Detail', nameEs: 'Mini Detail', descEn: 'Deep clean with leather treatment and floor mat shampoo.', descEs: 'Limpieza profunda con tratamiento de cuero y lavado de tapetes.', featuresEn: ['Everything in Wash & Wax', 'Express wax coat', 'Leather treatment (dashboard & console)', 'Shampoo floor mats'], featuresEs: ['Todo lo de Wash & Wax', 'Capa de cera express', 'Tratamiento de cuero (tablero y consola)', 'Lavado de tapetes'] },
    { id: 'complete-detail', duration: 150, priceEn: 315, priceEs: 315, nameEn: 'Complete Detail', nameEs: 'Complete Detail', descEn: 'The full premium experience — steam, clay bar, and flawless finish.', descEs: 'La experiencia premium completa — vapor, clay bar y acabado impecable.', featuresEn: ['Everything in Mini Detail', 'Interior steam cleaning', 'Full sanitization', 'Leather/vinyl UV protection', 'Exterior clay bar treatment', "Meguiar's finishing wax coat"], featuresEs: ['Todo lo de Mini Detail', 'Limpieza interior a vapor', 'Sanitización completa', 'Protección UV para cuero/vinilo', 'Tratamiento exterior con Clay Bar', 'Capa de cera final Meguiars'] },
  ],
  full_size: [
    { id: 'super-wash', duration: 60, priceEn: 85, priceEs: 85, nameEn: 'Super Wash', nameEs: 'Super Wash', descEn: 'A thorough exterior & interior clean for everyday maintenance.', descEs: 'Limpieza exterior e interior completa para mantenimiento diario.', featuresEn: ['Exterior hand wash', 'Vacuum', 'Clean windows inside & out', 'Interior wipe down', 'Clean door jams', 'Clean wheels', 'Tire shine'], featuresEs: ['Lavado manual exterior', 'Aspirado', 'Limpieza de ventanas int/ext', 'Limpieza de superficies interior', 'Limpieza de marcos de puertas', 'Limpieza de rines', 'Acondicionador de llantas'] },
    { id: 'wash-and-wax', duration: 100, priceEn: 120, priceEs: 120, nameEn: 'Wash & Wax', nameEs: 'Wash & Wax', descEn: 'Everything in Super Wash plus premium wax protection.', descEs: 'Todo lo de Super Wash más protección premium con cera.', popular: true, featuresEn: ['Everything in Super Wash', 'Apply cream wax with D/A Polisher', 'Extra shine & paint protection'], featuresEs: ['Todo lo de Super Wash', 'Cera en crema con pulidora D/A', 'Brillo extra y protección de pintura'] },
    { id: 'mini-detail', duration: 130, priceEn: 195, priceEs: 195, nameEn: 'Mini Detail', nameEs: 'Mini Detail', descEn: 'Deep clean with leather treatment and floor mat shampoo.', descEs: 'Limpieza profunda con tratamiento de cuero y lavado de tapetes.', featuresEn: ['Everything in Wash & Wax', 'Express wax coat', 'Leather treatment (dashboard & console)', 'Shampoo floor mats'], featuresEs: ['Todo lo de Wash & Wax', 'Capa de cera express', 'Tratamiento de cuero (tablero y consola)', 'Lavado de tapetes'] },
    { id: 'complete-detail', duration: 180, priceEn: 335, priceEs: 335, nameEn: 'Complete Detail', nameEs: 'Complete Detail', descEn: 'The full premium experience — steam, clay bar, and flawless finish.', descEs: 'La experiencia premium completa — vapor, clay bar y acabado impecable.', featuresEn: ['Everything in Mini Detail', 'Interior steam cleaning', 'Full sanitization', 'Leather/vinyl UV protection', 'Exterior clay bar treatment', "Meguiar's finishing wax coat"], featuresEs: ['Todo lo de Mini Detail', 'Limpieza interior a vapor', 'Sanitización completa', 'Protección UV para cuero/vinilo', 'Tratamiento exterior con Clay Bar', 'Capa de cera final Meguiars'] },
  ],
};

export const ADDONS = [
  { id: 'engine-detail', nameEn: 'Engine Detail', nameEs: 'Detalle de Motor', price: 50, descEn: 'Degrease, rinse, blow dry & protect plastics', descEs: 'Desengrasado, enjuague, secado y protección de plásticos' },
  { id: 'clay-bar', nameEn: 'Clay Bar Treatment', nameEs: 'Tratamiento Clay Bar', price: 50, descEn: 'Removes embedded contaminants from paint', descEs: 'Elimina contaminantes incrustados en la pintura' },
  { id: 'headlight-restoration', nameEn: 'Headlight Restoration', nameEs: 'Restauración de Faros', price: 50, descEn: 'Wet sanding, compound buff & UV protection coat (per pair)', descEs: 'Lijado húmedo, pulido y capa de protección UV (por par)' },
  { id: 'headliner', nameEn: 'Headliner / Interior Ceiling', nameEs: 'Techo Interior', price: 50, descEn: 'Deep clean of interior ceiling and headliner', descEs: 'Limpieza profunda del techo interior' },
  { id: 'machine-wax', nameEn: 'Machine Wax', nameEs: 'Encerado con Máquina', price: 75, descEn: 'Professional machine-applied wax for maximum shine', descEs: 'Cera aplicada con máquina profesional para máximo brillo' },
  { id: 'trim-restoration', nameEn: 'Trim Restoration', nameEs: 'Restauración de Molduras', price: 35, descEn: 'Restores faded plastic trim to like-new condition ($20–$50)', descEs: 'Restaura molduras de plástico descoloridas ($20–$50)' },
  { id: 'pet-hair', nameEn: 'Pet Hair / Excessive Dirt', nameEs: 'Pelo de Mascota / Suciedad Excesiva', price: 35, descEn: 'Extra labor for heavy pet hair or excessive grime ($20–$50)', descEs: 'Trabajo extra por mucho pelo de mascota o suciedad excesiva ($20–$50)' },
];

export const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export const CONTACT = {
  email: 'andres@shinepro.net',
  phone: '+1 (714) 334-4582',
};
