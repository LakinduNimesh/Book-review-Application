import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import "@/styles/globals.css";
import AOS from "aos";
import 'aos/dist/aos.css'
import { useEffect, useState } from "react";


export default function App({ Component, pageProps }) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleComplate = () => {
      setIsLoading(false);
    }

    //simulate a loading delay 
    setTimeout(handleComplate, 3000);

    return () => {
      clearTimeout(handleComplate);
    }
  }, [])

  //aos animation
  useEffect(() => {
    //initialize aos

    AOS.init({
      //global settings
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,

      //settings that can be overriten
      offset: 100,
      delay: 0,
      duration: 900,
      easing: 'ease',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',

    })
  }, [])

  return <>
    <Preloader isLoading={isLoading} />
    <Header />
    {!isLoading && (

      <main id="site-wrapper">
        <Component {...pageProps} />
      </main>
    )}
    <Footer />
  </>
}
