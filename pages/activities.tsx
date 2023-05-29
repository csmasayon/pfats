import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import 'tailwindcss/tailwind.css'

type ConnectionStatus = {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container bg-white dark:bg-gray-700 h-screen w-screen max-w-full">
     <Head>  
        <title>Personalized User Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className='flex justify-center items-center'>

          <div className="grid">

            <h1 className="title">
              Welcome to <a href="https://nextjs.org">Next.js with MongoDB!</a>
            </h1>


            <a href="https://nextjs.org/docs" className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Documentation &rarr;</h3>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Find in-depth information about Next.js features and API.</p>
            </a>

            
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
