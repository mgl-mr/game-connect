export default {
  setUser(state, user) {
    if (user) {
      state.user = { ...state.user, ...user };
    } else {
      state.user = {};
    }
  },

  setUserSignup(state, user) {
    state.userSignup = { ...state.userSignup, ...user };
  },

  setGames(state, games) {
    state.games = games;
  },

  setMatch(state, match) {
    state.match = match;
  },
};
