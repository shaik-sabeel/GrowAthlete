import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Fallback/Demo coordinates for cities
const CITY_COORDINATES = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
  'Bangalore': [12.9716, 77.5946],
  'Bengaluru': [12.9716, 77.5946],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Chandigarh': [30.7333, 76.7794],
  'Bhopal': [23.2599, 77.4126],
  'Indore': [22.7196, 75.8577],
  'Patna': [25.5941, 85.1376],
  'Ranchi': [23.3441, 85.3096],
  'Guwahati': [26.1158, 91.7086],
  'Bhubaneswar': [20.2961, 85.8245],
  'Thiruvananthapuram': [8.5241, 76.9366],
  'Visakhapatnam': [17.6868, 83.2185],
  'Kochi': [9.9312, 76.2673],
  'Surat': [21.1702, 72.8311],
  'Nagpur': [21.1458, 79.0882],
  'Coimbatore': [11.0168, 76.9558],
  'Vadodara': [22.3072, 73.1812],
  'Kanpur': [26.4499, 80.3319],
  'Ludhiana': [30.9010, 75.8573],
  'Agra': [27.1767, 78.0081],
  'Nashik': [19.9975, 73.7898],
  'Faridabad': [28.4089, 77.3178],
  'Meerut': [28.9845, 77.7064],
  'Rajkot': [22.3039, 70.8022],
  'Varanasi': [25.3176, 82.9739],
  'Srinagar': [34.0837, 74.7973],
  'Aurangabad': [19.8762, 75.3433],
  'Dhanbad': [23.7957, 86.4304],
  'Amritsar': [31.6340, 74.8723],
  'Navi Mumbai': [19.0330, 73.0297],
  'Allahabad': [25.4358, 81.8463],
  'Prayagraj': [25.4358, 81.8463],
  'Howrah': [22.5958, 88.2636],
  'Jabalpur': [23.1815, 79.9864],
  'Gwalior': [26.2183, 78.1828],
  'Vijayawada': [16.5062, 80.6480],
  'Jodhpur': [26.2389, 73.0243],
  'Madurai': [9.9252, 78.1198],
  'Raipur': [21.2514, 81.6296],
  'Kota': [25.2138, 75.8648],
  'Dehradun': [30.3165, 78.0322],
  'Mysore': [12.2958, 76.6394],
  'Mysuru': [12.2958, 76.6394],
  'Gurgaon': [28.4595, 77.0266],
  'Gurugram': [28.4595, 77.0266],
  'Noida': [28.5355, 77.3910],
  'Ghaziabad': [28.6692, 77.4538],
  'Shimla': [31.1048, 77.1734],
  'Manali': [32.2432, 77.1892],
  'Goa': [15.2993, 74.1240], // Panaji coords
  'Panaji': [15.2993, 74.1240]
};

const getCoordinates = (locationString) => {
  if (!locationString) return null;

  // Try to find a city name in the location string
  const city = Object.keys(CITY_COORDINATES).find(city =>
    locationString.toLowerCase().includes(city.toLowerCase())
  );

  return city ? CITY_COORDINATES[city] : null;
};

const MapSection = ({ tournaments = [] }) => {
  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Filter tournaments with valid coordinates
  const markers = tournaments
    .map(t => ({
      ...t,
      coordinates: getCoordinates(t.location)
    }))
    .filter(t => t.coordinates);

  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-8 z-0 relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Tournament Locations</h2>
      <div className="relative w-full overflow-hidden rounded-md h-96 z-0">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((tournament) => (
            <Marker
              key={tournament._id}
              position={tournament.coordinates}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="block text-indigo-600 mb-1">{tournament.title}</strong>
                  <span className="block text-gray-600 mb-1">{tournament.location}</span>
                  <span className="block text-gray-500 text-xs">{tournament.dateRange}</span>
                  <span className="block font-medium mt-1 text-green-600">{tournament.status}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {markers.length === 0 && (
            <div className="leaflet-bottom leaflet-right">
              <div className="leaflet-control leaflet-bar p-2 bg-white text-xs text-gray-500">
                No mappable locations found
              </div>
            </div>
          )}
        </MapContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Showing available tournaments across the region.
      </p>
    </div>
  );
};

export default MapSection;