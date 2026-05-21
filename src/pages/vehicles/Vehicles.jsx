import React from 'react'

const Vehicles = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-yellow to-primary-green bg-clip-text text-transparent">
          Vehicles Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage fleet vehicles</p>
      </div>
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-xl font-semibold mb-2">Vehicles Module</h3>
        <p className="text-gray-500">Vehicle management features coming soon...</p>
      </div>
    </div>
  )
}

export default Vehicles