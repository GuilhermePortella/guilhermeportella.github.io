import React from 'react';

const Contato = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-bold">Contact Me</h1>
      <p className="mt-4 text-lg text-gray-600">
        Alguns dos meus canais de contato estao listados abaixo. Sinta-se a vontade para me enviar uma mensagem!
      </p>
      <div className="mt-8">
        <p className="text-xl">Você pode me contatar através dos seguintes canais:
        </p>
        <a href="mailto:guilhermeportella.dev@gmail.com" className="text-xl text-blue-600 font-semibold hover:underline">
          guilhermeportella.dev@gmail.com
        </a>
      </div>
      <div className="mt-10">
        <p className="text-xl text-gray-700">Redes sociais</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/GuilhermePortella"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 font-semibold hover:text-gray-900 hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/myprofileguilhermeportella/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 font-semibold hover:text-gray-900 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/BYTE_GHOST404"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 font-semibold hover:text-gray-900 hover:underline"
          >
            Twitter/X
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contato;
