// Shine Pro â€” Business data (packages, services, areas, schedule)
export const PACKAGES = {
  small_sedan: [
    { id: 'super-wash', name: 'Super Wash', price: 50, duration: '45 min', popular: false, minimum: 3, features: ['Exterior hand wash','Vacuum','Clean windows inside & out','Interior wipe down','Clean door jams','Clean wheels','Tire shine'] },
    { id: 'wash-and-wax', name: 'Wash & Wax', price: 85, duration: '75 min', popular: true, minimum: 2, features: ['Everything in Super Wash','Apply cream wax with D/A Polisher','Extra shine & paint protection'] },
    { id: 'mini-detail', name: 'Mini Detail', price: 150, duration: '90 min', popular: false, minimum: 1, features: ['Everything in Wash & Wax','Express wax coat','Leather treatment (dashboard & console)','Shampoo floor mats'] },
    { id: 'complete-detail', name: 'Complete Detail', price: 275, duration: '120 min', popular: false, minimum: 1, startsAt: true, features: ['Everything in Mini Detail','Interior steam cleaning','Full sanitization','Leather/vinyl UV protection','Exterior clay bar treatment','Meguiars finishing wax coat'] },
  ],
  small_pickup: [
    { id: 'super-wash', name: 'Super Wash', price: 60, duration: '50 min', popular: false, minimum: 3, features: ['Exterior hand wash','Vacuum','Clean windows inside & out','Interior wipe down','Clean door jams','Clean wheels','Tire shine'] },
    { id: 'wash-and-wax', name: 'Wash & Wax', price: 100, duration: '80 min', popular: true, minimum: 2, features: ['Everything in Super Wash','Apply cream wax with D/A Polisher','Extra shine & paint protection'] },
    { id: 'mini-detail', name: 'Mini Detail', price: 175, duration: '100 min', popular: false, minimum: 1, features: ['Everything in Wash & Wax','Express wax coat','Leather treatment (dashboard & console)','Shampoo floor mats'] },
    { id: 'complete-detail', name: 'Complete Detail', price: 300, duration: '130 min', popular: false, minimum: 1, startsAt: true, features: ['Everything in Mini Detail','Interior steam cleaning','Full sanitization','Leather/vinyl UV protection','Exterior clay bar treatment','Meguiars finishing wax coat'] },
  ],
  mid_size: [
    { id: 'super-wash', name: 'Super Wash', price: 70, duration: '55 min', popular: false, minimum: 3, features: ['Exterior hand wash','Vacuum','Clean windows inside & out','Interior wipe down','Clean door jams','Clean wheels','Tire shine'] },
    { id: 'wash-and-wax', name: 'Wash & Wax', price: 120, duration: '90 min', popular: true, minimum: 2, features: ['Everything in Super Wash','Apply cream wax with D/A Polisher','Extra shine & paint protection'] },
    { id: 'mini-detail', name: 'Mini Detail', price: 200, duration: '110 min', popular: false, minimum: 1, features: ['Everything in Wash & Wax','Express wax coat','Leather treatment (dashboard & console)','Shampoo floor mats'] },
    { id: 'complete-detail', name: 'Complete Detail', price: 325, duration: '150 min', popular: false, minimum: 1, startsAt: true, features: ['Everything in Mini Detail','Interior steam cleaning','Full sanitization','Leather/vinyl UV protection','Exterior clay bar treatment','Meguiars finishing wax coat'] },
  ],
  full_size: [
    { id: 'super-wash', name: 'Super Wash', price: 80, duration: '60 min', popular: false, minimum: 3, features: ['Exterior hand wash','Vacuum','Clean windows inside & out','Interior wipe down','Clean door jams','Clean wheels','Tire shine'] },
    { id: 'wash-and-wax', name: 'Wash & Wax', price: 140, duration: '100 min', popular: true, minimum: 2, features: ['Everything in Super Wash','Apply cream wax with D/A Polisher','Extra shine & paint protection'] },
    { id: 'mini-detail', name: 'Mini Detail', price: 225, duration: '130 min', popular: false, minimum: 1, features: ['Everything in Wash & Wax','Express wax coat','Leather treatment (dashboard & console)','Shampoo floor mats'] },
    { id: 'complete-detail', name: 'Complete Detail', price: 350, duration: '180 min', popular: false, minimum: 1, startsAt: true, features: ['Everything in Mini Detail','Interior steam cleaning','Full sanitization','Leather/vinyl UV protection','Exterior clay bar treatment','Meguiars finishing wax coat'] },
  ]
};

export const SERVICE_AREAS = [
  'Newport Beach, CA',
  'Irvine, CA',
  'Costa Mesa, CA',
  'Orange, CA',
  'Anaheim, CA',
  'Santa Ana, CA',
  'Huntington Beach, CA',
  'Garden Grove, CA',
];

export const VEHICLE_TYPES = ['Sedan', 'Mid-Size', 'SUV / Truck'];

export const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM',
];

export const TESTIMONIALS = [
  {
    name: 'Patrick Stone',
    rating: 5,
    text: 'They are very good and fast but above all reliable. I left valuable belongings and they are very careful â€” they always respect our valuables. Thank you!',
    location: 'Newport Beach, CA',
  },
  {
    name: 'Hugo James',
    rating: 5,
    text: 'Very attentive and kind, but above all they do an excellent job. I love the way they leave my car every single time.',
    location: 'Irvine, CA',
  },
  {
    name: 'Cassie Carleton',
    rating: 5,
    text: "It's the first place where my car was completely cleaned, and that's very important to me. I've become a regular client.",
    location: 'Costa Mesa, CA',
  },
  {
    name: 'MarÃ­a GonzÃ¡lez',
    rating: 5,
    text: 'Excelente servicio! Llegaron puntual y dejaron mi carro como nuevo. Lo recomiendo al 100%.',
    location: 'Orange, CA',
  },
];

export const COMPANY_INFO = {
  name: 'Shine Pro',
  tagline: 'Mobile Detailing',
  phone: '714 334-4582',
  email: 'andres@shinepro.net',
  location: 'Orange County, California',
  hours: 'Monâ€“Sat: 7amâ€“5pm',
  website: 'https://shinepro.net',
};


