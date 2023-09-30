<template>
  <div class="component-container">
    <div class="chat-container">
      <loading v-show="loading" class="loading"/>
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
          >
          <img
            src="@/assets/images/close.png"
            alt="Fechar"
            class="close"
            @click="close"
          >
        </div>
      </div>
      <div class="messages">

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
        <p v-show="error" class="error shake">Erro ao enviar mensagem!!!</p>
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
      messages: [],
      text: '',
      loading: false,
      error: false,
    };
  },

  methods: {
    async sendMessage() {
      this.text = this.text.trim().replace(/\s+/g, ' ');

      if (this.text !== '') {
        this.loading = true;

        const response = await this.$store.dispatch('sendMessage', {
          id: this.$store.state.chat.id,
          message: {
            from: this.$store.state.user.id,
            date: new Date(),
            message: this.text,
          },
        });

        this.loading = false;

        if (response) {
          this.text = '';
        } else {
          this.error = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, '3000');
        }
      }
    },

    close() {
      this.$store.state.chat = {
        show: false,
        id: '',
        friend: {},
      };
    },
  },

  mounted() {
    // console.log(this.$store.state.chat);
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

.messages {
  width: 100%;
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
}

.messages::-webkit-scrollbar {
  width: 0px;
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

.loading {
  width: 30%;
  height: 80%;
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