<template>
  <q-dialog ref="modal" persistent>
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          <q-btn icon="share" flat />
          Bagikan
          <q-btn icon="close" class="float-right" flat v-close-popup />
        </div>
      </q-card-section>
      <q-card-section v-if="sharing">
        <ShareNetwork
          v-for="network in networks"
          :network="network.network"
          :key="network.network"
          :url="sharing.url"
          :title="sharing.title"
          :description="sharing.description"
          :quote="sharing.quote"
          :hashtags="sharing.hashtags"
          :twitterUser="sharing.twitterUser"
        >
          <q-btn
            class="text-white q-ma-sm"
            rounded
            :style="{ backgroundColor: network.color }"
            @click="stayHere"
          >
            <!-- <q-icon
                      class="q-mr-sm"
                      name="img:https://www.file-extensions.org/imgs/app-icon/128/9694/whatsapp-for-windows-phone-icon.png"
                    /> -->
            {{ network.name }}
          </q-btn>
        </ShareNetwork>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
// import { Notify } from "quasar";
// import { required } from "vuelidate/lib/validators";
import { getSegment } from "../lib/helper";

export default {
  props: {
    sharing: {
      type: Object
    }
  },
  data() {
    return {
      tempFokus: null,
      tempData: {},
      isLoading: false,
      // sharing: {
      //   url: "",
      //   title: "",
      //   description: "",
      //   quote: "",
      //   hashtags: "",
      //   twitterUser: ""
      // },
      networks: [
        {
          network: "email",
          name: "Email",
          icon: "far fah fa-lg fa-envelope",
          color: "#333333"
        },
        {
          network: "facebook",
          name: "Facebook",
          icon: "fab fah fa-lg fa-facebook-f",
          color: "#1877f2"
        },
        {
          network: "line",
          name: "Line",
          icon: "fab fah fa-lg fa-line",
          color: "#00c300"
        },
        // {
        //   network: "linkedin",
        //   name: "LinkedIn",
        //   icon: "fab fah fa-lg fa-linkedin",
        //   color: "#007bb5"
        // },
        // {
        //   network: "pinterest",
        //   name: "Pinterest",
        //   icon: "fab fah fa-lg fa-pinterest",
        //   color: "#bd081c"
        // },
        {
          network: "sms",
          name: "SMS",
          icon: "far fah fa-lg fa-comment-dots",
          color: "#333333"
        },
        {
          network: "telegram",
          name: "Telegram",
          icon: "fab fah fa-lg fa-telegram-plane",
          color: "#0088cc"
        },
        // {
        //   network: "twitter",
        //   name: "Twitter",
        //   icon: "fab fah fa-lg fa-twitter",
        //   color: "#1da1f2"
        // },
        {
          network: "whatsapp",
          name: "Whatsapp",
          icon: "fab fah fa-lg fa-whatsapp",
          color: "#25d366"
        }
      ]
    };
  },
  // validations: {
  //   tempData: {
  //     bank: {
  //       required
  //     }
  //   }
  // },
  mounted() {},
  methods: {
    start() {
      // this.$v.tempData.$reset();
      this.$refs.modal.show();
    },
    create() {},
    stayHere(e) {
      e.preventDefault();
    }
  },
  computed: {},
  watch: {
    sharing(value) {
      console.log("watch sharing");
    }
  }
};
</script>

<style>
a:link {
  text-decoration: none;
}
</style>
