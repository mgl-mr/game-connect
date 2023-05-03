export default {
  async createUser({ commit }, userData) {
    try {
      commit('SET_USER', userData);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  },
};
