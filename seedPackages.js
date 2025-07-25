const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp({
  credential: applicationDefault(),
  projectId: 'menderapp-8ddf3', // Replace with your project ID if different
});

const db = getFirestore();

const packages = [
  // SPRING
  {
    title: 'Spring Essentials',
    description: 'Get your home ready for the new season with our essential spring maintenance.',
    price: 199,
    season: 'Spring',
    tier: 'Essentials',
    startDate: new Date('2024-03-19'),
    endDate: new Date('2024-06-20'),
    services: ['Gutter cleaning', 'Window washing', 'HVAC filter replacement', 'Lawn fertilization'],
    active: true,
  },
  {
    title: 'Spring Deluxe',
    description: 'A deluxe package for a fresh start to spring.',
    price: 299,
    season: 'Spring',
    tier: 'Deluxe',
    startDate: new Date('2024-03-19'),
    endDate: new Date('2024-06-20'),
    services: ['Gutter cleaning', 'Window washing', 'HVAC filter replacement', 'Lawn fertilization', 'Power washing siding', 'Deck cleaning', 'Garden bed prep'],
    active: true,
  },
  {
    title: 'Spring Premium',
    description: 'The ultimate spring refresh for your home.',
    price: 399,
    season: 'Spring',
    tier: 'Premium',
    startDate: new Date('2024-03-19'),
    endDate: new Date('2024-06-20'),
    services: ['Gutter cleaning', 'Window washing', 'HVAC filter replacement', 'Lawn fertilization', 'Power washing siding', 'Deck cleaning', 'Garden bed prep', 'Roof inspection', 'Minor exterior repairs', 'Driveway cleaning'],
    active: true,
  },
  {
    title: 'Spring Allergy Relief',
    description: 'Reduce allergens and breathe easy this spring.',
    price: 249,
    season: 'Spring',
    tier: 'Special',
    startDate: new Date('2024-03-19'),
    endDate: new Date('2024-06-20'),
    services: ['Duct cleaning', 'Deep carpet cleaning', 'Window screen cleaning', 'Air purifier install'],
    active: true,
  },
  // SUMMER
  {
    title: 'Summer Essentials',
    description: 'Keep your home cool and safe all summer long.',
    price: 199,
    season: 'Summer',
    tier: 'Essentials',
    startDate: new Date('2024-06-21'),
    endDate: new Date('2024-09-21'),
    services: ['AC tune-up', 'Window screen repair', 'Deck sealing', 'Pest inspection'],
    active: true,
  },
  {
    title: 'Summer Deluxe',
    description: 'Enjoy summer with a worry-free home.',
    price: 299,
    season: 'Summer',
    tier: 'Deluxe',
    startDate: new Date('2024-06-21'),
    endDate: new Date('2024-09-21'),
    services: ['AC tune-up', 'Window screen repair', 'Deck sealing', 'Pest inspection', 'Outdoor furniture cleaning', 'Fence/gate check', 'Irrigation system check'],
    active: true,
  },
  {
    title: 'Summer Premium',
    description: 'The best summer care for your home and yard.',
    price: 399,
    season: 'Summer',
    tier: 'Premium',
    startDate: new Date('2024-06-21'),
    endDate: new Date('2024-09-21'),
    services: ['AC tune-up', 'Window screen repair', 'Deck sealing', 'Pest inspection', 'Outdoor furniture cleaning', 'Fence/gate check', 'Irrigation system check', 'Pool cleaning', 'Exterior paint touch-up', 'Tree/shrub trimming'],
    active: true,
  },
  {
    title: 'Summer Entertainer',
    description: 'Get your home ready for summer gatherings.',
    price: 249,
    season: 'Summer',
    tier: 'Special',
    startDate: new Date('2024-06-21'),
    endDate: new Date('2024-09-21'),
    services: ['Patio cleaning', 'Grill cleaning', 'Outdoor lighting check', 'Mosquito treatment'],
    active: true,
  },
  // FALL
  {
    title: 'Fall Essentials',
    description: 'Prepare your home for the colder months ahead.',
    price: 199,
    season: 'Fall',
    tier: 'Essentials',
    startDate: new Date('2024-09-22'),
    endDate: new Date('2024-12-20'),
    services: ['Gutter clean-out', 'Roof clearing', 'Winterizing hose bibs', 'Furnace filter change'],
    active: true,
  },
  {
    title: 'Fall Deluxe',
    description: 'Deluxe fall maintenance for peace of mind.',
    price: 299,
    season: 'Fall',
    tier: 'Deluxe',
    startDate: new Date('2024-09-22'),
    endDate: new Date('2024-12-20'),
    services: ['Gutter clean-out', 'Roof clearing', 'Winterizing hose bibs', 'Furnace filter change', 'Chimney sweep', 'Window caulking', 'Leaf removal'],
    active: true,
  },
  {
    title: 'Fall Premium',
    description: 'Complete fall protection for your home.',
    price: 399,
    season: 'Fall',
    tier: 'Premium',
    startDate: new Date('2024-09-22'),
    endDate: new Date('2024-12-20'),
    services: ['Gutter clean-out', 'Roof clearing', 'Winterizing hose bibs', 'Furnace filter change', 'Chimney sweep', 'Window caulking', 'Leaf removal', 'Attic insulation check', 'Weatherstripping doors', 'Driveway sealing'],
    active: true,
  },
  {
    title: 'Fall Storm Prep',
    description: 'Be ready for fall storms and heavy rain.',
    price: 249,
    season: 'Fall',
    tier: 'Special',
    startDate: new Date('2024-09-22'),
    endDate: new Date('2024-12-20'),
    services: ['Sump pump test', 'Basement check', 'Tree limb removal', 'Emergency kit setup'],
    active: true,
  },
  // WINTER
  {
    title: 'Winter Essentials',
    description: 'Keep your home safe and warm this winter.',
    price: 199,
    season: 'Winter',
    tier: 'Essentials',
    startDate: new Date('2024-12-21'),
    endDate: new Date('2025-03-18'),
    services: ['Pipe insulation', 'Door/window draft check', 'Smoke/CO detector test', 'Snow removal plan'],
    active: true,
  },
  {
    title: 'Winter Deluxe',
    description: 'Deluxe winterization for your home.',
    price: 299,
    season: 'Winter',
    tier: 'Deluxe',
    startDate: new Date('2024-12-21'),
    endDate: new Date('2025-03-18'),
    services: ['Pipe insulation', 'Door/window draft check', 'Smoke/CO detector test', 'Snow removal plan', 'Roof ice dam prevention', 'Gutter guard install', 'Attic ventilation check'],
    active: true,
  },
  {
    title: 'Winter Premium',
    description: 'The ultimate winter protection package.',
    price: 399,
    season: 'Winter',
    tier: 'Premium',
    startDate: new Date('2024-12-21'),
    endDate: new Date('2025-03-18'),
    services: ['Pipe insulation', 'Door/window draft check', 'Smoke/CO detector test', 'Snow removal plan', 'Roof ice dam prevention', 'Gutter guard install', 'Attic ventilation check', 'Emergency generator check', 'Fireplace cleaning', 'Heated driveway check'],
    active: true,
  },
  {
    title: 'Winter Comfort',
    description: 'Stay cozy and comfortable all winter.',
    price: 249,
    season: 'Winter',
    tier: 'Special',
    startDate: new Date('2024-12-21'),
    endDate: new Date('2025-03-18'),
    services: ['Thermostat programming', 'Heated blanket install', 'Window insulation film', 'Hot water heater check'],
    active: true,
  },
];

async function seedPackages() {
  for (const pkg of packages) {
    await db.collection('servicePackages').add({
      ...pkg,
      startDate: Timestamp.fromDate(pkg.startDate),
      endDate: Timestamp.fromDate(pkg.endDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`Seeded: ${pkg.title}`);
  }
  console.log('All packages seeded!');
}

seedPackages();