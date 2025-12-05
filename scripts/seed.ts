// To run this script, use: npx ts-node --compiler-options '{\"module\":\"commonjs\"}' scripts/seed.ts
import { MongoClient, ObjectId } from 'mongodb';
import { Cat } from '../types'; // Adjust the import path as needed

const uri = 'mongodb+srv://leenibatta:pawsperfectmeow@purrfectpaws.szldwli.mongodb.net/?appName=PurrfectPaws'; // Replace with your actual URI

const sampleCats: Omit<Cat, '_id'>[] = [
  {
    name: 'Whiskers',
    age: 2,
    breed: 'Domestic Shorthair',
    color: 'Tabby',
    gender: 'Male',
    description: 'Affectionate, playful, and curious. Loves chasing feather toys, enjoys lap cuddles, and gets along well with other cats.',
    medicalHistory: {
      vaccinations: 'Up to date (Rabies, FVRCP)',
      spayedNeutered: true,
      healthNotes: 'Healthy, no chronic illnesses, last vet checkup was 1 month ago.',
    },
    imageUrls: ['/images/whiskers.jpg'],
    status: 'Available',
  },
  {
    name: 'Shadow',
    age: 1,
    breed: 'Bombay',
    color: 'Black',
    gender: 'Female',
    description: 'A sleek and mysterious cat with a gentle soul. Shadow is a bit shy at first but becomes a loving companion once she trusts you.',
    medicalHistory: {
      vaccinations: 'Up to date',
      spayedNeutered: true,
      healthNotes: 'Perfect health.',
    },
    imageUrls: ['/images/shadow.jpg'],
    status: 'Available',
  },
  {
    name: 'Cleo',
    age: 8, // months
    breed: 'Siamese',
    color: 'Cream with dark points',
    gender: 'Female',
    description: 'A vocal and intelligent kitten who loves to explore and play. Cleo is very social and would do well in an active home.',
    medicalHistory: {
      vaccinations: 'First round complete',
      spayedNeutered: false, // Still a kitten
      healthNotes: 'Active and healthy kitten.',
    },
    imageUrls: ['/images/cleo.jpg'],
    status: 'Available',
  },
];

async function seedDB() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const catCollection = client.db('purrfect-paws').collection<Omit<Cat, '_id'>>('cats');

    // Clear existing data
    await catCollection.deleteMany({});
    console.log('Cleared existing cats collection');

    // Insert new data
    const result = await catCollection.insertMany(sampleCats);
    console.log(`Inserted ${result.insertedCount} cats into the collection`);

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

seedDB();