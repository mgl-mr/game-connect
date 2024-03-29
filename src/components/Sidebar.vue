<template>
  <div class="container-sidebar">
    <img
      src="@/assets/images/logo.png"
      class="logo"
      alt="Logo Game Connect"
    >

    <div class="user">
      <img v-if="$store.state.user.imageURL !== ''"
        :src="$store.state.user.imageURL"
        class="user-image"
        alt="Imagem de perfil"
      >
      <img v-else
        src="@/assets/images/user-no-image.png"
        class="user-image"
        alt="Imagem de perfil"
      >

      <p class="user-name">{{ $store.state.user.name }}</p>
    </div>

    <div class="search-container">
      <input
        type="text"
        placeholder="Filtre por nome"
        class="search"
        v-model="searchTerm"
      >

      <div class="bell-container">
        <p>{{ $store.state.user.receivedFriendRequests.length }}</p>
        <img
          v-if="$store.state.user.receivedFriendRequests.length === 0"
          src="@/assets/images/request_bell_of.png"
          class="bell"
          alt="sem notificações de pedido de amizade'"
          @click="openReceivedRequests"
        >
        <img
          v-else
          src="@/assets/images/request_bell_on.png"
          class="bell ringing-bell"
          alt="notificações de pedido de amizade'"
          @click="openReceivedRequests"
        >
      </div>
    </div>

    <div class="friends">
      <p v-if="$store.state.user.friendsId.length === 0" class="friend-message">
        Você ainda não tem amigos adicionados.
      </p>
      <p v-else-if="friends.length === 0" class="friend-message">
        Não há amigos correspondente à sua busca.
      </p>
      <div
        v-else-if="searchTerm !== ''"
        v-for="(friend, id) in $store.state.user.friends" :key="id"
        class="friend"
        @click="showPerfil(friend)"
        @mouseover="hover = friend.id"
        @mouseleave="hover = ''"
      >
        <img v-if="friend.imageURL !== ''"
          :src="friend.imageURL"
          class="friend-image"
          alt="Imagem de perfil"
        >
        <img v-else
          src="@/assets/images/user-no-image.png"
          class="friend-image"
          alt="Imagem de perfil"
        >
        <p class="friend-name">{{ friend.name }}</p>
        <div class="status-container">
          <p v-show="friend.id === hover">{{ friend.status }}</p>
          <div v-if="friend.status === 'online'" class="online"></div>
          <div v-else class="offline"></div>
        </div>
      </div>
      <div
        v-else
        v-for="(friend, index) in $store.state.user.friends" :key="index"
        class="friend"
        @click="showChat(friend)"
        @mouseover="hover = friend.id"
        @mouseleave="hover = ''"
      >
        <div class="friend-container">
          <img v-if="friend.imageURL !== ''"
            :src="friend.imageURL"
            class="friend-image"
            alt="Imagem de perfil"
          >
          <img v-else
            src="@/assets/images/user-no-image.png"
            class="friend-image"
            alt="Imagem de perfil"
          >
          <p class="friend-name">{{ friend.name }}</p>
        </div>
        <div class="info-container">
          <div class="status-container">
            <p v-show="friend.id === hover">{{ friend.status }}</p>
            <div v-if="friend.status === 'online'" class="online"></div>
            <div v-else class="offline"></div>
          </div>
          <div v-show="friend.newMessages > 0" class="new-messages">
            {{ friend.newMessages }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',

  data() {
    return {
      friends: false,
      filteredFriends: false,
      searchTerm: '',
      hover: '',
    };
  },

  methods: {
    openReceivedRequests() {
      this.$store.state.showFriendRequestList = true;
    },

    showChat(friend) {
      const ids = [friend.id, this.$store.state.user.id].sort();

      const id = `${ids[0]}_${ids[1]}`;

      if (this.$store.state.chat.conversations[id]) {
        this.$store.state.messages = this.$store.state.chat.conversations[id].messages;
      } else {
        this.$store.state.messages = [];
      }

      if (this.$store.state.chat.friend.id !== friend.id) {
        this.$store.state.chat.show = true;
        this.$store.state.chat.id = id;
        this.$store.state.chat.friend = {
          id: friend.id,
          name: friend.name,
          imageURL: friend.imageURL,
        };

        if (this.$store.state.messages.length !== 0 && friend.newMessages > 0) {
          this.$store.dispatch('resetUnseenMessages', this.$store.state.chat.id);
        }
      }
    },
  },

  watch: {
    searchTerm() {
      if (this.searchTerm === '') {
        if (this.$store.state.user.friendsId.length !== 0) {
          this.friends = this.$store.state.user.friends;
        } else {
          this.friends = false;
        }
      } else {
        this.friends = this.$store.state.user.friends.filter(
          (friend) => friend.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        );
      }
    },
  },
};
</script>

<style scoped>
.container-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  height: 100vh;
  background: linear-gradient(
    185.75deg,
    var(--primary) 0%,
    var(--accent) 100%
  );
}

.logo {
  width: 50%;
  animation: logo 2s linear infinite;
}

.user {
  display: flex;
  align-items: center;
  width: 90%;
}

.user-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.user-name  {
  font-family: var(--pressStart), Arial, Helvetica;
  color: var(--white);
  font-size: medium;
  margin-left: 10%;
  width: calc(85% - 84px);
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  height: 4vh;
  margin: 10px 0 5px 0;
}

.search {
  width: calc(90% - 4px);
  height: 100%;
  text-align: center;
  background-color: transparent;
  border: 2px solid var(--white);
  border-radius: 10px;
  outline: 0
}

.search::placeholder {
  color: var(--white);
}

.search:hover {
  box-shadow: 0 0 3px 1px var(--white);
  outline: 0
}

.search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 3px 1px var(--white);
  color: var(--white);
  outline: 0
}

.bell-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 4vh;
  padding: 0;
  margin: 0;
  position: relative;
}

.bell {
  height: 100%;
}

.bell:hover {
  cursor: pointer;
}

.ringing-bell {
  animation: ring 4s .7s ease-in-out infinite;
}

.bell-container p {
  color: var(--white);
  font-family: var(--pressStart);
  font-size: 8px;
  position: absolute;
  right: 0;
  top: 0;
  margin: 0;
}

.friends {
  width: 90%;
  margin-top: 10px;
  list-style-type: none;
  overflow-y: auto;
}

.friends::-webkit-scrollbar {
  width: 0px;
}

.friend-message {
  width: 100%;
  text-align: center;
  font-family: var(--pressStart), Arial, Helvetica;
  color: var(--white);
  font-size: small;
}

.friend {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 54px;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 5px;
  border-bottom: 2px solid var(--white);
  position: relative;
}

.friend-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: calc(50% - 5px);
}

.friend-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.friend-name  {
  font-family: var(--pressStart), Arial, Helvetica;
  color: var(--white);
  font-size: 10px;
  margin: 0;
  margin-left: 10px;
  width: calc(100% - 64px);
}

.friend:hover {
  cursor: pointer;
}

.friend:hover .friend-image{
  box-shadow: 0 0 3px 1px var(--white);
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.info-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;
  width: calc(50% - 5px);
  height: 100%;
}

.status-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.status-container p {
  font-family: var(--pressStart);
  font-size: 10px;
  color: var(--white);
  margin: 0;
}

.status-container div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--white);
}

.online {
  background-color: var(--accent);
  box-shadow: 0 0 3px 1px var(--accent);
}

.offline {
  background-color: var(--dark);
}

.new-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  padding: 5px;
  font-family: var(--pressStart);
  background-color: var(--primary);
  color: var(--white);
  border-radius: 5px;
}

@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(30deg); }
  3% { transform: rotate(-28deg); }
  5% { transform: rotate(34deg); }
  7% { transform: rotate(-32deg); }
  9% { transform: rotate(30deg); }
  11% { transform: rotate(-28deg); }
  13% { transform: rotate(26deg); }
  15% { transform: rotate(-24deg); }
  17% { transform: rotate(22deg); }
  19% { transform: rotate(-20deg); }
  21% { transform: rotate(18deg); }
  23% { transform: rotate(-16deg); }
  25% { transform: rotate(14deg); }
  27% { transform: rotate(-12deg); }
  29% { transform: rotate(10deg); }
  31% { transform: rotate(-8deg); }
  33% { transform: rotate(6deg); }
  35% { transform: rotate(-4deg); }
  37% { transform: rotate(2deg); }
  39% { transform: rotate(-1deg); }
  41% { transform: rotate(1deg); }

  43% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
</style>
