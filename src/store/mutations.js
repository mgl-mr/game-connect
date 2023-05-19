export default {
  setUser(state, user) {
    state.user = user;
  },

  setUserSignup(state, user) {
    state.userSignup = Object.assign({}, state.userSignup, user);
  }
};
