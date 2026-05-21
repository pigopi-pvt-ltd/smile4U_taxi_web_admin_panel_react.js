import React from 'react'

const Button = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black hover:shadow-lg',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button