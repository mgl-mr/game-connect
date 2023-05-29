<template>
  <form class="form-auth" @submit="next">

    <label for="time" class="label">
      <img
        src="@/assets/images/auth/auth_input_time.png"
        alt="imagem de tempo"
        class="input-image"
      >
      <div class="time">
        <div class="info">
          Informe o horário do dia que mais joga:
        </div>
        <div class="container-inputs">
          <div :class="{ 'input-error': startError }">
              <p>INICIO</p>
            <input
              type="text"
              name="inicio"
              class="input-time"
              placeholder="00:00"
              v-model="start"
              @keydown="formatTimeStart"
            >
          </div>

          <div :class="{ 'input-error': endError }">
            <p>FIM</p>
            <input
              type="text"
              name="fim"
              class="input-time"
              placeholder="00:00"
              v-model="end"
              @keydown="formatTimeEnd"
            >
          </div>
        </div>
      </div>
    </label>

    <div class="label">
      <img v-if="urlImage === ''"
        src="@/assets/images/auth/auth_input_photo.png"
        alt="imagem de foto"
        class="input-image"
      >
      <img v-else
        :src="urlImage"
        alt="imagem de foto"
        class="input-image"
      >
      <label for="file-image" class="input" :class="{ 'input-error': imageError }">
        Escolha uma foto(opcional){{imageName}}
        <input
          id="file-image"
          type="file"
          name="imagem"
          @change="pickImage"
        >
      </label>
    </div>

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{msg}}</p>
    </div>

    <div class="buttons">
      <div class="button-overflow">
        <button type="button" class="auth-button" @click="back">BACK</button>
      </div>
      <div class="button-overflow">
        <button type="submit" class="auth-button">NEXT</button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SignUp3',

  data() {
    return {
      start: '',
      end: '',
      image: '',
      imageName: '',
      urlImage: '',
      imageError: '',
      msg: '',
      error: false,
      startError: false,
      endError: false,
    };
  },

  methods: {
    next(e) {
      e.preventDefault();
      if (this.validate()) {
        this.$router.push('/sign-up/sign-up4');
      }
    },

    back() {
      this.$router.push('/sign-up/sign-up2');
    },

    validate() {
      if (this.start === '' || this.end === '') {
        this.msg = 'Preencha estes campos!';
        this.error = true;
        this.startError = true;
        this.endError = true;
        setTimeout(() => {
          this.startError = false;
          this.endError = false;
        }, 500);
        return false;
      }

      const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!regex.test(this.start)) {
        this.msg = 'Digite um horário válido!';
        this.error = true;
        this.startError = true;
        setTimeout(() => {
          this.startError = false;
        }, 500);
        return false;
      }

      if (!regex.test(this.end)) {
        this.msg = 'Digite um horário válido!';
        this.error = true;
        this.endError = true;
        setTimeout(() => {
          this.endError = false;
        }, 500);
        return false;
      }

      return true;
    },

    validateImage(file) {
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

      return true;
    },

    formatTimeStart(e) {
      e.preventDefault();

      if (e.keyCode === 8 && this.start.length === 3) {
        this.start = this.start.slice(0, -2);
      } else if (e.keyCode === 8 && this.start.length !== 0) {
        this.start = this.start.slice(0, -1);
      }

      if (e.keyCode >= 48 && e.keyCode <= 57 && this.start.length < 5) {
        this.start += e.key;
        if (this.start.length === 2) {
          this.start += ':';
        }
      }
    },

    formatTimeEnd(e) {
      e.preventDefault();

      if (e.keyCode === 8 && this.end.length === 3) {
        this.end = this.end.slice(0, -2);
      } else if (e.keyCode === 8 && this.end.length !== 0) {
        this.end = this.end.slice(0, -1);
      }

      if (e.keyCode >= 48 && e.keyCode <= 57 && this.end.length < 5) {
        this.end += e.key;
        if (this.end.length === 2) {
          this.end += ':';
        }
      }
    },

    pickImage(e) {
      const file = e.target.files[0];

      if (this.validateImage(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.urlImage = reader.result;
        };

        this.imageName = `: ${file.name}`;
        this.image = file;
      }
    },
  },

  mounted() {
    this.start = this.$store.state.userSignup.start;
    this.end = this.$store.state.userSignup.end;
    this.image = this.$store.state.userSignup.image;
    this.imageName = this.$store.state.userSignup.imageName;
    this.urlImage = this.$store.state.userSignup.urlImage;

    if (this.$route.query.toValidate) {
      this.validate();
    }
  },

  unmounted() {
    this.$store.commit('setUserSignup', {
      start: this.start,
      end: this.end,
      image: this.image,
      imageName: this.imageName,
      urlImage: this.urlImage,
    });
  },
};
</script>

<style scoped>
.form-auth {
  height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 60%;
  margin-bottom: 2vh;
}

.time {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 9vh;
  width: calc(80% + 10px + 1vh);
  border: 0;
  margin-left: 10px;
}

.info {
  width: 100%;
  margin: 0;
  padding: 0;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
  font-size: 0.6rem;
}

.container-inputs {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.container-inputs div {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  background: var(--primary);
  color: var(--white);
  border: 0.5vh solid var(--accent);
  border-radius: 0px 20px 20px 0px;
}

.time p {
  margin: 0;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
  font-size: 0.6rem;
}

.input-image {
  width: 15%;
  height: 10vh;
  border-radius: 10px;
}

.input {
  display: flex;
  align-items: center;
  height: 9vh;
  width: 80%;
  margin-left: 10px;
  padding: 0 5px;
  background: var(--primary);
  color: var(--white);
  border: 0.5vh solid var(--accent);
  border-radius: 0px 50px 50px 0px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5vw;
  transition: background-color 0.5s ease;
}

.input-time {
  height: 5vh;
  width: 40%;
  border: 0;
  padding: 0;
  text-align: center;
  background: var(--primary);
  color: var(--white);
  border: 0;
  border-radius: 0px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5vw;
  transition: background-color 0.5s ease;
}

#file-image{
  display: none;
}

.input::placeholder,
.input-time::placeholder {
  color: var(--white);
}

.input:hover,
.input-time:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.label label:hover {
  cursor: pointer;
}

.input:focus,
.input-time:focus {
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
  outline: 0;
  background-color: var(--dark);
  border-color: var(--primary);
  color: var(--white);
  font-size: 1vw;
}

.input-time:focus {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--white);
}

.label:hover > .input-image,
.bio:hover > .input-image {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.button-overflow {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48%;
  height: 9vh;
  background: transparent;
  border: 0.5vh solid var(--accent);
  border-radius: 15px;
}

.button-overflow:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.auth-button {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  font-size: 1.8vw;
  transition: font-size 0.2s ease-in-out;
}

.auth-button:hover {
  text-shadow: 2px 4px 2px var(--white);
  font-size: 2vw;
  cursor: pointer;
}

.div-error {
  height: 4vh;
  margin: -1vw 0 1vw 0;
  text-align: center;
}

.auth-error {
  display: none;
  margin: 0;
  font-size: 1.5vw;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

.error {
  display: block;
}

.input-error {
  border-color: red;
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
