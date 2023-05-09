<template>
  <form class="form-auth" @submit="enter">
    <label for="name" class="label">
      <img
        src="@/assets/images/auth/auth_input_email.png"
        alt="imagem de email"
        class="input-image"
      >
      <input
        type="text"
        name="name"
        class="input"
        :class="{ 'input-error': emailError }"
        placeholder="Digite seu email"
        v-model="email"
      >
    </label>

    <label for="password" class="label">
      <img
        src="@/assets/images/auth/auth_input_password.png"
        alt="imagem de email"
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

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{msg}}</p>
    </div>

    <div class="button-overflow">
      <div class="button-border"></div>
      <button type="submit" class="auth-button">CONTINUAR</button>
    </div>
  </form>
</template>

<script>
import store from '@/store';

export default {
  name: 'SignIn',

  data() {
    return {
      email: '',
      password: '',
      msg: '',
      error: false,
      emailError: false,
      passwordError: false,
    };
  },

  methods: {
    enter(e) {
      e.preventDefault();
      if (this.validate()) {
        // TODO: login no frebase
      }
    },
    validate() {
      if (this.email === '' || this.password === '') {
        this.msg = 'Preencha todos os campos!';
        this.error = true;
        this.emailError = true;
        this.passwordError = true;
        setTimeout(() => {
          this.emailError = false;
          this.passwordError = false;
        }, 500);
        return false;
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

      this.error = false;
      return true;
    },
  },
};
</script>

<style scoped>
.form-auth {
  flex-direction: column;
}

.label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2vw;
}

.input-image {
  width: 5vw;
  height: 5vw;
}

.input {
  height: calc(5vw - 10px);
  width: 25vw;
  border: 0;
  padding: 0;
  margin-left: 10px;
  padding: 0 5px;
  background: var(--primary);
  color: var(--white);
  border: 5px solid var(--accent);
  border-radius: 0px 50px 50px 0px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5vw;
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
  background: var(--dark);
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
  border-radius: 15px;
  background: transparent;
  width: calc(30vw + 5px);
  height: 5vw;
  border: 5px solid var(--accent);
}

.button-border {
  display: none;
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.button-overflow:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.button-overflow:hover > .button-border{
  display: block;
  animation: hoverMovement 2s linear infinite;
}

.auth-button {
  position: absolute;
  width: calc(29.5vw + 5px);
  height: 4.5vw;
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

@keyframes hoverMovement {
  0% { left: -10%; }
  50% { left: 90%; }
  100% { left: -10%; }
}
</style>
