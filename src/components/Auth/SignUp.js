import React, { useState, useEffect } from 'react'
import axios from 'axios'
import visibility from './../../images/visibility_black_24dp.svg'
import visibilityOff from './../../images/visibility_off_black_24dp.svg'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp({user, setUser}) {
    let navigate = useNavigate()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({ username: '', password: ''})
    
    useEffect(() => {
        if (user) {
            navigate('/')
        } 
    }, [user])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!username) {
            return setErrors({...errors, username: 'Please enter username here'})
        } else if (!password) {
            return setErrors({username: '', password: 'Please enter password here'})
        } else {
            setErrors({ username: '', password: ''})
        }

        try {
            const {data} = await axios.post('http://localhost:5000/signup', { username, password })
            setUser(data)
            localStorage.setItem('jwt', data.token)
            navigate('/')

        } catch (error) {
            if(error.response.data) {
                console.log(error.response.data)
                setErrors(error.response.data)
            }
        }
    }

    function handleClick(e) {
        // Get input field and setUp password visibility toggle
        const input = document.querySelector('.password-input')

        switch(input.type) {
            case 'password':
                input.type = 'text'
                setShowPassword(prevVal => !prevVal)
                break;
            case 'text':
                input.type = 'password'
                setShowPassword(prevVal => !prevVal)
                break;
            default: 
                console.error('wrong type in input field')
                break;
        }
    }
        return (
            <div className='container'>
                <form onSubmit={handleSubmit} className='auth-form'>
                    <h3>Sign Up</h3>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
                        <p className="validation-error">{errors.username}</p>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <p onClick={handleClick} className='visibility-btn'> { showPassword && <img className='visibility-toggle' src={visibilityOff} alt="Show password" /> } </p>
                        <p onClick={handleClick} className='visibility-btn'> { !showPassword && <img className='visibility-toggle' src={visibility} alt="Show password" /> } </p>
                        <input className='password-input' type="password" name="password" placeholder='min 6 characters' onChange={(e) => setPassword(e.target.value)}/>
                        <p className="validation-error">{errors.password}</p>
                    </div>
                    <div className="input-group">
                        <button className='btn' type="submit">Sign Up</button>
                    </div>
                    <div className="auth-link">
                        <Link to="/sign-in">Already have an account?</Link>
                    </div>
                </form>
            </div> 
        )
   
}
