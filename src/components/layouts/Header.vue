<template>
  <q-header elevated>
    <q-toolbar class="bg-primary text-white shadow-2 row q-pt-md row q-pb-md">
      <div class="col">
        <q-input
          bg-color="white"
          outlined
          rounded
          v-model="search"
          label="Cari produk..."
          clearable
          dense
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- <q-btn flat class="float-right" round dense icon="chat" /> -->
      <q-btn flat class="float-right" round dense icon="notifications" />
      <q-btn
        flat
        class="float-right"
        round
        dense
        icon="shopping_cart"
        :to="{ name: 'cart' }"
      >
        <q-badge color="red" floating>{{ countCarts }}</q-badge>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
<script>
import { myCart } from "../../lib/api";
import { isLoggedIn } from "../../lib/helper";

export default {
  props: {
    initialData: {
      type: String
    }
  },
  data() {
    return {
      search: null,
      countCarts: 0
    };
  },
  mounted() {
    this.getMyCart();
  },
  methods: {
    getMyCart() {
      if (isLoggedIn()) {
        this.isLoading = true;
        myCart({})
          .then(r => {
            if (r.data) {
              this.countCarts = r.data.length;
            }
            this.isLoading = false;
          })
          .catch(e => {
            this.isLoading = false;

            console.log("Failed get cart data");
          });
      }
    }
  },
  watch: {
    initialData(value) {
      this.search = value;
    }
  }
};
</script>
