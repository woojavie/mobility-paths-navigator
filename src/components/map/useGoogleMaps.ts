import { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMapType, InfoWindowType } from './types';
import { toast } from '@/components/ui/use-toast';

export const useGoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<GoogleMapType | null>(null);
  const [infoWindow, setInfoWindow] = useState<InfoWindowType | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance && window.google) {
        try {
          window.google.maps.event.trigger(mapInstance, 'resize');
          if (mapInstance.getCenter()) {
            const center = mapInstance.getCenter();
            mapInstance.setCenter(center);
          }
        } catch (error) {
          console.error('Error handling resize:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapInstance]);

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      if (!mapRef.current || mapLoaded) return;
      
      try {
        setLoading(true);

        // Get and validate API key
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log('Environment variables:', import.meta.env);
        console.log('API Key exists:', !!apiKey);
        if (!apiKey) {
          throw new Error('Google Maps API key is missing. Please check your environment variables.');
        }

        // Debug log for API key
        console.log('API Key length:', apiKey.length);
        console.log('API Key first 4 chars:', apiKey.substring(0, 4));

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"]
        });
        
        console.log('Loading Google Maps...');
        const googleMaps = await loader.load();
        console.log('Google Maps loaded successfully');

        if (!isMounted) return;
        
        console.log('Creating map instance...');
        const map = new googleMaps.maps.Map(mapRef.current, {
          center: { lat: 49.2666656, lng: -123.249999 },
          zoom: 14,
          mapTypeId: googleMaps.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: googleMaps.maps.ControlPosition.RIGHT_TOP
          }
        });
        console.log('Map instance created successfully');

        // Add resize event listener to the map
        googleMaps.maps.event.addListenerOnce(map, 'idle', () => {
          if (!isMounted) return;
          try {
            googleMaps.maps.event.trigger(map, 'resize');
            console.log('Map resize triggered on idle');
          } catch (error) {
            console.error('Error triggering resize on idle:', error);
          }
        });

        // Add error handler for the map
        googleMaps.maps.event.addListener(map, 'error', (e) => {
          console.error('Google Maps error:', e);
          if (isMounted) {
            toast({
              title: "Map error occurred",
              description: "There was an error with the map. Please refresh the page.",
              variant: "destructive"
            });
          }
        });
        
        // Create a single info window instance to reuse
        const infoWindowInstance = new googleMaps.maps.InfoWindow();
        
        if (isMounted) {
          setMapInstance(map);
          setInfoWindow(infoWindowInstance);
          setMapLoaded(true);
          console.log('Map instance created and stored');
        }
        
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!isMounted) return;
              
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map.setCenter(pos);
              console.log('User location set:', pos);
              
              // Add a marker for the user's location
              new googleMaps.maps.Marker({
                position: pos,
                map: map,
                icon: {
                  path: googleMaps.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                },
                title: "You are here",
              });
            },
            (error) => {
              console.error("Geolocation error:", error);
              if (isMounted) {
                toast({
                  title: "Location access denied",
                  description: "Please enable location access for better experience.",
                  variant: "destructive"
                });
              }
            }
          );
        }
        
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        if (isMounted) {
          toast({
            title: "Error loading map",
            description: error instanceof Error ? error.message : "Please check your internet connection and try again.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initMap();

    return () => {
      isMounted = false;
      if (mapInstance && window.google) {
        try {
          // Remove all event listeners
          window.google.maps.event.clearInstanceListeners(mapInstance);
          setMapInstance(null);
          setMapLoaded(false);
          console.log('Map cleanup completed');
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, [mapLoaded]);

  return { mapRef, mapInstance, infoWindow, mapLoaded, loading };
};
