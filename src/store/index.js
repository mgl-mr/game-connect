import { createStore } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

import games from '../assets/data/games.json';

export default createStore({
  state: {
    user: {},
    games,
    userSignup: {
      name: '',
      email: '',
      password: '',
      confirm: '',
      birthdate: '',
      bio: '',
      start: '',
      end: '',
      image: '',
      imageName: '',
      urlImage: '',
      games: [],
    },
  },
  getters,
  mutations,
  actions,
});
