// Run with: npx ts-node -P tsconfig.seed.json scripts/bulk-upload.ts

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing environment variables. Check .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const mongoClient = new MongoClient(MONGODB_URI);

async function uploadSpecificCats() {
  const baseDir = path.join(process.cwd(), '/bulk-cats');
  const imagesDir = path.join(baseDir, 'images');
  const jsonPath = path.join(baseDir, 'cats.json');

  // 1. Check if files exist
  if (!fs.existsSync(jsonPath)) {
    console.error('Could not find "bulk-data/cats.json". Please create it.');
    return;
  }

  // 2. Read the JSON data
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const catsToUpload = JSON.parse(rawData);

  console.log(`Found ${catsToUpload.length} cats in your JSON file. Starting process...`);

  try {
    await mongoClient.connect();
    const db = mongoClient.db('purrfect-paws');
    const collection = db.collection('cats');

    for (const cat of catsToUpload) {
      console.log(`Processing: ${cat.name}...`);

      const imagePath = path.join(imagesDir, cat.imageFile);

      if (!fs.existsSync(imagePath)) {
        console.error(`  ERROR: Image file "${cat.imageFile}" not found in images folder. Skipping.`);
        continue;
      }

      // 3. Upload the specific image to Supabase
      const fileBuffer = fs.readFileSync(imagePath);
      const uniqueFileName = `${cat.name.toLowerCase()}-${Date.now()}-${cat.imageFile}`;

      const { error: uploadError } = await supabase.storage
        .from('cat-images')
        .upload(uniqueFileName, fileBuffer, { contentType: 'image/jpeg', upsert: false });

      if (uploadError) {
        console.error(`  Upload failed:`, uploadError.message);
        continue;
      }

      // 4. Get Public URL
      const { data: urlData } = supabase.storage
        .from('cat-images')
        .getPublicUrl(uniqueFileName);

      // 5. Create the Final Database Object
      const newCatEntry = {
        name: cat.name,
        age: cat.age,
        breed: cat.breed,
        gender: cat.gender,
        color: cat.color,
        description: cat.description,
        // We add default medical history since it's tedious to type in JSON, 
        // but you could add it to JSON if you really wanted to.
        medicalHistory: {
          vaccinations: 'Up to date',
          spayedNeutered: true,
          healthNotes: 'Healthy.'
        },
        imageUrls: [urlData.publicUrl], // Link the Supabase URL
        status: 'Available'
      };

      // 6. Insert into MongoDB
      await collection.insertOne(newCatEntry);
      console.log(`  --> Success! ${cat.name} is live.`);
    }

    console.log('------------------------------------------------');
    console.log('All specific cats uploaded successfully!');

  } catch (error) {
    console.error('Script Error:', error);
  } finally {
    await mongoClient.close();
  }
}

uploadSpecificCats();