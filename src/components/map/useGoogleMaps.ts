
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

  useEffect(() => {
    const initMap = async () => {
      if (mapRef.current && !mapLoaded) {
        try {
          // Try to load Google Maps with a dummy API key - in production, use a real API key
          const loader = new Loader({
            apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
            version: "weekly",
            libraries: ["places"]
          });
          
          const googleMaps = await loader.load();
          const map = new googleMaps.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 }, // Default to New York
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
          
          // Create a single info window instance to reuse
          const infoWindowInstance = new googleMaps.maps.InfoWindow();
          
          setMapInstance(map);
          setInfoWindow(infoWindowInstance);
          setMapLoaded(true);
          
          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.setCenter(pos);
                
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
              () => {
                console.log("Error: The Geolocation service failed.");
              }
            );
          }
          
        } catch (error) {
          console.error("Error loading Google Maps:", error);
          toast({
            title: "Error loading map",
            description: "Please check your internet connection and try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    initMap();
  }, [mapLoaded]);

  return { mapRef, mapInstance, infoWindow, mapLoaded, loading };
};
