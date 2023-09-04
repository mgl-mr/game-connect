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
  updatePassword,
  deleteUser,
} from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
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

        await updateDoc(userRef, {
          status: 'online',
        });

        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const user = userDoc.data();
          user.id = userDoc.id;
          user.friends = [];
          user.suggestions = [];
          commit('setUser', user);
          return true;
        }
        return 'Erro ao logar.';
      }

      return 'Você deve verificar o seu email.';
    } catch (error) {
      return 'Email ou senha icorreto(s).';
    }
  },

  async logout({ commit, state }, id) {
    try {
      const userRef = doc(database, `gamers/${id}`);
      await updateDoc(userRef, {
        status: 'offline',
      });

      await auth.signOut();

      state.listeners.forEach((listener) => {
        listener();
      });

      commit('setListeners', []);
      commit('setUser', null);

      return true;
    } catch (error) {
      return false;
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
        const imageName = userData.email.replace(/\s/g, '').substring(0, 3) + userAuth.user.uid.substring(0, 10);
        const imageRef = storageRef(storage, `/${imageName}`);

        await uploadBytes(imageRef, userData.image);
        downloadURL = await getDownloadURL(imageRef);
      }

      const gamesId = userData.games.map((game) => game.id);

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
        status: 'offline',
        friendsId: [],
        gamesId,
        sentFriendRequests: [],
        receivedFriendRequests: [],
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

  async updateUser({ commit }, user) {
    const {
      pass,
      newPass,
      confirmPass,
      id,
      ...userUpdate
    } = user;

    try {
      if (newPass !== '') {
        await updatePassword(auth.currentUser, newPass);
        userUpdate.password = newPass;
      }

      const databaseRef = doc(database, `gamers/${user.id}`);
      await updateDoc(databaseRef, userUpdate);

      commit('setUser', userUpdate);

      return true;
    } catch (error) {
      return false;
    }
  },

  async deleteUser({ commit }, user) {
    try {
      if (user.imageURL !== '') {
        const imageName = user.email.replace(/\s/g, '').substring(0, 3) + user.id.substring(0, 10);
        const imageRef = storageRef(storage, `/${imageName}`);
        await deleteObject(imageRef);
      }

      const databaseRef = doc(database, `gamers/${user.id}`);
      await deleteDoc(databaseRef, user);

      await deleteUser(auth.currentUser);
      commit('setUser', {});

      return true;
    } catch (error) {
      return false;
    }
  },

  async updateImage({ commit }, payload) {
    const user = payload[0];
    const file = payload[1];

    const imageName = user.email.replace(/\s/g, '').substring(0, 3) + user.id.substring(0, 10);
    const imageRef = storageRef(storage, `/${imageName}`);

    await uploadBytes(imageRef, file);
    const imageURL = await getDownloadURL(imageRef);

    const databaseRef = doc(database, `gamers/${user.id}`);
    await updateDoc(databaseRef, {
      imageURL,
    });

    commit('setUser', {
      imageURL,
    });
  },

  async sendFriendRequest({ commit }, payload) {
    const user = payload[0];
    const id = payload[1];
    const sentFriendRequests = payload[2];

    try {
      const batch = writeBatch(database);

      const userRef = doc(database, `gamers/${user.id}`);
      batch.update(userRef, {
        sentFriendRequests: arrayUnion(id),
      });

      const targetUserRef = doc(database, `gamers/${id}`);
      batch.update(targetUserRef, {
        receivedFriendRequests: arrayUnion(user),
      });

      await batch.commit();

      sentFriendRequests.push(id);

      commit('setUser', {
        sentFriendRequests,
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  async acceptFriendRequest({ commit }, payload) {
    const user = payload[0];
    const requestId = payload[1];

    try {
      const batch = writeBatch(database);

      const userRef = doc(database, `gamers/${user.id}`);
      batch.update(userRef, {
        receivedFriendRequests: user.receivedFriendRequests,
        friendsId: arrayUnion(requestId),
      });

      const targetUserRef = doc(database, `gamers/${requestId}`);
      batch.update(targetUserRef, {
        sentFriendRequests: arrayRemove(user.id),
        friendsId: arrayUnion(user.id),
      });

      await batch.commit();

      const friendsId = user.friendsId.push(requestId);

      commit('setUser', {
        friendsId,
        receivedFriendRequests: user.receivedFriendRequests,
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  async deleteFriendRequest({ commit }, payload) {
    const user = payload[0];
    const requestId = payload[1];

    try {
      const batch = writeBatch(database);

      const userRef = doc(database, `gamers/${user.id}`);
      batch.update(userRef, {
        receivedFriendRequests: user.receivedFriendRequests,
      });

      const targetUserRef = doc(database, `gamers/${requestId}`);
      batch.update(targetUserRef, {
        sentFriendRequests: arrayRemove(user.id),
      });

      await batch.commit();

      commit('setUser', {
        receivedFriendRequests: user.receivedFriendRequests,
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  fetchListeners({ commit, state }, id) {
    const unsub = onSnapshot(doc(database, 'gamers', id), (userSnapshot) => {
      commit('setListener', unsub);

      const { friendsId } = userSnapshot.data();
      const { sentFriendRequests } = userSnapshot.data();
      const { receivedFriendRequests } = userSnapshot.data();

      commit('setUser', {
        friendsId,
        sentFriendRequests,
        receivedFriendRequests,
      });

      const friendListeners = {};
      const { friends } = state.user;

      friendsId.forEach((friendId) => {
        if (!(friendId in friendListeners)) {
          const unsubscribe = onSnapshot(doc(database, 'gamers', friendId), (friendSnapshot) => {
            commit('setListener', unsubscribe);

            if (!friendSnapshot.exists) {
              const userRef = doc(database, `gamers/${id}`);

              updateDoc(userRef, {
                friendsId: arrayRemove(friendId),
              });

              if (friendListeners[friendId]) {
                friendListeners[friendId]();
                delete friendListeners[friendId];
              } else unsubscribe();
            } else {
              const friendData = {
                id: friendSnapshot.id,
                name: friendSnapshot.data().name,
                bio: friendSnapshot.data().bio,
                birthdate: friendSnapshot.data().birthdate,
                start: friendSnapshot.data().start,
                end: friendSnapshot.data().end,
                imageURL: friendSnapshot.data().imageURL,
                games: friendSnapshot.data().games,
                status: friendSnapshot.data().status,
              };

              const existingFriendIndex = friends.findIndex((friend) => friend.id === friendSnapshot.id);
              if (existingFriendIndex !== -1) {
                friends[existingFriendIndex] = friendData;
              } else {
                friends.push(friendData);
              }

              commit('setUser', {
                friends,
              });
            }
          });

          friendListeners[friendId] = unsubscribe;
        }
      });
    });
  },

  async fetchSuggestions({ commit }, ids) {
    try {
      const suggestionsRef = collection(database, 'gamers');
      const suggestionsQuery = query(suggestionsRef, where('gamesId', 'array-contains-any', ids));
      const snapshot = await getDocs(suggestionsQuery);
      const suggestions = snapshot.docs.map((document) => ({
        id: document.id,
        name: document.data().name,
        games: document.data().games,
        bio: document.data().bio,
        start: document.data().start,
        end: document.data().end,
        imageURL: document.data().imageURL,
        status: document.data().status,
      }));

      commit('setUser', {
        suggestions,
      });
    } catch (error) {
      console.error(`actions, fetchSuggestions: ${error}`);
    }
  },

  async createMatch({ commit }, match) {
    try {
      const matchRef = doc(database, `matches/${match.gamerId}`);
      await setDoc(matchRef, match);
    } catch (error) {
      console.log(error);
      return false;
    }

    const matchQuery = query(collection(database, 'matches'), where('gameId', '==', match.gameId), where('__name__', '!=', match.gamerId));
    const unsubscribe = onSnapshot(matchQuery, (querySnapshot) => {
      querySnapshot.forEach((document) => {
        let find = true;

        if (!match.anyAge || !document.data().anyAge) {
          if (!match.anyAge) {
            if (document.data().age < match.minAge || document.data().age > match.maxAge) {
              find = false;
            }
          }
          if (!document.data().anyAge) {
            if (match.age < document.data().minAge || match.age > document.data().maxAge) {
              find = false;
            }
          }
        }

        if (match.wantedLevel !== document.data().wantedLevel) {
          if (match.wantedLevel !== 'any' || document.data().wantedLevel !== 'any') {
            find = false;
          } else if (match.wantedLevel === 'any') {
            if (match.myLevel !== document.data().wantedLevel) {
              find = false;
            }
          } else if (document.data().myLevel !== match.wantedLevel) {
            find = false;
          }
        }

        if (match.type !== document.data().type) {
          if (match.type !== 'any' || document.data().type !== 'any') {
            find = false;
          }
        }

        console.log(find);
        if (find) {
          // TODO: excluir matches. fazer ligação
        }
      });
    });

    commit('setMatch', {
      inMatch: true,
      unsubscribe,
    });

    return true;
  },

  async deleteMatch({ commit, state }) {
    try {
      await deleteDoc(doc(database, 'matches', state.user.id));

      const { match } = state;
      match.unsubscribe && match.unsubscribe();
      match.unsubscribe = null;
      match.inMatch = false;

      commit('setMatch', match);
      return true;
    } catch (error) {
      return false;
    }
  },

  async fetchGames({ commit }) {
    try {
      const gamesRef = collection(database, 'games');
      const snapshot = await getDocs(gamesRef);
      const gamesArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      commit('setGames', gamesArray);
    } catch (error) {
      console.error(`actions, fetchGames: ${error}`);
    }
  },
};
