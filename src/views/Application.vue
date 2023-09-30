<template>
  <div class="container-screen">
    <Sidebar />
    <div class="application">
      <Navbar />
      <router-view class="component" />
    </div>
    <RequestsReceived v-show="$store.state.showFriendRequestList" />
    <VoIP v-show="$store.state.voIP.inVoIP !== false" />
    <Options v-show="$store.state.optionsMenu.show" />
    <Chat v-show="$store.state.chat.show" />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import RequestsReceived from '@/components/RequestsReceived.vue';
import VoIP from '@/components/VoIP.vue';
import Options from '@/components/Options.vue';
import Chat from '@/components/Chat.vue';

export default {
  name: 'Application',
  components: {
    Sidebar,
    Navbar,
    RequestsReceived,
    VoIP,
    Options,
    Chat,
  },

  mounted() {
    this.$store.dispatch('fetchListeners', this.$store.state.user.id);
  },
};
</script>

<style scoped>
.container-screen{
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, var(--dark), var(--primary));
  position: relative;
}

.application {
  width: 75%;
  height: 100vh;
  background: linear-gradient(180deg, var(--dark) 0%, var(--primary) 100%);
}

.component {
  width: 100%;
  height: 85vh;
}
</style>
