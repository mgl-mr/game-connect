<template>
  <div class="line" :class="stage()">
      <router-link
        to="/sign-up/sign-up1"
        class="link complete"
        :class="last('/sign-up/sign-up1')"
      >
        1
      </router-link>
      <router-link
        to="/sign-up/sign-up2"
        class="link"
        :class="{
          'complete':signUp2complete,
          'selected': last('/sign-up/sign-up2') !== false
        }"
      >
        2
      </router-link>
      <router-link
        to="/sign-up/sign-up3"
        class="link"
        :class="{
          'complete':signUp3complete,
          'selected': last('/sign-up/sign-up3') !== false
        }"
      >
        3
      </router-link>
      <router-link
        to="/sign-up/sign-up4"
        class="link"
        :class="{
          'complete':signUp4complete,
          'selected': last('/sign-up/sign-up4') !== false
        }"
      >
        4
      </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  computed: {
    signUp2complete() {
      return (
        this.$route.path === '/sign-up/sign-up2'
        || this.$route.path === '/sign-up/sign-up3'
        || this.$route.path === '/sign-up/sign-up4'
      );
    },

    signUp3complete() {
      return (
        this.$route.path === '/sign-up/sign-up3'
        || this.$route.path === '/sign-up/sign-up4'
      );
    },

    signUp4complete() {
      return this.$route.path === '/sign-up/sign-up4';
    },

  },

  methods: {
    stage() {
      switch (this.$route.path) {
        case '/sign-up/sign-up1':
          return 'stage-1';
        case '/sign-up/sign-up2':
          return 'stage-2';
        case '/sign-up/sign-up3':
          return 'stage-3';
        case '/sign-up/sign-up4':
          return 'stage-4';
        default:
          break;
      }
    },

    last(lastNum) {
      if (this.$route.path === lastNum) {
        return 'selected';
      }
      return false;
    },
  },
};
</script>

<style scoped>
.line {
  display: flex;
  justify-content: space-around;
  width: 60%;
  height: 5px;
  margin-top: 30px;
  border-radius: 2.5px;
  background-color: var(--accent);
}

.stage-1 {
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    var(--accent) 12.5%,
    var(--primary) 12.6%,
    var(--primary) 100%
  );
}

.stage-2 {
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    var(--accent) 37.5%,
    var(--primary) 37.6%,
    var(--primary) 100%
  );
}

.stage-3 {
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    var(--accent) 62.5%,
    var(--primary) 62.6%,
    var(--primary) 100%
  );
}

.stage-4 {
  background: var(--accent);
}

.link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: calc(-1.5vw + 2.5px);
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: var(--primary);
  text-align: center;
  text-decoration: none;
  font-family: var(--pressStart), varArial, Helvetica;
  color: var(--white);
  font-size: 100%;
}

.link:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.complete {
  background-color: var(--accent);
  color: var(--primary);
}

.selected {
  transform: scale(1.1);
  box-shadow: 0px 0px 4px var(--white);
}

</style>
