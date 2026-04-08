// Shine Pro – i18n translations (EN primary / ES secondary)
const translations = {
  en: {
    nav: {
      services: 'Services',
      packages: 'Packages',
      results: 'Results',
      reviews: 'Reviews',
      locations: 'Locations',
      about: 'About',
      contact: 'Contact',
      bookNow: 'Book Now',
      tagline: 'MOBILE AUTO SPA',
    },
    hero: {
      badge: "Orange County's Elite Detailing Service",
      title: 'Restoring The',
      titleSpan: 'Ultimate Shine',
      subtitle: 'Experience showroom results at your doorstep. We bring world-class precision and premium care to your home or office.',
      cta: 'Book My Detail',
      ctaSecondary: 'See Packages',
      stats: {
        clients: 'Happy Clients',
        years: 'Years of Service',
        rating: 'Average Rating',
        areas: 'Service Areas',
      }
    },
    services: {
      badge: 'Expertise',
      title: 'Specialized',
      titleSpan: 'Care Treatments',
      subtitle: 'Tailored solutions using advanced steam technology and premium Meguiar\'s products to protect your investment.',
      items: {
        exterior: { title: 'Exterior Detailing', desc: '100% Hand Wash · Meguiar\'s Premium Products · Clay Bar Treatment · Buff & Polish · Trim Shine' },
        interior: { title: 'Interior Detailing', desc: 'Vacuum · Interior Steam Cleaning · Dashboard & Seats · Professional Leather treatment' },
        engine: { title: 'Engine Service', desc: 'Degrease · Rinse · Blow Dry · Plastic Shine & Protection' },
        headlights: { title: 'Headlight Restoration', desc: 'Wet Sanding · Compound Buff · UV Protection Coat' },
      }
    },
    packages: {
      badge: 'Choose Your Package',
      title: 'Transparent',
      titleSpan: 'Pricing',
      subtitle: 'Flat rates based on vehicle size. No hidden fees. 100% satisfaction guaranteed.',
      vehicleTabs: { small_sedan: 'Small Sedan', small_pickup: 'Small Pickup/Suv', mid_size: 'Mid Size Truck/Suv', full_size: 'Full Size Vehicle' },
      popular: 'Most Popular',
      bookBtn: 'Book Now',
      minimumNote: (n) => `Minimum ${n} services per trip`,
      startsAt: 'Starts at',
      data: {
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
      }
    },
    testimonials: {
      badge: 'Reviews',
      title: 'What Our Clients',
      titleSpan: 'Say',
      list: [
        { name: 'Alex Thompson', rating: 5, text: 'The Shine Pro team is incredible. My Mercedes looks like it just came off the showroom floor. Highly recommended!', location: 'Newport Beach, CA', carImg: '/reviews/car1.png', avatar: '/reviews/alex.png' },
        { name: 'Sofia Rodriguez', rating: 5, text: 'I am very picky about who touches my car. They handled my Porsche with extreme care and precision. 10/10.', location: 'Irvine, CA', carImg: '/reviews/car2.png', avatar: '/reviews/sofia.png' },
        { name: 'David Miller', rating: 5, text: 'Best mobile car wash in OC. So convenient to have them come right to my office while I work.', location: 'Costa Mesa, CA', carImg: '/reviews/car3.png', avatar: '/reviews/david.png' },
        { name: 'Elena Garcia', rating: 5, text: 'Their interior steam cleaning is a game changer. It looks and smells brand new again. Simply amazing.', location: 'Orange, CA', carImg: '/reviews/car4.png' },
        { name: 'Michael Chen', rating: 5, text: 'The eco-friendly products are a huge plus. My Tesla is glowing, and I feel good about the environment.', location: 'Laguna Beach, CA', carImg: '/reviews/car5.png' },
        { name: 'Sarah Jenkins', rating: 5, text: 'Punctual, professional, and very thorough. They really live up to the name Shine Pro.', location: 'Huntington Beach, CA', carImg: '/reviews/car6.png' },
        { name: 'Julian Foster', rating: 5, text: "Truly premium service for luxury vehicles. I wouldn't trust my car with anyone else in the area.", location: 'Newport Coast, CA', carImg: '/reviews/car7.png' },
      ]
    },
    about: {
      badge: 'About Shine Pro',
      title: 'We Bring The',
      titleSpan: 'Car Wash To You',
      desc1: 'Shine Pro is a family-owned and operated mobile detailing service in Orange County. Since 2020, we\'ve been delivering top-quality car care directly to your driveway, office, or anywhere that\'s convenient for you.',
      desc2: 'We use only biodegradable, eco-friendly products and professional-grade equipment, including steam cleaning, to make your car look its absolute best.',
      values: {
        eco: { title: 'Eco-Friendly', desc: 'Biodegradable products safe for the environment.' },
        quality: { title: 'Premium Quality', desc: 'Professional equipment and trusted brands.' },
        convenient: { title: 'Ultra Convenient', desc: 'We come to your home, office, or anywhere.' },
        trusted: { title: 'Trusted & Reliable', desc: 'Valued belongings always respected.' },
      }
    },
    contact: {
      badge: 'Get In Touch',
      title: 'Contact',
      titleSpan: 'Us',
      phone: 'Phone',
      email: 'Email',
      location: 'Service Area',
      locationValue: 'Orange County, CA',
      hours: 'Hours',
      hoursValue: 'Mon–Sat: 7am–5pm',
      bannerTitle: 'READY FOR A SPOTLESS CAR?',
      bannerSubtitle: 'Book in minutes – we come to you anywhere in Orange County.',
    },
    footer: {
      nav: 'Navigation',
      contact: 'Contact',
      location: 'Location',
      tagline: 'Family owned & operated mobile detailing service.',
      rights: '© 2026 Shine Pro. All Rights Reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      termsApply: '*Terms and conditions apply',
      mapBtn: 'MAPS',
      serviceArea: 'Full Mobile Service Coverage',
      followUs: 'Follow us on:',
      madeWith: 'Made by HD Impulso Digital',
    },
    legal: {
      title: 'Legal Information',
      subtitle: 'Privacy Policy & Terms of Service',
      lastUpdated: 'Last Updated: April 2026',
      
      // Privacy Policy Expanded
      privacyTitle: 'Privacy Policy',
      privacyIntro: 'At Shine Pro, your privacy is a priority. This detailed policy outlines our commitment to protecting the personal data of our Orange County clients when using our mobile detailing services.',
      dataCollection: '1. Information We Collect',
      dataCollectionDesc: 'We securely collect personal identifiers including your full name, email, phone number, and precise service address. This data is exclusively used for booking confirmation, real-time service updates, and billing through our secure platform.',
      ccpa: '2. California Privacy Rights (CCPA)',
      ccpaDesc: 'Under the California Consumer Privacy Act, you have the right to know what personal data we collect, why we collect it, and the right to request deletion. We explicitly state that Shine Pro NEVER sells, rents, or trades your personal information to third-party data brokers.',
      cookies: '3. Digital Experience & Cookies',
      cookiesDesc: 'Our website utilizes essential session cookies to maintain your bilingual preferences and ensure the integrity of the multi-step booking process. We may also use analytical cookies to improve our digital user experience.',
      dataRetention: '4. Data Retention & Security',
      dataRetentionDesc: 'Client data is stored for the duration of the service relationship and as required by local tax regulations. We use industry-standard encryption for all digital transactions and data storage.',

      // Terms of Service Expanded
      termsTitle: 'Terms & Conditions',
      termsIntro: 'By scheduling a service with Shine Pro, you acknowledge and agree to these Terms and Conditions. These policies are designed to ensure safety, quality, and mutual respect between our team and our valued clients.',
      cancellations: '1. Appointments & Cancellations',
      cancellationsDesc: 'A minimum of 24-hour notice is required for any cancellation or rescheduling. Appointments cancelled with less than 24-hour notice may be subject to a $40 "Late Cancellation" fee. If weather conditions (rain, storm) make outdoor detailing impossible, we will reach out to reschedule at no additional cost to you.',
      conditionTitle: '2. Vehicle Condition & Pricing',
      conditionDesc: 'Our listed prices are base rates for vehicles in "standard" maintainable condition. Should a vehicle require extra intensive labor due to excessive pet hair, deep biological stains (mold/vomit), sand, or construction grime, a surcharge will be applied upon inspection (typically ranging from $25 to $120) to cover the extra time and chemicals required.',
      travelTitle: '3. Service Area & Logistics',
      travelDesc: 'We provide full mobile coverage across Orange County. Locations outside our primary zone may incur a travel fee based on mileage ($1.50 per additional mile). Clients must provide a safe work site with at least 5 feet of clearance around the vehicle and a legal parking spot for our service van.',
      liabilityTitle: '4. Liability & Presiding Conditions',
      liabilityDesc: 'Shine Pro is not responsible for pre-existing damage, loose trim, or oxidized paint that may react to standard cleaning. A pre-service inspection is performed. Any claims regarding the service must be submitted within 24 hours of completion for resolution.',
    },
    comparison: {
      badge: 'Deep Cleaning',
      title: 'Remarkable',
      titleSpan: 'Transformations',
      subtitle: 'See the power of our deep steam cleaning. We safely remove years of dirt, grime and stains from any surface.',
      visibleResults: 'Visible Results',
      effortRequired: 'Effort Required',
      labels: { before: 'Before', after: 'After' }
    },
    locations: {
      badge: 'Locations',
      title: 'We service',
      titleSpan: 'Orange County & Inland Empire',
      subtitle: 'We deliver our premium detailing services right to your doorstep across Orange County and the Inland Empire. Total convenience without leaving home.',
      areas: [
        { city: 'Newport Beach', zip: 'CA 92660' },
        { city: 'Irvine', zip: 'CA 92606' },
        { city: 'Costa Mesa', zip: 'CA 92626' },
        { city: 'Orange', zip: 'CA 92867' }
      ]
    },
    chat: {
      greeting: 'Hi! 👋 I\'m Shine, your personal detailing assistant. How can I help you today?',
      placeholder: 'Type your message...',
      send: 'Send',
    }
  },
  es: {
    nav: {
      services: 'Servicios',
      packages: 'Paquetes',
      results: 'Resultados',
      reviews: 'Reseñas',
      locations: 'Ubicaciones',
      about: 'Nosotros',
      contact: 'Contacto',
      bookNow: 'Reservar Ahora',
      tagline: 'SPA AUTOMOTRIZ MÓVIL',
    },
    hero: {
      badge: 'Detallado de Élite en Orange County',
      title: 'Restauramos El',
      titleSpan: 'Brillo De Tu Auto',
      subtitle: 'Resultados de exhibición en la comodidad de tu hogar. Llevamos precisión de clase mundial y cuidado premium a tu puerta.',
      cta: 'Reservar Mi Cita',
      ctaSecondary: 'Ver Paquetes',
      stats: {
        clients: 'Clientes Felices',
        years: 'Años de Servicio',
        rating: 'Calificación Promedio',
        areas: 'Zonas de Servicio',
      }
    },
    services: {
      badge: 'Lo Que Hacemos',
      title: 'Servicios Profesionales',
      titleSpan: 'A Tu Puerta',
      subtitle: 'Todos los servicios en la comodidad de tu hogar u oficina en todo Orange County.',
      items: {
        exterior: { title: 'Detallado Exterior', desc: 'Lavado a Mano 100% · Productos Premium Meguiar\'s · Tratamiento Clay Bar · Pulido · Brillo de Molduras' },
        interior: { title: 'Detallado Interior', desc: 'Aspirado · Limpieza a Vapor Profunda · Tablero y Asientos · Tratamiento Profesional de Cuero' },
        engine: { title: 'Servicio de Motor', desc: 'Desengrasado · Enjuague · Secado · Brillo y Protección de Plásticos' },
        headlights: { title: 'Restauración de Faros', desc: 'Lijado Húmedo · Pulido · Capa de Protección UV' },
      }
    },
    packages: {
      badge: 'Elige Tu Paquete',
      title: 'Precios',
      titleSpan: 'Transparentes',
      subtitle: 'Precios fijos según el tamaño del vehículo. Sin costos ocultos. Satisfacción garantizada.',
      vehicleTabs: { small_sedan: 'Sedan Pequeño', small_pickup: 'Pickup Pequeño/SUV', mid_size: 'Mid Size Truck/Suv', full_size: 'Vehículo Grande' },
      popular: 'Más Popular',
      bookBtn: 'Reservar Ahora',
      minimumNote: (n) => `Mínimo ${n} servicios por visita`,
      startsAt: 'Desde',
      data: {
        small_sedan: [
          { id: 'super-wash', name: 'Super Wash', price: 50, duration: '45 min', popular: false, minimum: 3, features: ['Lavado manual exterior','Aspirado','Limpieza de ventanas int/ext','Limpieza de superficies interior','Limpieza de marcos de puertas','Limpieza de rines','Acondicionador de llantas'] },
          { id: 'wash-and-wax', name: 'Wash & Wax', price: 85, duration: '75 min', popular: true, minimum: 2, features: ['Todo lo de Super Wash','Cera en crema con pulidora D/A','Brillo extra y protección de pintura'] },
          { id: 'mini-detail', name: 'Mini Detail', price: 150, duration: '90 min', popular: false, minimum: 1, features: ['Todo lo de Wash & Wax','Capa de cera express','Tratamiento de cuero (tablero y consola)','Lavado de tapetes'] },
          { id: 'complete-detail', name: 'Complete Detail', price: 275, duration: '120 min', popular: false, minimum: 1, startsAt: true, features: ['Todo lo de Mini Detail','Limpieza interior a vapor','Sanitización completa','Protección UV para cuero/vinilo','Tratamiento exterior con Clay Bar','Capa de cera final Meguiars'] },
        ],
        small_pickup: [
          { id: 'super-wash', name: 'Super Wash', price: 60, duration: '50 min', popular: false, minimum: 3, features: ['Lavado manual exterior','Aspirado','Limpieza de ventanas int/ext','Limpieza de superficies interior','Limpieza de marcos de puertas','Limpieza de rines','Acondicionador de llantas'] },
          { id: 'wash-and-wax', name: 'Wash & Wax', price: 100, duration: '80 min', popular: true, minimum: 2, features: ['Todo lo de Super Wash','Cera en crema con pulidora D/A','Brillo extra y protección de pintura'] },
          { id: 'mini-detail', name: 'Mini Detail', price: 175, duration: '100 min', popular: false, minimum: 1, features: ['Todo lo de Wash & Wax','Capa de cera express','Tratamiento de cuero (tablero y consola)','Lavado de tapetes'] },
          { id: 'complete-detail', name: 'Complete Detail', price: 300, duration: '130 min', popular: false, minimum: 1, startsAt: true, features: ['Todo lo de Mini Detail','Limpieza interior a vapor','Sanitización completa','Protección UV para cuero/vinilo','Tratamiento exterior con Clay Bar','Capa de cera final Meguiars'] },
        ],
        mid_size: [
          { id: 'super-wash', name: 'Super Wash', price: 70, duration: '55 min', popular: false, minimum: 3, features: ['Lavado manual exterior','Aspirado','Limpieza de ventanas int/ext','Limpieza de superficies interior','Limpieza de marcos de puertas','Limpieza de rines','Acondicionador de llantas'] },
          { id: 'wash-and-wax', name: 'Wash & Wax', price: 120, duration: '90 min', popular: true, minimum: 2, features: ['Todo lo de Super Wash','Cera en crema con pulidora D/A','Brillo extra y protección de pintura'] },
          { id: 'mini-detail', name: 'Mini Detail', price: 200, duration: '110 min', popular: false, minimum: 1, features: ['Todo lo de Wash & Wax','Capa de cera express','Tratamiento de cuero (tablero y consola)','Lavado de tapetes'] },
          { id: 'complete-detail', name: 'Complete Detail', price: 325, duration: '150 min', popular: false, minimum: 1, startsAt: true, features: ['Todo lo de Mini Detail','Limpieza interior a vapor','Sanitización completa','Protección UV para cuero/vinilo','Tratamiento exterior con Clay Bar','Capa de cera final Meguiars'] },
        ],
        full_size: [
          { id: 'super-wash', name: 'Super Wash', price: 80, duration: '60 min', popular: false, minimum: 3, features: ['Lavado manual exterior','Aspirado','Limpieza de ventanas int/ext','Limpieza de superficies interior','Limpieza de marcos de puertas','Limpieza de rines','Acondicionador de llantas'] },
          { id: 'wash-and-wax', name: 'Wash & Wax', price: 140, duration: '100 min', popular: true, minimum: 2, features: ['Todo lo de Super Wash','Cera en crema con pulidora D/A','Brillo extra y protección de pintura'] },
          { id: 'mini-detail', name: 'Mini Detail', price: 225, duration: '130 min', popular: false, minimum: 1, features: ['Todo lo de Wash & Wax','Capa de cera express','Tratamiento de cuero (tablero y consola)','Lavado de tapetes'] },
          { id: 'complete-detail', name: 'Complete Detail', price: 350, duration: '180 min', popular: false, minimum: 1, startsAt: true, features: ['Todo lo de Mini Detail','Limpieza interior a vapor','Sanitización completa','Protección UV para cuero/vinilo','Tratamiento exterior con Clay Bar','Capa de cera final Meguiars'] },
        ]
      }
    },
    testimonials: {
      badge: 'Reseñas',
      title: 'Lo Que Dicen',
      titleSpan: 'Nuestros Clientes',
      list: [
        { name: 'Alex Thompson', rating: 5, text: 'El equipo de Shine Pro es increíble. Mi Mercedes parece recién salido del concesionario. ¡Muy recomendados!', location: 'Newport Beach, CA', carImg: '/reviews/car1.png', avatar: '/reviews/alex.png' },
        { name: 'Sofia Rodriguez', rating: 5, text: 'Soy muy exigente con quién toca mi auto. Manejaron mi Porsche con extremo cuidado y precisión. 10/10.', location: 'Irvine, CA', carImg: '/reviews/car2.png', avatar: '/reviews/sofia.png' },
        { name: 'David Miller', rating: 5, text: 'El mejor lavado móvil en OC. Es genial que vengan directamente a mi oficina mientras trabajo.', location: 'Costa Mesa, CA', carImg: '/reviews/car3.png', avatar: '/reviews/david.png' },
        { name: 'Elena Garcia', rating: 5, text: 'Su limpieza a vapor en el interior fue increíble. Huele y se siente como nuevo otra vez. Simplemente asombroso.', location: 'Orange, CA', carImg: '/reviews/car4.png' },
        { name: 'Michael Chen', rating: 5, text: 'Los productos ecológicos son un gran plus. Mi Tesla brilla y me siento bien con el medio ambiente.', location: 'Laguna Beach, CA', carImg: '/reviews/car5.png' },
        { name: 'Sarah Jenkins', rating: 5, text: 'Puntuales, profesionales y muy detallistas. Realmente hacen honor al nombre Shine Pro.', location: 'Huntington Beach, CA', carImg: '/reviews/car6.png' },
        { name: 'Julian Foster', rating: 5, text: 'Un servicio verdaderamente premium para vehículos de lujo. No confiaría mi auto a nadie más en la zona.', location: 'Newport Coast, CA', carImg: '/reviews/car7.png' },
      ]
    },
    about: {
      badge: 'Sobre Shine Pro',
      title: 'Llevamos El',
      titleSpan: 'Lavado A Ti',
      desc1: 'Shine Pro es el servicio premium de detallado móvil de Orange County. Desde 2020, llevamos cuidado de alta calidad directamente a tu entrada, oficina o donde te sea más conveniente.',
      desc2: 'Usamos solo productos biodegradables y ecológicos con equipo profesional para que tu auto luzca espectacular.',
      values: {
        eco: { title: 'Ecológico', desc: 'Productos biodegradables seguros para el ambiente.' },
        quality: { title: 'Calidad Premium', desc: 'Equipo profesional y marcas reconocidas.' },
        convenient: { title: 'Ultra Conveniente', desc: 'Vamos a tu hogar, oficina o donde sea.' },
        trusted: { title: 'Confiable', desc: 'Tus pertenencias siempre son respetadas.' },
      }
    },
    contact: {
      badge: 'Comunícate',
      title: 'Contáctanos',
      titleSpan: '',
      phone: 'Teléfono',
      email: 'Correo',
      location: 'Área de Servicio',
      locationValue: 'Orange County, CA',
      hours: 'Horario',
      hoursValue: 'Lun–Sáb: 7am–5pm',
      bannerTitle: '¿LISTO PARA UN AUTO IMPECABLE?',
      bannerSubtitle: 'Reserva en minutos – vamos a ti en cualquier lugar de Orange County.',
    },
    footer: {
      nav: 'Navegación',
      contact: 'Contacto',
      location: 'Ubicación',
      tagline: 'Negocio familiar de detallado móvil premium.',
      rights: '© 2026 Shine Pro. Todos los Derechos Reservados.',
      privacy: 'Aviso de Privacidad',
      terms: 'Términos y Condiciones',
      termsApply: '*Aplican términos y condiciones',
      mapBtn: 'MAPA',
      serviceArea: 'Cobertura Total de Servicio Móvil',
      followUs: 'Sígenos en:',
      madeWith: 'Hecho por HD Impulso Digital',
    },
    legal: {
      title: 'Información Legal',
      subtitle: 'Aviso de Privacidad y Términos',
      lastUpdated: 'Última actualización: Abril 2026',
      
      // Aviso de Privacidad Extendido
      privacyTitle: 'Aviso de Privacidad',
      privacyIntro: 'En Shine Pro, su privacidad es nuestra prioridad. Esta política detallada describe nuestro compromiso con la protección de los datos personales de nuestros clientes en Orange County al utilizar nuestros servicios de detallado móvil.',
      dataCollection: '1. Información que Recopilamos',
      dataCollectionDesc: 'Recopilamos de forma segura identificadores personales que incluyen su nombre completo, correo electrónico, número de teléfono y dirección exacta del servicio. Estos datos se utilizan exclusivamente para la confirmación de citas, actualizaciones del servicio en tiempo real y facturación a través de nuestra plataforma segura.',
      ccpa: '2. Derechos de Privacidad en California (CCPA)',
      ccpaDesc: 'Bajo la Ley de Privacidad del Consumidor de California, usted tiene derecho a saber qué datos recopilamos, por qué los recopilamos y el derecho a solicitar su eliminación. Shine Pro NUNCA vende, alquila ni comercializa su información personal con terceros.',
      cookies: '3. Experiencia Digital y Cookies',
      cookiesDesc: 'Nuestro sitio web utiliza cookies de sesión esenciales para mantener sus preferencias de idioma y asegurar la integridad del proceso de reserva. También podemos usar cookies analíticas para mejorar nuestra experiencia de usuario digital.',
      dataRetention: '4. Seguridad y Retención de Datos',
      dataRetentionDesc: 'Los datos de los clientes se almacenan durante la relación de servicio y según lo exijan las regulaciones fiscales locales. Utilizamos cifrado estándar para todas las transacciones digitales y el almacenamiento de datos.',

      // Términos y Condiciones Extendido
      termsTitle: 'Términos y Condiciones',
      termsIntro: 'Al programar un servicio con Shine Pro, usted reconoce y acepta estos Términos y Condiciones. Estas políticas están diseñadas para garantizar la seguridad, la calidad y el respeto mutuo entre nuestro equipo y nuestros valiosos clientes.',
      cancellations: '1. Citas y Cancelaciones',
      cancellationsDesc: 'Se requiere un aviso mínimo de 24 horas para cualquier cancelación o cambio de fecha. Las citas canceladas con menos de 24 horas pueden estar sujetas a una tarifa de "Cancelación Tardía" de $40. Si las condiciones climáticas (lluvia, tormenta) hacen imposible el detallado, reprogramaremos sin costo adicional.',
      conditionTitle: '2. Condición del Vehículo y Precios',
      conditionDesc: 'Nuestros precios listados son tarifas base para vehículos en condición "estándar". Si un vehículo requiere un trabajo extra intensivo debido a exceso de pelo de mascota, manchas biológicas (moho/vómito), arena profunda o lodo extremo, se aplicará un recargo tras la inspección (típicamente entre $25 y $120) para cubrir el tiempo y químicos extra.',
      travelTitle: '3. Área de Servicio y Logística',
      travelDesc: 'Brindamos cobertura móvil completa en todo Orange County. Las ubicaciones fuera de nuestra zona principal pueden incurrir en un cargo de viaje basado en el millaje ($1.50 por milla adicional). El cliente debe proporcionar un sitio de trabajo seguro con al menos 5 pies de espacio alrededor del vehículo y un lugar de estacionamiento legal.',
      liabilityTitle: '4. Responsabilidad y Daños Previos',
      liabilityDesc: 'Shine Pro no se hace responsable por daños preexistentes, molduras sueltas o pintura oxidada que pueda reaccionar a la limpieza estándar. Se realiza una inspección previa al servicio. Cualquier reclamo debe presentarse dentro de las 24 horas posteriores a la finalización para su resolución.',
    },
    comparison: {
      badge: 'Limpieza Profunda',
      title: 'Transformaciones',
      titleSpan: 'Asombrosas',
      subtitle: 'Mira el poder de nuestro detallado a vapor. Eliminamos años de suciedad y manchas de cualquier superficie de forma segura.',
      visibleResults: 'Resultados Visibles',
      effortRequired: 'Esfuerzo Requerido',
      labels: { before: 'Antes', after: 'Después' }
    },
    locations: {
      badge: 'Ubicaciones',
      title: 'Damos servicio en',
      titleSpan: 'Orange County y Inland Empire',
      subtitle: 'Ofrecemos servicios de detallado premium directamente en tu puerta en Orange County y Inland Empire. Comodidad total sin moverte de casa.',
      areas: [
        { city: 'Newport Beach', zip: 'CA 92660' },
        { city: 'Irvine', zip: 'CA 92606' },
        { city: 'Costa Mesa', zip: 'CA 92626' },
        { city: 'Orange', zip: 'CA 92867' }
      ]
    },
    chat: {
      greeting: '¡Hola! 👋 Soy Shine, tu asistente de detallado. ¿Cómo puedo ayudarte hoy?',
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
    }
  }
};

export default translations;


