export default {
  getUserById: (state) => (id) => state.users.find((user) => user.id === id),
};
