<template>
  <div class="component">
    <div class="container-left">
      <div class="container-input user">
        <label for="image">
          <input
            v-show="false"
            type="file"
            id="image"
            @change="pickImage"
          >
          <img
            :src="user.imageURL"
            alt="imagem de perfil"
            :class="{ 'input-error': imageError }"
          >
          <img
            src="@/assets/images/pick_image.png"
            alt="imagem de perfil"
            class="image-button"
          >
        </label>
        <div>
          <input
            class="input name"
            type="text"
            placeholder="Digite o seu nome"
            v-model="user.name"
          >
          <textarea
            class="input bio"
            type="text"
            placeholder="Digite o seu nome"
            v-model="user.bio"
          > </textarea>
        </div>
      </div>

      <div class="games-container">
        <p>Selecione seu jogos favoritos:</p>
        <div class="games">
          <div v-for="(game, id) in user.games" :key="id">
            <img :src="game.imageURL" @click="removeGame(game)" :alt="game.name">
          </div>
          <div v-for="index in numberOfDivs" :key="index"></div>
        </div>
      </div>
      <GamePicker
        :list="user.games"
        :pick="pickGame"
        :max=5
      />
    </div>
    <div class="container-right">
      <div class="container-input password">
        <p>Alterar senha</p>
        <input
          type="password"
          class="input"
          placeholder="Senha atual"
          v-model="user.pass"
        >
        <input
          type="password"
          class="input"
          placeholder="Nova senha"
          v-model="user.newPass"
        >
        <input
          type="password"
          class="input"
          placeholder="Confirmar senha"
          v-model="user.confirmPass"
        >
      </div>
      <div class="container-input birthdate">
        <p>Data de nascimento</p>
        <input
          type="text"
          class="input"
          placeholder="dd/mm/yyyy"
          v-model="user.birthdate"
        >
      </div>

      <div class="container-input playtime">
        <p>Horário do dia que mais joga</p>
        <div class="time-input-container">
          <div>
            <span>Inicio:</span>
            <input
              type="text"
              class="input"
              placeholder="00:00"
              v-model="user.start"
            >
          </div>
          <div>
            <span>Fim:</span>
            <input
              type="text"
              class="input"
              placeholder="00:00"
              v-model="user.end"
            >
          </div>
        </div>
      </div>

      <div class="div-error">
        <p
          class="auth-error"
          :class="{
            'error':error,
            'input-error':msgError
          }"
        >
          {{ msg }}
        </p>
      </div>

      <div class="button-save">
        <div class="button-loading" :class="{'loading':saving}"></div>
        <button
          type="button"
          class="save"
          @click="update"
        >
          SALVAR
        </button>
      </div>

      <div class="button-delete">
        <div class="button-loading" :class="{'loading':deleting}"></div>
        <button
          type="button"
          class="delete"
          @click="showModal = true"
        >
          DELETAR
        </button>
      </div>
    </div>
    <ConfirmationModal
      v-show="showModal"
      message="Você está preste a deletar sua conta:"
      @cancel="closeModal"
      @confirm="destroy"
    />
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

export default {
  name: 'MyProfile',
  components: { GamePicker, ConfirmationModal },

  data() {
    return {
      user: null,
      saving: false,
      deleting: false,
      msg: '',
      msgError: false,
      error: false,
      imageError: false,
      showModal: false,
    };
  },

  computed: {
    numberOfDivs() {
      const arrayLength = this.user.games.length;
      const numberOfExtraDivs = Math.max(0, 5 - arrayLength);
      return numberOfExtraDivs;
    },
  },

  methods: {
    pickGame(game) {
      if (
        this.user.games.length === 5
        || this.user.games.some((g) => g.id === game.id)
      ) {
        return;
      }

      this.user.games.push(game);
    },

    removeGame(game) {
      const index = this.user.games.findIndex((g) => g.id === game.id);
      if (index !== -1) {
        this.user.games.splice(index, 1);
      }
    },

    async pickImage(e) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.msg = 'Somente arquivo do tipo jpeg ou png!';
        this.error = true;
        this.imageError = true;
        setTimeout(() => {
          this.imageError = false;
        }, 500);
        return false;
      }

      if (file.size > 1024 * 1024) {
        this.msg = 'imagem até 1MB!';
        this.error = true;
        this.imageError = true;
        setTimeout(() => {
          this.imageError = false;
        }, 500);
        return false;
      }
      this.saving = true;
      await this.$store.dispatch(
        'updateImage',
        [this.user, file],
      );
      this.saving = false;
      this.user.imageURL = this.$store.state.user.imageURL;
    },

    async update() {
      if (this.validate()) {
        this.saving = true;
        const gamesId = this.user.games.map((game) => game.id);
        this.user.gamesId = gamesId;
        const update = await this.$store.dispatch(
          'updateUser',
          this.user,
        );
        this.saving = false;

        if (update) {
          this.msg = 'Dados atualizados com sucesso';
          this.error = true;
          if (this.user.pass !== '') {
            this.user.pass = '';
            this.user.newPass = '';
            this.user.confirmPass = '';
          }
        } else {
          this.informError('Erro ao atualizar dados.');
        }
      }
    },

    async destroy() {
      this.showModal = false;

      this.deleting = true;
      const deleted = await this.$store.dispatch(
        'deleteUser',
        this.user,
      );
      this.deleting = false;

      if (deleted) {
        this.$router.push('/authentication/sign-in');
      } else {
        this.informError('Erro ao deletar conta.');
      }
    },

    closeModal() {
      this.showModal = false;
    },

    validate() {
      if (this.user.name === '') {
        this.informError('Informe o seu nome!');
        return false;
      }

      if (this.user.name.length < 3 || this.user.name.length > 30) {
        this.informError('Nome entre 3 a 30 caracteres!');
        return false;
      }

      let regex = /^[a-zA-Z0-9\s]+$/;
      if (!regex.test(this.user.name)) {
        this.informError('Nome só pode conter letras e números!');
        return false;
      }

      if (this.user.bio.length > 150) {
        this.informError('Desrição até 150 caracterres!');
        return false;
      }

      if (this.user.pass !== '') {
        if (this.user.pass !== this.user.password) {
          this.informError('Senha incorreta!');
          return false;
        }
        if (this.user.newPass.length < 6 || this.user.newPass.length > 15) {
          this.informError('Nova senha entre 6 a 15 caracteres!');
          return false;
        }
        if (this.user.newPass !== this.user.confirmPass) {
          this.informError('Senhas diferentes!');
          return false;
        }
      }

      regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
      if (!regex.test(this.user.birthdate)) {
        this.informError('insira uma data válida! (DD/MM/YYYY)');
        return false;
      }

      if (this.user.start === '') {
        this.informError('Informe o horário de inicio!');
        return false;
      }

      if (this.user.end === '') {
        this.informError('Informe o horário de fim!');
        return false;
      }

      regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!regex.test(this.user.start)) {
        this.informError('Informe o horário de inicio valido! (HH:MM)');
        return false;
      }

      if (!regex.test(this.user.end)) {
        this.informError('Informe o horário de fim valido! (HH:MM)');
        return false;
      }

      return true;
    },

    informError(message) {
      this.msg = message;
      this.error = true;
      this.msgError = true;
      setTimeout(() => {
        this.msgError = false;
      }, 500);
    },
  },

  beforeMount() {
    this.user = { ...this.$store.state.user };
    this.user.pass = '';
    this.user.newPass = '';
    this.user.confirmPass = '';
  },
};

</script>

<style>
.component {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.container-left,
.container-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 83vh;
}

.container-left {
  width: 50%;
}

.container-right {
  width: 40%;
}

.container-input {
  width: calc(100% - 2px);
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: linear-gradient(99.83deg, var(--primary) 0%, var(--dark) 100%);
}

.input {
  outline: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  color: var(--white);
}

.input::placeholder {
  color: var(--white);
}

/*** USER ***/
.user {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.user label {
  width: 30%;
  height: 90%;
  position: relative;
}

.user label:hover {
  cursor: pointer;
  text-shadow: 0px 4px 4px var(--primary);
}

.user label:hover .image-button{
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;;
}

.user img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user .image-button{
  width: 30px;
  height: 30px;
  border-radius: 5x;
  position: absolute;
  bottom: 0;
  right: 0;
}

.user div {
  width: 60%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.name {
  width: 100%;
  height: 10%;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--white);
}

.name:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.bio {
  width: 100%;
  height: calc(90% - 16px);
  overflow-x: hidden;
  overflow-y: hidden;
  resize: none;
}

.bio:hover {
  color: var(--accent);
}

/*** GAMES  ***/
.games-container {
  width: 100%;
  margin-top: 10px;
}

.games-container > p {
  font-size: 0.5rem;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
}

.games {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.games div {
  width: 15%;
  height: 10vh;
  background-color: var(--dark);
  border-radius: 15px;
}

.games img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.games img:hover {
  cursor: pointer;
}

/*** PASSWORD ***/ /*** BIRTHDATE ***/ /*** PLAYTIME ***/
.password {
  height: 20vh;
  margin-bottom: 10px;
}

.birthdate,
.playtime {
  height: 10vh;
  margin-bottom: 10px;
}

.time-input-container {
  display: flex;
  width: 100%;
}

.time-input-container div{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  margin-top: 5px;
}

.password > p,
.birthdate > p,
.playtime > p,
.time-input-container span {
  margin: 1vh;
  font-size: 0.7rem;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
}

.time-input-container span {
  margin-left: 1vh;
}

.password .input,
.birthdate .input,
.time-input-container .input {
  width: calc(100% - 1vh);
  margin-left: 1vh;
  margin-bottom: 1vh;
  height: 4vh;
  border-bottom: 1px solid var(--white);
}

.time-input-container .input {
  width: 35px;
  height: auto;
  margin: 0;
}

.password .input:hover,
.birthdate .input:hover,
.time-input-container .input:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.password .input:hover::placeholder,
.birthdate .input:hover::placeholder,
.time-input-container .input:hover::placeholder {
  color: var(--accent);
}

.password .input:focus,
.birthdate .input:focus,
.time-input-container .input:focus {
  color: var(--accent);
  border-color: var(--accent);
}

.password .input:focus::placeholder,
.birthdate .input:focus::placeholder,
.time-input-container .input:focus::placeholder {
  color: var(--accent);
}

/*** BUTTONS ***/
.button-save,
.button-delete {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 1vh);
  height: 9vh;
  background: transparent;
  border-radius: 15px;
  margin-bottom: 1vh;
}

.button-save {
  border: 0.5vh solid var(--accent);
}

.button-delete {
  border: 0.5vh solid var(--dark);
}

.button-loading {
  display: none;
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.button-save:hover,
.button-delete:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.save,
.delete {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  font-size: 1.8vw;
  transition: font-size 0.2s ease-in-out;
}

.save {
  background-color: var(--accent);
  color: var(--primary);
}

.delete {
  background-color: var(--dark);
  color: var(--accent);
}

.save:hover,
.delete:hover {
  font-size: 2vw;
  cursor: pointer;
}

.save:hover {
  text-shadow: 2px 4px 2px var(--white);
}

.delete:hover {
  text-shadow: 2px 4px 2px var(--primary);
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

@keyframes loading {
  0% { left: -15%; }
  50% { left: 85%; }
  100% { left: -15%; }
}

/*** ERROR ***/
.div-error {
  height: 4vh;
  margin: 0;
  text-align: center;
}

.auth-error {
  display: none;
  margin: 0;
  font-size: 1.5vw;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.error {
  display: block;
}

.input-error {
  color: var(--accent);
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
