import React from 'react';

const Contato = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-bold">Contact Me</h1>
      <p className="mt-4 text-lg text-gray-600">
        This is a placeholder for the contact page.
      </p>
      <div className="mt-8">
        <p className="text-xl">You can reach me at:</p>
        <a href="mailto:your-email@example.com" className="text-xl text-blue-600 font-semibold hover:underline">
          your-email@example.com
        </a>
      </div>
    </div>
  );
};

export default Contato;