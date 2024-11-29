import { RiBarChartHorizontalLine } from "react-icons/ri";
import { GoScreenNormal } from "react-icons/go";
import { GoScreenFull } from "react-icons/go";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"
import { CgProfile } from "react-icons/cg";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function Header({ handleAsideOpen }) {

    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullScreen(true);
            })
        } else {
            document.exitFullscreen().then(() => {
                setIsFullScreen(false)
            })
        }
    }

    const { data: session } = useSession()


    return <>

        <header className="header flex flex-sb">
            <div className="logo flex gap-2">
                <h1>BOOKLOOM</h1>

                {session ? <div className="headerham flex flex-center" onClick={handleAsideOpen}>

                    <RiBarChartHorizontalLine />

                </div> : null}

            </div>

            <div className="rightnav flex gap-2">
                <div onClick={toggleFullScreen}>
                    {isFullScreen ? <GoScreenNormal /> : <GoScreenFull />}

                </div>
                <div className="notification">
                    <IoIosNotificationsOutline />
                </div>
                <div className="profilenav">
                    <CgProfile />
                </div>
            </div>


        </header>

    </>



}