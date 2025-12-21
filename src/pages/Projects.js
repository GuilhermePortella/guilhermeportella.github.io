import React, { useEffect, useMemo, useState } from 'react';

const GITHUB_REPOS_URL = 'https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=100';
const PAGE_SIZE = 9;
const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'stars-desc', label: 'Mais estrelas' },
  { value: 'stars-asc', label: 'Menos estrelas' },
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' },
  { value: 'created', label: 'Criados recentemente' }
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const response = await fetch(GITHUB_REPOS_URL, {
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
          name: repo.name,
          description: repo.description || 'No description provided yet.',
          repoUrl: repo.html_url,
          liveUrl: repo.homepage || null,
          tags: repo.language ? [repo.language] : [],
          language: repo.language,
          stars: repo.stargazers_count,
          updatedAt: repo.pushed_at,
          createdAt: repo.created_at
        }));

        setProjects(mappedProjects);
        setCurrentPage(1);
        setStatus('success');
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setErrorMessage('Unable to load projects right now. Please try again later.');
        setStatus('error');
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [languageFilter, sortOption]);

  const languageOptions = useMemo(() => {
    const uniqueLanguages = new Set();
    projects.forEach((project) => {
      if (project.language) {
        uniqueLanguages.add(project.language);
      }
    });
    return Array.from(uniqueLanguages).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (languageFilter === 'all') {
      return projects;
    }
    return projects.filter((project) => project.language === languageFilter);
  }, [projects, languageFilter]);

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];

    switch (sortOption) {
      case 'stars-desc':
        return sorted.sort((a, b) => b.stars - a.stars);
      case 'stars-asc':
        return sorted.sort((a, b) => a.stars - b.stars);
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'created':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  }, [filteredProjects, sortOption]);

  const totalPages = useMemo(() => {
    if (!sortedProjects.length) {
      return 1;
    }
    return Math.ceil(sortedProjects.length / PAGE_SIZE);
  }, [sortedProjects.length]);

  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedProjects.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, sortedProjects]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <>
      <section aria-labelledby="projects-title" className="bg-white text-center py-16 px-6">
        <h1 id="projects-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Meus projetos</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">Uma coleção dos meus trabalhos, desde aplicações web até contribuições para projetos de código aberto.</p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          {status === 'success' && (
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="project-sort" className="block text-sm font-semibold text-gray-700">
                  Ordenar por
                </label>
                <select
                  id="project-sort"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:max-w-xs">
                <label htmlFor="project-language" className="block text-sm font-semibold text-gray-700">
                  Linguagem
                </label>
                <select
                  id="project-language"
                  value={languageFilter}
                  onChange={(event) => setLanguageFilter(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas</option>
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {status === 'loading' && (
              <div className="col-span-full text-center text-gray-600">
                Loading projects from GitHub...
              </div>
            )}
            {status === 'error' && (
              <div className="col-span-full text-center text-red-600">
                {errorMessage}
              </div>
            )}
            {status === 'success' && sortedProjects.length === 0 && (
              <div className="col-span-full text-center text-gray-600">
                Nenhum projeto encontrado para os filtros selecionados.
              </div>
            )}
            {status === 'success' && currentProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      {/* Star Icon Placeholder */}
                      <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"></path></svg>
                      {project.stars}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={`${project.id}-${tag}`} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    View on GitHub
                  </a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:underline">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {status === 'success' && totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
