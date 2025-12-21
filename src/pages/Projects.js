import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data - in a real app, this could be fetched from the GitHub API
const allProjects = [
  {
    id: 1,
    name: 'Project One',
    description: 'A detailed description of the first project. It solves problem X by using technologies Y and Z. The outcome was a 20% improvement in performance.',
    repoUrl: 'https://github.com/your-username/project-one',
    liveUrl: '#',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    stars: 128,
  },
  {
    id: 2,
    name: 'Project Two',
    description: 'This project focuses on data visualization, using D3.js to create interactive charts for financial data analysis.',
    repoUrl: 'https://github.com/your-username/project-two',
    liveUrl: '#',
    tags: ['JavaScript', 'D3.js', 'Python', 'Flask'],
    stars: 256,
  },
  {
    id: 3,
    name: 'Project Three',
    description: 'A mobile application built with React Native for tracking personal fitness goals. Includes authentication and data persistence.',
    repoUrl: 'https://github.com/your-username/project-three',
    liveUrl: null, // No live URL
    tags: ['React Native', 'Firebase', 'iOS', 'Android'],
    stars: 98,
  },
  {
    id: 4,
    name: 'Another Cool Project',
    description: 'A brief description of another project, focusing on a different skill set or technology stack.',
    repoUrl: 'https://github.com/your-username/another-project',
    liveUrl: '#',
    tags: ['Go', 'Docker', 'gRPC'],
    stars: 50,
  },
  // Add more projects as needed
];

const Projects = () => {
  return (
    <>
      <section aria-labelledby="projects-title" className="bg-white text-center py-16 px-6">
        <h1 id="projects-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">My Projects</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">A collection of my work, from web applications to open-source contributions.</p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map(project => (
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
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
        </div>
      </div>
    </>
  );
};

export default Projects;
