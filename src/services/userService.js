import api from '../api/client';

const userService = {
  // Create new user
  createUser: (userData) => {
    return api.post('/user', { user: userData });
  },

  // Get all users
  getAllUsers: () => {
    return api.get('/user');
  },

  // Delete user by email
  deleteUser: (email) => {
    return api.delete('/user', { data: { email } });
  },
};

export default userService;