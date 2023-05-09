import { auth, database } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';

export default {
  async login({ commit }, userData) {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );

      if (credentials.user.emailVerified) {
        const userRef = ref(database, `jogadores/${credentials.user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const user = snapshot.val();
          commit('setUser', user);
          return true;
        }
        return 'Erro ao logar.';
      }

      return 'Você deve verificar o seu email.';
    } catch (error) {
      console.log(error);
      return 'Emal ou senha icorreto(s).';
    }
  },
};
