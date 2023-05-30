import { useState, useEffect } from 'react';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import polyline from '@mapbox/polyline';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

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

const MapComponent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngExpression | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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
    const fetchActivities = async () => {
      try {
        // Fetch activities using the access token
        const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        const polylines = [];
        for (let i = 0; i < response.data.length; i += 1) {
          const activity_polyline = response.data[i].map.summary_polyline;
          const activity_name = response.data[i].name;
          polylines.push({ activityPositions: polyline.decode(activity_polyline), activityName: activity_name });
        }

        setNodes(polylines);

        // Calculate the average latitude and longitude for the center
        const latlngs = response.data
          .filter((activity: Activity) => activity.start_latlng && isValidLatLng(activity.start_latlng))
          .map((activity: Activity) => activity.start_latlng!);

        if (latlngs.length > 0) {
          const totalLat = latlngs.reduce((sum: any, latlng: any[]) => sum + latlng[0], 0);
          const totalLng = latlngs.reduce((sum: any, latlng: any[]) => sum + latlng[1], 0);
          const avgLat = totalLat / latlngs.length;
          const avgLng = totalLng / latlngs.length;
          setMapCenter([avgLat, avgLng]);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
        {nodes.map((activity, i) => (
          <Polyline key={i} positions={activity.activityPositions}>
            <Popup>
              <div>
                <h2>{"Name: " + activity.activityName}</h2>
              </div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
