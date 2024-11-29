import Head from "next/head";
import Link from "next/link";
import { FaCalendarDay, FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function Home() {
  // Active service background color
  const [activeIndex, setActiveIndex] = useState(0);

  const handleHover = (index) => {
    setActiveIndex(index);
  };

  const handleMouseOut = () => {
    setActiveIndex(0); // Reset to the first item as active when mouse leaves
  };

  // State variables
  const [loading, setLoading] = useState(true);
  const [alldata, setAlldata] = useState([]);
  const [allwork, setAllwork] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error(`Error fetching books: ${response.statusText}`);
        }
        const bookData = await response.json();

        // Set data for books
        setAlldata(bookData);
        setAllwork(bookData);
      } catch (error) {
        console.error("Error Fetching Data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBooks(alldata.filter((pro) => pro.status === "publish"));
    } else {
      setFilteredBooks(
        alldata.filter(
          (pro) =>
            pro.status === "publish" &&
            pro.bookcategory &&
            pro.bookcategory.includes(selectedCategory)
        )
      );
    }
  }, [selectedCategory, alldata]);

  // Format date function
  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "Invalid Date";
    }

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <>
      <Head>
        <title>BOOKLOOM - Book Review Application</title>
        <meta name="description" content="BOOKLOOM book review" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>

      {/* Hero Section */}
      <section className="hero">
        <div className="intro_text">
          <svg viewBox="0 0 1290 300">
            <text x="50%" y="50%" textAnchor="middle" className="animate-stroke">
              WELCOME
            </text>
          </svg>
        </div>

        <div className="container">
          <div className="gallerytopsec">
            <div className="topphonesec">
              <div className="lefttitlesec">
                <h4>Welcome to BOOKLOOM</h4>
                <h1>
                  BOOKLOOM <br /> Books
                </h1>
                <Link href="/books">
                  <button>VIEW MORE</button>
                </Link>
              </div>
              <div className="rightimgsec">
                <img src="/img/2.jpg" alt="Main Cover" />
                <div className="r_img_top ">
                  <img src="/img/3.jpg" alt="Secondary Cover" />
                  <img src="/img/1.jpg" alt="Tertiary Cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects">
        <div className="container">
          <div className="project_titles">
            <h2>Recent Uploaded Books</h2>
            <p>
              "Explore the latest additions to our collection—stories that
              inspire, knowledge that empowers, and adventures waiting to
              unfold. Dive into the world of recently uploaded books."
            </p>
          </div>

          <div className="project_buttons">
            {["All", "Science Fiction", "Biography", "Historical", "Classics", "Graphic Novels"].map(
              (category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>

          <div className="projects_cards">
            {loading ? (
              <div className="flex flex-center wh_50">
                <Spinner />
              </div>
            ) : filteredBooks.length === 0 ? (
              <h1 className="w-100 flex flex-center mt-3">No Book Found</h1>
            ) : (
              filteredBooks.slice(0, 4).map((pro) => (
                <Link
                  href={`/books/${pro.slug}`}
                  key={pro._id}
                  className="procard"
                >
                  <div className="proimgbox">
                    <img
                      src={pro.images?.[0] || "/img/noimage.png"}
                      alt={pro.title || "No Title"}
                    />
                  </div>
                  <div className="procontentbox">
                    <h2>{pro.title}</h2>
                    <GoArrowUpRight />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="recentblogs">
        <div className="container">
          <div className="myskills_title">
            <h2>Most Popular Books</h2>
            <p>
              <FaQuoteLeft /> Explore the latest additions to our collection—stories that
              inspire, knowledge that empowers, and adventures waiting to
              unfold. Dive into the world of recently uploaded books. <FaQuoteRight />
            </p>
          </div>

          <div className="recent_blogs">
            {allwork.slice(0, 4).map((book) => (
              <Link href={`/books/${book.slug}`} key={book._id} className="re_blog">
                <div className="re_blogimg">
                  <img
                    src={book.images?.[0] || "/img/noimage.png"}
                    alt={book.title || "No Title"}
                  />
                  <span>{book.bookcategory?.[0] || "Uncategorized"}</span>
                </div>
                <div className="re_bloginfo">
                  <div className="re_topdate flex gap-1">
                    <div className="res_date">
                      <FaCalendarDay />
                      <span>{formatDate(book.createdAt)}</span>
                    </div>
                  </div>
                  <h2>{book.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
