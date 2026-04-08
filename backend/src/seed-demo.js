/**
 * Seed 30 demo bookings spread across this week and next.
 * Run: node src/seed-demo.js
 */
require('dotenv').config();
const pool = require('./db');

// Helper: get date string offset from today
function dayOffset(n) {
  const d = new Date();
  // Use LA timezone base
  const la = new Date(d.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  la.setDate(la.getDate() + n);
  const y = la.getFullYear();
  const m = String(la.getMonth() + 1).padStart(2, '0');
  const day = String(la.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const BOOKINGS = [
  // ── THIS WEEK ──────────────────────────────────────────────────────────────
  // Monday (offset depends on today's dow — we just use relative days 0-6 from today)
  { nombre: 'Daniel Rodriguez',   email: 'daniel.r@gmail.com',    telefono: '(714) 555-0101', direccion: '123 Main St, Irvine, CA',           zona: 1, travel_fee: 0,  vehiculo: 'Small Sedan',    paquete: 'Wash & Wax',         addons: [],                    fecha: dayOffset(0), hora: '8:00 AM',  total: 85,  status: 'confirmed' },
  { nombre: 'Sofia Martinez',     email: 'sofia.m@yahoo.com',     telefono: '(949) 555-0102', direccion: '456 Oak Ave, Newport Beach, CA',    zona: 2, travel_fee: 10, vehiculo: 'Mid-Size SUV',   paquete: 'Mini Detail',        addons: ['pet-hair'],          fecha: dayOffset(0), hora: '10:00 AM', total: 200, status: 'confirmed' },
  { nombre: 'James Wilson',       email: 'jwilson@outlook.com',   telefono: '(562) 555-0103', direccion: '789 Beach Blvd, Huntington Beach, CA', zona: 2, travel_fee: 10, vehiculo: 'Pickup Truck',   paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(0), hora: '12:00 PM', total: 65,  status: 'pending'   },
  { nombre: 'Emily Chen',         email: 'emily.chen@gmail.com',  telefono: '(714) 555-0104', direccion: '321 Elm St, Anaheim, CA',           zona: 1, travel_fee: 0,  vehiculo: 'Small Sedan',    paquete: 'Complete Detail',    addons: ['clay-bar'],          fecha: dayOffset(0), hora: '2:00 PM',  total: 315, status: 'confirmed' },
  { nombre: 'Marcus Johnson',     email: 'marcus.j@gmail.com',    telefono: '(909) 555-0105', direccion: '654 Pine Rd, Costa Mesa, CA',       zona: 1, travel_fee: 0,  vehiculo: 'Full-Size SUV',  paquete: 'Wash & Wax',         addons: [],                    fecha: dayOffset(1), hora: '9:00 AM',  total: 100, status: 'confirmed' },
  { nombre: 'Isabella Torres',    email: 'isa.torres@gmail.com',  telefono: '(949) 555-0106', direccion: '987 Laguna Rd, Laguna Beach, CA',   zona: 3, travel_fee: 20, vehiculo: 'Small Sedan',    paquete: 'Mini Detail',        addons: ['ozone-treatment'],   fecha: dayOffset(1), hora: '11:00 AM', total: 180, status: 'pending'   },
  { nombre: 'Ryan Thompson',      email: 'ryan.t@icloud.com',     telefono: '(714) 555-0107', direccion: '111 Harbor Blvd, Fullerton, CA',    zona: 1, travel_fee: 0,  vehiculo: 'Pickup Truck',   paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(1), hora: '1:00 PM',  total: 55,  status: 'confirmed' },
  { nombre: 'Natalie Kim',        email: 'natalie.k@gmail.com',   telefono: '(562) 555-0108', direccion: '222 Cherry St, Long Beach, CA',     zona: 2, travel_fee: 10, vehiculo: 'Mid-Size SUV',   paquete: 'Complete Detail',    addons: ['headlight-resto'],   fecha: dayOffset(1), hora: '3:00 PM',  total: 375, status: 'cancelled' },
  { nombre: 'Carlos Mendez',      email: 'carlos.m@gmail.com',    telefono: '(949) 555-0109', direccion: '333 Vista Dr, San Clemente, CA',    zona: 4, travel_fee: 35, vehiculo: 'Small Sedan',    paquete: 'Wash & Wax',         addons: [],                    fecha: dayOffset(2), hora: '8:00 AM',  total: 120, status: 'confirmed' },
  { nombre: 'Ashley Davis',       email: 'ashley.d@yahoo.com',    telefono: '(714) 555-0110', direccion: '444 Grove Ave, Orange, CA',         zona: 1, travel_fee: 0,  vehiculo: 'Full-Size SUV',  paquete: 'Mini Detail',        addons: ['pet-hair','clay-bar'],fecha: dayOffset(2), hora: '10:00 AM', total: 250, status: 'confirmed' },
  { nombre: 'Ethan Brown',        email: 'ethan.b@gmail.com',     telefono: '(909) 555-0111', direccion: '555 Summit Rd, Yorba Linda, CA',    zona: 2, travel_fee: 10, vehiculo: 'Pickup Truck',   paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(2), hora: '12:00 PM', total: 65,  status: 'pending'   },
  { nombre: 'Mia Garcia',         email: 'mia.garcia@gmail.com',  telefono: '(562) 555-0112', direccion: '666 Ocean View, Dana Point, CA',    zona: 3, travel_fee: 20, vehiculo: 'Small Sedan',    paquete: 'Complete Detail',    addons: [],                    fecha: dayOffset(2), hora: '2:00 PM',  total: 295, status: 'confirmed' },
  { nombre: 'Logan White',        email: 'logan.w@outlook.com',   telefono: '(949) 555-0113', direccion: '777 Pelican Dr, Aliso Viejo, CA',   zona: 2, travel_fee: 10, vehiculo: 'Mid-Size SUV',   paquete: 'Wash & Wax',         addons: ['ceramic-spray'],     fecha: dayOffset(3), hora: '9:00 AM',  total: 150, status: 'confirmed' },
  { nombre: 'Olivia Sanchez',     email: 'olivia.s@gmail.com',    telefono: '(714) 555-0114', direccion: '888 Brea Blvd, Brea, CA',           zona: 1, travel_fee: 0,  vehiculo: 'Small Sedan',    paquete: 'Mini Detail',        addons: [],                    fecha: dayOffset(3), hora: '11:00 AM', total: 150, status: 'pending'   },
  { nombre: 'Noah Anderson',      email: 'noah.a@icloud.com',     telefono: '(562) 555-0115', direccion: '999 Pacific St, Seal Beach, CA',    zona: 2, travel_fee: 10, vehiculo: 'Full-Size SUV',  paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(3), hora: '1:00 PM',  total: 75,  status: 'cancelled' },
  { nombre: 'Ava Lopez',          email: 'ava.lopez@gmail.com',   telefono: '(949) 555-0116', direccion: '100 Moulton Pkwy, Laguna Hills, CA',zona: 3, travel_fee: 20, vehiculo: 'Small Sedan',    paquete: 'Wash & Wax',         addons: ['ozone-treatment'],   fecha: dayOffset(4), hora: '8:00 AM',  total: 135, status: 'confirmed' },
  { nombre: 'Liam Harris',        email: 'liam.h@gmail.com',      telefono: '(714) 555-0117', direccion: '200 Tustin Ave, Tustin, CA',        zona: 1, travel_fee: 0,  vehiculo: 'Pickup Truck',   paquete: 'Complete Detail',    addons: [],                    fecha: dayOffset(4), hora: '10:00 AM', total: 295, status: 'confirmed' },
  { nombre: 'Emma Nguyen',        email: 'emma.n@yahoo.com',      telefono: '(562) 555-0118', direccion: '300 Westminster Ave, Westminster, CA',zona:2, travel_fee:10, vehiculo: 'Mid-Size SUV',   paquete: 'Mini Detail',        addons: ['engine-cleaning'],   fecha: dayOffset(4), hora: '12:00 PM', total: 210, status: 'pending'   },
  { nombre: 'Jackson Lee',        email: 'jack.lee@gmail.com',    telefono: '(909) 555-0119', direccion: '400 Yorba Linda Blvd, Placentia, CA',zona:1, travel_fee: 0, vehiculo: 'Small Sedan',    paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(5), hora: '9:00 AM',  total: 50,  status: 'confirmed' },
  { nombre: 'Chloe Robinson',     email: 'chloe.r@gmail.com',     telefono: '(949) 555-0120', direccion: '500 Ortega Hwy, San Juan Capistrano, CA', zona: 4, travel_fee: 35, vehiculo: 'Full-Size SUV', paquete: 'Wash & Wax', addons: ['clay-bar'],          fecha: dayOffset(5), hora: '11:00 AM', total: 180, status: 'confirmed' },

  // ── NEXT WEEK ──────────────────────────────────────────────────────────────
  { nombre: 'Aiden Clark',        email: 'aiden.c@outlook.com',   telefono: '(714) 555-0121', direccion: '600 Chapman Ave, Garden Grove, CA', zona: 1, travel_fee: 0,  vehiculo: 'Pickup Truck',   paquete: 'Mini Detail',        addons: [],                    fecha: dayOffset(7), hora: '8:00 AM',  total: 165, status: 'confirmed' },
  { nombre: 'Ella Walker',        email: 'ella.w@gmail.com',      telefono: '(562) 555-0122', direccion: '700 Atlantic Ave, Long Beach, CA',  zona: 2, travel_fee: 10, vehiculo: 'Small Sedan',    paquete: 'Complete Detail',    addons: ['ceramic-spray'],     fecha: dayOffset(7), hora: '10:00 AM', total: 320, status: 'pending'   },
  { nombre: 'Sebastian Hall',     email: 'seb.hall@gmail.com',    telefono: '(949) 555-0123', direccion: '800 Crown Valley, Mission Viejo, CA',zona:3, travel_fee: 20, vehiculo: 'Mid-Size SUV',   paquete: 'Wash & Wax',         addons: [],                    fecha: dayOffset(8), hora: '9:00 AM',  total: 115, status: 'confirmed' },
  { nombre: 'Grace Young',        email: 'grace.y@icloud.com',    telefono: '(714) 555-0124', direccion: '900 Katella Ave, Anaheim, CA',      zona: 1, travel_fee: 0,  vehiculo: 'Small Sedan',    paquete: 'Mini Detail',        addons: ['pet-hair'],          fecha: dayOffset(8), hora: '11:00 AM', total: 175, status: 'confirmed' },
  { nombre: 'Owen Allen',         email: 'owen.a@yahoo.com',      telefono: '(562) 555-0125', direccion: '150 Lakewood Blvd, Lakewood, CA',   zona: 2, travel_fee: 10, vehiculo: 'Full-Size SUV',  paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(9), hora: '8:00 AM',  total: 75,  status: 'pending'   },
  { nombre: 'Lily Scott',         email: 'lily.scott@gmail.com',  telefono: '(949) 555-0126', direccion: '250 El Toro Rd, Lake Forest, CA',   zona: 3, travel_fee: 20, vehiculo: 'Small Sedan',    paquete: 'Wash & Wax',         addons: ['headlight-resto'],   fecha: dayOffset(9), hora: '10:00 AM', total: 155, status: 'confirmed' },
  { nombre: 'Lucas King',         email: 'lucas.k@gmail.com',     telefono: '(714) 555-0127', direccion: '350 Brookhurst St, Fountain Valley, CA', zona:1, travel_fee:0, vehiculo: 'Pickup Truck',  paquete: 'Complete Detail',    addons: ['engine-cleaning'],   fecha: dayOffset(10), hora: '9:00 AM', total: 330, status: 'confirmed' },
  { nombre: 'Zoe Wright',         email: 'zoe.w@outlook.com',     telefono: '(562) 555-0128', direccion: '450 Bellflower Blvd, Bellflower, CA',zona:2, travel_fee: 10, vehiculo: 'Mid-Size SUV',   paquete: 'Mini Detail',        addons: [],                    fecha: dayOffset(10), hora: '11:00 AM',total: 185, status: 'pending'   },
  { nombre: 'Henry Adams',        email: 'henry.a@gmail.com',     telefono: '(949) 555-0129', direccion: '550 Trabuco Rd, Rancho Santa Margarita, CA', zona:4, travel_fee:35, vehiculo:'Full-Size SUV', paquete:'Wash & Wax', addons:['clay-bar','ceramic-spray'], fecha: dayOffset(11), hora:'10:00 AM',total: 200, status: 'confirmed' },
  { nombre: 'Aria Flores',        email: 'aria.f@gmail.com',      telefono: '(714) 555-0130', direccion: '650 Magnolia Ave, Corona, CA',      zona: 4, travel_fee: 35, vehiculo: 'Small Sedan',    paquete: 'Super Wash',         addons: [],                    fecha: dayOffset(12), hora: '8:00 AM', total: 85,  status: 'pending'   },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🗑  Clearing existing demo bookings (keeping real ones)...');
    // Only delete if email matches our demo pattern to avoid deleting real bookings
    await client.query(`DELETE FROM bookings WHERE email LIKE '%@gmail.com' OR email LIKE '%@yahoo.com' OR email LIKE '%@outlook.com' OR email LIKE '%@icloud.com'`);

    console.log(`📥  Inserting ${BOOKINGS.length} demo bookings...`);
    for (const b of BOOKINGS) {
      await client.query(
        `INSERT INTO bookings
           (nombre, email, telefono, direccion, zona, travel_fee,
            vehiculo, paquete, addons, fecha, hora, total, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [b.nombre, b.email, b.telefono, b.direccion, b.zona, b.travel_fee,
         b.vehiculo, b.paquete, b.addons, b.fecha, b.hora, b.total, b.status]
      );
    }
    console.log(`✅  Done! ${BOOKINGS.length} demo bookings inserted.`);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
