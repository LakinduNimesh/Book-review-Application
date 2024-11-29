
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Spinner from './Spinner';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ReactSortable } from 'react-sortablejs';
import { MdDeleteForever } from "react-icons/md";


export default function Book({
    _id,
    title: existingTitle,
    slug: existingSlug,
    author: existingAuthor,
    images: existingImages,
    description: existingDescription,
    bookcategory: existingBookcategory,
    tags: existingTags,
    status: existingStatus,
}) {

    const [redirect, SetRedirect] = useState(false);
    const router = useRouter();

    const [title, setTitle] = useState(existingTitle || '');
    const [slug, setSlug] = useState(existingSlug || '');
    const [author, setAuthor] = useState(existingAuthor || '');
    const [images, setImages] = useState(existingImages || []);
    const [description, setDescription] = useState(existingDescription || '');
    const [bookcategory, setBookcategory] = useState(existingBookcategory || []);
    const [tags, setTags] = useState(existingTags || []);
    const [status, setStatus] = useState(existingStatus || '');


    // for image Uploading
    const [isUploading, SetIsUploading] = useState(false);
    const uploadImagesQueue = [];

    async function createBook(ev) {
        ev.preventDefault();

        if (isUploading) {
            await Promise.all(uploadImagesQueue)
        }

        const data = { title, slug, author, images, description, bookcategory, tags, status };

        if (_id) {
            await axios.put('/api/books', { ...data, _id });
            toast.success('Data Updated');

        } else {
            await axios.post('/api/books', data);
            toast.success('Book Created');

        }

        SetRedirect(true);
    };

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            SetIsUploading(true);
            const promises = [];
            for (const file of files) {
                const data = new FormData();
                data.append('file', file);
                // Push promises to a local array for resolution
                const promise = axios.post('/api/upload', data).then(res => {
                    setImages(oldImages => [...oldImages, ...res.data.links]);
                });
                promises.push(promise);
            }
            // Await local promises array instead of a global queue
            await Promise.all(promises);
            SetIsUploading(false);
            toast.success('Images Uploaded');
        } else {
            toast.error('An error occurred!');
        }
    }


    if (redirect) {
        router.push('/books')
        return null;
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    function handleDeleteImage(Index) {
        const updatedImages = [...images];
        updatedImages.splice(Index, 1);
        setImages(updatedImages);
        toast.success('Image Deleted Successfully')
    }


    //for slug url
    const handleSlugChange = (ev) => {
        const inputValue = ev.target.value;
        const newSlug = inputValue.replace(/\s+/g, '-') //repalce spaces with hyphens

        setSlug(newSlug);
    }

    return <>

        <form className="addWebsiteform" onSubmit={createBook}>
            {/* Book Title */}
            <div className="w-100 flex flex-col flex-left mb-2">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    placeholder='Enter the title'
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}

                />
            </div>

            {/* Book Slug url */}
            <div className="w-100 flex flex-col flex-left mb-2">
                <label htmlFor="slug">Slug (seo friendly url)</label>
                <input
                    type="text"
                    id="slug"
                    placeholder='Enter slug url'
                    value={slug}
                    onChange={handleSlugChange}
                />
            </div>

            {/* Book author */}
            <div className="w-100 flex flex-col flex-left mb-2">
                <label htmlFor="author">Author</label>
                <input
                    type="text"
                    id="author"
                    placeholder='Enter Author Name'
                    value={author}
                    onChange={ev => setAuthor(ev.target.value)}

                />
            </div>

            {/* Book category*/}
            <div className="w-100 flex flex-col flex-left mb-2">
                <label htmlFor="category">Select Category (For multiple Selection press ctr + mouse RightKey)</label>
                <select onChange={(e) => setBookcategory(Array.from(e.target.selectedOptions, option => option.value))} value={bookcategory} name="category" id="category" multiple>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Historical">Historical</option>
                    <option value="Horror">Horror</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Graphic Novels">Graphic Novels</option>
                    <option value="Classics">Classics</option>
                    <option value="Philosophy">Philosophy</option>

                </select>
            </div>

            {/* Book images*/}
            <div className="w-100 flex flex-col flex-left mb-2">
                <div className="w-100">
                    <label htmlFor="images">Images (Frist Image will be show as thumbnail, You can drag)</label>
                    <input type="file" id="fileInput" className='mt-1' accept='image/*' multiple onChange={uploadImages} />
                </div>
                <div className="w-100 flex flex-left mt-1">
                    {isUploading && (<Spinner />)}
                </div>
            </div>

            {/* images preview and images Sortable*/}

            {!isUploading && (
                <div className="flex">
                    <ReactSortable list={Array.isArray(images) ? images : []} setList={updateImagesOrder} animation={200} className='flex gap-1'>
                        {images?.map((link, index) => (
                            <div key={link} className="uploadedimg">
                                <img src={link} alt="image" className='object-cover' />
                                <div className="deleteimg">
                                    <button onClick={() => handleDeleteImage(index)}>
                                        <MdDeleteForever />
                                    </button>
                                </div>
                            </div>
                        ))}

                    </ReactSortable>
                </div>
            )}

            {/* markDown Description*/}
            <div className="description w-100 flex flex-col flex-left mb-2">
                <label htmlFor="description">Book Content (For image: frist upload and copy link and paste in  ![text](link) )</label>
                <MarkdownEditor

                    value={description}
                    onChange={(ev) => setDescription(ev.text)}


                    style={{ width: '100%', height: '400px' }} //You can ajust the height ass needed

                    renderHTML={(text) => (
                        <ReactMarkdown components={{
                            code: ({ node, inline, className, children, ...props }) => {

                                //for code
                                const match = /language-(\w+)/.exec(className || '');

                                if (inline) {
                                    return <code>{children}</code>
                                } else if (match) {
                                    return (
                                        <div style={{ position: 'relative' }}>
                                            <pre style={{ padding: '0', borderRadius: '5px', overflowX: 'auto', whiteSpace: 'pre-wrap' }} {...props}>
                                                <code>{children}</code>
                                            </pre>
                                            <button style={{ position: 'absolute', top: '0', right: '0', zIndex: '1' }} onClick={() => navigator.clipboard.writeText(children)}>
                                                Copy Code
                                            </button>

                                        </div>
                                    )

                                } else {
                                    return <code {...props}>{children}</code>
                                }
                            }
                        }}>
                            {text}
                        </ReactMarkdown>

                    )}
                />

            </div>

            {/* tags*/}
            <div className=" w-100 flex flex-col flex-left mb-2">
                <label htmlFor="tags">Tags</label>
                <select onChange={(e) => setTags(Array.from(e.target.selectedOptions, option => option.value))} value={tags} name="tags" id="tags" multiple>
                    <option value="fiction">fiction</option>
                    <option value="non-fiction">non-fiction</option>
                    <option value="fantasy">fantasy</option>
                    <option value="romance">romance</option>
                    <option value="thriller">thriller</option>
                    <option value="mystery">mystery</option>
                    <option value="science-fiction">science-fiction</option>
                    <option value="biography">biography</option>
                    <option value="self-help">self-help</option>
                    <option value="history">history</option>
                    <option value="young-adult">young adult</option>
                    <option value="poetry">poetry</option>
                    <option value="horror">horror</option>
                    <option value="classics">classics</option>
                    <option value="philosophy">philosophy</option>
                </select>
            </div>

            {/* Blog Status*/}
            <div className=" w-100 flex flex-col flex-left mb-2">
                <label htmlFor="status">Status</label>
                <select onChange={ev => setStatus(ev.target.value)} value={status} name="status" id="status">
                    <option value="">No select</option>
                    <option value="draft">Draft</option>
                    <option value="publish">Publish</option>
                </select>
            </div>

            <div className="w-100 mb-1">
                <button type="submit" className='w-100 addwebbtn flex-center'>
                    SAVE BOOK
                </button>
            </div>

        </form>
    </>
}

