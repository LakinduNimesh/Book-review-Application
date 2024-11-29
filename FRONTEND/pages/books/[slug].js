// pages/books/[slug].js

import { SlCalender } from "react-icons/sl";
import { CiRead } from "react-icons/ci";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { BiLogoLinkedin } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { BsCopy } from "react-icons/bs";
import Link from "next/link";
import Head from "next/head";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import axios from "axios";
import { useRouter } from "next/router";
import useFetchData from "@/hooks/useFetchData";
import { Children, useEffect, useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import Booksearch from "@/components/Booksearch";
import ReactStars from "react-stars";

const BookPage = () => {


    const router = useRouter();

    const { slug } = router.query;//fetch all slug parameter from the router

    // hook for all data fetching
    const { alldata } = useFetchData('/api/books');

    const [SearchInput, setSearchInput] = useState(false);

    const handleSearchOpen = () => {
        setSearchInput(!SearchInput);
    }

    const handleSearchClose = () => {
        setSearchInput(false);
    }

    const [bookData, setBookData] = useState({ book: {}, comments: [] }); // initialoize comments as an empty array
    const [newComment, setNewComment] = useState({
        name: '',
        email: '',
        title: '',
        contentpera: '',
        rating: 0, // New field for rating
        maincomment: true,
        parent: null,
        parentName: '',
    });

    const handleRatingChange = (newRating) => {
        setNewComment({ ...newComment, rating: newRating });
    };

    const [editingComment, setEditingComment] = useState(null);  // Add this line

    // other code...

    const handleEdit = (comment) => {
        setEditingComment(comment);  // Now you can set the editing comment
    };


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageOk, setMessageOk] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {

        const fetchBookData = async () => {
            if (slug) {
                try {
                    const response = await axios.get(`/api/books/${slug}`);
                    setBookData(response.data);
                    setLoading(false);
                } catch (error) {
                    setError('Failed to ftech book data Please try again later');
                    setLoading(false);
                }
            }
        };

        fetchBookData();
    }, [slug]); //fetch data whenever slug changes

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`/api/books/${slug}`, newComment);

            //check if it's reply (nested comment) or root comment
            if (newComment.parent) {
                //add the new comment to it's parent's children array

                setBookData(prevData => {
                    const updatedComments = prevData.comments.map(comment => {
                        if (comment._id === newComment.parent) {
                            return {
                                ...comment,
                                children: [...comment.children, response.data]
                            }
                        } else if (comment.children && comment.children.length > 0) {
                            // recurdively update children comments 
                            return {
                                ...comment,
                                children: updateChildrenComments(comment.children, newComment.parent, response.data)

                            };
                        }
                        return comment;
                    });

                    return {
                        ...prevData,
                        comments: updatedComments
                    }
                })
            } else {
                // add new root comment 
                setBookData(prevData => ({
                    ...prevData,
                    comments: [response.data, ...prevData.comments]
                }))
            }

            setMessageOk('✅ Comment Posted Successfully');
            setTimeout(() => {
                setMessageOk('')
            }, 5000);

            // clear form after succesfully submission 
            setNewComment({
                name: '',
                email: '',
                title: '',
                contentpera: '',
                maincomment: true,
                parent: null,
                parentName: '' // reset parent name after submission
            })
        } catch (error) {
            setMessageOk('❌ failed to post comment')
            setTimeout(() => {
                setMessageOk('')
            }, 5000);
        }
    }

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`/api/comments/${commentId}`);
            // Update state to reflect changes
            setBookData((prevData) => ({
                ...prevData,
                comments: prevData.comments.filter((c) => c._id !== commentId),
            }));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    // for scroll down to comment form 
    const replyFormRef = useRef(null);

    const handleReply = (parentCommentId, parentName) => {
        setNewComment({
            ...newComment,
            parent: parentCommentId,
            parentName: parentName, //set parent name for reply
            maincomment: false // set maincomment to false for replies
        })
        if (replyFormRef.current) {
            replyFormRef.current.scrollIntoView({ behavior: 'smooth' })

        }
    }

    const handleRemoveReply = () => {
        setNewComment({
            ...newComment,
            parent: null,
            parentName: null,
            maincomment: true // set main comment to true
        })
    }

    const updateChildrenComments = (comments, parentId, newComment) => {
        return comments.map(comment => {
            if (comment._id === parentId) {
                //add a reply to children 
                return {
                    ...comment,
                    children: [...comment.children, newComment]
                }
            } else if (comment.children && comment.children.length > 0) {
                //recursively update comments
                return {
                    ...comment,
                    children: updateChildrenComments(comment.children, parentId, newComment)
                }
            }
            return comment;
        })
    }



    if (loading) {
        return <div className="flex flex-center wh_100">
            <Spinner />
        </div>
    }

    if (error) {
        return <p> Error : {error}</p>
    }

    const createdAtDate = bookData && bookData.book.createdAt ? new Date(bookData && bookData.book.createdAt) : null;

    //function to format the date as '08 November 2024 12.38pm'
    const formatDate = (date) => {
        //check if the date is valid
        if (!date || isNaN(date)) {
            return ''; // or handele the error as needed

        }

        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour12: true // use 12 hour format 
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    }


    const bookURL = `http://localhost:3000/books/${slug}`;


    const handleCopyURL = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000); // reset copied state after 3 seconds
    }

    const Code = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');

        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        }

        if (inline) {
            return <code>{children}</code>
        } else if (match) {
            return (
                <div style={{ position: 'relative' }}>
                    <SyntaxHighlighter
                        style={a11yDark}
                        language={match[1]}
                        PreTag='pre'
                        {...props}
                        codeTagProps={{ style: { padding: '0', borderRadius: '5px', overflow: 'auto', whiteSpace: 'pre-wrap' } }}

                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>

                    <button onClick={handleCopy} style={{ position: 'absolute', top: '0', right: '0', zIndex: '1', background: '#f79b50', color: '#fff', padding: '10px', borderRadius: '5px' }}>
                        {copied ? 'Copied' : 'Copy code'}
                    </button>
                </div>
            );
        } else {
            <code className="md-post-code" {...props}>
                {children}
            </code>
        }
    }

    const renderComments = (comments) => {
        if (!comments) {
            return null;
        }

        const commentsMap = new Map();
        comments.forEach(comment => {
            if (comment.maincomment) {
                commentsMap.set(comment._id, []);
            }
        });

        comments.forEach(comment => {
            if (!comment.maincomment && comment.parent) {
                if (commentsMap.has(comment.parent)) {
                    commentsMap.get(comment.parent).push(comment);
                }
            }
        });

        return comments
            .filter(comment => comment.maincomment)
            .map(parentComment => (
                <div className="blogcomment" key={parentComment._id}>
                    <h3>{parentComment.name} <span>{new Date(parentComment.createdAt).toLocaleString()}</span></h3>
                    <h4>Topic: <span>{parentComment.title}</span></h4>
                    <p>{parentComment.contentpera}</p>
                    <button onClick={() => handleReply(parentComment._id, parentComment.name)}>Reply</button>
                    <button onClick={() => handleDelete(parentComment._id)}>Delete</button>
                    <button onClick={() => setEditingComment(parentComment)}>Edit</button>
                    {parentComment.parent && (
                        <span className="repliedto">Replied to {parentComment.parentName}</span>
                    )}

                    <div className="children-comments">
                        {commentsMap.get(parentComment._id).map(childComment => (
                            <div className="child-comment" key={childComment._id}>
                                <h3>{childComment.name} <span>{new Date(childComment.createdAt).toLocaleString()}</span></h3>
                                <span>Replied to {childComment.parentName}</span>
                                <h4>Topic: <span>{childComment.title}</span></h4>
                                <p>{childComment.contentpera}</p>
                            </div>
                        ))}
                    </div>
                    <p>Rating: {parentComment.rating || 'No rating provided'}</p>
                </div>
            ));
    }



    return (
        <>
            <Head>
                <title>{slug}</title>
            </Head>

            <div>
                {bookData && (


                    <div className="blogslugpage">
                        <div className="container">
                            <div className="blogslugpagecont">

                                <div className="leftsitedetails">
                                    <div className="leftblogkinfoimg">
                                        <img src={bookData.book.images[0] || '/img/noimage.png'} alt={bookData && bookData.title} />
                                    </div>
                                    <div className="slugbloginfopub">
                                        <div className="flex gap-2">
                                            <div className="adminslug">
                                                <img src="/img/coder.jpg" alt="ADMIN" />
                                                <span>By {bookData.book.author}</span>
                                            </div>
                                            <div className="adminslug">
                                                <SlCalender />
                                                <span> {formatDate(createdAtDate)} </span>
                                            </div>
                                            <div className="adminslug">
                                                <CiRead />
                                                <span>Comments ({bookData.comments ? bookData.comments.length : 0})</span>
                                            </div>
                                        </div>

                                        <div className="shareblogslug">
                                            {/* Copy Url button */}
                                            <div title="Copy URL" onClick={() => handleCopyURL(bookURL)} style={{ cursor: 'pointer' }}>
                                                <BsCopy /> <span>{copied ? 'Copied!' : ''}</span>
                                            </div>

                                            {/* FaceBook ShareButton button */}
                                            <a target="_blank" href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(bookURL)}`} rel="noopener noreferer">
                                                <RiFacebookFill />
                                            </a>

                                            {/* twitter ShareButton button */}
                                            <a target="_blank" href={`https://twitter.com/intent/tweet?tweet=${encodeURIComponent('Check out this book post:' + bookURL)}`} rel="noopener noreferer">
                                                <RiTwitterXFill />
                                            </a>

                                            {/* whatsapp ShareButton button */}
                                            <a target="_blank" href={`https://wa.me?text=Check out this book: ${encodeURIComponent(bookURL)}`} rel="noopener noreferer">
                                                <RiWhatsappFill />
                                            </a>

                                            {/* linkedin  ShareButton button */}
                                            <a target="_blank" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bookURL)}`} rel="noopener noreferrer">
                                                <BiLogoLinkedin />
                                            </a>
                                        </div>
                                    </div>
                                    <h1>{bookData.book.title}</h1>
                                    {loading ? <Spinner /> : <div className="blogcontent">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code: Code
                                            }}

                                        >
                                            {bookData.book.description}
                                        </ReactMarkdown>
                                    </div>}

                                    <div className="blogslugtags">
                                        <div className="blogstegs">
                                            <h2>Tags </h2>
                                            <div className="flex flex-wrap gap-1">
                                                {bookData && bookData.book.tags.map((cat) => {
                                                    return <span key={cat}>{cat}</span>
                                                })}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="blogusecomments">
                                        <h2>Comments</h2>
                                        {renderComments(bookData.comments)}
                                    </div>

                                    <div className="blogslugcomments" ref={replyFormRef}>
                                        {newComment.parentName && (
                                            <h2>Leave a reply <span className="perentname">{newComment.parentName}</span>
                                                <button className="removereplybtn" onClick={handleRemoveReply}> Remove reply</button>
                                            </h2>
                                        )}



                                        <p>Your email will not be publish. Required fileds are marked *</p>
                                        <form className="leaveareplyform" onSubmit={handleCommentSubmit}>
                                            <div className="nameemailcomment">
                                                <input
                                                    type="text"
                                                    placeholder="Enter name"
                                                    value={newComment.name}
                                                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={newComment.email}
                                                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="rating">Review </label>
                                            <ReactStars
                                                count={5}
                                                value={newComment.rating}
                                                onChange={(newRating) =>
                                                    setNewComment({ ...newComment, rating: newRating })
                                                }
                                                size={30}
                                                activeColor="#ffd700"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Enter title"
                                                value={newComment.title}
                                                onChange={(e) => setNewComment({ ...newComment, title: e.target.value })}
                                            />
                                            <textarea
                                                name=""
                                                rows={4}
                                                placeholder="Enter your comments"
                                                id="textcomments"
                                                value={newComment.contentpera}
                                                onChange={(e) => setNewComment({ ...newComment, contentpera: e.target.value })}
                                            ></textarea>

                                            <div className="flex gap-2">
                                                <button type="submit">Post Comment</button>
                                                <p>{messageOk}</p>
                                            </div>

                                        </form>
                                    </div>

                                </div>

                                <div className="rightsitedetails">
                                    <div className="rightslugsearchbar">
                                        <input onClick={handleSearchOpen} type="text" placeholder="Search..." />
                                        <button><FiSearch /></button>
                                    </div>
                                    <div className="rightslugcategory">
                                        <h2>CATEGORIES</h2>
                                        <ul>
                                            <Link href='/books/category/Fiction'><li>Fiction <span>({alldata.filter(ab => ab.bookcategory[0] === 'Fiction').length})</span></li></Link>
                                            <Link href='/books/category/Non-Fiction'><li>Non-Fiction <span>({alldata.filter(ab => ab.bookcategory[0] === 'Non-Fiction').length})</span></li></Link>
                                            <Link href='/books/category/Fantasy'><li>Fantasy <span>({alldata.filter(ab => ab.bookcategory[0] === 'Fantasy').length})</span></li></Link>
                                            <Link href='/books/category/Romance'><li>Romance <span>({alldata.filter(ab => ab.bookcategory[0] === 'Romance').length})</span></li></Link>
                                            <Link href='/books/category/Thriller'><li>Thriller <span>({alldata.filter(ab => ab.bookcategory[0] === 'Thriller').length})</span></li></Link>
                                            <Link href='/books/category/Mystery'><li>Mystery <span>({alldata.filter(ab => ab.bookcategory[0] === 'Mystery').length})</span></li></Link>
                                            <Link href='/books/category/Science Fiction'><li>Science Fiction <span>({alldata.filter(ab => ab.bookcategory[0] === 'Science Fiction').length})</span></li></Link>
                                            <Link href='/books/category/Biography '><li>Biography <span>({alldata.filter(ab => ab.bookcategory[0] === 'Biography ').length})</span></li></Link>
                                            <Link href='/books/category/Self-Help'><li>Self-Help <span>({alldata.filter(ab => ab.bookcategory[0] === 'Self-Help').length})</span></li></Link>
                                            <Link href='/books/category/History'><li>History <span>({alldata.filter(ab => ab.bookcategory[0] === 'History').length})</span></li></Link>
                                            <Link href='/books/category/Young Adult'><li>Young Adult <span>({alldata.filter(ab => ab.bookcategory[0] === 'Young Adult').length})</span></li></Link>
                                            <Link href='/books/category/Poetry'><li>Poetry <span>({alldata.filter(ab => ab.bookcategory[0] === 'Poetry').length})</span></li></Link>
                                            <Link href='/books/category/Horror'><li>Horror <span>({alldata.filter(ab => ab.bookcategory[0] === 'Horror').length})</span></li></Link>
                                            <Link href='/books/category/Classics'><li>Classics <span>({alldata.filter(ab => ab.bookcategory[0] === 'Classics').length})</span></li></Link>
                                            <Link href='/books/category/Philosophy '><li>Philosophy  <span>({alldata.filter(ab => ab.bookcategory[0] === 'Philosophy ').length})</span></li></Link>

                                        </ul>
                                    </div>
                                    <div className="rightrecentpost">
                                        <h2>RECENT POSTED BOOKS</h2>
                                        {alldata.slice(0, 3).map((book) => {
                                            return <Link key={book._id} href={`/books/${book.slug}`} className="rightrecentp">
                                                <img src={book.images[0]} alt={book.title} />

                                                <div>
                                                    <h3>{book.title}</h3>
                                                    <h4 className="mt-1">
                                                        {book.tags.slice(0, 3).map((cat) => {
                                                            return <span key={cat}>{cat}</span>
                                                        })}
                                                    </h4>
                                                </div>
                                            </Link>
                                        })}
                                    </div>
                                </div>

                            </div>

                        </div>

                        {SearchInput ? <Booksearch cls={handleSearchClose} /> : null}

                    </div>


                )}
            </div >

        </>
    );
};

export default BookPage;
