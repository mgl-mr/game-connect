<template>
  <div class="component-container">
    <div class="chat-container">
      <div v-show="$store.state.chat.loading" class="loading-container">
        <div>
          <loading
            :background="true"
            class="loading"
          />
        </div>
        <button v-show="voipLoading" @click="cancel">
          CANCELAR
        </button>
      </div>
      <div class="header">
        <div class="friend">
          <img
            v-if="$store.state.chat.friend.imageURL !== ''"
            :src="$store.state.chat.friend.imageURL"
            :alt="$store.state.chat.friend.name"
          >
          <img
            v-else
            src="@/assets/images/user-no-image.png"
            :alt="$store.state.chat.friend.name"
          >
          <p>{{ $store.state.chat.friend.name }}</p>
        </div>
        <div class="actions">
          <img
            src="@/assets/images/start-call.png"
            alt="Encerrar ligação"
            class="start-call"
            @click="askCall"
          >
          <img
            src="@/assets/images/close.png"
            alt="Fechar"
            class="close"
            @click="close"
          >
        </div>
      </div>
      <div class="messages-container" id="messages-container">
        <div v-if="$store.state.messages.length === 0" class="no-messages">
          <p>Sem mensagens</p>
        </div>
        <div
          v-else
          v-for="message in $store.state.messages" :key="message.date.nanoseconds"
          class="message"
          :class="{ 'friend-message-container': message.from !== $store.state.user.id }"
        >
          <div :class="{ 'my-message': message.from === $store.state.user.id,  'friend-message': message.from !== $store.state.user.id}">
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
          @keyup.enter="sendMessage"
        >
        <img
          src="@/assets/images/send.png"
          alt="enviar mensagem"
          class="send"
          @click="sendMessage"
        >
        <p v-show="$store.state.chat.error.show" class="error shake">{{ $store.state.chat.error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
  name: 'Chat',
  components: { Loading },

  data() {
    return {
      text: '',
      voipLoading: false,
    };
  },

  computed: {
    count() {
      return this.$store.state.messages.length;
    },
  },

  watch: {
    count() {
      this.scrollToBottom();
    },
  },

  methods: {
    async sendMessage() {
      this.voipLoading = false;
      this.text = this.text.trim().replace(/\s+/g, ' ');

      if (this.text !== '') {
        this.$store.state.chat.loading = true;

        const newMessage = this.$store.state.messages.length === 0;

        const response = await this.$store.dispatch('sendMessage', {
          id: this.$store.state.chat.id,
          friendId: this.$store.state.chat.friend.id,
          message: {
            from: this.$store.state.user.id,
            date: new Date(),
            message: this.text,
          },
          newMessage,
        });

        this.$store.state.chat.loading = false;

        if (response) {
          this.text = '';
        } else {
          this.$store.state.chat.error.show = false;
          this.$store.state.chat.error.message = 'Erro ao enviar mensagem!!!';
          this.$store.state.chat.error.show = true;
          setTimeout(() => {
            this.$store.state.chat.error.show = false;
          }, '3000');
        }
      }
    },

    async askCall() {
      if (this.$store.state.user.inLobby) {
        this.$store.state.chat.error.show = false;
        this.$store.state.chat.error.message = 'Saia do lobby para fazer ligações!!!';
        this.$store.state.chat.error.show = true;
        setTimeout(() => {
          this.$store.state.chat.error.show = false;
        }, '3000');

        return;
      }

      if (this.$store.state.user.inMatch) {
        this.$store.state.chat.error.show = false;
        this.$store.state.chat.error.message = 'Cancele a match para fazer ligações!!!';
        this.$store.state.chat.error.show = true;
        setTimeout(() => {
          this.$store.state.chat.error.show = false;
        }, '3000');

        return;
      }

      const friend = this.$store.state.user.friends.filter((f) => f.id === this.$store.state.chat.friend.id);
      if (friend[0].inLobby || friend[0].inMatch || friend[0].inVoIP) {
        this.$store.state.chat.error.show = false;
        this.$store.state.chat.error.message = 'Usuário ocupado!!!';
        this.$store.state.chat.error.show = true;
        setTimeout(() => {
          this.$store.state.chat.error.show = false;
        }, '3000');

        return;
      }

      this.voipLoading = true;
      this.$store.state.chat.loading = true;

      const response = await this.$store.dispatch('askCall', this.$store.state.chat.friend);

      if (!response) {
        this.$store.state.chat.loading = false;
        this.$store.state.chat.error.show = false;
        this.$store.state.chat.error.message = 'Erro ao iniciar chamada!!!';
        this.$store.state.chat.error.show = true;
        setTimeout(() => {
          this.$store.state.chat.error.show = false;
        }, '3000');
      }
    },

    cancel() {
      this.$store.state.chat.loading = false;
      this.$store.state.chat.error.show = false;
      this.$store.state.chat.error.message = 'Chamada cancelada!!!';
      this.$store.state.chat.error.show = true;
      setTimeout(() => {
        this.$store.state.chat.error.show = false;
      }, '3000');

      this.$store.state.voIP.id = this.$store.state.chat.friend.id;

      this.$store.dispatch('hangUp', 'cancel');
    },

    close() {
      this.$store.state.messages = [];
      this.$store.state.chat.show = false;
      this.$store.state.chat.id = '';
      this.$store.state.chat.friend = {};
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messageContainer = document.getElementById('messages-container');

        if (messageContainer) {
          const lastMessage = messageContainer.querySelector('.message:last-child');
          if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.component-container {
  position: absolute;
  z-index: 0;
  left: 25vw;
  top: 15vh;
  width: 75vw;
  height: 85vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.chat-container {
  width: 30%;
  height: 80%;
  background-color: var(--dark);
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 30px);
  height: 15%;
  background-color: var(--primary);
  padding: 0 15px;
}

.friend {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50%;
}

.friend:hover {
  cursor: pointer;
}

.friend img {
  width: 8vh;
  height: 8vh;
  border-radius: 50%;
  border: 2px solid var(--white);
  margin-right: 5px;
}

.friend:hover img {
  transform: scale(1.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.friend p {
  font-size: 12px;
  font-family: var(--pressStart);
  color: white;
  margin: 0;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  height: 100%;
}

.start-call {
  width: 5vh;
  height: 5vh;
  margin-right: 40px;
}

.close {
  width: 2.5vh;
  height: 2.5vh;
}

.start-call:hover,
.close:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.messages-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
}

.messages-container::-webkit-scrollbar {
  width: 0px;
}

.no-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.no-messages p {
  font-size: 14px;
  font-family: var(--pressStart);
  color: var(--white);
}

.message {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.message div {
  display: inline-block;
  border-radius: 15px;
  padding: 6px;
  margin: 5px;
  max-width: 75%;
  word-wrap: break-word;
  font-family: Arial, Helvetica, sans-serif;
}

.my-message {
  background-color: var(--white);
  color: var(--dark);
}

.friend-message-container {
  justify-content: flex-start;
}

.friend-message {
  background-color: var(--primary);
  color: var(--white);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5%;
  background-color: var(--primary);
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
  gap: 20px;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading-container button {
  width: 50%;
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  background-color: var(--dark);
  border: 2px solid var(--white);
  border-radius: 15px;
  padding: 10px 0;
}

.loading-container button:hover {
  cursor: pointer;
  box-shadow: 0 0 13px 1px rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.loading-container button:not(:hover) {
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

.loading-container div {
  width: 80px;
  height: 80px;
}

.loading {
  width: 100%;
  height:100%;
}

.error {
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

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
