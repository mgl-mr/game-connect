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

    <input
      type="text"
      placeholder="Filtre por nome"
      class="search"
      v-model="searchTerm"
    >

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
      </div>
      <div
        v-else
        v-for="(friend, index) in $store.state.user.friends" :key="index"
        class="friend"
        @click="showPerfil(friend)"
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
    };
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    showPerfil(friend) {
      // TODO: ir para página de perfil do usuário
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

<style>
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

.search {
  width: calc(90% - 4px);
  height: 4vh;
  margin: 10px 0 5px 0;
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
  width: 100%;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 5px;
  border-bottom: 2px solid var(--white);
}

.friend-image{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.friend-name  {
  font-family: var(--pressStart), Arial, Helvetica;
  color: var(--white);
  font-size: 10px;
  margin-left: 10px;
  width: calc(85% - 59px);
}

.friend:hover {
  cursor: pointer;
}

.friend:hover .friend-image{
  box-shadow: 0 0 3px 1px var(--white);
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
</style>
