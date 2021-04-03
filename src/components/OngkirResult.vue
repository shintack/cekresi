<template>
  <q-expansion-item
    v-if="initialData"
    expand-separator
    icon="send"
    :label="courierLabel"
  >
    <q-card v-if="ongkirResult">
      <q-list separator>
        <q-item v-for="(d, i) in ongkirResult.costs" :key="i">
          <q-item-section>
            <q-item-label class="text-subtitle1">
              {{ d.service }}
            </q-item-label>
            <q-item-label caption> {{ d.description }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="text-subtitle1">
              {{ d.cost[0].value | rupiahFormat }}
            </q-item-label>
            <q-item-label caption
              >Estimasi: {{ d.cost[0].etd }} Hari</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-expansion-item>
</template>
<script>
import { postage } from "../lib/api";

export default {
  props: {
    initialData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      ongkirResult: null
    };
  },
  computed: {
    courierLabel() {
      return this.ongkirResult
        ? this.ongkirResult.name
        : this.initialData
        ? this.initialData.courier.label
        : "-";
    }
  },
  mounted() {
    this.actionCheckOngkir();
  },
  methods: {
    actionCheckOngkir() {
      this.isLoading = true;
      this.$q.loading.show();
      postage({
        origin: this.initialData.origin,
        destination: this.initialData.destination,
        weight: this.initialData.weight,
        courier: this.initialData.courier.value
      })
        .then(r => {
          this.ongkirResult = r.data;
          console.log(this.ongkirResult);
          this.$q.loading.hide();
          this.isLoading = false;
        })
        .catch(e => {
          console.log(e);
          this.$q.loading.hide();
          this.isLoading = false;
        });
    }
  },
  watch: {
    initialData(value) {
      console.log("val", value);
    }
  }
};
</script>
