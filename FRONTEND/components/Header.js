import Link from "next/link";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { FaMoon } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuSun, LuSunMoon } from "react-icons/lu";

export default function Header() {

    // Dark mode on/off
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage for dark mode preference on initial load
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
    }, []);

    useEffect(() => {
        // Apply dark mode styles when darkMode state changes
        if (darkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };



    // navlist active
    const router = useRouter();
    const [clicked, setClicked] = useState();
    const [activeLink, setActiveLink] = useState('/');

    const handleClick = (link) => {
        setActiveLink(link);
        setClicked(false);
    }

    useEffect(() => {
        //update active link state when the page is reloaded
        setActiveLink(router.pathname);

    }, [router.pathname]);


    //mobile navbar

    const [mobile, setMobile] = useState(false);

    //Open
    const handleMobileOpen = () => {
        setMobile(!mobile);
    }

    // Close
    const handleMobileClose = () => {
        setMobile(false);
    }


    return <>
        <header>
            <nav className="container flex flex-sb">
                <div className="logo flex gap-2">
                    <Link href='/'><img src={`/img/${darkMode ? 'white' : 'logo'}.png`} alt="logo" /></Link>
                    <h2>BOOKLOOM</h2>
                </div>

                <div className="navlist flex gap-2">
                    <ul className="flex gap-2">
                        <li>
                            <Link href='/' onClick={() => handleClick('/')} className={activeLink === '/' ? 'active' : ''}>Home</Link>
                        </li>
                        <li>
                            <Link href='/books' onClick={() => handleClick('/books')} className={activeLink === '/books' ? 'active' : ''}>Books</Link>
                        </li>




                    </ul>
                    <div className="darkmodetoggle" onClick={toggleDarkMode}>
                        {darkMode ? <FaMoon /> : <LuSun />}

                    </div>

                </div>
                <div className="mobiletogglesvg" onClick={handleMobileOpen}>
                    < HiMiniBars3BottomRight />
                </div>
                <div className={mobile ? 'mobilenavlist active' : 'mobilenavlist'}>
                    <span className={mobile ? 'active' : ''} onClick={handleMobileClose}></span>
                    <div className="mobilelogo">
                        <img src="/img/white.png" alt="logo" />
                        <h2>laki-Nimesh</h2>
                    </div>
                    <ul className="flex gap-1 flex-col flex-left mt-3" onClick={handleMobileClose}>
                        <li>
                            <Link href='/' onClick={() => handleClick('/')} className={activeLink === '/' ? 'active' : ''}>Home</Link>
                        </li>

                        <li>
                            <Link href='/books' onClick={() => handleClick('/books')} className={activeLink === '/books' ? 'active' : ''}>Blogs</Link>
                        </li>

                    </ul>
                    <p>copyright & copy; 2024 | lakindu_nimesh</p>

                </div>
            </nav>

        </header>

    </>
}