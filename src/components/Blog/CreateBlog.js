import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreateBlog({ user, loading }) {
    let navigate = useNavigate()
    const [description, setDescription] = useState()
    const [title, setTitle] = useState()
    const [errors, setErrors] = useState({ title: '', author: '', description: ''})
    
    useEffect(() => {
        if (!user && !loading) {
            navigate('/')
        }
    }, [user])

    async function handleSubmit(e) {
        e.preventDefault()

        const userInput = { title, description, author: user.user }

        try {
            const { data } = await axios.post('http://localhost:5000/blogs/create', userInput)
            if (data.status === 'success') {
                navigate('/')
            }
        } catch (error) {
            console.log(error.response.data)
            if(error.response.data) {
                setErrors(error.response.data)
            }
        }

    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className='new-blog-form'>
                <h3>Create a new Blog</h3>
                <div className="input-group">
                    <label htmlFor="author">Author</label>
                    { user && <input type="text" disabled={true} value={user.user} id="author"/>}
                    <p className="validation-error">{errors.author}</p>
                </div>
                <div className="input-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
                    <p className="validation-error">{errors.title}</p>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" id="description" placeholder='Description' onChange={(e) => setDescription(e.target.value)}></textarea>
                    <p className="validation-error">{errors.description}</p>
                </div>
                <div className="input-group">
                    <button type="submit" className='btn btn-create'>Create</button>
                </div>
            </form>
        </div>
    )
}
