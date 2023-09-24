<template>
  <div
    id="voip-container"
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

    <div v-if="$store.state.voIP.loading.show" class="loading-container">
      <p>{{ $store.state.voIP.loading.message }}</p>
      <div class="loading">
        <Loading :background="true" />
      </div>
    </div>
    <div v-else class="controls">
      <div class="buttons-container">
        <img
          src="@/assets/images/end_call.png"
          alt="Encerrar ligação"
          class="end-call"
          @click="endCall('hangUp')"
        >
        <img
          v-if="muted"
          src="@/assets/images/mic_muted.png"
          alt="Mutar microfone"
          class="mute"
          @click="mute"
        >
        <img
          v-else
          src="@/assets/images/mic.png"
          alt="Mutar microfone"
          class="mute"
          @click="mute"
        >
      </div>
      <div class="volume-container">
        <input
          type="range"
          class="volume"
          @mousedown="draggingVolume = true"
          @mouseup="draggingVolume = false"
          @mouseleave="draggingVolume = false"
          @input="setVolume"
          v-model="volume"
        >
        <p>{{ volume }}</p>
      </div>
    </div>

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

    <audio id="track" autoplay></audio>

    <div v-show="$store.state.voIP.error.show" class="error-container">
      <p class="error">ERROR</p>
      <p class="message">{{$store.state.voIP.error.message}}</p>
      <button  @click="endCall('remove')">OK</button>
    </div>
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
      muted: false,
      volume: 50,
      dragging: false,
      draggingVolume: false,
    };
  },

  methods: {
    async endCall(type) {
      await this.$store.dispatch('hangUp', type);
    },

    mute() {
      const audioTrack = this.$store.state.voIP.localStream.getTracks().find((track) => track.kind === 'audio');

      if (audioTrack.enabled) {
        audioTrack.enabled = false;
        this.muted = true;
      } else {
        audioTrack.enabled = true;
        this.muted = false;
      }
    },

    setVolume() {
      const vlm = document.getElementById('track');
      vlm.volume = this.volume / 100;
    },

    showMenu(e) {
      e.stopPropagation();
      this.$store.state.optionsMenu.x = e.clientX;
      this.$store.state.optionsMenu.y = e.clientY;
      this.$store.state.optionsMenu.user = this.$store.state.voIP.matchedUser;
      this.$store.state.optionsMenu.show = !this.$store.state.optionsMenu.show;
    },

    dragMouseDown(e) {
      this.dragging = true;
      this.position.pos3 = e.clientX;
      this.position.pos4 = e.clientY;
    },

    elementDrag(e) {
      if (this.dragging && !this.draggingVolume) {
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
    document.getElementById('track').volume = 0;
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
  cursor: grab;
}

.user-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 90px;
  height: 100%;
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
}

.end-call {
  width: 40px;
  height: 40px;
}

.mute {
  width: 23.44px;
  height: 30px;
  margin-top: 5px;
}

.buttons-container img:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.volume-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30px;
}

.volume-container p {
  width: 24px;
  font-family: var(--pressStart);
  font-size: 8px;
  color: var(--accent);
  text-align: center;
  margin: 0;
}

.volume {
  -webkit-appearance: none;
  width: 70%;
  height: 5px;
  background: #555;
  border-radius: 5px;
  margin: 0;
}

.volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
}

.contact:hover {
  transform: scale(1.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 70px;
  height: 100%;
}

.loading-container p {
  font-size: 10px;
  font-family: var(--pressStart);
  color: white;
  margin: 0;
}

.loading {
  width: 70px;
  height: 70px;
  position: relative;
  margin: 0;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}

.error-container p {
  font-family: var(--pressStart);
  color: white;
  margin: 0;
}

.error {
  width: 100%;
  text-align: center;
  font-size: 16px;
}

.message {
  width: 90%;
  font-size: 11px;
  text-align: justify;
}

.error-container button {
  font-family: var(--pressStart);
  color: var(--white);
  background-color: var(--dark);
  border: 1px solid var(--white);
  border-radius: 5px;
  padding: 5px;
}

.error-container button:hover {
  transform: scale(1.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}
</style>
