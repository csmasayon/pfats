import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import 'tailwindcss/tailwind.css'
import { JSXElementConstructor, Key, ReactChild, ReactElement, ReactFragment, ReactNodeArray, ReactPortal } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Activity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: Date;
  elapsed_time: number;
  distance: Float32Array;
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

export default function Dashboard(){
    const [activities, setActivities] = useState<Activity[]>([]);
    const [personalData, setPersonalData] = useState<PersonalData>();
    const [profilePicture, setProfilePicture] = useState('');

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

  return (
    <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
     <Head>  
        <title>Personalized User Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
          <div className='flex mx-auto'>

            <div className="flex-none max-w-sm">

              {(personalData: { firstname: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                lastname: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                city: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                country: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                sex: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                weight: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined; }) =>
                (<div className="text-center break-normal max-w-sm p-6 mt-5 ml-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3 font-normal text-black dark:text-white">
                <div>{profilePicture && <img className="rounded-full h-20 mb-4 mx-auto" src={profilePicture} alt="Profile Picture" />}</div>
                <p className="font-bold">{personalData.firstname} {personalData.lastname}</p>
                <p>{personalData.city}, {personalData.country}</p>
                <p>Sex: {personalData.sex}</p>
                <p>{personalData.weight} kg</p>
                </div>)}

            </div>

            <div className="flex-1 grid justify-center">

                {activities && activities.map((activity: {
                  start_date_local: string | number | Date;
                  distance: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                  elapsed_time: number;
                  sport_type: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
                  type: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined; id: Key | undefined; name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; 
                  }) => (
                    <div className="text-center break-normal max-w-sm p-6 mt-5 mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"><div className='mb-3 font-normal text-black dark:text-white' key={activity.id}>
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{activity.name}</h3>
                    <p>Type: {activity.type}</p>
                    <p>Sport Type: {activity.sport_type}</p>
                    <p> Date &amp; Time: {convertToLocaleString(activity.start_date_local)}</p>
                    <p>Elapsed Time: {Math.floor(activity.elapsed_time/60)} minutes</p>
                    <p>Distance Took: {activity.distance} meters</p></div></div>
                ))}

                        
                
            </div> 

            
          </div>

        
      </main>

      <footer>
      </footer>
    </div>
  )
}
