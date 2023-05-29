<template>
  <form class="form-auth" @submit="recoverPassword">
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

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{msg}}</p>
    </div>

    <div class="button-overflow">
      <div class="button-loading" :class="{'loading':loading}"></div>
      <button type="submit" class="auth-button">RECUPERAR</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ForgotPass',

  data() {
    return {
      email: '',
      emailError: false,
      msg: '',
      error: false,
      loading: false,
    };
  },

  methods: {
    async recoverPassword(e) {
      e.preventDefault();
      if (this.validate()) {
        this.loading = true;
        const response = await this.$store.dispatch('resetPass', this.email);
        this.loading = false;

        if (response === true) {
          this.msg = 'Email de recuperação enviado com sucesso.';
          this.error = true;
        } else {
          this.msg = response;
          this.error = true;
        }
      }
    },

    validate() {
      if (this.email === '') {
        this.msg = 'Informe seu email!';
        this.error = true;
        this.emailError = true;
        setTimeout(() => {
          this.emailError = false;
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

      this.error = false;
      return true;
    },
  },
};
</script>

<style scoped>
.form-auth {
  height: 80vh;
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

.button-loading {
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
