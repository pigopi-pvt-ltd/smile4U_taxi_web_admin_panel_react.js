import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineViewGrid, HiOutlineCalendar, HiOutlineUsers, HiOutlineTruck,
  HiOutlineUserGroup, HiOutlineStar, HiOutlineCurrencyDollar, HiOutlineBriefcase,
  HiOutlineClock, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout,
  HiOutlineChevronLeft, HiOutlineX, HiOutlineDatabase
} from 'react-icons/hi'
import useAuthStore from '../../store/authStore'
import logo from '../../assets/logo.jpg'

const menuItems = [
  { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
  { name: 'Bookings', icon: HiOutlineCalendar, path: '/bookings' },
  { name: 'Drivers', icon: HiOutlineUsers, path: '/drivers' },
  { name: 'Vehicles', icon: HiOutlineTruck, path: '/vehicles' },
  { name: 'Employees', icon: HiOutlineUserGroup, path: '/employees' },
  { name: 'Users', icon: HiOutlineUsers, path: '/users' },
  { name: 'Reviews', icon: HiOutlineStar, path: '/reviews' },
  { name: 'Customers', icon: HiOutlineBriefcase, path: '/customers' },
  { name: 'Attendance', icon: HiOutlineClock, path: '/attendance' },
  { name: 'Master Data', icon: HiOutlineDatabase, path: '/master-data' },
  { name: 'Analytics', icon: HiOutlineChartBar, path: '/analytics' },
  { name: 'Settings', icon: HiOutlineCog, path: '/settings' },
]

const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
  const location = useLocation()
  const { logout } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const SidebarLink = ({ item }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon

    return (
      <Link
        to={item.path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose()
        }}
        className={`relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-primary-yellow to-yellow-500 text-primary-black shadow-md' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-yellow'
        } ${isCollapsed ? 'justify-center' : ''}`}
      >
        <Icon className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-black' : ''}`} />
        
        {!isCollapsed && (
          <span className={`font-medium text-sm transition-all duration-200 ${isActive ? 'translate-x-0.5' : ''}`}>
            {item.name}
          </span>
        )}
        
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
            {item.name}
          </div>
        )}
        
        {isActive && !isCollapsed && (
          <div className="absolute left-0 w-0.5 h-6 bg-primary-yellow rounded-r-full" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Balanced size */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 shadow-xl z-50 border-r border-gray-100 dark:border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-gray-100 dark:border-gray-800`}>
          {!isCollapsed ? (
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Smile4U" 
                  className="w-9 h-9 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-green rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 dark:text-white text-base group-hover:text-primary-yellow transition-colors">
                  Smile4U
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="relative">
              <img 
                src={logo} 
                alt="Smile4U" 
                className="w-9 h-9 rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-green rounded-full animate-pulse"></div>
            </Link>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <HiOutlineX className="text-xl" />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarLink key={item.name} item={item} />
            ))}
          </div>
        </nav>
        
        {/* Bottom Actions - Only collapse button */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4">
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <HiOutlineChevronLeft className="text-xl group-hover:scale-110 transition-transform" />
            </motion.div>
            {!isCollapsed && <span className="text-sm font-medium">Collapse Menu</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar