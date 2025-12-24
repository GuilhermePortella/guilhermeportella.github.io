import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useArticles from '../hooks/useArticles';

const FEATURED_PROJECTS_URL = 'https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=3';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredStatus, setFeaturedStatus] = useState('loading');
  const [featuredError, setFeaturedError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchFeaturedProjects = async () => {
      setFeaturedStatus('loading');
      setFeaturedError('');

      try {
        const response = await fetch(FEATURED_PROJECTS_URL, {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json',
          },
        });

        if (!response.ok) {
          throw new Error('GitHub API request failed.');
        }

        const data = await response.json();
        const mappedProjects = data.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || 'No description provided yet.',
          repoUrl: repo.html_url,
        }));

        setFeaturedProjects(mappedProjects);
        setFeaturedStatus('success');
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setFeaturedError('Unable to load featured projects right now.');
        setFeaturedStatus('error');
      }
    };

    fetchFeaturedProjects();

    return () => controller.abort();
  }, []);

  const { articles: latestPosts, status: articlesStatus } = useArticles(3);

  return (
    <>
      {/* Hero Section */}
      <section aria-labelledby="hero-title" className="bg-white text-center py-20 px-6">
        <h1 id="hero-title" className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">Guilherme Portella</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">BackEnd Developer | Tech Enthusiast | Lifelong Learner</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/projects" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            View My Work
          </Link>
          <a href="#contato" className="text-sm font-semibold leading-6 text-gray-900">
            Entre em contato <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <main>
        {/* About Me Section */}
        <section id="about" aria-labelledby="about-title" className="bg-gray-50 py-20 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 id="about-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Me</h2>
            <p className="mt-6 text-lg text-gray-600">
              Bem-vindo(a) ao meu espaço pessoal na web! Sou um desenvolvedor apaixonado por tecnologia.
              Aqui você encontrará uma coleção dos meus projetos,
              reflexões sobre tecnologia e um pouco da minha trajetória no mundo do desenvolvimento de software.
            </p>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" aria-labelledby="projects-title" className="bg-white py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="projects-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Projetos em destaque</h2>
              <p className="mt-4 text-lg text-gray-600">
                Uma seleção dos meus trabalhos recentes.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStatus === 'loading' && (
                <div className="col-span-full text-center text-gray-600">
                  Loading featured projects...
                </div>
              )}
              {featuredStatus === 'error' && (
                <div className="col-span-full text-center text-red-600">
                  {featuredError}
                </div>
              )}
              {featuredStatus === 'success' && featuredProjects.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  No featured projects available yet.
                </div>
              )}
              {featuredStatus === 'success' && featuredProjects.map(project => (
                <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                      View on GitHub &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/projects" className="text-lg font-semibold text-blue-600 hover:underline">
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        <section id="blog" aria-labelledby="blog-title" className="bg-gray-50 py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="blog-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h2>
              <p className="mt-4 text-lg text-gray-600">
                Alguns temas que estou estruturando agora.
              </p>
            </div>
            <div className="mt-16 space-y-8 max-w-3xl mx-auto">
              {articlesStatus === 'loading' && (
                <div className="text-center text-gray-600">
                  Carregando artigos...
                </div>
              )}
              {articlesStatus === 'error' && (
                <div className="text-center text-red-600">
                  Nao foi possivel carregar os artigos agora.
                </div>
              )}
              {articlesStatus === 'success' && latestPosts.length === 0 && (
                <div className="text-center text-gray-600">
                  Nenhum artigo publicado ainda.
                </div>
              )}
              {articlesStatus === 'success' && latestPosts.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-sm text-gray-500 mb-1">{post.category}</p>
                  <h3 className="text-2xl font-semibold mb-2">
                    <Link to={`/blog/artigos/${post.slug}`} className="hover:text-blue-600">{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link to={`/blog/artigos/${post.slug}`} className="font-semibold text-blue-600 hover:underline">
                    Read More &rarr;
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/blog" className="text-lg font-semibold text-blue-600 hover:underline">
                Visit Blog
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" aria-labelledby="contact-title" className="bg-white py-20 px-6">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 id="contact-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Vamos nos conectar</h2>
            <p className="mt-6 text-lg text-gray-600">
              Estou sempre aberto a discutir novos projetos ou sobre tecnologia ou alguma coisa que achar interessante aqui, se quiser conversar pode entrar em contato comigo.
            </p>
            <div className="mt-10">
              <a href="mailto:guilhermeportella.dev@gmail.com" className="text-xl text-blue-600 font-semibold hover:underline">
                guilhermeportella.dev@gmail.com
              </a>
            </div>
            <div className="flex justify-center space-x-6 mt-6">
              {/* In a real app, you would use SVG icons here */}
              <a href="https://github.com/GuilhermePortella" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">GitHub</a>
              <a href="https://www.linkedin.com/in/myprofileguilhermeportella/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">LinkedIn</a>
              <a href="https://x.com/BYTE_GHOST404" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">Twitter</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
