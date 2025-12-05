// Run with: npx ts-node -P tsconfig.seed.json scripts/update-medical.ts

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const mongoClient = new MongoClient(MONGODB_URI);

async function updateMedicalData() {
  const jsonPath = path.join(process.cwd(), 'bulk-cats', 'cats.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('Could not find bulk-cuts/cats.json');
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const catsToUpdate = JSON.parse(rawData);

  console.log(`Read ${catsToUpdate.length} cats from JSON. Connecting to DB...`);

  try {
    await mongoClient.connect();
    const db = mongoClient.db('purrfect-paws');
    const collection = db.collection('cats');

    for (const cat of catsToUpdate) {
      // Logic: Find the cat by NAME, and update ONLY the medicalHistory field
      const result = await collection.updateOne(
        { name: cat.name }, // Find cat by name
        { 
          $set: { 
            medicalHistory: cat.medicalHistory 
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated medical info for: ${cat.name}`);
      } else {
        console.log(`⚠️  Could not find cat named: ${cat.name} (Did you change the name?)`);
      }
    }

    console.log('------------------------------------------------');
    console.log('Update Complete! Check your website.');

  } catch (error) {
    console.error('Script Error:', error);
  } finally {
    await mongoClient.close();
  }
}

updateMedicalData();