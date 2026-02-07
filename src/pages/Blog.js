import React from 'react';
import { Link } from 'react-router-dom';
import { formatShortDate } from '../utils/articleUtils';
import useArticles from '../hooks/useArticles';

const highlights = [
  {
    id: 1,
    title: 'Back-end',
    description: 'APIs, integracoes e boas praticas para manter sistemas saudaveis.'
  },
  {
    id: 2,
    title: 'Seguranca',
    description: 'Estudos de fundamentos, ferramentas e cuidados do dia a dia.'
  },
  {
    id: 3,
    title: 'Projetos',
    description: 'Aprendizados aplicados nos trabalhos que estou construindo.'
  }
];

const Blog = () => {
  const { articles: posts, status: postsStatus } = useArticles(3);

  return (
    <>
      <section aria-labelledby="blog-title" className="bg-white text-center py-16 px-6">
        <h1 id="blog-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Blog</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Artigos técnicos, guias e estudos de caso focados em engenharia de software e boas práticas.
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="latest-posts-title" className="mb-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="latest-posts-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Últimos artigos
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Conteúdo técnico e prático — notas, guias e análises que apoio com referências e exemplos.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsStatus === 'loading' && (
                <div className="col-span-full text-center text-gray-600">
                  Carregando artigos...
                </div>
              )}
              {postsStatus === 'error' && (
                <div className="col-span-full text-center text-red-600">
                  Não foi possível carregar os artigos agora. Tente novamente mais tarde.
                </div>
              )}
              {postsStatus === 'success' && posts.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  Nenhum artigo disponível no momento.
                </div>
              )}
              {postsStatus === 'success' && posts.map((post) => {
                const dateLabel = formatShortDate(post.publishedAt) || 'Sem data';

                return (
                  <Link
                    key={post.id}
                    to={`/blog/artigos/${post.slug}`}
                    className="group block"
                    aria-label={`Ler artigo ${post.title}`}
                  >
                    <article className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col h-full transition-shadow duration-300 group-hover:shadow-xl">
                      <div className="p-6 flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{post.category}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                        <p className="mt-4 text-gray-600">{post.excerpt}</p>
                      </div>
                      <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                        <span className="text-gray-600">{dateLabel}</span>
                        <span className="text-gray-600">{post.readTime} min de leitura</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link to="/blog/artigos" className="text-lg font-semibold text-blue-600 hover:underline">
                Ver todos os artigos
              </Link>
            </div>
          </section>

          <section aria-labelledby="topics-title" className="mb-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="topics-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                O que encontrará aqui
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Conteúdo prático, checklists e análises focadas em aplicação direta no dia a dia de desenvolvimento.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cta-title">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
              <h2 id="cta-title" className="text-3xl font-bold text-gray-900">Quer acompanhar?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Se quiser sugerir um tema, enviar feedback técnico ou colaborar em um estudo, vamos conversar.
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

export default Blog;
