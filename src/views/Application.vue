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
    <ConfirmationModal
      v-show="$store.state.answerCall.show"
      :message="answerCallMessage"
      @cancel="answerCall(false)"
      @confirm="answerCall(true)"
    />
    <ConfirmationModal
      v-show="$store.state.user.receivedLobbyInvite !== false"
      :message="answerInviteMessage"
      @cancel="answerInvite(false)"
      @confirm="answerInvite(true)"
    />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import RequestsReceived from '@/components/RequestsReceived.vue';
import VoIP from '@/components/VoIP.vue';
import Options from '@/components/Options.vue';
import Chat from '@/components/Chat.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

export default {
  name: 'Application',
  components: {
    Sidebar,
    Navbar,
    RequestsReceived,
    VoIP,
    Options,
    Chat,
    ConfirmationModal,
  },

  computed: {
    answerCallMessage() {
      if (this.$store.state.answerCall.message) {
        return this.$store.state.answerCall.message;
      }

      return '';
    },

    answerInviteMessage() {
      if (this.$store.state.user.receivedLobbyInvite !== false) {
        return `${this.$store.state.user.receivedLobbyInvite.from} está te convidando para um lobby de ${this.$store.state.user.receivedLobbyInvite.game}`;
      }

      return '';
    },
  },

  methods: {
    answerCall(response) {
      this.$store.dispatch('answerCall', response);
    },

    async answerInvite(response) {
      const payload = {
        response,
        lobbyId: this.$store.state.user.receivedLobbyInvite.lobbyId,
      };

      const resp = await this.$store.dispatch('answerLobbyInvite', payload);

      if (resp && response) {
        this.$router.push('/application/lobby');
      }
    },
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
