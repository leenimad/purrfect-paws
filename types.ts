// import { ObjectId } from 'mongodb';

// export interface Cat {
//   _id?: ObjectId;
//   name: string;
//   age: number;
//   breed: string;
//   color: string;
//   gender: string;
//   description: string;
//   medicalHistory: {
//     vaccinations: string;
//     spayedNeutered: boolean;
//     healthNotes: string;
//   };
//   imageUrls: string[];
//   status: 'Available' | 'Pending' | 'Adopted';
// }

// export interface Application {
//     status: string;
//     _id?: ObjectId;
//     catId: ObjectId;
//     catName: string;
//     applicantName: string;
//     applicantEmail: string;
//     applicantPhone: string;
//     livingSituation: string;
//     experience: string;
//     submissionDate: Date;
// }
import { ObjectId } from 'mongodb';

export interface Cat {
  _id?: ObjectId;
  name: string;
  age: number;
  breed: string;
  color: string;
  gender: string;
  description: string;
  medicalHistory: {
    vaccinations: string;
    spayedNeutered: boolean;
    healthNotes: string;
  };
  imageUrls: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  
  // --- NEW FIELDS FOR SHELTERS ---
  ownerId?: string;    // The Supabase User ID of the person who uploaded this
  ownerEmail?: string; // The email of the person who uploaded this
    ownerName?: string; // The name of the person who uploaded this
}

export interface Application {
    _id?: ObjectId;
    catId: ObjectId;
    catName: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    livingSituation: string;
    experience: string;
    submissionDate: Date;
    
    // --- NEW FIELDS FOR STATUS & SHELTERS ---
    status?: 'Pending' | 'Approved' | 'Rejected';
    catOwnerId?: string; // The ID of the shelter we need to send this application to
}