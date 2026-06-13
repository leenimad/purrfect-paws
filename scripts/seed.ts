// // To run this script, use: npx ts-node --compiler-options '{\"module\":\"commonjs\"}' scripts/seed.ts
// import { MongoClient, ObjectId } from 'mongodb';
// import { Cat } from '../types'; 

// const uri = 'mongodb+srv://leenibatta:pawsperfectmeow@purrfectpaws.szldwli.mongodb.net/?appName=PurrfectPaws'; // Replace with your actual URI

// const sampleCats: Omit<Cat, '_id'>[] = [
//   {
//     name: 'Whiskers',
//     age: 2,
//     breed: 'Domestic Shorthair',
//     color: 'Tabby',
//     gender: 'Male',
//     description: 'Affectionate, playful, and curious. Loves chasing feather toys, enjoys lap cuddles, and gets along well with other cats.',
//     medicalHistory: {
//       vaccinations: 'Up to date (Rabies, FVRCP)',
//       spayedNeutered: true,
//       healthNotes: 'Healthy, no chronic illnesses, last vet checkup was 1 month ago.',
//     },
//     imageUrls: ['/images/whiskers.jpg'],
//     status: 'Available',
//   },
//   {
//     name: 'Shadow',
//     age: 1,
//     breed: 'Bombay',
//     color: 'Black',
//     gender: 'Female',
//     description: 'A sleek and mysterious cat with a gentle soul. Shadow is a bit shy at first but becomes a loving companion once she trusts you.',
//     medicalHistory: {
//       vaccinations: 'Up to date',
//       spayedNeutered: true,
//       healthNotes: 'Perfect health.',
//     },
//     imageUrls: ['/images/shadow.jpg'],
//     status: 'Available',
//   },
//   {
//     name: 'Cleo',
//     age: 8, // months
//     breed: 'Siamese',
//     color: 'Cream with dark points',
//     gender: 'Female',
//     description: 'A vocal and intelligent kitten who loves to explore and play. Cleo is very social and would do well in an active home.',
//     medicalHistory: {
//       vaccinations: 'First round complete',
//       spayedNeutered: false, // Still a kitten
//       healthNotes: 'Active and healthy kitten.',
//     },
//     imageUrls: ['/images/cleo.jpg'],
//     status: 'Available',
//   },
// ];

// async function seedDB() {
//   const client = new MongoClient(uri);
//   try {
//     await client.connect();
//     console.log('Connected correctly to server');
//     const catCollection = client.db('purrfect-paws').collection<Omit<Cat, '_id'>>('cats');

//     // Clear existing data
//     await catCollection.deleteMany({});
//     console.log('Cleared existing cats collection');

//     // Insert new data
//     const result = await catCollection.insertMany(sampleCats);
//     console.log(`Inserted ${result.insertedCount} cats into the collection`);

//   } catch (err) {
//     console.error('An error occurred:', err);
//   } finally {
//     await client.close();
//   }
// }

// seedDB();
// scripts/seed.js
const { MongoClient } = require('mongodb');

// PASTE YOUR NEW MONGODB CONNECTION STRING HERE:
const uri = "mongodb://leenibatta:pawsperfectmeow@ac-owaxqel-shard-00-00.gye3q03.mongodb.net:27017,ac-owaxqel-shard-00-01.gye3q03.mongodb.net:27017,ac-owaxqel-shard-00-02.gye3q03.mongodb.net:27017/?ssl=true&replicaSet=atlas-el5xit-shard-0&authSource=admin&appName=PurrfectPaws"; 

const sampleCats = [
  {
    name: 'Charlie',
    age: 3,
    breed: 'Maine Coon Mix',
    color: 'Grey Fluffy Tabby',
    gender: 'Male',
    description: 'Charlie is a majestic Maine Coon mix with a gorgeous fluffy coat. He has a calm, gentle-giant personality and loves lounging on sunny balconies.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, requires regular brushing.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/charlie-1763852282491-Charlie.jpg'],
    status: 'Available',
  },
  {
    name: 'Coco',
    age: 8,
    breed: 'Persian',
    color: 'Pure Fluffy White',
    gender: 'Female',
    description: 'Coco is a dignified Persian princess. She is very quiet, loves a peaceful environment, and enjoys being brushed while sitting on your lap.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Excellent health for her age, flat-face breed care needed.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/coco-1763852287652-Coco.jpg'],
    status: 'Available',
  },
  {
    name: 'Ginger',
    age: 6,
    breed: 'Domestic Longhair',
    color: 'Orange Fluffy Tabby',
    gender: 'Female',
    description: 'Ginger is a lovely orange lady who is incredibly sweet. She loves to hold conversations with her soft meows and will follow you around the house.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, very gentle temperament.' },
imageUrls:['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/ginger-1763852289894-Ginger.jpg'],
    status: 'Available',
  },
  {
    name: 'Milo',
    age: 1,
    breed: 'Ragdoll',
    color: 'Seal Point & White',
    gender: 'Male',
    description: 'Milo is a young Ragdoll who completely goes limp with happiness when held. He has striking blue eyes and a highly affectionate personality.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy and growing well.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/milo-1763852287048-Milo.jpg'],
    status: 'Available',
  },
  {
    name: 'Nala',
    age: 0.4, // 5 months
    breed: 'Siamese Mix',
    color: 'Seal Point',
    gender: 'Female',
    description: 'Nala is a petite, energetic Siamese mix kitten. She is extremely curious, loves exploring high places, and is very playful.',
    medicalHistory: { vaccinations: 'First rounds complete', spayedNeutered: false, healthNotes: 'Energetic and healthy kitten.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/nala-1763852286460-Nala.jpg'],
    status: 'Available',
  },
  {
    name: 'Oreo',
    age: 3,
    breed: 'Tuxedo',
    color: 'Black & White',
    gender: 'Male',
    description: 'Always dressed to impress! Oreo is a confident Tuxedo boy who behaves like a little puppy—he loves to play fetch and greet guests at the door.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Very healthy, active.' },
imageUrls:[' https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/oreo-1763852285548-Oreo.jpg'],
    status: 'Available',
  },
  {
    name: 'Shadow',
    age: 1,
    breed: 'Bombay',
    color: 'Sleek Black',
    gender: 'Female',
    description: 'A sleek, mini-panther! Shadow has striking yellow eyes and a highly affectionate soul. She is a loyal companion who loves to sleep next to you.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Excellent physical condition.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/shadow.jpg'],
    status: 'Available',
  },
  {
    name: 'Simba',
    age: 5,
    breed: 'Orange Tabby',
    color: 'Ginger Tabby',
    gender: 'Male',
    description: 'Simba is a laid-back ginger boy who enjoys the finer things in life: soft blankets, wet food, and long afternoon naps in sunny spots.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, enjoys a calm environment.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/simba-1763852283698-Simba.jpg'],
    status: 'Available',
  },
  {
    name: 'Willow',
    age: 4,
    breed: 'Russian Blue',
    color: 'Silver Grey',
    gender: 'Female',
    description: 'Willow is an elegant Russian Blue with gorgeous green eyes. She is quiet, highly intelligent, and loves a peaceful home environment.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, no known issues.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/willow-1763852289351-Willow.jpg'],
    status: 'Available',
  },
  {
    name: 'Cat',
    age: 2,
    breed: 'Siamese',
    color: 'Chocolate Point',
    gender: 'Male',
    description: 'Cat is a classic Siamese boy who is extremely vocal and social. He loves being the center of attention and holding conversations with you.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Very healthy and active.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/1765022436728.jpg'],
    status: 'Available',
  },
  {
    name: 'Cleo',
    age: 2,
    breed: 'Siamese',
    color: 'Seal Point',
    gender: 'Male',
    description: 'Cleo is a stunning Siamese with deep blue eyes. He is highly affectionate and loves cuddling under the blankets on chilly nights.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, loves attention.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/1765022436728.jpg'],
    status: 'Available',
  },
  {
    name: 'Kiky',
    age: 1,
    breed: 'Scottish Fold',
    color: 'Silver Tabby',
    gender: 'Male',
    description: 'Kiky is an adorable Scottish Fold with unique folded ears and big, round blue eyes. He is very playful, gentle, and loves interactive toys.',
    medicalHistory: { vaccinations: 'Up to date', spayedNeutered: true, healthNotes: 'Healthy, fold-ear care checks done.' },
    imageUrls: ['https://eyynksufsjyxycrmujfl.supabase.co/storage/v1/object/public/cat-images/1764197398542.png'],
    status: 'Available',
  }
];

async function seedDB() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Successfully connected to the new database!');
    const db = client.db('purrfect-paws');
    const catCollection = db.collection('cats');

    await catCollection.deleteMany({});
    console.log('Cleared existing cats collection.');

    const result = await catCollection.insertMany(sampleCats);
    console.log(`Successfully inserted ${result.insertedCount} cats into the database!`);

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

seedDB();