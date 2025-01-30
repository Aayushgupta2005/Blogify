import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="py-4 bg-gray-900 text-gray-300 border-b border-gray-700">
      <Container>
        <nav className="flex items-center justify-between">
          <Link to="/">
            <Logo width="70px" />
          </Link>
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => item.active && (
              <li key={item.name}>
                <Link to={item.slug} className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition duration-200">
                  {item.name}
                </Link>
              </li>
            ))}
            {authStatus && (
              <li>
                <LogoutBtn className="text-gray-300 hover:text-white" />
              </li>
            )}
          </ul>
          <ul className={`md:hidden ${menuOpen ? 'block' : 'hidden'} absolute top-14 left-0 w-full bg-gray-900 p-4 space-y-4 z-10`}>
            {navItems.map((item) => item.active && (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.slug)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition duration-200"
                >
                  {item.name}
                </button>
              </li>
            ))}
            {authStatus && (
              <li>
                <LogoutBtn className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition duration-200" />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
