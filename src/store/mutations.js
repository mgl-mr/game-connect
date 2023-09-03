export default {
  setUser(state, user) {
    state.user = { ...state.user, ...user };
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
