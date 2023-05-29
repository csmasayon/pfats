import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const redirectTo = () =>{
    router.push('/login');
  }

  return (
    <div className="container bg-gray-100 dark:bg-gray-700 min-w-full min-h-screen mx-auto">
      <Head>
        <title>Physical Fitness Activity Tracker System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className='flex justify-center items-center'>

          <div className="grid">

            <div className="text-center max-w-sm p-6 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Physical Fitness Activity Tracker System</h3>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A Physical Fitness Activity Tracker System using the Strava API.</p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">To use the Physical Fitness Activity Tracker System, the user must login to their Strava account and the user can retrieve the details of the activities done by the user.</p>
              <button onClick={redirectTo} className="flex-1 items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login with <img src="/strava.png" className="ml-1 mt-1 h-5" alt="Strava"></img></button>
            </div>
            
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
