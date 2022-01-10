import React, { useState, useEffect } from 'react'
import brandLogo from './../images/brandlogo.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'


export default function Navbar({user, setUser}) {
    let location = useLocation()
    let navigate = useNavigate()
    const [authRoute, setAuthRoute] = useState(false)
    const [blogRoute, setBlogRoute] = useState(false)

    useEffect(() => {
        let path = location.pathname
        if (path === '/sign-up') {
            setAuthRoute(true)
        } else if (path === '/sign-in') {
            setAuthRoute(true)
        } else if (path === '/blog/new') {
            setBlogRoute(true)
        } else {
            setAuthRoute(false)
            setBlogRoute(false)
        }
    }, [location])

    function handleClick(e) {
        localStorage.removeItem('jwt')
        setUser(null)
        navigate('/')
    }

    return (
        <nav className='main-nav'>
            <div className='brand-name-and-logo'>
                <Link to="/"><h2 className='brand-name'>Game Mania</h2></Link>
                <img className='brand-logo' src={brandLogo} width="36" alt="Brand Logo" />
            </div>
            <div>
                { !user && !authRoute && <Link to="/sign-in"><button className='btn sign-in-btn'>Sign In</button></Link>}
                { !user && !authRoute && <Link to="/sign-up"><button className='btn sign-up-btn'>Sign Up</button></Link>}
                { user && !blogRoute && <Link to="/blog/new"><button className='btn'>Create Blog</button></Link>}
                { user && <button onClick={handleClick} className='btn sign-out-btn'>Sign Out</button>}
            </div>
        </nav>
    )
} 
