import { useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import polyline from '@mapbox/polyline';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import { useRouter } from 'next/router';

interface Activity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: Date;
  elapsed_time: number;
  distance: Float32Array;
  start_latlng: LatLngExpression | undefined;
}

interface Node {
  activityPositions: any;
  activityName: string;
}

const MapSingularComponent = () => {
  const [node, setNode] = useState<Node | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  const getAccessToken = () => {
    // Get the access token from the cookie
    const name = 'access_token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }

    return '';
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Fetch the activity using the access token and activity ID
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
  
        const activity_polyline = response.data.map.summary_polyline;
        const activity_name = response.data.name;
        const positions = polyline.decode(activity_polyline);
  
        setNode({ activityPositions: positions, activityName: activity_name });
  
        // Set the map center to the start latitude and longitude of the activity
        const startLatLng = response.data.start_latlng;
        if (isValidLatLng(startLatLng)) {
          setMapCenter(startLatLng);
        }
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  },[]);

  const isValidLatLng = (latlng: LatLngExpression | undefined) => {
    if (!latlng) {
      return false;
    }

    const [lat, lng] = latlng as [number, number];

    return !isNaN(lat) && !isNaN(lng);
  };


  if (loading) {
    return <div className="font-bold text-black dark:text-white">Loading...</div>;
  }

  return (
    <div>
      <MapContainer center={mapCenter || [0, 0]} zoom={14} style={{ height: '40em', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {node && (
          <Polyline positions={node.activityPositions}>
            <Popup>
              <div>
                <h2>{"Name: " + node.activityName}</h2>
              </div>
            </Popup>
          </Polyline>
        )}
      </MapContainer>
    </div>
  );
};

export default MapSingularComponent;
