import { createStore } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default createStore({
  state: {
    user: {},
    games: [],
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
    listeners: [],
    showFriendRequestList: false,
  },
  getters,
  mutations,
  actions,
});
