import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import 'tailwindcss/tailwind.css'
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const redirectTo = () =>{
    router.push('/login');
  }

  return (
    <div className="container bg-white dark:bg-gray-700 h-screen w-screen max-w-full">
      <Head>  
        <title>Personalized User Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className='flex justify-center items-center'>

          <div className="grid">

            <div className="max-w-sm p-6 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Personalized User Dashboard</h3>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A personalized user dashboard using the Strava API.</p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">To use the personalized user dashboard, the user must login to their Strava account and the user can retrieve the details of the activities done by the user.</p>
              <button onClick={redirectTo} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login with Strava</button>
            </div>
            
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
