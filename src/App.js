import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar';
import BlogList from './components/Blog/BlogList'
import Blog from './components/Blog/Blog'
import SpecificBlog from './components/Blog/SpecificBlog'
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import CreateBlog from './components/Blog/CreateBlog';
import EditBlog from './components/Blog/EditBlog';
import EditSpecificBlog from './components/Blog/EditSpecificBlog';

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  async function checkUser(jwt) {
    try {
      const {data} = await axios.post('http://localhost:5000/checkuser', { token: jwt })
      setUser(data)
      setLoading(false)
      return data 
    } catch (error) {
      if (error?.response?.data?.token === null) {
        setUser(null)
        setLoading(false)
      } 
    }
}

  useEffect(() => {
    // Check if user is signed in
    setLoading(true)
    const jwt = localStorage.getItem('jwt')
    
    if (jwt) {
        checkUser(jwt)
    } else {
        setLoading(false)
    }

  }, [])

  if (!loading) {
    return (
      <BrowserRouter>
          <Navbar user={user} setUser={setUser}/>
          <Routes>
            <Route path="/" element={<BlogList user={user}/>} />
            <Route path="/blog/new" element={<CreateBlog user={user} loading={loading}/>} />
            <Route path="/blog" element={<Blog />} >
              <Route path=":id" element={<SpecificBlog user={user}/>}/>
            </Route>
            <Route path="/sign-up" element={<SignUp user={user} setUser={setUser} setLoading={setLoading}/> } />
            <Route path="/sign-in" element={<SignIn user={user} setUser={setUser} setLoading={setLoading}/> } />
            <Route path="/blogs/edit" element={<EditBlog />}>
              <Route path=":id" element={<EditSpecificBlog user={user}/>} />
            </Route>
          </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <div className="loading">Loading...</div>
    )
  }
}

export default App;
