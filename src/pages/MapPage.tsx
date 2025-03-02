import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import AccessMap from '@/components/map/AccessMap';

const MapPage = () => {
  const location = useLocation();
  const routeParams = location.state;
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <main className="flex-1 pt-16">
        <AccessMap 
          initialStartLocation={routeParams?.startLocation}
          initialDestination={routeParams?.destination}
          initialPreferences={routeParams?.preferences}
        />
      </main>
    </Layout>
  );
};

export default MapPage;
