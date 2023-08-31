<template>
  <div class="match-loading-container">
    <p>Procurando jogador...</p>
    <div class="match-loading">
      <Loading :background="true"/>
    </div>
    <button @click="cancel">
      CANCELAR
    </button>
  </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
  name: 'MatchLoading',
  components: { Loading },

  props: {
    cancel: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.match-loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

p {
  font-family: var(--pressStart);
  color: var(--white);
  font-size: 16px;
}

.match-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

button {
  width: 300px;
  font-family: var(--pressStart);
  font-size: 14px;
  color: var(--white);
  background-color: var(--dark);
  border: 2px solid var(--white);
  border-radius: 15px;
  padding: 10px 0;;
}

button:hover {
  cursor: pointer;
  box-shadow: 0 0 13px 1px rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

button:not(:hover) {
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

</style>
