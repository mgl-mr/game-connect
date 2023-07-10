<template>
  <form class="form-auth" @submit="next">
    <label for="birthdate" class="label">
      <img
        src="@/assets/images/auth/auth_input_birthdate.png"
        alt="imagem de nome"
        class="input-image"
      >
      <input
        type="text"
        name="birthdate"
        class="input"
        :class="{ 'input-error': birthdateError }"
        placeholder="Digite sua data de nascimento"
        v-model="birthdate"
        @keydown="formatDate"
      >
    </label>

    <label for="bio" class="bio">
      <img
        src="@/assets/images/auth/auth_input_bio.png"
        alt="imagem de nome"
        class="input-image"
      >
      <textarea
        type="text"
        name="bio"
        class="input"
        :class="{ 'input-error': bioError }"
        placeholder="Escreva algo sobre você(opcional)"
        v-model="bio"
      > </textarea>
    </label>

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{msg}}</p>
    </div>

    <div class="buttons">
      <div class="button-overflow">
        <button type="submit" class="auth-button" @click="back">BACK</button>
      </div>
      <div class="button-overflow">
        <button type="submit" class="auth-button">NEXT</button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SignUp2',

  data() {
    return {
      birthdate: '',
      bio: '',
      birthdateError: false,
      bioError: false,
      msg: '',
      error: false,
    };
  },

  methods: {
    next(e) {
      e.preventDefault();
      if (this.validate()) {
        this.$router.push('/authentication/sign-up/sign-up3');
      }
    },

    back() {
      this.$router.push('/authentication/sign-up/sign-up1');
    },

    validate() {
      if (this.birthdate === '') {
        this.msg = 'Preencha todos os campos!';
        this.error = true;
        this.birthdateError = true;
        setTimeout(() => {
          this.birthdateError = false;
        }, 500);
        return false;
      }

      const regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
      if (!regex.test(this.birthdate)) {
        this.msg = 'insira uma data válida!';
        this.error = true;
        this.birthdateError = true;
        setTimeout(() => {
          this.birthdateError = false;
        }, 500);
        return false;
      }

      return true;
    },

    formatDate(e) {
      e.preventDefault();

      if (e.keyCode === 8 && (this.birthdate.length === 3 || this.birthdate.length === 6)) {
        this.birthdate = this.birthdate.slice(0, -2);
      } else if (e.keyCode === 8 && this.birthdate.length !== 0) {
        this.birthdate = this.birthdate.slice(0, -1);
      }

      if (e.keyCode >= 48 && e.keyCode <= 57 && this.birthdate.length < 10) {
        this.birthdate += e.key;
        if (this.birthdate.length === 2 || this.birthdate.length === 5) {
          this.birthdate += '/';
        }
      }
    },
  },

  mounted() {
    this.birthdate = this.$store.state.userSignup.birthdate;
    this.bio = this.$store.state.userSignup.bio;

    if (this.$route.query.toValidate) {
      this.validate();
    }
  },

  unmounted() {
    this.$store.commit('setUserSignup', {
      birthdate: this.birthdate,
      bio: this.bio,
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
  justify-content: center;
  width: 60%;
  margin-bottom: 2vh;
}

.bio {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 60%;
  margin-bottom: 2vh;
}

.bio textarea {
  height: 18vh;
  border-radius: 0 25px 25px 0;
  overflow-x: hidden;
  padding-right: 10px;
  overflow-y: hidden;
  resize: none;
}

.input-image {
  width: 15%;
  height: 10vh;
}

.input {
  height: 9vh;
  width: 80%;
  border: 0;
  padding: 0;
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

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.input::placeholder {
  color: var(--white);
}

.input:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.input:focus {
  box-shadow: 0 0 0px 0px rgba(255, 255, 255, 0.5);
  outline: 0;
  background-color: var(--dark);
  border-color: var(--primary);
  color: var(--white);
  font-size: 1vw;
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
  animation: shake 0.5s;
  border-color: red;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
