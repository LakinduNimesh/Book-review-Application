import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react"

export default function Aside({ asideOpen, handleAsideOpen }) {

        const router = useRouter();
        const [clicked, setClicked] = useState(false);
        const [activeLink, setActiveLink] = useState('/');

        const handleClick = () => {
                setClicked(!clicked);
        }

        const handleLinkClick = (link) => {
                setActiveLink(preActive => (preActive === link ? null : link));
                setClicked(false);
        }

        useEffect(() => {
                //update active link state when the page is reloaded.
                setActiveLink(router.pathname);

        }, [router.pathname])

        const { data: session } = useSession()

        if (session) {

                return <>

                        <aside className={asideOpen ? 'asideleft active' : 'asideleft'}>
                                <ul>
                                        <Link href='/'>
                                                <li className="navactive">
                                                        <IoHome />
                                                        <span>DashBoard</span>
                                                </li>
                                        </Link>

                                        <li className={activeLink === '/books' ? 'navactive flex-col flex-left' : 'flex-col flex-left'} onClick={() => handleLinkClick('/books')}>
                                                <div className="flex gap-1">
                                                        <BsPostcard />
                                                        <span>Books</span>
                                                </div>
                                                {activeLink === '/books' && (
                                                        <ul>
                                                                <Link href='/books'><li>All Books</li></Link>
                                                                <Link href='/books/draft'><li>Draft Books</li></Link>
                                                                <Link href='/books/addbook'><li>Add Book</li></Link>
                                                        </ul>

                                                )}
                                        </li>





                                </ul>
                                <button onClick={() => signOut()} className="logoutbtn">Logout</button>
                        </aside>


                </>
        }



}