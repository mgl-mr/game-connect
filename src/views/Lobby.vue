<template>
  <div class="component">
    <div class="container">
      <div class="form">
        <div class="base-info">
          <input
            v-if="$store.state.lobby.owner.id === $store.state.user.id"
            type="text"
            placeholder="Nome do lobby"
            class="name-input"
            v-model="lobby.name"
          >
          <p v-else class="name">{{ lobby.name }}</p>

          <textarea
            v-if="$store.state.lobby.owner.id === $store.state.user.id"
            v-model="lobby.description"
            placeholder="Descrição do Lobby"
            class="description-input"
          >
          </textarea>
          <p v-else class="description">{{ lobby.description }}</p>

          <div
            class="game"
            :class="{'game-hover': $store.state.lobby.owner.id === $store.state.user.id}"
            @click="choseGame = true"
          >
            <img :src="lobby.game.imageURL" :alt="lobby.game.name">
            <p>{{ lobby.game.name }}</p>
          </div>
        </div>

        <div class="config">
          <div class="participants">
            <p>Participantes:</p>
            <div v-if="$store.state.lobby.owner.id === $store.state.user.id">
              <p>{{ lobby.numGamers }}/</p>
              <input type="number" v-model="lobby.numMaxGamers">
            </div>
            <p v-else>{{ lobby.numGamers }}/{{ lobby.numMaxGamers }}</p>
          </div>

          <div class="checkbox-container">
            <p>Privado: </p>
            <input
              v-if="$store.state.lobby.owner.id === $store.state.user.id"
              class="checkbox"
              type="checkbox"
              v-model="lobby.private"
            >
            <div v-else-if="lobby.private">&#10003;</div>
            <div v-else>X</div>
          </div>

          <div class="checkbox-container">
            <p>Convidar: </p>
            <input
              v-if="$store.state.lobby.owner.id === $store.state.user.id"
              class="checkbox"
              type="checkbox"
              v-model="lobby.invite"
            >
            <div v-else-if="lobby.invite">&#10003;</div>
            <div v-else>X</div>
          </div>

          <div v-if="$store.state.lobby.owner.id === $store.state.user.id" class="button-create">
            <div class="button-loading" :class="{'loading':saveLoading}"></div>
            <button
              type="button"
              class="create"
              @click="updateLobby"
            >
              SALVAR
            </button>
          </div>
        </div>
      </div>

      <div class="voip-container">
        VoIP em breve
      </div>
    </div>

    <div class="container">
      <div class="chat-container">
        <div v-show="chatLoading" class="loading-container">
          <Loading
            :background="true"
          />
        </div>

        <div class="messages-container" id="messages-container">
          <div
            v-for="message in lobby.messages" :key="message.date.nanoseconds"
            class="message-div"
            :class="{'my-message': message.from.id === $store.state.user.id }"
          >
            <img
              v-show="message.from.imageURL !== '' && message.from.id !== $store.state.user.id"
              :src="message.from.imageURL"
              :alt="message.from.name"
            >
            <img
              v-show="message.from.imageURL === '' && message.from.id !== $store.state.user.id"
              src="@/assets/images/user-no-image.png"
              :alt="message.from.name"
            >

            <div>
              {{ message.message }}
            </div>
          </div>
        </div>

        <div class="input-container">
          <input
            type="text"
            placeholder="mensagem"
            class="input"
            v-model="text"
            :readonly="chatLoading"
            @keyup.enter="sendMessage"
          >
          <img
            src="@/assets/images/send.png"
            alt="enviar mensagem"
            class="send"
            @click="sendMessage"
          >
          <p v-show="errorChat" class="error-message shake">Falha ao enviar mensagem!!!</p>
        </div>
      </div>

      <div class="container-members">
        <div class="members">
          <p>Participantes: {{ lobby.numGamers }}/{{ lobby.numMaxGamers }}</p>

          <div class="owner" @mousedown="showMenu($event, lobby.owner)">
            <img
              v-if="lobby.owner.imageURL !== ''"
              :src="lobby.owner.imageURL"
              :alt="lobby.owner.name"
            >
            <img
              v-else
              src="@/assets/images/user-no-image.png"
              :alt="lobby.owner.name"
            >

            <p>{{ lobby.owner.name }}</p>
          </div>

          <button
            v-show="$store.state.lobby.owner.id === $store.state.user.id || $store.state.lobby.invite"
            class="invite-button"
            @click="invite = true; choseGame = false"
          >
            CONVIDAR
          </button>

          <div class="members-container">
            <div
              v-for="gamer in lobby.gamers" :key="gamer.id"
              class="member"
              @mousedown="showMenu($event, gamer)"
            >
              <img
                v-if="gamer.imageURL !== ''"
                :src="gamer.imageURL"
                :alt="gamer.name"
              >
              <img
                v-else
                src="@/assets/images/user-no-image.png"
                :alt="gamer.name"
              >

              <p>{{ gamer.name }}</p>
            </div>
          </div>
        </div>

        <div class="button-exit">
          <div class="button-loading" :class="{'loading':exitLoading}"></div>
          <button
            type="button"
            class="exit"
            @click="exitLobby"
          >
            SAIR
          </button>
        </div>
      </div>
    </div>

    <div class="div-error">
      <p
        class="auth-error"
        :class="{
          'error':error,
          'input-error':msgError
        }"
      >
        {{ msg }}
      </p>
    </div>

    <GamePicker
      v-show="choseGame"
      :list="game"
      :pick="pickGame"
      :max=1
      :full=true
      :initialGamesNumber=40
      class="container-gamer-picker"
    />

    <div v-show="invite" class="invite-container">
      <div class="header">
        <p>Convidar amigos</p>
        <button class="close" @click="invite = false">
          X
        </button>
      </div>

      <div class="invite-error">
        <p v-show="inviteError" :class="{'input-error': inviteError}">
          Erro ao convidar amigo!!!
        </p>
      </div>

      <div class="friends-container">
        <Loading v-show="inviteLoading"/>
        <div
          v-for="friend in friendsInvite" :key="friend.id"
          class="friend"
        >
          <div class="friend-info">
            <img
              v-if="friend.imageURL !== ''"
              :src="friend.imageURL"
              :alt="friend.name"
            >
            <img
              v-else
              src="@/assets/images/user-no-image.png"
              :alt="friend.name"
            >

            <p>{{ friend.name }}</p>
          </div>

          <button @click="inviteFriend(friend.id)">CONVIDAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Libby',
  components: { GamePicker, Loading },

  data() {
    return {
      lobby: {},
      game: [],
      choseGame: false,
      invite: false,
      error: false,
      text: '',
      msgError: false,
      msg: '',
      errorChat: false,
      saveLoading: false,
      chatLoading: false,
      exitLoading: false,
      inviteLoading: false,
      inviteError: false,
    };
  },

  computed: {
    participant() {
      return JSON.stringify(this.lobby) === JSON.stringify(this.$store.state.lobby);
    },

    owner() {
      return (
        this.lobby.gamers === this.$store.state.lobby.gamers
        && this.lobby.messages === this.$store.state.lobby.messages
        && this.lobby.numGamers === this.$store.state.lobby.numGamers
      );
    },

    countMessages() {
      return this.$store.state.lobby.messages.length;
    },

    friendsInvite() {
      return this.$store.state.user.friends
        .filter((friend) => !this.lobby.gamers.some((participant) => participant.id === friend.id))
        .filter((friend) => !this.lobby.guests.some((guestId) => guestId === friend.id))
        .filter((friend) => friend.inVoIP === false && friend.inLobby === false)
        .map((friend) => ({
          id: friend.id,
          name: friend.name,
          imageURL: friend.imageURL,
        }));
    },
  },

  watch: {
    participant(newValue) {
      if (!newValue && this.$store.state.lobby.owner.id !== this.$store.state.user.id) {
        this.refreshLobby();
      }
    },

    owner(newValue) {
      if (!newValue && this.$store.state.lobby.owner.id === this.$store.state.user.id) {
        this.refreshLobby();
      }
    },

    countMessages() {
      this.scrollToBottom();
    },
  },

  methods: {
    async updateLobby() {
      if (!this.loading) {
        if (this.validate()) {
          this.loading = true;
          const response = await this.$store.dispatch('saveLobby', {
            lobby: this.lobby,
            create: false,
          });
          this.loading = false;

          if (response) {
            this.informError('Lobby atualizado com sucesso.');
          } else {
            this.informError('Erro ao criar lobby.Verifique sua conexão');
          }
        }
      }
    },

    async exitLobby() {
      this.exitLoading = true;

      const response = await this.$store.dispatch('exitLobby');

      this.exitLoading = false;

      if (response) {
        this.$router.push('/application/lobbies');
      }
    },

    async sendMessage() {
      if (!this.chatLoading) {
        this.text = this.text.trim().replace(/\s+/g, ' ');

        if (this.text !== '') {
          this.chatLoading = true;

          const response = await this.$store.dispatch('sendLobbyMessage', {
            id: this.lobby.id,
            message: {
              from: {
                id: this.$store.state.user.id,
                name: this.$store.state.user.name,
                imageURL: this.$store.state.user.imageURL,
              },
              date: new Date(),
              message: this.text,
            },
          });

          this.chatLoading = false;

          if (response) {
            this.text = '';
          } else {
            this.errorChat = true;
            setTimeout(() => {
              this.errorChat = false;
            }, '3000');
          }
        }
      }
    },

    async inviteFriend(id) {
      const payload = {
        friendId: id,
        data: {
          from: this.$store.state.user.name,
          lobbyId: this.lobby.id,
          game: this.lobby.game.name,
        },
      };

      this.inviteLoading = true;
      const response = await this.$store.dispatch('inviteLobby', payload);
      this.inviteLoading = false;

      if (!response) {
        this.inviteError = true;
        setTimeout(() => {
          this.inviteError = false;
        }, 3000);
      }
    },

    pickGame(game) {
      this.game = [game];
      this.lobby.game = game;
      this.choseGame = false;
    },

    showMenu(e, g) {
      if (g.id !== this.$store.state.user.id) {
        e.stopPropagation();

        const gamer = g;

        if (this.$store.state.user.id === this.lobby.owner.id) {
          gamer.lobby = this.lobby.id;
        }

        this.$store.state.optionsMenu.x = e.clientX;
        this.$store.state.optionsMenu.y = e.clientY;
        this.$store.state.optionsMenu.user = gamer;
        this.$store.state.optionsMenu.show = true;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messageContainer = document.getElementById('messages-container');

        if (messageContainer) {
          const lastMessage = messageContainer.querySelector('.message-div:last-child');
          if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }
      });
    },

    refreshLobby() {
      this.lobby = { ...this.$store.state.lobby };
    },

    validate() {
      this.lobby.name = this.lobby.name.trim();
      this.lobby.name = this.lobby.name.replace(/\s+/g, ' ');

      this.lobby.description = this.lobby.description.trim();
      this.lobby.description = this.lobby.description.replace(/\s+/g, ' ');

      if (this.lobby.name.length < 3 || this.lobby.name.length > 30) {
        this.informError('Nome deve ter entre 3 a 30 caracteres.');
        return false;
      }

      if (this.lobby.description.length < 10 || this.lobby.description.length > 90) {
        this.informError('Descrição deve ter entre 10 a 90 caracteres.');
        return false;
      }

      if (typeof this.lobby.numMaxGamers !== 'number' || this.lobby.numMaxGamers < 2 || this.lobby.numMaxGamers > 30) {
        this.informError('Número de participantes deve ser entre 2 a 30.');
        return false;
      }
      this.lobby.numMaxGamers = parseInt(this.lobby.numMaxGamers, 10);

      if (this.lobby.numMaxGamers < this.lobby.numGamers) {
        this.informError('Número de participantes Não pode ser menor que a quantidade atual.');
        return false;
      }

      return true;
    },

    informError(message) {
      this.msg = message;
      this.error = true;
      this.msgError = true;
      setTimeout(() => {
        this.msgError = false;
      }, 500);
    },
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('exitLobby');

    next();
  },

  beforeMount() {
    this.refreshLobby();
  },
};
</script>

<style scoped>
.component {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: calc(85vh - 40px);
  margin: 0 auto;
  padding: 20px 0;
}

.component > div:nth-child(1) {
  height: 35%;
}

.component > div:nth-child(2) {
  height: 60%;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
}

/*** FORM / INFO ***/
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  height: 100%;
  border-radius: 15px;
  background-color: var(--dark);
}

.base-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 60%;
  height: calc(100% - 40px);
  margin-left: 10px;
  border: 2px solid var(--primary);
  border-radius: 15px;
  padding: 10px;
}

.base-info p {
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
}

.base-info .name {
  width: 100%;
  font-size: 14px;
  word-break: break-all;
  text-align: center;
}

.base-info .name-input {
  width: 100%;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
}

.base-info .name-input:hover,
.base-info .description-input:hover,
.config .participants div input:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.base-info .name-input::placeholder,
.base-info .description-input::placeholder {
  color: var(--white);
}

.base-info .description {
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: var(--white);
}

.base-info .description-input {
  width: 100%;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
  resize: none;
}

.base-info .game {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.game-hover:hover {
  cursor: pointer;
}

.game img {
  width: 80px;
  height: 80px;
  border-radius: 15px;
}

.game p {
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 0;
  margin-left: 5px;
  word-break: break-all;
}

.config {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: calc(40% - 80px);
  height: calc(100% - 40px);
  margin: 0 10px;
  border: 2px solid var(--primary);
  border-radius: 15px;
  padding: 10px;
}

.config .participants > p:nth-child(1) {
  margin-bottom: 5px;
}

.config .participants div {
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config .participants div p {
  height: 8px;
}

.config .participants div input {
  width: 40px;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
  resize: none;
}

.config .checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.config .checkbox-container div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  font-size: 12px;
  background-color: var(--primary);
  border-radius: 2px;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.config p {
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
  font-size: 10px;
  text-align: center;
}

.button-create {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 1vh);
  background: transparent;
  border-radius: 15px;
  margin-bottom: 1vh;
  height: 5vh;
  border: 0.5vh solid var(--accent);
}

.button-create:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.create {
  position: absolute;
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  transition: font-size 0.2s ease-in-out;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  font-size: 14px;
}

.create:hover {
  cursor: pointer;
  font-size: 18px;
  text-shadow: 2px 4px 2px var(--white);
}

.button-loading {
  display: none;
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

/*** CONTAINER GAMES ***/
.container-gamer-picker {
  position: absolute;
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 30px 1px var(--white);
}

/*** VOIP ***/
.voip-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
  height: 100%;
  background-color: var(--dark);
  color: var(--white);
  font-family: var(--pressStart);
  border-radius: 15px;
}

/*** CHAT ***/
.chat-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 60%;
  height: 100%;
  border-radius: 15px;
  background-color: var(--dark);
}

.messages-container {
  display: flex;
  flex-direction: column;
  width: 95%;
  height: calc(95% - 15px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
}

.messages-container::-webkit-scrollbar {
  width: 0px;
}

.message-div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.message-div div {
  border-radius: 15px;
  padding: 6px;
  margin: 5px;
  max-width: 60%;
  word-wrap: break-word;
  font-family: Arial, Helvetica, sans-serif;
  background-color: var(--primary);
  color: var(--white);
}

.my-message {
  justify-content: flex-end;
}

.my-message div {
  background-color: var(--white);
  color: var(--dark);
}

.message-div img {
  width: 30px;
  height: 30px;
  border: 1px solid var(--white);
  border-radius: 50%;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  height: 5%;
  background-color: var(--primary);
  margin-bottom: 5px;
  border-radius: 5px;
}

.input {
  width: calc(100% - 2vh - 15px);
  height: 100%;
  background-color: var(--primary);
  border: none;
  padding: 0;
  padding-left: 5px;
  margin: 0;
  color: var(--white);
  border-radius: 5px;
}

.input:focus {
  outline: none;
}

.input::placeholder {
  color: var(--white);
}

.send {
  width: 2vh;
  height: 2vh;
  margin: 0 5px;
}

.send:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.error-message {
  position: absolute;
  width: 100%;
  font-size: 10px;
  font-family: var(--pressStart);
  color: var(--white);
  text-align: center;
  margin: 0;
  margin-bottom: calc(4vh + 10px);
}

.shake {
  animation: shake 0.5s;
}

/*** MEMBERS ***/
.container-members {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 35%;
  height: 100%;
}

.invite-button {
  width: 95%;
  margin: 5px 0;
  border: none;
  border-radius: 15px;
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--primary);
  background-color: var(--accent);
  padding: 3px 0;
}

.invite-button:hover {
  cursor: pointer;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.members {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 85%;
  background-color: var(--dark);
  border-radius: 15px;
}

.members p {
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
  margin-top: 5px;
}

.members .owner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  background-color: var(--primary);
  color: var(--white);
  border-radius: 15px;
}

.members img {
  width: 50px;
  height: 50px;
  margin: 5px;
  border: 1px solid var(--white);
  border-radius: 50%;
}

.members-container {
  width: 95%;
  height: calc(100% - 105px);
  margin-bottom: 5px;
  border-top: 2px solid var(--white);
  overflow-y: auto;
  overflow-x: hidden;
}

.members-container::-webkit-scrollbar {
  width: 0px;
}

.members-container .member {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 5px;
}

.members .owner:hover,
.members-container .member:hover {
  cursor: pointer;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.members .owner:hover > img,
.members-container .member:hover > img {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.members .owner:not(:hover) > img,
.members-container .member:not(:hover) > img {
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

/*** EXIT ***/

.button-exit {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 1vh);
  background: transparent;
  border-radius: 15px;
  height: 10%;
  border: 0.5vh solid var(--accent);
}

.exit {
  position: relative;
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  transition: font-size 0.2s ease-in-out;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  font-size: 14px;
}

.exit:hover {
  cursor: pointer;
  font-size: 18px;
  text-shadow: 0px 0px 2px var(--white);
}

.button-loading {
  display: none;
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

/*** INVITE ***/
.invite-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 500px;
  border-radius: 15px;
  margin: 0 auto;
  box-shadow: 0 0 30px 1px var(--white);
  background-color: var(--dark);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  margin: 10px 0;
}

.header p {
  font-family: var(--pressStart);
  color: white;
  font-size: 16px;
  margin: 0;
}

.close {
  color: var(--white);
  background-color: transparent;
  border: 1px solid var(--white);
  border-radius: 50%;
}

.close:hover {
  cursor: pointer;
}

.invite-error {
  width: 95%;
  height: 20px;
  border-bottom: 2px solid var(--white);
}

.invite-error p {
  width: 100%;
  margin: 0;
  font-family: var(--pressStart);
  color: var(--white);
  font-size: 12px;
  text-align: center;
}

.friends-container {
  position: relative;
  width: 90%;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 0 0 15px 15px;
  margin-bottom: 5px;
}

.friends-container::-webkit-scrollbar {
  width: 0px;
}

.friend {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.friend-info {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 10px 0;
}

.friend-info img {
  width: 50px;
  height: 50px;
  border: 1px solid var(--white);
  border-radius: 50%;
}

.friend-info p {
  width: calc(100% - 60px);
  font-family: var(--pressStart);
  color: white;
  font-size: 16px;
  margin: 0;
  margin-left: 10px;
}

.friend button {
  width: calc(50% - 3px);
  height: 50px;
  background-color: var(--accent);
  font-family: var(--pressStart);
  font-size: 16px;
  color: var(--primary);
  border: none;
  border-radius: 15px;
  transition: font-size 0.2s ease-in-out;
}

.friend button:hover {
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 0 3px 1px var(--white);
}

/*** ERROR ***/
.div-error {
  top: 31vh;
  position: absolute;
  margin: 0;
  text-align: center;
}

.auth-error {
  display: none;
  margin: 0;
  font-size: 16px;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.error {
  display: block;
}

.input-error {
  color: var(--accent);
  animation: shake 0.5s;
}

@keyframes loading {
  0% { left: -100px; }
  50% { left: 100%; }
  100% { left: -100px; }
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
