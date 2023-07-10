<template>
  <form class="form-auth" @submit="next">
    <label for="name" class="label">
      <img
        src="@/assets/images/auth/auth_input_name.png"
        alt="imagem de nome"
        class="input-image"
      >
      <input
        type="text"
        name="name"
        class="input"
        :class="{ 'input-error': nameError }"
        placeholder="Digite seu nome"
        v-model="name"
      >
    </label>

    <label for="email" class="label">
      <img
        src="@/assets/images/auth/auth_input_email.png"
        alt="imagem de email"
        class="input-image"
      >
      <input
        type="text"
        name="email"
        class="input"
        :class="{ 'input-error': emailError }"
        placeholder="Digite seu email"
        v-model="email"
      >
    </label>

    <label for="password" class="label">
      <img
        src="@/assets/images/auth/auth_input_password.png"
        alt="imagem de senha"
        class="input-image"
      >
      <input
        type="password"
        name="password"
        class="input"
        :class="{ 'input-error': passwordError }"
        placeholder="Digite sua senha"
        v-model="password"
      >
    </label>

    <label for="password" class="label">
      <img
        src="@/assets/images/auth/auth_input_confirm.png"
        alt="imagem de confirmar senha"
        class="input-image"
      >
      <input
        type="password"
        name="password"
        class="input"
        :class="{ 'input-error': confirmError }"
        placeholder="Confirme sua senha"
        v-model="confirm"
      >
    </label>

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{msg}}</p>
    </div>

    <div class="button-overflow">
      <button type="submit" class="auth-button">NEXT</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SignUp1',

  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirm: '',
      msg: '',
      error: false,
      nameError: false,
      emailError: false,
      passwordError: false,
      confirmError: false,
    };
  },

  methods: {
    next(e) {
      e.preventDefault();
      if (this.validate()) {
        this.$router.push('/sign-up/sign-up2');
      }
    },

    validate() {
      if (
        this.name === ''
        || this.email === ''
        || this.password === ''
        || this.confirm === ''
      ) {
        this.msg = 'Preencha todos os campos!';
        this.error = true;
        this.nameError = true;
        this.emailError = true;
        this.passwordError = true;
        this.confirmError = true;
        setTimeout(() => {
          this.nameError = false;
          this.emailError = false;
          this.passwordError = false;
          this.confirmError = false;
        }, 500);
        return false;
      }

      if (this.name.length < 3 || this.name.length > 30) {
        this.msg = 'Nome deve ter entre 3 a 30 caracteres!';
        this.error = true;
        this.nameError = true;
        setTimeout(() => {
          this.nameError = false;
        }, 500);
        return false;
      }
      let regex = /^[a-zA-Z0-9\s]+$/;
      if (!regex.test(this.name)) {
        this.msg = 'Nome só pode conter letras e números!';
        this.error = true;
        this.nameError = true;
        setTimeout(() => {
          this.nameError = false;
        }, 500);
        return false;
      }

      regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(this.email)) {
        this.msg = 'Digite um email válido!';
        this.error = true;
        this.emailError = true;
        setTimeout(() => {
          this.emailError = false;
        }, 500);
        return false;
      }

      if (this.password.length < 6 || this.password.length > 15) {
        this.msg = 'Senha deve ter entre 6 a 15 caracteres!';
        this.error = true;
        this.passwordError = true;
        setTimeout(() => {
          this.passwordError = false;
        }, 500);
        return false;
      }

      if (this.password !== this.confirm) {
        this.msg = 'Senhas não coincidem!';
        this.error = true;
        this.passwordError = true;
        this.confirmError = true;
        setTimeout(() => {
          this.passwordError = false;
          this.confirmError = false;
        }, 500);
        return false;
      }

      this.error = false;
      return true;
    },
  },

  mounted() {
    this.name = this.$store.state.userSignup.name;
    this.email = this.$store.state.userSignup.email;
    this.password = this.$store.state.userSignup.password;
    this.confirm = this.$store.state.userSignup.confirm;

    if (this.$route.query.toValidate) {
      this.validate();
    }
  },

  unmounted() {
    this.$store.commit('setUserSignup', {
      name: this.name,
      email: this.email,
      password: this.password,
      confirm: this.confirm,
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

.label:hover > .input-image {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.button-overflow {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(60% - 1vh);
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

@keyframes loading {
  0% { left: -10%; }
  50% { left: 90%; }
  100% { left: -10%; }
}
</style>
