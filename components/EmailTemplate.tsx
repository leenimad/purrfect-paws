// import * as React from 'react';

// interface EmailTemplateProps {
//   applicantName: string;
//   applicantEmail?: string; 
//   catName: string;
// }

// export const EmailTemplate: React.FC<EmailTemplateProps> = ({
//   applicantName,
//   applicantEmail,
//   catName,
// }) => (
//   <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
//     <h1 style={{ color: '#8b5cf6' }}>Purrfect Paws 🐾</h1>
//     <h2>Application Received!</h2>
//     <p>Hi <strong>{applicantName}</strong>,</p>
//     <p>
//       We have received your application to adopt <strong>{catName}</strong>! 
//       This is such exciting news.
//     </p>
//     <p>
//       Our team will review your details and get back to you within 3-5 business days.
//     </p>
//     <br />
//     <p>Best regards,</p>
//     <p>The Purrfect Paws Team</p>
//   </div>
// );
import * as React from 'react';

interface EmailTemplateProps {
  applicantName: string;
  applicantEmail?: string; // Add this
  catName: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  applicantName,
  applicantEmail,
  catName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1 style={{ color: '#8b5cf6' }}>New Application Alert! 🚨</h1>
    
    <p>Hello Admin,</p>
    
    <p>
      Good news! A user named <strong>{applicantName}</strong> has just applied to adopt <strong>{catName}</strong>.
    </p>

    <div style={{ background: '#f3e8ff', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Applicant Details:</h3>
      <p><strong>Name:</strong> {applicantName}</p>
      <p><strong>Email:</strong> {applicantEmail}</p>
      <p><strong>Cat of Interest:</strong> {catName}</p>
    </div>

    <p style={{ marginTop: '20px' }}>
      Please log in to your <a href="https://purrfect-paws-seven.vercel.app/admin">Admin Dashboard</a> to approve or reject this application.
    </p>
  </div>
);