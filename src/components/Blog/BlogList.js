import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { formatDate } from '../../utils/dateFunctions'
import { Link } from 'react-router-dom'
import thumbsUp from '../../images/thumb_up_black_24dp.svg'

export default function BlogList() {
    const [posts, setPosts] = useState([])

    async function getPosts() {
        try {
            const { data } = await axios.get('http://localhost:5000/blogs')

            if (data.posts.length === 0) {
                return setPosts(null)
            }

            const formattedPosts = data.posts.map(post => {
                const date = new Date(Date.parse(post.createdAt))
                const formattedDate = formatDate(date)
                post.createdAt = formattedDate
                return post
            })

            setPosts(formattedPosts.reverse())
            return data
        } catch (error) {
            console.log(error)            
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    function handleChange(e) {
        if (e.target.value === 'new' || e.target.value === 'old') {
            setPosts(posts.slice().reverse())
        } else {
            const sortedPosts = posts.slice().sort((a, b) => {
                return b.likeCount - a.likeCount
            })
            setPosts(sortedPosts)
        }
    }


    if (posts) {
        return (
            <div className='container'>
                <select className='blog-filter' name="filters" id="filters" onChange={handleChange}>
                    <option value="new">Newest</option>
                    <option value="old">Oldest</option>
                    <option value="likes">Likes</option>
                </select>
                { posts.length !== 0 && 
                    <ul className='post-list'>
                        {posts.map(post =>  { 
                            // Make sure desc stays reasonably long 
                            if (post.description.length > 10) {
                                post.description = post.description.substring(0, 15)
                            }
                            return (
                            <Link to={`/blog/${post._id}`} key={post._id}>
                                <div className='post'  id={post._id}>
                                    <div className="title-and-description">
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className='description'>{post.description + '...'}</p>
                                        <div className="like-button">
                                            <img src={thumbsUp} alt="Like button" />
                                            <p className='like-count'>{post.likeCount}</p>
                                        </div>
                                    </div>
                                    <div className="date-and-creator">
                                        <p className='gray post-time'>{post.createdAt}</p>
                                        <p className='gray post-creator'>Creator: {post.author}</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                        )}
                    </ul>
                }
            </div>
        )
    } else {
        return (
            <div className="container">
                <h3 style={{textAlign: "center"}}>No blog posts yet. Please sign up and create one!</h3>
            </div>
        )
    }
}
