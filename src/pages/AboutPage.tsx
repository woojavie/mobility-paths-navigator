import { Layout } from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';

const founders = [
  {
    name: 'Ryan Ariles',
    role: 'Co-Founder',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png', // Lucario
    description: 'Specializing in React and TypeScript development, focusing on building accessible UI components and responsive design systems.'
  },
  {
    name: 'Young Kim',
    role: 'Co-Founder',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', // Dragonite
    description: 'Implementing backend infrastructure using Node.js and PostgreSQL, with expertise in RESTful API design and database optimization.'
  },
  {
    name: 'Jacky Wang',
    role: 'Co-Founder',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png', // Lopunny
    description: 'Developing real-time geolocation features using Google Maps API and implementing WebSocket-based live updates.'
  },
  {
    name: 'Javier Woo',
    role: 'Co-Founder',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', // Blastoise
    description: 'Engineering the data pipeline architecture and implementing machine learning algorithms for route optimization.'
  }
];

const AboutPage = () => {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Making Navigation Accessible for Everyone
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto">
              AccessPath is dedicated to creating a world where everyone can navigate their environment confidently and independently.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-6">
                Our mission is to empower individuals with mobility challenges by providing them with the tools and information they need to navigate their environment confidently and independently.
              </p>
              <p className="text-lg mb-6">
                We believe that accessibility information should be readily available, up-to-date, and community-driven. By combining technology with community engagement, we're creating a platform that makes navigation easier and more inclusive for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Purpose</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Community-Driven</h3>
                <p>Harnessing the power of community contributions to maintain accurate and up-to-date accessibility information.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Accessibility First</h3>
                <p>Ensuring that everyone, regardless of their mobility needs, can navigate their environment with confidence.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Technology for Good</h3>
                <p>Using innovative technology to solve real-world accessibility challenges and improve lives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Founders</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {founders.map((founder) => (
                <div key={founder.name} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-gray-100 p-4">
                    <img 
                      src={founder.pokemon} 
                      alt={`${founder.name}'s Pokemon Avatar`}
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{founder.name}</h3>
                    <p className="text-primary font-medium mb-2">{founder.role}</p>
                    <p className="text-gray-600">{founder.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Together, we can create a more accessible world. Contribute to our community and help others navigate with confidence.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  );
};

export default AboutPage; 