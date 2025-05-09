import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';

import Navbar from './components/Navbar';
import Home from './components/Home';


import Register from './components/Register';
import Login from './components/Login';

import AddBlog from './components/AddBlog';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import EditBlog from './components/EditBlog';

import CategoryBlogs from './components/CategoryBlogs';
import ReadBlog from './components/ReadBlog';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} /> {/* fallback to home */}

        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />

        <Route path="/add-blog" element={<AddBlog/>} />
        <Route path="/blog-list" element={
        <ProtectedRoute>
          <BlogList />
        </ProtectedRoute>
      } />
        <Route path='/blog-detail/:id' element={<BlogDetail/>} />
        <Route path="/edit-blog/:id" element={<EditBlog/>} />

        <Route path="/blogs/:category" element={<CategoryBlogs />} />
        <Route path="/blog/:id" element = {<ReadBlog/>} />
      </Routes>
    </Router>
    </AuthProvider>
    
  );
}

export default App;
