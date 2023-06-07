import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import { JSXElementConstructor, Key, ReactChild, ReactElement, ReactFragment, ReactNodeArray, ReactPortal, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import router from 'next/router';
import MapComponent from '../components/MapComponent';
import Link from 'next/link';

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
      description: string;
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
    const [searchQuery, setSearchQuery] = useState('');
    
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

    const isAccessTokenValid = () => {
      if (typeof document !== 'undefined') {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        const accessTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('access_token='));
    
        if (accessTokenCookie) {
          const accessToken = accessTokenCookie.split('=')[1];
          return !!accessToken;
        }
      }
    
      return false;
    };
  

    useEffect(() => {

      if (!isAccessTokenValid()) {
        // Redirect to the login page if the access token is not valid
        router.push('/login')
      }

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

      const convertToLocaleString = (dateTimeString: string | number | Date) => {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString();
      };

      const handleLogout = async () => {
        try {
          // Make a request to the logout API route
          await axios.get('/api/logout')
    
          // Redirect the user to the dashboard or login page
          window.location.href = '/'
        } catch (error) {
          console.error('Logout failed', error)
        }
      }

      const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchQuery(e.target.value);
      };
    
      const filteredActivities = activities.filter((activity) =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      return (
        <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
         
            <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
            <Head>  
              <title>Physical Fitness Activity Tracker System</title>
              
              <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <main>
                <div className='flex mx-auto justify-center'>
                  
                  <div className="sticky flex-none max-w-sm justify-center">
                    <div className='sticky top-5'>
                      <div className="sticky top-5 items-center break-normal max-w-sm p-6 ml-6 mb-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white">
                        <div className="flex justify-center">
                          <img src="/pfats-logo.png" className="mt-1 mb-1 w-28" alt="PFATS"></img>
                        </div>
                      </div>
                    </div>

                    {personalData && (
                      <div className='sticky top-36'>
                        <div className="sticky top-5 text-center break-normal max-w-sm p-6 ml-6 mb-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white" key={personalData.id}>
                        <div>{profilePicture && <img className="rounded-full h-20 mb-4 mx-auto" src={profilePicture} alt="Profile Picture" />}</div>
                        <p className="font-bold">{personalData.firstname} {personalData.lastname}</p>
                        <p>{personalData.city}, {personalData.country}</p>
                        {personalData.sex === 'M' ? (
                          <p>Male</p>
                        ) : (
                          <p>Female</p>
                        )}
                        <p>{personalData.weight} kg</p>
                        <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 mt-4 rounded" onClick={handleLogout}>Log Out</button>
                        </div>
                      </div>)}
    
                  </div>
    
                  <div className="sticky flex-1 justify-center max-w-4xl">

                    <div className="sticky top-5 text-center break-normal p-2 mr-5 mb-9 ml-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">World Map</h3>
                    </div>  
    
                    <div className="sticky top-24 text-center break-normal p-2 mr-5 mb-5 ml-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <MapComponent />
                    </div>   
                    
                  </div> 
    
                  <div className="flex-none justify-center">
    
                    <div className="overflow-hidden">
                        <div className="text-center break-normal max-w-sm p-2 mt-5 mb-5 mr-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-800">
                          <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Recent Activities</h3>
                        </div>
                        
                        
                        <div className="text-center break-normal max-w-sm p-2 mt-5 mb-5 mr-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-800">
                          <input className="shadow appearance-none w-full rounded py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Search activity by name" onChange={handleSearch} />
                        </div>


                        {filteredActivities.map((activity) => (
                          <div className="text-center break-normal max-w-sm p-6 mt-5 mb-5 mr-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-800" key={activity.id}>
                          <div className="mb-3 font-normal text-black dark:text-white">
                            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{activity.name}</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p>Type:</p>
                                <p>Sport Type:</p>
                                <p>Date &amp; Time:</p>
                                <p>Elapsed Time:</p>
                                <p>Distance Took:</p>
                              </div>
                              <div>
                                <p>{activity.type}</p>
                                <p>{activity.sport_type}</p>
                                <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">{convertToLocaleString(activity.start_date_local)}</p>
                                <p>{Math.floor(activity.elapsed_time / 60)} minutes</p>
                                <p>{activity.distance} meters</p>
                              </div>
                            </div>
                            <Link href={`/activity/${activity.id}`} passHref>
                              <button type="button" className="mt-5 flex-1 items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                            </Link>
                            <Link href={(`/edit-activity/${activity.id}`)} passHref>
                              <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold ml-2 py-2 px-3 mt-4 rounded"> Edit </button>
                            </Link>
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
      
        </div>
      );
}