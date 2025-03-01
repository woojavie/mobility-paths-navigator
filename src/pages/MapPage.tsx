
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import AccessMap from '@/components/map/AccessMap';

const MapPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <AccessMap />
      </main>
    </div>
  );
};

export default MapPage;
