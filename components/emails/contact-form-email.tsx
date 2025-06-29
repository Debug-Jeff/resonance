'use client';

// Simplified version without server components
export const ContactFormEmailTemplate = ({ 
  name, 
  email, 
  type, 
  subject, 
  message 
}) => {
  return (
    <div>
      <h1>New Contact Form Submission</h1>
      <div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Subject:</strong> {subject}</p>
      </div>
      <hr />
      <h2>Message:</h2>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};