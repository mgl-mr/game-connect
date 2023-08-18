<template>
  <div class="component">
    <div v-show="$store.state.user.suggestions.length === 0" class="no-suggestions">
      Sem sugestões
    </div>
    <div v-show="$store.state.user.suggestions.length !== 0" class="list-suggestions">
      <div
        v-for="(suggestion) in $store.state.user.suggestions" :key="suggestion.id"
        v-show="suggestion.id !==  $store.state.user.id"
        class="suggestions"
      >
        <img :src="suggestion.imageURL" :alt="suggestion.name">
        <p class="suggestion-name">{{ suggestion.name }}</p>
        <p class="suggestion-bio">{{ suggestion.bio }}</p>
        <p class="suggestion-time">
          Horário de jogo: {{ suggestion.start }} - {{ suggestion.end }}
        </p>
        <p>Jogos Favoritos</p>
        <div class="suggestion-games">
          <div v-for="(game) in suggestion.games" :key="game.id">
            <img
              :src="game.imageURL"
              :alt="game.name"
              @mouseover="gameName = game.name, hover = suggestion.id"
              @mouseleave="gameName = ''"
            >
          </div>
        </div>
        <div class="bottom">
          <p v-show="suggestion.id === hover" class="game-name">
            {{ gameName }}
          </p>
          <button>SOLICITAR AMIZADE</button>
        </div>
      </div>
    </div>
    <Loading v-show="loading" />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  name: 'Suggestions',
  components: { Loading },

  data() {
    return {
      gameName: '',
      hover: '',
      loading: false,
    };
  },

  async beforeMount() {
    if (this.$store.state.user.games.length !== 0) {
      this.loading = true;
      await this.$store.dispatch('fetchSuggestions', this.$store.state.user.gamesId);
      this.loading = false;
    }
  },

  unmounted() {
    this.$store.state.user.suggestions = [];
  },
};
</script>

<style scoped>
.component {
  position: relative;
}

.no-suggestions {
  color: var(--white);
  font-family: var(--pressStart);
}

.list-suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 75vw;
  height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.list-suggestions::-webkit-scrollbar {
  width: 0px;
}

.suggestions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30%;
  height: 75vh;
  margin-top: calc(7.5vw / 4);
  border-radius: 15px;
  color: var(--white);
  background-color: var(--dark);
  border: 2px solid var(--accent);
}

.suggestions:hover {
  transform: scale(1.03);
  transition: transform 0.2s ease-in-out;
}

.suggestions:not(:hover) {
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

.suggestions > img {
  width: 60%;
  height: 30%;
  margin: 2% 0;
  border: 2px solid var(--white);
  border-radius: 50%;
}

.suggestion-name {
  font-size: 1.4rem;
  margin: 2% 0 1% 0;
}

.suggestion-bio {
  font-size: 1rem;
  margin: 0% 2% 1% 2%;
}

.suggestion-time {
  font-size: 1.2rem;
  margin: 5% 0 1% 0;
  width: 100%;
  text-align: center;
  border-top: 2px solid var(--white);
  border-bottom: 2px solid var(--white);
}

.suggestion-games {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.suggestion-games div {
  width: 18%;
  height: calc(0.18 * (0.3 * 75vw));
  border-radius: 5px;
}

.suggestion-games img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 10%;
  margin-top: 10%;
}

.game-name {
  position: absolute;
  width: 100%;
  bottom: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
}

.bottom button {
  width: 90%;
  height: 70%;
  font-family: var(--pressStart);
  color: var(--primary);
  background-color: var(--accent);
  border: 2px solid var(--white);
  border-radius: 15px;
}

.bottom button:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.bottom button:not(:hover) {
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}
</style>
