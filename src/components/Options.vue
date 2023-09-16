<template>
  <div id="options-container">
    <div class="user">
      <img
        v-if="$store.state.optionsMenu.user?.imageURL !== ''"
        :src="$store.state.optionsMenu.user.imageURL"
        :alt="$store.state.optionsMenu.user.name"
        class="user-image"
      >
      <img
        v-else
        src="@/assets/images/user-no-image.png"
        :alt="$store.state.optionsMenu.user.name"
        class="user-image"
      >
      <p>{{ $store.state.optionsMenu.user.name }}</p>
    </div>

    <div class="options">
      <p v-if="requested()">Solicitado</p>
      <p v-else-if="isfriend()" @click="unfriend">Desfazer amizade</p>
      <p v-else @click="sendRequest">Solicitar amizade</p>
    </div>

    <div v-show="loading" class="loading">
      <loading :background="true" />
    </div>
  </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
  name: 'Options',
  components: { Loading },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async sendRequest() {
      this.loading = true;

      const user = {
        id: this.$store.state.user.id,
        name: this.$store.state.user.name,
        imageURL: this.$store.state.user.imageURL,
      };

      await this.$store.dispatch(
        'sendFriendRequest',
        [user, this.$store.state.optionsMenu.user.id, this.$store.state.user.sentFriendRequests],
      );

      this.loading = false;
    },

    unfriend() {
      // TODO: desfazer amizade
    },

    requested() {
      return this.$store.state.user.sentFriendRequests.includes(this.$store.state.optionsMenu.user.id);
    },

    isfriend() {
      return this.$store.state.user.friendsId.includes(this.$store.state.optionsMenu.user.id);
    },

    handleBodyClick(event) {
      const optionsElement = document.getElementById('options-container');
      if (optionsElement && !optionsElement.contains(event.target)) {
        this.$store.state.optionsMenu.show = false;
      }
    },
  },

  mounted() {
    document.body.addEventListener('mousedown', this.handleBodyClick);
  },

  beforeUnmount() {
    document.body.removeEventListener('mousedown', this.handleBodyClick);
  },

  updated() {
    const optionsElement = document.getElementById('options-container');

    if (this.$store.state.optionsMenu.x <= window.innerWidth / 2) {
      optionsElement.style.left = `${this.$store.state.optionsMenu.x}px`;
    } else {
      optionsElement.style.left = `${this.$store.state.optionsMenu.x - 204}px`;
    }

    if (this.$store.state.optionsMenu.y <= window.innerHeight / 2) {
      optionsElement.style.top = `${this.$store.state.optionsMenu.y}px`;
    } else {
      optionsElement.style.top = `${this.$store.state.optionsMenu.y - optionsElement.clientHeight - 4}px`;
    }
  },
};
</script>

<style scoped>
#options-container {
  position: absolute;
  z-index: 2;
  width: 200px;
  background-color: var(--dark);
  border: 2px solid white;
  border-radius: 15px;
  padding: 5px;
}

.user {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--white);
}

.user .user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--white);
  margin-right: 5px;
}

.user p {
  font-size: 10px;
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
  word-break: break-all;
}

.options {
  width: 100%;
  margin: 10px 0 5px 0;
}

.options p {
  width: 100%;
  height: auto;
  padding: 4px 0;
  border-radius: 5px;
  text-align: center;
  font-size: 10px;
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
}

.options p:hover {
  cursor: pointer;
  background-color: var(--primary);
}

.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
