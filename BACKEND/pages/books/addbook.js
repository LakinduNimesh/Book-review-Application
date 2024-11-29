import { FaBloggerB } from "react-icons/fa";
import Blog from "@/components/Book";


export default function Addblog() {



    return <>

        <div className="addbookspage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>Add <span>Book</span></h2>
                    <h3>ADMIN PANEL</h3>
                </div>

                <div className="breadcrumb">
                    <FaBloggerB /> <span>/</span> <span>Addbook</span>
                </div>
            </div>

            <div className="booksadd">
                <Blog />
            </div>
        </div>
    </>
}