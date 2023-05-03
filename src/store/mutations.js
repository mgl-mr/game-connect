export default {
  SET_USER(state, user) {
    const index = state.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      state.users.splice(index, 1, user);
    } else {
      state.users.push(user);
    }
  },
};
