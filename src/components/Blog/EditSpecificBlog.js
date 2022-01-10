import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { formatDate } from '../../utils/dateFunctions'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

    export default function EditSpecificBlog({user}) {
    let navigate = useNavigate()

    const [description, setDescription] = useState()
    const [post, setPost] = useState(null)
    const [title, setTitle] = useState(null)
    
    const { id } = useParams()

    async function getPost() {
        try {
            const { data } =  await axios.get(`http://localhost:5000/blogs/${id}`)

            const date = new Date(Date.parse(data.post.createdAt))
            let formattedDate = formatDate(date)
            data.post.createdAt = formattedDate

            setPost(data.post)
        } catch (error) {
            console.log(error.response)            
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const userInput = { description, title, id: post._id }

        try {
            const { data } = await axios.put('http://localhost:5000/blogs/update', userInput)
            if (data.status === 'success') {
                navigate(`/blog/${id}`)
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getPost()
    }, [])

    useEffect(() => {
        if (post) {
            setTitle(post.title)
            setDescription(post.description)
        }
    }, [post])

    if (post) {
        return (
            <div className="container">
                <form onSubmit={handleSubmit} className='new-blog-form'>
                    <h3>Edit the blog post</h3>
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" placeholder='Title' onChange={(e) => setTitle(e.target.value)} defaultValue={post.title}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea type="text" id="description" placeholder='Description' onChange={(e) => setDescription(e.target.value)} defaultValue={post.description}></textarea>
                    </div>
                    <div className="input-group">
                        <button type="submit" className='btn btn-create'>Save</button>
                        <button className="btn btn-cancel" onClick={() => {   navigate('/blog/' + id) }}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div className="loading">Loading...</div>
        )
    }
}
