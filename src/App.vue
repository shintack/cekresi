<template>
  <div id="q-app" style="max-width: 800px; margin: 0 auto;">
    <q-layout view="lHh Lpr lFf" v-if="loading">
      <q-page-container>
        <q-page class="flex flex-center">
          <img
            id="mydiv"
            style="max-height:100px; position: fixed;"
            src="statics/tokobukaid.png"
          />
          <q-spinner-puff size="20em" color="primary" />
        </q-page>
      </q-page-container>
    </q-layout>
    <router-view v-else />
  </div>
</template>

<script>
import { refreshTokenAndProfile } from "./lib/SessionHelper";

export default {
  name: "App",
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    if (this.isAuthenticated) {
      refreshTokenAndProfile(this)
        .then(result => {
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    } else {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["user/isAuthenticated"];
    }
  }
};
</script>

<style scoped>
/* #mydiv {
    position:fixed;
    top: 50%;
    left: 50%;
    margin-top: -9em;
    margin-left: -15em;
} */
</style>
