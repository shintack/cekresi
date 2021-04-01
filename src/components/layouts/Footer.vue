<template>
  <q-footer elevated :show-if-above="false" >
    <q-tabs
      v-model="tab"
      dense
      active-color="white"
      class="text-grey-5 shadow-2"
    >
      <q-tab
        name="katalog"
        icon="dashboard"
        label="Katalog"
        @click="toCatalog()"
      />
      <q-tab
        name="pesanan"
        icon="assignment"
        label="Pesanan"
        @click="toPage('myOrder')"
      />
    </q-tabs>
  </q-footer>
</template>
<script>
import { getSegment } from "../../lib/helper";
export default {
  props: {
    initialData: {
      type: String
      // required: true
    }
  },
  data() {
    return {
      tab: "katalog"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.tab = this.initialData;
    },
    toCatalog() {
      const slug = getSegment(1);
      this.$router
        .push({
          name: "store",
          params: {
            slug: slug
          }
        })
        .catch(e => {
          console.log("your page has been loaded");
        });
    },
    toPage(page) {
      this.$router
        .push({
          name: page
        })
        .catch(e => {
          console.log("your page has been loaded");
        });
    },
    toMyStore() {
      this.$router.push({
        name: "my-store"
      });
    }
  },
  watch: {
    initialData(value) {
      this.tab = value;
    }
  }
};
</script>
