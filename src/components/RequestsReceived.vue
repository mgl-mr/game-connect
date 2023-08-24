<template>
  <div class="container-overlay">
    <div class="container">
      <div class="header">
        <p class="title">
          Solicitações de amizade
        </p>
        <button class="close" @click="close">
          X
        </button>
      </div>
      <div class="list-request">
        <p v-if="$store.state.user.receivedFriendRequests.length === 0" class="no-requests">
          Nenhuma solicitação recebida
        </p>
        <div
          v-else
          v-for="(request) in $store.state.user.receivedFriendRequests" :key="request.id"
          class="request"
        >
          <img :src="request.imageURL" :alt="request.name">
          <div class="request-user">
            <p>{{ request.name }}</p>
            <div class="request-buttons">
              <button @click="accept(request)" class="request-accept">
                ACEITAR
              </button>
              <button @click="remove(request)" class="request-delete">
                EXCLUIR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading v-show="loading"/>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  name: 'RequestsReceived',
  components: { Loading },

  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async accept(request) {
      this.loading = true;

      const receivedFriendRequests = this.$store.state.user.receivedFriendRequests.filter(
        (r) => r.id !== request.id,
      );
      const user = {
        id: this.$store.state.user.id,
        receivedFriendRequests,
        friendsId: this.$store.state.user.friendsId,
      };

      await this.$store.dispatch(
        'acceptFriendRequest',
        [user, request.id],
      );

      this.loading = false;
    },

    async remove(request) {
      this.loading = true;

      const receivedFriendRequests = this.$store.state.user.receivedFriendRequests.filter(
        (r) => r.id !== request.id,
      );
      const user = {
        id: this.$store.state.user.id,
        receivedFriendRequests,
      };

      await this.$store.dispatch(
        'deleteFriendRequest',
        [user, request.id],
      );

      this.loading = false;
    },

    close() {
      this.$store.state.showFriendRequestList = false;
    },
  },
};
</script>

<style scoped>
.container-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.container {
  width: 30vw;
  height: auto;
  background: linear-gradient(45deg, var(--primary) -10%, var(--dark) 100%);
  border: 1px solid var(--white);
  border-radius: 4px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 20px);
  height: 20px;
  padding: 10px;
}

.title {
  margin: 5px 0;
  margin: 0;
  color: var(--white);
  font-family: var(--pressStart);
  font-size: 12px;
  text-align: center;
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

.list-request {
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  height: 40vh;
  padding: 10px;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.no-requests {
  width: 100%;
  text-align: center;
  font-family: var(--pressStart);
  font-size: 10px;
  color: var(--white);
}

.list-request::-webkit-scrollbar {
  width: 0px;
}

.request {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 20px);
  height: auto;
  background-color: var(--dark);
  border-radius: 15px;
  padding: 10px;
}

.request img {
  width: 30%;
  height: calc(calc(calc(30vw - 20px) - 20px) * 0.3 + 10px);
  border: 1px solid var(--white);
  border-radius: 50%;
  margin-right: 10px;
}

.request-user {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: calc(70% - 10px);
  height: 100%;
}

.request-user p {
  width: 100%;
  height: 50%;
  margin: 0;
  word-wrap: break-word;
  font-family: var(--pressStart);
  color: var(--white);
  overflow: hidden;
}

.request-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30%;
}

.request-buttons button {
  width: 45%;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 10px;
}

.request-buttons button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.request-accept {
  border: none;
  background-color: var(--white);
  color: var(--dark);
}

.request-delete {
  border: 1px solid var(--white);
  background-color: var(--dark);
  color: var(--white);
}
</style>
