import { createStore } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default createStore({
  state: {
    user: {},
    userSignup: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    },
  },
  getters,
  mutations,
  actions,
});
