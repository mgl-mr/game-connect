<template>
  <div class="button-create">
          <button
            type="button"
            class="create"
            @click="$router.push('/application/create-lobby')"
          >
            CRIAR LOBBY
          </button>
        </div>
</template>

<script>
export default {
  name: 'Lobbies',
};
</script>

<style scoped>
.button-create {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2vh);
  background: transparent;
  border-radius: 15px;
  margin: 1vh;
  height: 4vh;
  border: 0.5vh solid var(--accent);
}

.create {
  position: absolute;
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  transition: font-size 0.2s ease-in-out;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  font-size: .8vw;
}

.create:hover {
  cursor: pointer;
  font-size: .9vw;
  text-shadow: 2px 4px 2px var(--white);
}
</style>
