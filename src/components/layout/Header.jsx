import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineBell, HiOutlineUser, HiOutlineSun, HiOutlineMoon,  HiOutlineArrowRightOnRectangle, HiBars3 } from 'react-icons/hi2'
import useAuthStore from '../../store/authStore'

const Header = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const [isDark, setIsDark] = useState(false) 
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <HiBars3 className="text-2xl" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-green to-primary-green bg-clip-text text-transparent">
          Welcome back, {user?.name || 'Admin'}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <HiOutlineBell className="text-xl" />
        </button>
        
        <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          {isDark ? <HiOutlineSun className="text-xl" /> : <HiOutlineMoon className="text-xl" />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-primary-yellow rounded-full flex items-center justify-center">
              <span className="text-primary-black font-bold">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50">
              <button onClick={handleProfile} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <HiOutlineUser /> Profile
              </button>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600">
                <HiOutlineArrowRightOnRectangle /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header