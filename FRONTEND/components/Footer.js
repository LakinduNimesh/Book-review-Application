import Link from "next/link";
import { FaBehance, FaFacebookF, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";
import { GrLinkedinOption } from "react-icons/gr";
import { LiaBasketballBallSolid } from "react-icons/lia";
import { RiTwitterXLine } from "react-icons/ri";

export default function Footer() {
    return <>
        <footer className="footer">
            <div className="footersec flex flex-center flex-col gap-2">
                <div className="logo">
                    <img src="/img/logo.png" alt="LOGO" />
                </div>

                <ul className="hero_social">
                    <li><a href="#" target="_blank"><RiTwitterXLine /></a></li>
                    <li><a href="#" target="_blank"><FaInstagram /></a></li>
                    <li><a href="#" target="_blank"><FaGithub /></a></li>
                    <li><a href="#" target="_blank"><FaFacebookF /></a></li>
                    <li><a href="#" target="_blank"><FaBehance /></a></li>



                </ul>

                <div className="copyrights">&copy: 2024 All Rights Reserved By <span> <Link href='https://www.linkedin.com/in/lakindu-nimesh/'>Lakindu_Nimesh</Link></span></div>
            </div>
        </footer>
    </>
}