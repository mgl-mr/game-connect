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
  increment,
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
        inVoIP: false,
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
      suggestions,
      friends,
      ...userUpdate
    } = user;
    console.log(userUpdate);
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

  fetchListeners({ commit, state, dispatch }, id) {
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
      const chatListeners = {};
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

        const ids = [id, friendId].sort();
        const chatId = `${ids[0]}_${ids[1]}`;

        if (!(chatId in chatListeners)) {
          const unsb = onSnapshot(doc(database, 'chats', chatId), (chatSnapshot) => {
            commit('setListener', unsb);
            const friend = state.user.friends.find((f) => f.id === friendId);

            if (chatSnapshot.exists) {
              if (chatSnapshot.data()) {
                const data = chatSnapshot.data();
                state.chat.conversations[chatId] = data;
                friend.lastMessage = (data.messages[data.messages.length - 1].date.seconds);

                if (state.chat.id === chatId) {
                  state.messages = data.messages;

                  if (data?.[id] !== 0) {
                    dispatch('resetUnseenMessages', chatId);
                  }

                  friend.newMessages = 0;
                } else if (data?.[id] !== undefined) {
                  friend.newMessages = data?.[id];
                } else {
                  friend.newMessages = 0;
                }
              } else {
                state.chat.conversations[chatId] = false;
                friend.lastMessage = 0;
                friend.newMessages = 0;
              }
            }

            state.user.friends.sort((a, b) => b.lastMessage - a.lastMessage);
          });

          chatListeners[chatId] = unsb;
        }
      });
    });

    onSnapshot(doc(database, 'voips', id), (voipSnapshot) => {
      if (voipSnapshot.exists && voipSnapshot.data()?.calling && voipSnapshot.data()?.response) {
        if (voipSnapshot.data().response === 'waiting') {
          state.answerCall = {
            show: true,
            message: `${voipSnapshot.data().calling.name} está te ligando. Atender:`,
            friend: voipSnapshot.data().calling,
          };
        }
      }

      if (voipSnapshot.data()?.cancel) {
        state.answerCall = {
          show: false,
          message: '',
          friend: {},
        };

        state.voIP.id = state.user.id;

        dispatch('hangUp', 'remove');
      }
    });
  },

  async fetchSuggestions({ commit, state }, ids) {
    try {
      const suggestionsRef = collection(database, 'gamers');
      const suggestionsQuery = query(suggestionsRef, where('gamesId', 'array-contains-any', ids));
      const snapshot = await getDocs(suggestionsQuery);
      const suggestions = snapshot.docs
        .filter((document) => !state.user.friendsId.includes(document.id))
        .map((document) => ({
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

  async createMatch({ commit, dispatch, state }, match) {
    try {
      const matchRef = doc(database, `matches/${match.gamerId}`);
      await setDoc(matchRef, match);
    } catch (error) {
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
          if (match.wantedLevel !== 'any' && document.data().wantedLevel !== 'any') {
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

        if (find) {
          const m = state.match;
          m.unsubscribe && m.unsubscribe();
          m.unsubscribe = null;

          dispatch('deleteMatch');

          const matchedUser = {
            id: document.id,
            name: document.data().gamerName,
            imageURL: document.data().gamerImageURL,
          };

          dispatch('voipMath', matchedUser);
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

  async voipMath({ commit, state, dispatch }, matchedUser) {
    const ids = [state.user.id, matchedUser.id].sort();

    commit('setVoIP', {
      matchedUser,
      inVoIP: `${ids[0]}_${ids[1]}`,
      loading: {
        show: true,
        message: 'Estabelecendo conexão',
      },
    });

    if (ids[0] === state.user.id) {
      dispatch('createVoipOffer', `${ids[0]}_${ids[1]}`);
    } else {
      dispatch('createVoipAnswer', `${ids[0]}_${ids[1]}`);
    }
  },

  async askCall({ state, commit, dispatch }, friend) {
    try {
      const voipRef = doc(database, `voips/${friend.id}`);

      await setDoc(voipRef, {
        calling: {
          id: state.user.id,
          name: state.user.name,
          imageURL: state.user.imageURL,
        },
        response: 'waiting',
      });

      const unsub = onSnapshot(voipRef, (voipSnapshot) => {
        if (voipSnapshot.data()?.response) {
          if (voipSnapshot.data()?.response === true) {
            unsub();

            commit('setVoIP', {
              matchedUser: friend,
              inVoIP: friend.id,
              loading: {
                show: true,
                message: 'Estabelecendo conexão',
              },
            });

            state.chat.loading = false;

            dispatch('createVoipAnswer', friend.id);
          } else if (voipSnapshot.data()?.response === false) {
            unsub();

            state.chat.loading = false;
            state.chat.error.show = false;
            state.chat.error.message = 'Chamada recusada!!!';
            state.chat.error.show = true;
            setTimeout(() => {
              state.chat.error.show = false;
            }, '3000');

            state.voIP.id = friend.id;

            dispatch('hangUp', 'remove');
          }
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  async answerCall({ state, commit, dispatch }, response) {
    const voipRef = doc(database, `voips/${state.user.id}`);

    if (response) {
      commit('setVoIP', {
        matchedUser: state.answerCall.friend,
        inVoIP: state.user.id,
        loading: {
          show: true,
          message: 'Estabelecendo conexão',
        },
      });

      state.chat.loading = false;

      await setDoc(voipRef, {
        response: true,
      });

      state.answerCall = {
        show: false,
        message: '',
        friend: {},
      };

      dispatch('createVoipOffer', state.user.id);
    } else {
      updateDoc(voipRef, {
        response: false,
      });

      state.answerCall = {
        show: false,
        message: '',
        friend: {},
      };
    }
  },

  async createVoipOffer({ commit, state, dispatch }, id) {
    const voipRef = doc(database, `voips/${id}`);

    let localStream;
    let remoteStream;
    let peerConnection;

    const servers = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
    };

    commit('setVoIP', { id });

    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      state.voIP.localStream = localStream;

      peerConnection = new RTCPeerConnection(servers);
      state.voIP.peerConnection = peerConnection;

      remoteStream = new MediaStream();

      document.getElementById('track').srcObject = remoteStream;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          event.candidate && updateDoc(voipRef, {
            offerCandidates: arrayUnion(event.candidate.toJSON()),
          });
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      await setDoc(voipRef, {
        offer: {
          sdp: offer.sdp,
          type: offer.type,
        },
      });

      await updateDoc(doc(database, `gamers/${state.user.id}`), {
        inVoIP: id,
      });

      commit('setUser', {
        inVoIP: id,
      });

      const unsubscribe = onSnapshot(voipRef, (voipSnapshot) => {
        if (voipSnapshot.exists) {
          if (voipSnapshot.data()?.hangUp) {
            dispatch('hangUp', 'remove');
          }

          if (voipSnapshot.data()?.error) {
            commit('setVoIP', {
              error: {
                show: true,
                message: 'Falha na conexão com o destinatário da chamada.',
              },
            });
          }

          if (voipSnapshot.data()?.hangUp) {
            dispatch('hangUp', true);
          }

          if (!peerConnection.currentRemoteDescription && voipSnapshot.data()?.answer) {
            peerConnection.setRemoteDescription(voipSnapshot.data().answer);
          }

          if (peerConnection && voipSnapshot.data()?.answerCandidates) {
            voipSnapshot.data().answerCandidates.forEach((candidate) => {
              const regex = /candidate:(\d+)/;
              const match = candidate.candidate.match(regex);
              if (!state.voIP.answerCandidates.includes(match[1])) {
                peerConnection.addIceCandidate(candidate);
                state.voIP.loading = {
                  show: false,
                  message: '',
                };
                state.voIP.answerCandidates.push(match[1]);
              }
            });
          }
        }
      });

      state.voIP.unsubscribe = unsubscribe;
    } catch (error) {
      commit('setVoIP', {
        error: {
          show: true,
          message: 'Erro ao conectar. Certifique-se de permitir acesso do navegador ao microfone.',
        },
      });

      dispatch('hangUp', 'error');
    }
  },

  async createVoipAnswer({ commit, state, dispatch }, id) {
    const voipRef = doc(database, `voips/${id}`);

    let localStream;
    let remoteStream;
    let peerConnection;

    const servers = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
    };

    commit('setVoIP', { id });

    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      state.voIP.localStream = localStream;

      peerConnection = new RTCPeerConnection(servers);
      state.voIP.peerConnection = peerConnection;

      remoteStream = new MediaStream();

      document.getElementById('track').srcObject = remoteStream;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          event.candidate && updateDoc(voipRef, {
            answerCandidates: arrayUnion(event.candidate.toJSON()),
          });
        }
      };

      const callback = async (offer) => {
        await peerConnection.setRemoteDescription(offer);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        await updateDoc(voipRef, {
          answer: {
            sdp: answer.sdp,
            type: answer.type,
          },
        });

        await updateDoc(doc(database, `gamers/${state.user.id}`), {
          inVoIP: id,
        });

        commit('setUser', {
          inVoIP: id,
        });

        const unsubscribe = onSnapshot(voipRef, (voipSnapshot) => {
          if (voipSnapshot.exists) {
            if (voipSnapshot.data()?.hangUp) {
              dispatch('hangUp', 'remove');
            }

            if (voipSnapshot.data()?.error) {
              commit('setVoIP', {
                error: {
                  show: true,
                  message: 'Falha na conexão com o destinatário da chamada.',
                },
              });
            }

            if (peerConnection && voipSnapshot.data()?.offerCandidates) {
              voipSnapshot.data().offerCandidates.forEach((candidate) => {
                const regex = /candidate:(\d+)/;
                const match = candidate.candidate.match(regex);
                if (!state.voIP.offerCandidates.includes(match[1])) {
                  peerConnection.addIceCandidate(candidate);
                  state.voIP.loading = {
                    show: false,
                    message: '',
                  };
                  state.voIP.offerCandidates.push(match[1]);
                }
              });
            }
          }
        });

        state.voIP.unsubscribe = unsubscribe;
      };

      const unsubscribe = onSnapshot(voipRef, (voipSnapshot) => {
        if (voipSnapshot.exists) {
          if (voipSnapshot.data()?.error) {
            commit('setVoIP', {
              error: {
                show: true,
                message: 'Falha na conexão com o destinatário da chamada.',
              },
            });
          }

          if (voipSnapshot.data()?.offer) {
            callback(voipSnapshot.data().offer);
            unsubscribe();
          }
        }
      });
    } catch (error) {
      commit('setVoIP', {
        error: {
          show: true,
          message: 'Erro ao conectar. Certifique-se de permitir acesso do navegador ao microfone.',
        },
      });

      dispatch('hangUp', 'error');
    }
  },

  async hangUp({ state, commit }, type) {
    try {
      const voipRef = doc(database, `voips/${state.voIP.id}`);

      state.voIP.peerConnection && state.voIP.peerConnection.close();

      state.voIP.unsubscribe && state.voIP.unsubscribe();

      if (type === 'error') {
        await setDoc(voipRef, { error: true });
        return;
      }

      commit('setVoIP', {
        id: '',
        inVoIP: false,
        matchedUser: {},
        localStream: null,
        peerConnection: null,
        unsubscribe: null,
        loading: {
          show: false,
          message: '',
        },
        error: {
          show: false,
          message: '',
        },
      });

      await updateDoc(doc(database, `gamers/${state.user.id}`), {
        inVoIP: false,
      });

      commit('setUser', {
        inVoIP: false,
      });

      type === 'hangUp' && await setDoc(voipRef, { hangUp: true });

      type === 'cancel' && await setDoc(voipRef, { cancel: true });

      type === 'remove' && await deleteDoc(voipRef);

      return true;
    } catch (error) {
      return false;
    }
  },

  async sendMessage(context, payload) {
    const chatRef = doc(database, `chats/${payload.id}`);
    try {
      if (payload.newMessage) {
        await setDoc(chatRef, {
          messages: arrayUnion(payload.message),
          [payload.friendId]: increment(1),
        });
      } else {
        await updateDoc(chatRef, {
          messages: arrayUnion(payload.message),
          [payload.friendId]: increment(1),
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  resetUnseenMessages({ state }, id) {
    const chatRef = doc(database, `chats/${id}`);

    updateDoc(chatRef, {
      [state.user.id]: 0,
    });
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
