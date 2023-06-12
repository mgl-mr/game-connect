/* eslint-disable no-param-reassign */
import {
  auth,
  database,
  storage,
} from '@/firebase';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

export default {
  async login({ commit }, userData) {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );

      if (credentials.user.emailVerified) {
        const userRef = doc(database, `gamers/${credentials.user.uid}`);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const user = userDoc.data();
          user.id = userDoc.id;
          commit('setUser', user);
          return true;
        }
        return 'Erro ao logar.';
      }

      return 'Você deve verificar o seu email.';
    } catch (error) {
      console.log(error);
      return 'Email ou senha icorreto(s).';
    }
  },

  async signUp({ commit }, userData) {
    try {
      let downloadURL = '';
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );

      if (userData.image !== '') {
        const imageName = userData.name.replace(/\s/g, '').substring(0, 3) + userAuth.user.uid.substring(0, 10);
        const imageRef = storageRef(storage, `/${imageName}`);

        await uploadBytes(imageRef, userData.image);
        downloadURL = await getDownloadURL(imageRef);
      }

      const databaseRef = doc(database, `gamers/${userAuth.user.uid}`);
      await setDoc(databaseRef, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        birthdate: userData.birthdate,
        bio: userData.bio,
        start: userData.start,
        end: userData.end,
        imageURL: downloadURL,
        games: userData.games,
        friends: [],
      });

      sendEmailVerification(userAuth.user);

      commit('setUserSignup', {
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
      });

      return true;
    } catch (error) {
      if (error.code && error.code.startsWith('storage/')) {
        return 'Erro ao cadastrar usuário. Problema ao enviar imagem.';
      }

      if (error.code && error.code === 'auth/email-already-in-use') {
        return 'Email já está em uso.';
      }

      return 'Erro ao registrar conta.';
    }
  },

  // eslint-disable-next-line no-unused-vars
  async resetPass({ commit }, email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'Email não cadastrado';
        default: return 'Erro ao enviar email de recuperação.';
      }
    }
  },

  async fetchGames({ commit }) {
    try {
      const gamesRef = collection(database, 'games');
      const snapshot = await getDocs(gamesRef);
      const gamesArray = [];
      snapshot.forEach((document) => {
        const data = document.data();
        data.id = document.id;
        gamesArray.push(data);
      });
      commit('setGames', gamesArray);
    } catch (error) {
      console.error(`actions, fetchGames: ${error}`);
    }
  },
};
