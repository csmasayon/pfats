import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';


interface EditActivityPageProps {
    activityId: string;
  }
  
  interface ActivityFormData {
    name: string;
    type: string;
    sport_type: string;
    elapsed_time: number;
    distance: string;
  }
  
const EditActivityPage: React.FC<EditActivityPageProps> = ({ activityId }) => {
    const router = useRouter();
    const { id } = router.query;
    const [activityData, setActivityData] = useState<ActivityFormData>();

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
        const fetchActivityData = async () => {
            try {
              const response = await axios.get(`https://www.strava.com/api/v3/activities/${id}`, {
                headers: {
                  Authorization: `Bearer ${getAccessToken()}`,
                },
              });
      
              setActivityData(response.data);
            } catch (error) {
              console.error('Failed to fetch activity:', error);
            }
          };
      
          if (id) {
            fetchActivityData();
          }
    }, [id]);
  
    // Function to handle form submission and update the activity
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
      
        try {
          // Make a request to update the activity using the Strava API
          await axios.put(`https://www.strava.com/api/v3/activities/${id}`, activityData, {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          });
      
          // Redirect the user back to the dashboard or any other desired page
          router.push('/dashboard');
        } catch (error) {
          console.error('Failed to update activity:', error);
        }
      };
  
    if (!activityData) {
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
                      <div className="sticky top-5 text-center break-normal p-6 ml-6 mb-3 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white">
                        <div>
                            <form onSubmit={handleSubmit}>
                            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Activity</h3>
                            
                            <div className="mt-2 mb-2">
                                <label className="text-black dark:text-white">Activity Name: </label>
                            </div>

                            <div>
                                <input type="text" className="shadow appearance-none rounded w-min py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" placeholder={activityData.name} value={activityData.name} onChange={(e) => setActivityData({ ...activityData, name: e.target.value })}/>
                            </div>
                            
                            <div className="mt-2 mb-2">
                                <label className="text-black dark:text-white">Type: </label>
                            </div>

                            <div>
                                <input type="text" className="shadow appearance-none rounded w-min py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" placeholder={activityData.type} value={activityData.type} onChange={(e) => setActivityData({ ...activityData, type: e.target.value })}/>
                            </div>

                            <div className="mt-2 mb-2">
                                <label className="text-black dark:text-white">Sport Type: </label>
                            </div>

                            <div>
                                <input type="text" className="shadow appearance-none rounded w-min py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" placeholder={activityData.sport_type} value={activityData.sport_type} onChange={(e) => setActivityData({ ...activityData, sport_type: e.target.value })}/>
                            </div>

                            <div className="mt-2 mb-2">
                                <label className="text-black dark:text-white">Elapsed Time (in seconds): </label>
                            </div>

                            <div>
                                <input type="string" className="shadow appearance-none rounded w-min py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" placeholder={activityData.elapsed_time.toString()} value={activityData.elapsed_time} onChange={(e) => setActivityData({ ...activityData, elapsed_time: Number(e.target.value) })}/>
                            </div>

                            <div className="mt-2 mb-2">
                                <label className="text-black dark:text-white">Distance (in meters): </label>
                            </div>

                            <div>
                                <input type="text" className="shadow appearance-none rounded w-min py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline" placeholder={activityData.distance.toString()} value={activityData.distance.toString()} onChange={(e) => setActivityData({ ...activityData, distance: e.target.value })}/>
                            </div>
                           
                            <div>
                                <button type="submit" className="mt-5 flex-1 items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
                            </div>
                            
                            

                            </form>
                        </div>
                    </div>
                  </div>
                  </div>
              </main>
  
              <footer>
              </footer>
        </div>
      </div>
    );
  };
  
  export default EditActivityPage;
  