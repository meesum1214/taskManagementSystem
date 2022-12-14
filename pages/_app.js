import '../styles/globals.css'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, [])



  return (
    <div>
      {/* Loading Wheel */}
      <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`}></div>

      <Component {...pageProps} setLoading={setLoading} />
    </div>
  )
}

export default MyApp
