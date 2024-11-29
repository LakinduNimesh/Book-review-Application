import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";



const extractFirstParagraph = (markdown) => {
    // Split markdown by double newline to separate paragraphs
    const paragraphs = markdown.split('\n\n');

    // Return the first paragraph (assuming paragraphs[0] is the first paragraph)
    return paragraphs[0];
};

export default function Booksearch(props) {

    const { alldata = [], loading } = useFetchData('/api/books');  // Assuming useFetchData returns an object with allwork and loading

    const [searchResult, setSearchResult] = useState(null);
    const [booktitle, setBooktitle] = useState('');  // booktitle should be initialized as a string

    // filter for published books required
    const publishedData = alldata.filter(ab => ab.status === 'publish');

    // Function to handle search
    useEffect(() => {
        if (!booktitle.trim()) {  // Here, booktitle should be checked if it's an empty string
            setSearchResult([]);
            return;
        }

        const filteredbooks = publishedData.filter(book =>
            book.title.toLowerCase().includes(booktitle.toLowerCase())
        );

        setSearchResult(filteredbooks);  // setSearchResult should be used to update searchResult state

    }, [booktitle, alldata]);  // Include allwork in dependencies to ensure useEffect updates when data changes

    const handleBookClick = () => {
        setBooktitle('');  // This clears the input field when a book is clicked
    };

    if (loading) return <p>Loading...</p>; //Optionaly handle the loading state


    return <>
        <div className="searchblogfix">
            <div className="searchblogsectionfix">
                <div className="sbsfinput flex gap-1">
                    <input type="text"
                        placeholder='Search book here'
                        value={booktitle}
                        onChange={(e) => setBooktitle(e.target.value)}
                    />
                    <div className='sbsinputclose' onClick={props.cls}>
                        <IoClose />
                    </div>
                </div>
                <div className="sbsfsearchlist mt-2">
                    {booktitle && (<>
                        {searchResult.length === 0 ? <h3>No Book Found <span>(please check your spelling)</span></h3> : <>
                            {searchResult.slice(0, 10).map((book) => {
                                return <Link href={`/books/${book.slug}`} key={book._id} className="sbsfsbox" onClick={props.cls}>
                                    <h2>{book.title}</h2>
                                    <p>{extractFirstParagraph(book.description)}</p>
                                </Link>
                            })}

                        </>}
                    </>)}

                </div>
            </div>

        </div>
    </>
}