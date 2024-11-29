import Head from "next/head";
import { Bar } from 'react-chartjs-2';
import Loading from "@/components/Loading";
import { IoHome } from "react-icons/io5";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from "react";
import LoginLayout from "@/components/LoginLayout";

export default function Home() {
  // Register chart components for Chart.js
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  // Define state variables for different data types
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart options for styling and layout
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Books created Monthly by Year',
      }
    }
  };

  // Fetch data from various APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/books');

        // Convert responses to JSON
        const data = await response.json();

        // Set data to respective state variables
        setBooksData(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData(); // Call fetch data function on component mount
  }, []);

  // Aggregate book data by year and month for chart display
  const monthlyData = booksData.filter(dat => dat.status === 'publish').reduce((acc, book) => {
    const year = new Date(book.createdAt).getFullYear(); // Get the year from book date
    const month = new Date(book.createdAt).getMonth(); // Get the month from book date
    acc[year] = acc[year] || Array(12).fill(0); // Initialize array for the year if it doesn't exist
    acc[year][month]++; // Increment count for the month
    return acc;
  }, {});

  // Generate an array of years and labels for chart labels
  const years = Object.keys(monthlyData);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Map aggregated data to datasets for Chart.js
  const datasets = years.map(year => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0), // If no data for the month, default to 0
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.5)` // Set color for bars
  }));

  // Define data object with labels and datasets for the chart
  const data = {
    labels,
    datasets,
  };

  return (

    <LoginLayout>
      <>

        {/* Set up metadata for the page */}
        <Head>
          <title>Portfolio Backend</title>
          <meta name="description" content="Blog website backend" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        {/* Dashboard layout */}



        <div className="dashboard">
          {/* Title and breadcrumb navigation */}
          <div className="titledashboard flex flex-sb">
            <div>
              <h2>Admin <span>Dashboard</span></h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb">
              <IoHome /><span>/</span><span>Dashboard</span>
            </div>
          </div>

          {/* Dashboard cards for summary stats */}
          <div className="topfourcards flex flex-sb">
            <div className="four_card">
              <h2>Total Books</h2>
              <span>{booksData.filter(dat => dat.status === 'publish').length}</span>
            </div>
          </div>

          {/* Year Overview Section */}
          <div className="year_overview flex flex-sb">

            <div className="leftyearoverview">
              <div className="flex flex-sb">
                <h3>Year Overview</h3>

                {/* Decorative dots for styling */}
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>

                <h3 className="text-right">{booksData.filter(dat => dat.status === 'publish').length} / 365 <br /><span>Total Published</span></h3>
              </div>

              {/* Render Bar chart with data and options */}
              <Bar data={data} options={options} />
            </div>


            <div className="right_salescont">
              <h3>Books by category</h3>

              {/* Decorative dots for styling */}
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>

              <div className="bookscategory flex flex-center " >
                <div style={{ maxHeight: '550px', overflowY: 'auto', width: '100%' }}>
                  <table >
                    <thead>
                      <tr>
                        <td>Topics</td>
                        <td>Data</td>
                      </tr>
                    </thead>
                    <tbody>

                      <tr>
                        <td>Fiction</td>
                        <td>{booksData.filter(dat => dat.bookcategory[0] === "Fiction").length}</td>
                      </tr>

                      <tr>
                        <td>Fantasy</td>
                        <td>{booksData.filter(dat => dat.bookcategory[0] === "Fantasy").length}</td>
                      </tr>

                      <tr>
                        <td>Mystery</td>
                        <td>{booksData.filter(dat => dat.bookcategory[0] === "Mystery").length}</td>
                      </tr>

                      <tr>
                        <td>Self-Help</td>
                        <td>{booksData.filter(dat => dat.bookcategory[0] === "Self-Help").length}</td>
                      </tr>

                      <tr>
                        <td>Romance</td>
                        <td>{booksData.filter(dat => dat.bookcategory[0] === "Romance").length}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>

              </div>
            </div>



          </div>
        </div>


      </>
    </LoginLayout>


  );
}
