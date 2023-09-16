<template>
  <div v-if="!$store.state.voIP.loading" class="loading">
    <p>Estabelecendo conexão</p>
    <div>
      <Loading :background="true" />
    </div>
  </div>
  <div
    v-else
    id="voip-container"
    class="no-dragging"
    :class="{'dragging': dragging}"
    @mousedown="dragMouseDown"
    @mouseup="dragging = false"
    @mouseleave="dragging = false"
    @mousemove="elementDrag"
  >
    <img
      v-if="$store.state.user.imageURL !== ''"
      :src="$store.state.user.imageURL"
      :alt="$store.state.user.name"
      class="user-image"
    >
    <img
      v-else
      src="@/assets/images/user-no-image.png"
      :alt="$store.state.user.name"
      class="user-image"
    >

    <img
      src="@/assets/images/end_call.png"
      alt="Encerrar ligação"
      class="end-call"
    >

    <img
      v-if="$store.state.voIP.matchedUser.imageURL !== ''"
      :src="$store.state.voIP.matchedUser.imageURL"
      :alt="$store.state.voIP.matchedUser.name"
      class="user-image contact"
      @mousedown="showMenu"
    >
    <img
      v-else
      src="@/assets/images/user-no-image.png"
      :alt="$store.state.voIP.matchedUser.name"
      class="user-image contact"
      @mousedown="showMenu"
    >
  </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
  name: 'VoIP',
  components: { Loading },

  data() {
    return {
      elmnt: null,
      position: {
        pos1: 0,
        pos2: 0,
        pos3: 0,
        pos4: 0,
      },
      dragging: false,
    };
  },

  methods: {
    endCall() {
      // TODO: encerrar ligação
    },

    showMenu(e) {
      e.stopPropagation();
      this.$store.state.optionsMenu.x = e.clientX;
      this.$store.state.optionsMenu.y = e.clientY;
      this.$store.state.optionsMenu.user = this.$store.state.voIP.matchedUser;
      this.$store.state.optionsMenu.show = !this.$store.state.optionsMenu.show;
    },

    dragMouseDown(e) {
      e.preventDefault();
      this.dragging = true;
      this.position.pos3 = e.clientX;
      this.position.pos4 = e.clientY;
    },

    elementDrag(e) {
      e.preventDefault();
      if (this.dragging) {
        this.position.pos1 = this.position.pos3 - e.clientX;
        this.position.pos2 = this.position.pos4 - e.clientY;
        this.position.pos3 = e.clientX;
        this.position.pos4 = e.clientY;

        if (
          this.elmnt.offsetTop - this.position.pos2 >= 0
          && this.elmnt.offsetTop - this.position.pos2 <= window.innerHeight - 104
          && this.elmnt.offsetLeft - this.position.pos1 >= 0
          && this.elmnt.offsetLeft - this.position.pos1 <= window.innerWidth - 304
        ) {
          this.elmnt.style.top = `${this.elmnt.offsetTop - this.position.pos2}px`;
          this.elmnt.style.left = `${this.elmnt.offsetLeft - this.position.pos1}px`;
        }
      }
    },
  },

  mounted() {
    this.elmnt = document.getElementById('voip-container');
  },
};
</script>

<style scoped>
#voip-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: calc(100vh / 2 - 50px);
  left: calc(100vw / 2 - 150px);
  z-index: 1;
  width: 300px;
  height: 100px;
  background-color: var(--dark);
  border: solid 2px var(--accent);
  border-radius: 15px;
}

.no-dragging {
  cursor: grab;
}

.dragging {
  cursor: grabbing;
}

.user-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.end-call {
  width: 50px;
  height: 50px;
}

.end-call:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.contact:hover {
  transform: scale(1.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.loading {
  position: absolute;
  width: 300px;
  height: 100px;
  top: calc(100vh / 2 - 50px);
  left: calc(100vw / 2 - 150px);
  border: solid 2px var(--accent);
  border-radius: 15px;
  background-color: var(--dark);
}

.loading p {
  width: 100%;
  height: 14%;
  color: var(--white);
  font-family: var(--pressStart);
  font-size: 12px;
  text-align: center;
  margin: 3px 0;
}

.loading div {
  height: 80%;
}
</style>
