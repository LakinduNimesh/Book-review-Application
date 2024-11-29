import Spinner from '@/components/Spinner';
import useFetchData from '@/hooks/useFetchData';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';


export default function Category() {

    const router = useRouter();
    const { category } = router.query;

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // for page 1
    const [perPage] = useState(3);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    //fetch book category data 
    const { alldata, loading } = useFetchData(`/api/books?bookcategory=${category}`);

    // Filter all data based on search query
    const filteredBooks = alldata.filter((item) => item.category === item.category).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

    const bookcategoryData = [...filteredBooks].reverse();

    // Function to handle page change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const allBook = alldata.length; // total number of Books

    // Calculate index of the first and last Book displayed on the current page
    const indexOfFirstBook = (currentPage - 1) * perPage;
    const indexOfLastBook = currentPage * perPage;

    // Get the current page's Books
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    // Published Books for slider
    const publishedData = currentBooks.filter(blog => book.status === 'publish');

    // Pagination numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allBook / perPage); i++) {
        pageNumbers.push(i);
    }


    return <>
        <Head>
            <title>Book category page</title>
        </Head>
        <div className="blogcategory">
            <section className="tophero">
                <div className="container">
                    <div className="toptitle">
                        <div className="toptitlecont flex">
                            <h1>Category <span>{category}</span></h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="latestpostsec">
                <div className="container">
                    <div className="border"></div>
                    <div className="latestpostsdata">
                        <div className="fetitle">
                            <h3>{category} Articles</h3>
                        </div>
                        <div className="latestposts">
                            {loading ? <Spinner /> : <>
                                {publishedData.map((book) => {
                                    return <div className="lpost" key={book._id}>
                                        <div className="lpostimg">
                                            <Link href={`/blogs/${book.slug}`}>
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
                                            <p>{blog.description}</p>
                                            <h4 className="flex"><img src="/img/coder.jpg" alt="Coder" /><span></span> By {book.author}</h4>
                                        </div>

                                    </div>
                                })}
                            </>}
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
                </div>
            </section>
        </div>
    </>
}