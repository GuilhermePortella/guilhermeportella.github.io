import React from 'react';

// Placeholder data for favorite artists/albums
const favoriteMusic = [
  {
    artist: 'Artist One',
    album: 'Favorite Album A',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'A brief note on why this album or artist is a favorite.'
  },
  {
    artist: 'Artist Two',
    album: 'Classic Album B',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'The impact this music had and the memories associated with it.'
  },
  {
    artist: 'Artist Three',
    album: 'Greatest Hits',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'An artist that has been influential for a long time.'
  }
];

const Hobbies = () => {
  return (
    <>
      <section aria-labelledby="hobbies-title" className="bg-white text-center py-16 px-6">
        <h1 id="hobbies-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Curiosities & Music</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">A little bit about my interests outside of coding.</p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          {/* Curiosities Section */}
          <section id="curiosities" aria-labelledby="curiosities-title" className="mb-20">
            <div className="max-w-3xl mx-auto">
              <h2 id="curiosities-title" className="text-3xl font-bold text-gray-900 mb-6">Random Curiosities</h2>
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg space-y-4 text-gray-700">
                <p>
                  Here's a place for some fun facts, personal interests, or anything else you'd like to share. For example:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>I'm an avid reader of science fiction, with my favorite author being [Author's Name].</li>
                  <li>I enjoy hiking and have explored several national parks.</li>
                  <li>In my free time, I like to experiment with cooking and try new recipes.</li>
                  <li>I'm also passionate about [another hobby, e.g., photography, chess, etc.].</li>
                </ul>
                <p>
                  This section helps to add a personal touch to your portfolio and shows a bit more of who you are beyond your professional skills.
                </p>
              </div>
            </div>
          </section>

          {/* Music Section */}
          <section id="music" aria-labelledby="music-title">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="music-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Music I Enjoy</h2>
              <p className="mt-4 text-lg text-gray-600">
                Music is a big part of my life. Here are a few artists and albums I've been listening to recently.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteMusic.map((music, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden text-center">
                  <img src={music.imageUrl} alt={`${music.artist} - ${music.album}`} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{music.artist}</h3>
                    <p className="text-md text-gray-500 mb-2">{music.album}</p>
                    <p className="text-gray-600 text-sm">{music.description}</p>
                  </div>
                </div>
              ))}
            </div>
             <div className="text-center mt-12">
                <p className="text-gray-600">
                  You could also embed a Spotify or Apple Music playlist here.
                </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Hobbies;
