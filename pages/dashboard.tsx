import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import 'tailwindcss/tailwind.css'
import { JSXElementConstructor, Key, ReactChild, ReactElement, ReactFragment, ReactNodeArray, ReactPortal } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L, { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';
import polyline from '@mapbox/polyline'
import LogoutButton from './components/LogOutButton'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

export default function Dashboard(){
    interface Activity {
      id: number;
      name: string;
      type: string;
      sport_type: string;
      start_date_local: Date;
      elapsed_time: number;
      distance: Float32Array;
      start_latlng: LatLngExpression | undefined;
      // Add other properties as needed
    }
    
    interface PersonalData{
      id: number;
      firstname: string;
      lastname: string;
      city: string;
      country: string;
      sex: string;
      weight: number;
    }
    
    interface Node {
      activityPositions: any;
      activityName: string;
    }
  
    const [activities, setActivities] = useState<Activity[]>([]);
    const [personalData, setPersonalData] = useState<PersonalData>();
    const [profilePicture, setProfilePicture] = useState('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    

    useEffect(() => {
      const fetchActivities = async () => {
          try {
            // Fetch activities using the access token
            const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
              },
            });
    
            setActivities(response.data);

            const polylines = [];
            for (let i = 0; i < response.data.length; i += 1) {
              const activity_polyline = response.data[i].map.summary_polyline;
              const activity_name = response.data[i].name;
              polylines.push({activityPositions: polyline.decode(activity_polyline), activityName: activity_name});
            }

            console.log(polylines)
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
          }
        };

        const fetchPersonalData = async () => {
          try {
            // Fetch personal data using the access token
            const response = await axios.get('https://www.strava.com/api/v3/athlete', {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
              },
            });
    
            setPersonalData(response.data);
          } catch (error) {
            console.error('Failed to fetch personal data:', error);
          }  
        };

        const fetchProfilePicture = async () => {
          try {
            const response = await axios.get('https://www.strava.com/api/v3/athlete', {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
              },
            });
    
            const { profile_medium } = response.data;
    
            setProfilePicture(profile_medium);
          } catch (error) {
            console.error('Failed to fetch profile picture:', error);
          }
        };

        fetchActivities();
        fetchPersonalData();
        fetchProfilePicture();
      }, []);

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

      const hasCoordinates = (activity: Activity) => {
        return activity.start_latlng && isValidLatLng(activity.start_latlng);
      };

      const isValidLatLng = (latlng: LatLngExpression | undefined) => {
        const [lat, lng] = latlng;
        return !isNaN(lat) && !isNaN(lng);
      };

      const MapComponent = () => {
        const [isClient, setIsClient] = useState(false);
      
        useEffect(() => {
          setIsClient(true);
        }, []);
      
        if (!isClient) {
          return null; // Render nothing on the server-side
        }
      
        return (
          <MapContainer center={mapCenter} zoom={14} style={{ height: '40em', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
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
        );
      };

      return (
        <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
        <Head>  
            <title>Physical Fitness Activity Tracker System</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
            crossOrigin=""/>
          </Head>

          <main>
              <div className='flex mx-auto justify-center'>
                
                <div className="flex-none max-w-sm justify-center">

                {personalData && (<div className="sticky top-5 text-center break-normal max-w-sm p-6 ml-6 mb-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white" key={personalData.id}>
                  <div>{profilePicture && <img className="rounded-full h-20 mb-4 mx-auto" src={profilePicture} alt="Profile Picture" />}</div>
                  <p className="font-bold">{personalData.firstname} {personalData.lastname}</p>
                  <p>{personalData.city}, {personalData.country}</p>
                  {personalData.sex === 'M' ? (
                    <p>Male</p>
                  ) : (
                    <p>Female</p>
                  )}
                  <p>{personalData.weight} kg</p>
                  <LogoutButton />
                  </div>)}

                </div>

                <div className="flex-1 justify-center max-w-4xl">

                  <div className="sticky top-5 text-center break-normal p-2 mr-5 mb-5 ml-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <MapComponent />
                  </div>   
                  
                </div> 

                <div className="flex-none justify-center">

                  <div className="overflow-hidden">
                    
                     
                        {activities &&
                          activities.map((activity: {
                            start_date_local: string | number | Date;
                            distance: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                            elapsed_time: number;
                            sport_type: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                            type: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined; id: Key | undefined;
                            name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
                          }) => (
                            <div className="text-center break-normal max-w-sm p-6 mt-5 mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-800" key={activity.id}>
                              <div className="mb-3 font-normal text-black dark:text-white">
                                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{activity.name}</h3>
                                <p>Type: {activity.type}</p>
                                <p>Sport Type: {activity.sport_type}</p>
                                <p>Date &amp; Time: {convertToLocaleString(activity.start_date_local)}</p>
                                <p>Elapsed Time: {Math.floor(activity.elapsed_time / 60)} minutes</p>
                                <p>Distance Took: {activity.distance} meters</p>
                              </div>
                            </div>
                          ))}
                      
                    </div>
                  
                </div>
                
              </div>

          </main>

          <footer>
          </footer>
        </div>
      )
}