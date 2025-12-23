import React from 'react';
import { Link } from 'react-router-dom';
import ARTICLES from '../data/articles';

const Articles = () => {
  return (
    <>
      <section aria-labelledby="articles-title" className="bg-white text-center py-16 px-6">
        <h1 id="articles-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Artigos</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Lista completa de anotacoes, rascunhos e aprendizados recentes.
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="articles-list-title">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="articles-list-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Todos os artigos
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Estou organizando estes temas agora. Em breve entram os textos completos.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARTICLES.map((article) => (
                <article key={article.id} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                    <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                    <p className="mt-4 text-gray-600">{article.excerpt}</p>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="articles-cta-title" className="mt-20">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
              <h2 id="articles-cta-title" className="text-3xl font-bold text-gray-900">Quer sugerir um tema?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Posso incluir assuntos que voce gostaria de ler por aqui.
              </p>
              <div className="mt-8">
                <Link
                  to="/contato"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Falar comigo
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Articles;
