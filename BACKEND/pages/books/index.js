import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";
import { FaBloggerB } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from 'next/link';


export default function Books() {

    //pagination
    const [currentPage, setCurrentPage] = useState(1);//for page 1
    const [perPage] = useState(7);

    //search
    const [searchQuery, setSearchQuery] = useState('');

    //fetch book data
    const { alldata, loading } = useFetchData('/api/books');

    // function to handle page chaneg
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    //Total Number of books
    const allbook = alldata.length;

    // filter all data based on search Query
    const filteredBooks = searchQuery.trim() === '' ? alldata : alldata.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // calculate index of the frist page book displayed on the current page
    const indexOfFristBook = (currentPage - 1) * perPage;
    const indexOfLastBook = currentPage * perPage;

    //get the current pages books
    const currentBooks = filteredBooks.slice(indexOfFristBook, indexOfLastBook);

    const publishedBooks = currentBooks.filter(ab => ab.status === 'publish');

    const pageNumbers = [];

    for (let i = 0; i <= Math.ceil(allbook / perPage); i++) {
        pageNumbers.push(i);

    }




    return <>

        <div className="bookpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>All Published <span>Books</span></h2>
                    <h3>ADMIN PANEL</h3>
                </div>

                <div className="breadcrumb">
                    <FaBloggerB /> <span>/</span> <span>Books</span>
                </div>

            </div>

            <div className="bookstable">
                <div className="flex gap-2 mb-1">
                    <h2>Search Books: </h2>
                    <input value={searchQuery} onChange={ev => setSearchQuery(ev.target.value)} type="text" placeholder="Search by title." />
                </div>
                <table className="table table-styling">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <>
                            <tr>
                                <td>
                                    <Dataloading />
                                </td>
                            </tr>
                        </> : <>
                            {publishedBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        No Books Found
                                    </td>
                                </tr>
                            ) : (publishedBooks.map((book, index) => (
                                <tr key={book}>
                                    <td>{indexOfFristBook + index + 1}</td>
                                    <td><img src={book.images[0]} width={180} alt="image" /></td>
                                    <td><h3>{book.title}</h3></td>
                                    <td>
                                        <div className="flex gap-2 flex-center">
                                            <Link href={'/books/edit/' + book._id}> <button><MdEditSquare /></button>  </Link>
                                            <Link href={'/books/delete/' + book._id}> <button><MdDeleteForever /></button>  </Link>

                                        </div>
                                    </td>
                                </tr>
                            ))
                            )}
                        </>}
                    </tbody>
                </table>
                {/*For Pagination */}
                {publishedBooks.length === 0 ? ("") : (
                    <div className="bookpagination">
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
    </>
}