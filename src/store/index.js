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
    match: {
      inMatch: false,
      unsubscribe: null,
    },
    showFriendRequestList: false,
    voIP: {
      id: '',
      inVoIP: false,
      matchedUser: {},
      peerConnection: null,
      unsubscribe: null,
      offerCandidates: [],
      answerCandidates: [],
      loading: {
        show: false,
        message: '',
      },
      error: {
        show: false,
        message: '',
      },
    },
    optionsMenu: {
      x: 0,
      y: 0,
      show: false,
      user: {},
    },
  },
  getters,
  mutations,
  actions,
});
