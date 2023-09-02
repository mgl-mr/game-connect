<template>
  <div class="container-screen">
    <Sidebar />
    <div class="application">
      <Navbar />
      <router-view class="component" />
    </div>
    <RequestsReceived v-show="$store.state.showFriendRequestList"/>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import RequestsReceived from '@/components/RequestsReceived.vue';

export default {
  name: 'Application',
  components: { Sidebar, Navbar, RequestsReceived },

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
