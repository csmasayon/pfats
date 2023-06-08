import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';


interface EditActivityPageProps {
    activityId: string;
  }
  
  interface ActivityFormData {
    name: string;
    sport_type: string;
    elapsed_time: string;
    distance: string;
    description: string;
  }
  
const EditActivityPage: React.FC<EditActivityPageProps> = ({ activityId }) => {
    const router = useRouter();
    const { id } = router.query;
    const [activityData, setActivityData] = useState<ActivityFormData>();
    const [showBox, setShowBox] = useState(false);

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
      
          alert('Activity has been updated successfully!');
          // Redirect the user back to the dashboard or any other desired page
          router.push('/dashboard');
        } catch (error) {
          alert('Failed to update activity:' + error);
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
                <link rel="icon" href="/favicon.ico" />
                <script src="https://cdn.tailwindcss.com"></script>
              </Head>
              
              <main>
                  <div className='flex mx-auto justify-center'>
                    <div className="flex-1 justify-center max-w-4xl">
                      <div className="sticky top-5 text-center break-normal p-6 ml-6 mb-5 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 font-normal text-black dark:text-white">
                        <div>
                        <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Update Activity Details</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="mt-2 mb-2">
                              <label className="text-black dark:text-white">Activity Name: </label>
                            </div>
                            <div>
                              <input
                                type="text"
                                className="shadow appearance-none rounded w-full py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={activityData.name}
                                value={activityData.name}
                                onChange={(e) => setActivityData({ ...activityData, name: e.target.value })}
                              />
                            </div>
                            <div className="mt-2 mb-2">
                              <label className="text-black dark:text-white">Activity Description: </label>
                            </div>
                            <div>
                              <textarea
                                className="shadow appearance-none rounded w-full py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline resize-y"
                                placeholder={activityData.description ? activityData.description.toString() : ''}
                                value={activityData.description ? activityData.description.toString() : ''}
                                onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mt-2 mb-2 flex items-center justify-center">
                              <label className="text-black dark:text-white">Sport Type: </label>
                              <div className="relative inline-block ml-2" onMouseEnter={() => setShowBox(true)} onMouseLeave={() => setShowBox(false)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12" y2="8" />
                              </svg>
                              {showBox && (
                                <div className={`absolute top-0 left-0 mt-8 ml-4 p-2 bg-white rounded text-black shadow transition-opacity duration-300 ${
                                  showBox ? 'opacity-100' : 'opacity-0'
                                }`}>
                                  AlpineSki, BackcountrySki, Badminton, Canoeing, Crossfit, EBikeRide, Elliptical, EMountainBikeRide, Golf, GravelRide, Handcycle, HighIntensityIntervalTraining, Hike, IceSkate, InlineSkate, Kayaking, Kitesurf, MountainBikeRide, NordicSki, Pickleball, Pilates, Racquetball, Ride, RockClimbing, RollerSki, Rowing, Run, Sail, Skateboard, Snowboard, Snowshoe, Soccer, Squash, StairStepper, StandUpPaddling, Surfing, Swim, TableTennis, Tennis, TrailRun, Velomobile, VirtualRide, VirtualRow, VirtualRun, Walk, WeightTraining, Wheelchair, Windsurf, Workout, Yoga
                                </div>
                              )}
                            </div>
                              <div className="relative inline-block ml-2" onMouseEnter={() => setShowBox(true)} onMouseLeave={() => setShowBox(false)}>
                                {/* SVG code */}
                              </div>
                            </div>
                            <div>
                              <input
                                type="text"
                                className="shadow appearance-none rounded w-full py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={activityData.sport_type}
                                value={activityData.sport_type}
                                onChange={(e) => setActivityData({ ...activityData, sport_type: e.target.value })}
                              />
                            </div>
                            <div className="mt-2 mb-2">
                              <label className="text-black dark:text-white">Elapsed Time (in seconds): </label>
                            </div>
                            <div>
                              <input
                                type="string"
                                className="shadow appearance-none rounded w-full py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={activityData.elapsed_time.toString()}
                                value={activityData.elapsed_time.toString()}
                                onChange={(e) => setActivityData({ ...activityData, elapsed_time: e.target.value })}
                              />
                            </div>
                            <div className="mt-2 mb-2">
                              <label className="text-black dark:text-white">Distance (in meters): </label>
                            </div>
                            <div>
                              <input
                                type="text"
                                className="shadow appearance-none rounded w-full py-2 px-3 text-black border-black leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={activityData.distance.toString()}
                                value={activityData.distance.toString()}
                                onChange={(e) => setActivityData({ ...activityData, distance: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <button type="submit" className="mt-5 flex-1 items-center space-x-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Update</button>
                            <Link href="/dashboard" passHref>
                              <button type="button" className="mt-5 ml-5 flex-1 items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Return to Dashboard</button>
                            </Link>
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
  