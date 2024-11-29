import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { BsPostcard } from "react-icons/bs";
import { router } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import { useRouter } from "next/router";
import { FaBloggerB } from "react-icons/fa";
import Book from "@/components/Book";

export default function EditProduct() {

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


    return <>
        <Head>
            <title>Update Book</title>
        </Head>

        <div className="bookpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>Edit <span>{productInfo?.title}</span></h2>
                    <h3>ADMIN PANEL</h3>
                </div>

                <div className="breadcrumb">
                    <FaBloggerB /> <span>/</span> <span>Edit Book</span>
                </div>
            </div>

            <div className="mt-3">
                {
                    productInfo && (
                        <Book {...productInfo} />
                    )
                }
            </div>
        </div>

    </>
}