import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaBloggerB } from "react-icons/fa";
import toast from "react-hot-toast";
import Head from "next/head"
import { RiDeleteBin4Fill } from "react-icons/ri";


export default function DeleteProduct() {

    const router = useRouter();

    const { id } = router.query;

    const [productInfo, setProductInfo] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get('/api/books?id=' + id).then(response => {
                setProductInfo(response.data)
            })
        }
    }, [id]);

    function goBack() {
        router.push('/books')
    }

    async function deleteBook() {
        await axios.delete('/api/books?id=' + id)
        toast.success('Deleted Successfully..')
        goBack();
    }

    return <>

        <Head>
            <title>Delete Book</title>
        </Head>

        <div className="bookpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>Delete <span>{productInfo?.title}</span></h2>
                    <h3>ADMIN PANEL</h3>
                </div>

                <div className="breadcrumb">
                    <FaBloggerB /> <span>/</span> <span>Delete Book</span>
                </div>
            </div>

            <div className="deletesec flex flex-center wh_100">
                <div className="deletecard">
                    <RiDeleteBin4Fill style={{ fill: "red", height: "6em", width: "6em" }} />
                    <p className="cookieHeading">Are you sure? </p>
                    <p className="cookieDescription">If you delete this book content it will be permenent delete your content.</p>
                    <div className="buttonContainer">
                        <button onClick={deleteBook} className="acceptButton">Delete</button>
                        <button onClick={goBack} className="declineButton">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

    </>
}