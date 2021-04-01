import Clipboard from "v-clipboard";
import VueSocialSharing from "vue-social-sharing";
import VueCountdownTimer from "vuejs-countdown-timer";

export default ({ Vue }) => {
  Vue.use(Clipboard);
  Vue.use(VueSocialSharing);
  Vue.use(VueCountdownTimer);
};
