<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <p>{{ message }}</p>
        <div class="buttons">
          <button @click="confirm" class="confirm">CONFIRMAR</button>
          <button @click="cancel" class="cancel">CANCELAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  background: linear-gradient(45deg, var(--primary) -10%, var(--dark) 100%);
  border: 1px solid var(--white);
  border-radius: 4px;
  padding: 20px;
}

.modal-content {
  text-align: center;
}

p {
  font-family: var(--pressStart);
  font-size: 0.5em;
  color: var(--white);
  margin-bottom: 30px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cancel {
  border: 0;
  padding: 5px;
  background-color: var(--white);
  border-radius: 10px;
  color: var(--dark);
}

.confirm {
  border: 1px solid var(--white);
  padding: 5px;
  background-color: var(--dark);
  border-radius: 10px;
  color: var(--white);
}

button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}
</style>
