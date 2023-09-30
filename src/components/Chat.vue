<template>
  <div class="component-container">
    <div class="chat-container">
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
        >
        <img
            src="@/assets/images/send.png"
            alt="enviar mensagem"
            class="send"
          >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',

  methods: {
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
</style>
