<template>
  <q-layout view="lHh Lpr lFf">
    <transition
      :name="transitionName"
      enter-active-class="animated slideInUp"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <!-- <keep-alive> -->
      <router-view />
      <!-- </keep-alive> -->
    </transition>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      transitionName: ""
    };
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split("/").length;
    const fromDepth = from.path.split("/").length;
    this.transitionName =
      toDepth < fromDepth ? "overlap-left" : "overlap-right";
    next();
  },
  methods: {}
};
</script>

<style>
.child-slide {
  width: 100%;
  position: absolute;
  transition: all 0.3s;
}
.overlap-left-enter,
.overlap-left-enter-active {
  opacity: 0;
}
.overlap-left-enter-to {
  opacity: 1;
}
.overlap-left-leave-active {
  transform: translate(100%, 0);
}
.overlap-right-leave-active {
  z-index: -1;
  opacity: 1;
  transform: translate(-30px, 0);
}
.overlap-right-enter {
  transform: translate(100%, 0);
}
</style>
