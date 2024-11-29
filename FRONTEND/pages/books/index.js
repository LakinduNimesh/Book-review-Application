import { Swiper, SwiperSlide } from 'swiper/react';
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { FreeMode } from 'swiper/modules';
import Head from 'next/head';
import { FaQuoteLeft } from 'react-icons/fa';
import { FaQuoteRight } from 'react-icons/fa6';
import Spinner from '@/components/Spinner';
import Link from 'next/link';
import Booksearch from '@/components/Booksearch';




export default function Books() {

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // for page 1
    const [perPage] = useState(3);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch book data
    const { alldata, loading } = useFetchData('/api/books');


    const [SearchInput, setSearchInput] = useState(false);

    const handleSearchOpen = () => {
        setSearchInput(!SearchInput);
    }

    const handleSearchClose = () => {
        setSearchInput(false);
    }

    // Function to handle page change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Total Number of books
    const allBookCount = alldata.length;

    // Filter all data based on search query
    const filteredBooks = searchQuery.trim() === ''
        ? alldata
        : alldata.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Calculate index of the first and last book displayed on the current page
    const indexOfFristBook = (currentPage - 1) * perPage;
    const indexOfLastBook = currentPage * perPage;

    // Get the current page's books
    const currentBooks = filteredBooks.slice(indexOfFristBook, indexOfLastBook);

    // Published books for slider
    const publishedData = currentBooks.filter(book => book.status === 'publish');
    const sliderPubData = alldata.filter(book => book.status === 'publish');

    // Pagination numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allBookCount / perPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Head>
                <title>Books</title>
            </Head>
            <div className="blogpage">
                <section className="tophero">
                    <div className="container">
                        <div className="toptitle">
                            <div className="toptitlecont flex">
                                <h1>Welcome to <span> BookLoom</span></h1>
                                <p>
                                    <FaQuoteLeft />Explore the latest additions to our collection—stories that
                                    inspire, knowledge that empowers, and adventures waiting to
                                    unfold. Dive into the world of recently uploaded books.<FaQuoteRight />
                                </p>

                                <div className="subemail">
                                    <form className="flex">
                                        <input
                                            onClick={handleSearchOpen}
                                            placeholder='Search books here...'
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button type="button"> Search </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="featured">
                            <div className="container">
                                <div className="border"></div>
                                <div className="featuredposts">
                                    <div className="fetitle flex">
                                        <h3>Featured Books</h3>
                                    </div>
                                    <div className="feposts flex">
                                        <Swiper
                                            slidesPerView="auto"
                                            freeMode={true}
                                            spaceBetween={30}
                                            className="mySwiper"
                                            modules={[FreeMode]}
                                        >
                                            {loading ? (
                                                <Spinner />
                                            ) : (
                                                sliderPubData.slice(0, 6).map((book) => (
                                                    <SwiperSlide key={book._id}>
                                                        <div className="fpost">
                                                            <Link href={`/books/${book.slug}`}>
                                                                <img src={book.images[0]} alt={book.title} />
                                                            </Link>
                                                            <div className="fpostinfo">
                                                                <div className="tegs flex">
                                                                    {book.bookcategory.map((cat) => {
                                                                        return <Link href={`/books/category${cat}`} className='ai'><span></span>{cat}</Link>
                                                                    })}
                                                                </div>
                                                                <h2><Link href={`/books/${book.slug}`}>{book.title}</Link></h2>
                                                                <div className="fpostby flex">
                                                                    <img src="/img/coder.jpg" alt="Coder" />
                                                                    <p>By {book.author}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))
                                            )}
                                        </Swiper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="populartegssec">
                    <div className="container">
                        <div className="border"></div>

                    </div>
                </section>
                <section className="latestpostsec">
                    <div className="container">
                        <div className="border"></div>
                        <div className="latestpostsdata">
                            <div className="fetitle">
                                <h3>Latest Books</h3>
                            </div>
                            <div className="latestposts">
                                {loading ? <Spinner /> : <>
                                    {publishedData.map((book) => {
                                        return <div className="lpost" key={book._id}>
                                            <div className="lpostimg">
                                                <Link href={`/books/${book.slug}`}>
                                                    <img src={book.images[0]} alt="" />
                                                </Link>
                                                <div className="tegs flex">
                                                    {book.bookcategory.map((cat) => {
                                                        return <Link href={`/books/category${cat}`} className='ai'><span></span>{cat}</Link>
                                                    })}
                                                </div>
                                            </div>
                                            <div className="lpostinfo">
                                                <h3><Link href={`/books/${book.slug}`}>{book.title}</Link></h3>
                                                <p>{book.description}</p>
                                                <h4 className="flex"><img src="/img/coder.jpg" alt="Coder" /><span></span> By {book.author}</h4>
                                            </div>

                                        </div>
                                    })}
                                </>}
                            </div>
                        </div>

                        {/*For Pagination */}
                        {publishedData.length === 0 ? ("") : (
                            <div className="blogspaginationbtn flex flex-center mt-3">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                {pageNumbers.filter(number => number !== 0).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, pageNumbers.length)).map(number => (
                                    <button key={number}
                                        onClick={() => paginate(number)}
                                        className={`${currentPage === number ? 'active' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={currentBooks.length < perPage}>Next</button>
                            </div>
                        )}

                    </div>
                    {SearchInput ? <Booksearch cls={handleSearchClose} /> : null}
                </section>
            </div>
        </>
    );
}
