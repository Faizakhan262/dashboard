import React, { useEffect, useState } from 'react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import axios from 'axios';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

// Geocoding API (OpenCage or other geocoding APIs)
const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const API_KEY = '374a98f76fce430eb106be039f0de130';  // Replace with your OpenCage API Key or another geocoding API key.
const GEO_SERVER_URL = 'http://localhost:8080/geoserver/web/'; // GeoServer URL
const WORKSPACE = 'population_data'; // Your workspace in GeoServer
const DATA_STORE_NAME = 'geojson_store'; // Your data store in GeoServer

const CountryMap = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/geoserver/web/')
    .then(response => {
        console.log('GeoServer is reachable', response);
    })
    .catch(error => {
        console.error('Error reaching GeoServer', error);
    });

    // Fetch data from the users API (populated countries data)
    axios
      .get('http://localhost:5000/api/User')
      .then(async (response) => {
        const countryData = response.data;
        
        // Slice the data to only get the first 5 countries
        const firstFiveCountries = countryData.slice(0, 5);

        // Convert country data to GeoJSON for the first 5 countries
        const geoJson = await convertToGeoJSON(firstFiveCountries);

        // Upload GeoJSON to GeoServer
        await uploadGeoJSONToGeoServer(geoJson);

        // Create the map with a basemap
        const map = new Map({
          basemap: 'streets-navigation-vector',
        });

        // Create a new map view and set properties
        const view = new MapView({
          container: 'mapViewDiv',
          map: map,
          center: [0, 20], // Global view
          zoom: 2, // Zoom level
        });

        // Create a new graphics layer
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Loop through GeoJSON features and add them as Graphics
        geoJson.features.forEach((feature) => {
          const graphic = new Graphic({
            geometry: {
              type: 'point',
              longitude: feature.geometry.coordinates[0], // Longitude
              latitude: feature.geometry.coordinates[1],  // Latitude
            },
            attributes: feature.properties,
            symbol: getSymbolBasedOnProperty(feature.properties),
            popupTemplate: {
              title: "{country}",
              content: `
                <b>Population:</b> {population}<br>
                <b>Yearly Change:</b> {yearlyChange}<br>
                <b>Net Change:</b> {netChange}<br>
                <b>Density:</b> {density} P/Km²<br>
                <b>Land Area:</b> {landArea} Km²<br>
                <b>Migrants (net):</b> {migrants}<br>
                <b>Urban Population:</b> {urbanPopPercent}%<br>
                <b>World Share:</b> {worldShare}%<br>
                <b>Fertility Rate:</b> {fertilityRate}
              `
            }
          });

          // Add the graphic to the graphics layer
          graphicsLayer.add(graphic);
        });

        // Stop the loading state
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

  // Function to convert country data to GeoJSON format
  const convertToGeoJSON = async (countryData) => {
    const geoJson = {
      type: 'FeatureCollection',
      features: [],
    };

    // For each country in the user data, get its geolocation via geocoding API
    for (const country of countryData) {
      const coordinates = await getCoordinates(country['Country (or dependency)']);
      if (coordinates) {
        geoJson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat], // Longitude, Latitude
          },
          properties: {
            country: country['Country (or dependency)'],
            population: country['Population (2020)'],
            yearlyChange: country['Yearly Change'],
            netChange: country['Net Change'],
            density: country['Density (P/Km²)'], // Additional data
            landArea: country['Land Area (Km²)'],
            migrants: country['Migrants (net)'],
            urbanPopPercent: country['Urban Pop %'], // Additional data
            worldShare: country['World Share'],
            fertilityRate: country['Fertility Rate'], // Additional data
          },
        });
      }
    }

    return geoJson;
  };

  // Function to get the coordinates of a country using a geocoding API
  const getCoordinates = async (countryName) => {
    try {
      const response = await axios.get('http://localhost:8080/geoserver/web/')
console.log(response)
      if (response.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        return { lat, lng };
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${countryName}:`, error);
    }

    return null;
  };

  // Function to upload GeoJSON data to GeoServer
  const uploadGeoJSONToGeoServer = async (geoJsonData) => {
    try {
      const response = await axios.post(
       'http://localhost:8080/geoserver/web/' , // GeoServer's URL for GeoJSON upload
        geoJsonData, // Updated GeoJSON data with additional properties
        {
          headers: {
            'Content-Type': 'application/json', // Set the correct content type
            'Authorization': 'Basic ' + btoa('admin:geoserver'), // Use your GeoServer credecdntials
          }
        }
      );
      console.log('GeoJSON uploaded successfully!', response.data);
    } catch (error) {
      console.error('Error uploading GeoJSON to GeoServer:', error);
    }
  };

  // Function to determine the symbol based on property
  const getSymbolBasedOnProperty = (properties) => {
    const { density, urbanPopPercent, fertilityRate } = properties;

    // Customize the symbol based on population density
    let color = 'blue'; // Default color

    if (density > 500) {
      color = 'red'; // High-density countries (for example)
    } else if (urbanPopPercent > 70) {
      color = 'green'; // Countries with high urban population
    } else if (fertilityRate > 3) {
      color = 'orange'; // Countries with high fertility rate
    }

    return {
      type: 'simple-marker',
      color: color,
      size: '12px',
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    };
  };

  return (
    <div>
      <h1>Top Countries by Population</h1>
      {loading && <p>Loading...</p>}
      <div id="mapViewDiv" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default CountryMap;
