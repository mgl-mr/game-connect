<template>
  <div class="container-games">
    <p v-show="hover !== ''">{{ hover }}</p>
    <input
      type="text"
      placeholder="Filtre por nome"
      v-model="searchTerm"
    >
    <ul id="game-list">
      <li v-for="(game, id) in visibleGames" :key="id">
        <img
          :src="game.urlFoto"
          class="image"
          :class="{'selected' : selected(game) || isFull()}"
          :alt="game.nome"
          @click="pick(game)"
          @mouseover="hover = game.nome"
          @mouseleave="hover = ''"
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GamePicker',

  props: {
    pick: {
      type: Function,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      games: [],
      visibleGames: [],
      hover: '',
      searchTerm: '',
      itemsPerLoad: 20,
    };
  },

  watch: {
    searchTerm() {
      if (this.searchTerm === '') {
        this.games = this.$store.state.games;
      } else {
        this.visibleGames = [];
        this.games = this.$store.state.games.filter(
          (game) => game.nome.toLowerCase().includes(this.searchTerm.toLowerCase()),
        );
      }
      this.loadMoreItems();
    },
  },

  methods: {
    loadMoreItems() {
      const start = this.visibleGames.length;
      const end = start + this.itemsPerLoad;
      this.visibleGames = this.games.slice(0, end);
    },

    handleScroll() {
      const element = document.getElementById('game-list');
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.loadMoreItems();
      }
    },

    isFull() {
      return this.list.length === this.max;
    },

    selected(game) {
      return this.list.some((g) => g.id === game.id);
    },
  },

  created() {
    this.games = this.$store.state.games;
    this.loadMoreItems();
  },

  mounted() {
    const element = document.getElementById('game-list');
    element.addEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.container-games {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 60%;
  height: 40vh;
  background-color: var(--dark);
  margin: 20px 0 0 0;
  border-radius: 20px;
}

.container-games p {
  position: absolute;
  width: 100%;
  top: -20px;
  text-align: center;
  margin: 0;
  padding: 0;
  color: var(--white);
}

input {
  width: 90%;
  height: 5%;
  margin: 10px 0;
  text-align: center;
  border: 0;
  border-radius: 10px;
  background-color: var(--primary);
  color: var(--white);
}

input::placeholder {
  color: var(--white);
}

input:focus {
  outline: none;
  border: none;
}

#game-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  gap: 10px;
  height: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

#game-list::-webkit-scrollbar {
  width: 0px;
}

#game-list li {
  width: 20%;
}

.image {
  width: 100%;
  height: 60px;
  border-radius: 10px;
}

.image:hover {
  cursor: pointer;
}

.selected {
  filter: grayscale(100%);
}

.selected:hover {
  cursor: not-allowed;
}

</style>
