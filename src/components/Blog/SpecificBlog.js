import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import { formatDate } from '../../utils/dateFunctions'
import { Link, useNavigate } from 'react-router-dom'
import thumbsUp from '../../images/thumb_up_black_24dp.svg'

export default function SpecificBlog({user}) {
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [author, setAuthor] = useState(false)
    const [hasLiked, setHasLiked] = useState(false)
    const { id } = useParams()

    async function getPost() {
        try {
            const { data } =  await axios.get(`http://localhost:5000/blogs/${id}`)

            const date = new Date(Date.parse(data.post.createdAt))
            let formattedDate = formatDate(date)
            data.post.createdAt = formattedDate

            setPost(data.post)
            const likeHistory = data.post.likeHistory
            let foundUser = null;
            
            if (user) {
                 foundUser = likeHistory.find(liker => {
                    return user.user === liker
                })
            }

            if (foundUser) {
                setHasLiked(true)
            }

        } catch (error) {
            console.log(error)            
        }
    }

    function handleClick(e) {
        const confirmation = document.querySelector('.confirmation')
        confirmation.classList.remove('hidden')
    }

    function handleCancel(e) {
        const confirmation = document.querySelector('.confirmation')
        confirmation.classList.add('hidden')
    }

    async function handleConfirm(e) {
        try {
            const { data: res } = await axios.delete('http://localhost:5000/blogs/delete/' + id)
            if (res.status === 'success') {
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleLike(e) {
        if (!user) {
            const likeTooltip = document.querySelector('.like-button-tooltip')
            likeTooltip.classList.remove('hidden')

            setTimeout(() => {
                likeTooltip.classList.add('hidden')
            }, 1000)
            return
        } else {
            if (!hasLiked) {
                setPost({...post, likeCount: post.likeCount + 1});
                try {
                    const {data: res} = await axios.put('http://localhost:5000/blogs/update', { id: post._id, likeCount: post.likeCount + 1, user: user.user, likeHistory: post.likeHistory, hasLiked })
                    if (res.status === 'success') {
                        setHasLiked(true)
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                setPost({...post, likeCount: post.likeCount - 1});
                try {
                    const {data: res} = await axios.put('http://localhost:5000/blogs/update', { id: post._id, likeCount: post.likeCount - 1, user: user.user, hasLiked, likeHistory: post.likeHistory })
                    if (res.status === 'success') {
                        setHasLiked(false)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    useEffect(() => {
        if (user && post) {
            const username = user.user
            if (post.author === username) {
                return setAuthor(true)
            } else {
                return setAuthor(false)
            }
        }
    }, [post])

    if (post) {
        return (
            <div className='container'>
                <div className="confirmation hidden">
                    <div className="confirmation-card">
                        <h3 style={{textAlign: 'center', color: 'white'}}>Are you sure?</h3>
                        <button className='btn' onClick={handleConfirm}>Confirm</button>
                        <button className='btn btn-cancel' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
                <div className="post-wrapper">
                    <div className="date-and-creator">
                        <p className='post-creator'>Author: {post.author}</p>
                        <p className='post-time'>{post.createdAt}</p>
                    </div>
                    <div className="blog-title-and-description">
                        <h3 className='blog-title'>{post.title}</h3>
                        <p>{post.description}</p>
                    </div>
                    <div className="action-buttons">
                        <button onClick={handleLike} className='like-button'>
                            <p className='like-button-tooltip hidden'>Sign In to like this post</p>
                            <img className={`${user ? "" : "filter-gray"}  ${hasLiked ? 'filter-blue' : 'filter-black'} `} src={thumbsUp} alt="Like button" />
                            <p className='like-count'>{post.likeCount}</p>
                        </button>
                        <div className="delete-and-edit">
                            { author && <Link to={`/blogs/edit/${id}`}>
                                <button className="btn">Edit</button>
                            </Link> }
                            { author && <button className="btn btn-delete" onClick={handleClick}>Delete</button>}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                Loading / not found
            </div>
        )
    }
}
 