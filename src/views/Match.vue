<template>
  <div class="component">
    <p class="match-info">
      A funcionalidade de matchmaking tem como objetivo facilitar a descoberta de jogadores que atendam às suas preferências. Uma vez que você tenha especificado o jogo desejado, seu nível no jogo (como classificação, elo ou patente), o tipo de partida que deseja (casual ou competitiva), o sistema se encarregará de identificar jogadores que se alinhem com esses critérios. Assim que uma correspondência for encontrada, o sistema irá estabelecer automaticamente uma chamada de voz entre os dois jogadores, permitindo que possam se conectar e interagir.
    </p>
    <div class="container-match-form">
      <GamePicker
        :list="game"
        :pick="pickGame"
        :max=1
        :full=true
        :initialGamesNumber=40
        class="container-gamer-picker"
      />
      <div class="match-form">
        <div class="chosen-game">
          <p>Jogo escolhido</p>
          <div>
              <div v-if="game.length === 0" class="no-game"></div>
              <img
              v-else
                :src="game[0].imageURL"
                :alt="game[0].name"
               class="game-image"
              >
              <p v-if="game.length !== 0">{{ game[0].name }}</p>
              <p v-else>Nenhum jogo escolhido</p>
          </div>
        </div>
        <div class="level-container">
          <p>Qual level está procurando?</p>
          <select name="level" class="level">
            <option value="any">Qualquer</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Prata</option>
            <option value="gold">Ouro</option>
            <option value="platinum">Platina</option>
            <option value="diamond">Diamante</option>
          </select>
        </div>
        <div class="type">
          <p>Deseja alguém para jogar:</p>
          <div>
            <div>
              <input type="radio" id="casual" name="playstyle" value="casual">
              <label for="casual">Casualmente</label>
            </div>
            <div>
              <input type="radio" id="competitive" name="playstyle" value="competitive">
              <label for="competitive">Competitivamente</label>
            </div>
            <div>
              <input type="radio" id="any" name="playstyle" value="any">
              <label for="any">Qualquer</label>
            </div>
          </div>
        </div>
        <button class="start">INICIAR MATCH</button>
      </div>
    </div>
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';

export default {
  name: 'Match',
  components: { GamePicker },

  data() {
    return {
      game: [],
    };
  },

  methods: {
    pickGame(game) {
      this.game = [game];
    },
  },
};
</script>

<style scoped>
.component {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}

.match-info {
  width: calc(90% - 20px);
  height: auto;
  max-height: 15vh;
  margin: 10px 0;
  padding: 10px;
  border-radius: 15px;
  background-color: var(--dark);
  font-size: 10px;
  font-family: var(--pressStart);
  color: var(--white);
  line-height: 1.2;
  text-align: justify;
  overflow: auto;
}

.match-info::-webkit-scrollbar {
  width: 0px;
}

.container-match-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
}

.container-gamer-picker {
  width: 45%;
  height: 60vh;
}

.match-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  height: 100%;
}

.match-form > div {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
}

.chosen-game  p {
  width: calc(100% - 12vh - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.chosen-game > div {
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.no-game,
.game-image {
  width: 12vh;
  height: 12vh;
  border-radius: 15px;
}

.no-game {
  background-color: var(--white);
}

.level-container > p {
  width: calc(100% - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.level {
  width: calc(100% - 30px);
  background-color: var(--primary);
  color: var(--white);
  margin: 0 15px 15px 15px;
  text-align: center;
  border: solid 1px var(--white);
  border-radius: 5px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.level:hover {
  cursor: pointer;
}

.level option {
  background-color: var(--dark);
  color: var(--white);
}

.type > p {
  width: calc(100% - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.type > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px 15px 15px;
}

.type label {
  font-family: var(--pressStart);
  color: var(--white);
  font-size: 10px;
}

.type label:hover,
.type input:hover {
  cursor: pointer;
}

.start {
  width: 100%;
  background-color: var(--accent);
  color: var(--primary);
  font-family: var(--pressStart);
  padding: 10px 0;
  border: none;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
}

.start:hover {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}
</style>
