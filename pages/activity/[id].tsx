import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import MapSingularComponent from '../../components/MapSingularComponent';
import Head from 'next/head';
import Link from 'next/link';


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

export default function ActivityPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState<Activity | null>(null);

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

  const convertToLocaleString = (dateTimeString: string | number | Date) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        setActivity(response.data);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  if (!activity) {
    return (
    <div className="flex justify-center container bg-gray-100 top-5 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
          <div className="font-bold text-black dark:text-white">Loading...</div>
    </div>)
  } 

  return (
    <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">

      <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
            <Head>  
              <title>Physical Fitness Activity Tracker System</title>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
              integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
              crossOrigin=""/>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <main>
                <div className='flex mx-auto justify-center'>
                  <div className="flex-1 justify-center max-w-4xl">
                    <div className="sticky top-5 text-center break-normal p-6 mb-3 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white">
                      <MapSingularComponent />
                      <h3 className="mb-2 text-2xl mt-2 font-bold tracking-tight text-gray-900 dark:text-white">{activity.name}</h3>
                      <p>Type: {activity.type}</p>
                      <p>Sport Type: {activity.sport_type}</p>
                      <p>Date & Time: {convertToLocaleString(activity.start_date_local)}</p>
                      <p>Elapsed Time: {Math.floor(activity.elapsed_time / 60)} minutes</p>
                      <p>Distance Took: {activity.distance} meters</p>
                      <Link href={`/dashboard`} passHref>
                            <button type="button" className="mt-5 flex-1 items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Return to Dashboard</button>
                      </Link>
                    </div>
                  </div>
                </div>
            </main>

            <footer>
            </footer>
      </div>
    </div>
  );
}
