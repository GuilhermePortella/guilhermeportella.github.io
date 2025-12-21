import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Placeholder data
  const featuredProjects = [
    { id: 1, title: 'Project One', description: 'A brief description of the first project, highlighting the technologies used and its purpose.', imageUrl: 'https://via.placeholder.com/400x250', link: '/projects/one' },
    { id: 2, title: 'Project Two', description: 'A brief description of the second project, what problem it solves, and my role in it.', imageUrl: 'https://via.placeholder.com/400x250', link: '/projects/two' },
    { id: 3, title: 'Project Three', description: 'A brief description of the third project, focusing on the outcome and impact.', imageUrl: 'https://via.placeholder.com/400x250', link: '/projects/three' },
  ];

  const latestPosts = [
    { id: 1, title: 'My Journey into React', excerpt: 'A short summary of the blog post about learning and mastering React...', category: 'Web Development', link: '/blog/react-journey' },
    { id: 2, title: 'Understanding Async/Await in JavaScript', excerpt: 'A deep dive into asynchronous programming in JS...', category: 'Programming', link: '/blog/async-await' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section aria-labelledby="hero-title" className="bg-white text-center py-20 px-6">
        <h1 id="hero-title" className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">Guilherme Portella</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">Full-Stack Developer | Tech Enthusiast | Lifelong Learner</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/projects" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            View My Work
          </Link>
          <a href="#contact" className="text-sm font-semibold leading-6 text-gray-900">
            Get in Touch <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <main>
        {/* About Me Section */}
        <section id="about" aria-labelledby="about-title" className="bg-gray-50 py-20 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 id="about-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Me</h2>
            <p className="mt-6 text-lg text-gray-600">
              Welcome to my personal space on the web! I'm a passionate developer with a love for building elegant and efficient solutions. Here you'll find a collection of my projects, thoughts on technology, and a little bit about my journey in the world of software development.
            </p>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" aria-labelledby="projects-title" className="bg-white py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="projects-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Projects</h2>
              <p className="mt-4 text-lg text-gray-600">
                A selection of my recent work.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map(project => (
                <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <Link to={project.link} className="font-semibold text-blue-600 hover:underline">
                      View Details &rarr;
                    </Link>
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

        {/* Latest Blog Posts Section */}
        <section id="blog" aria-labelledby="blog-title" className="bg-gray-50 py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="blog-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h2>
              <p className="mt-4 text-lg text-gray-600">
                My latest thoughts and articles on development and technology.
              </p>
            </div>
            <div className="mt-16 space-y-8 max-w-3xl mx-auto">
              {latestPosts.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-sm text-gray-500 mb-1">{post.category}</p>
                  <h3 className="text-2xl font-semibold mb-2">
                    <Link to={post.link} className="hover:text-blue-600">{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link to={post.link} className="font-semibold text-blue-600 hover:underline">
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
            <h2 id="contact-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Let's Connect</h2>
            <p className="mt-6 text-lg text-gray-600">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
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