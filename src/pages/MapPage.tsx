import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import AccessMap from '@/components/map/AccessMap';

const MapPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <main className="flex-1 pt-16">
        <AccessMap />
      </main>
    </Layout>
  );
};

export default MapPage;
