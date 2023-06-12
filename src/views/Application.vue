<template>
  <div class="container-screen">
    <Sidebar />
    <div class="application">
      <Navbar />
      <router-view class="component" />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Application',
  components: { Sidebar, Navbar },

  async mounted() {
    if (this.$store.state.user.friendsId.length !== 0) {
      await this.$store.dispatch('fetchFriends', this.$store.state.user.friendsId);
    }
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
  height: 80vh;
}
</style>
