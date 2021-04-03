<template>
  <div>
    <single-selector
      class="q-mb-sm"
      v-model="cekOngkir.origin"
      :filterApi="cityFilterApi"
      label="Kota Asal"
      :minCharacters="2"
      :required="true"
      :initialData="initialOrigin"
      :loading="isLoading"
      :disable="isLoading"
    />
    <single-selector
      class="q-mb-sm"
      v-model="cekOngkir.destination"
      :filterApi="cityFilterApi"
      label="Kota Tujuan"
      :minCharacters="2"
      :required="true"
      :initialData="initialDestination"
      :loading="isLoading"
      :disable="isLoading"
    />
    <q-input
      outlined
      type="number"
      v-model="cekOngkir.weight"
      label="Berat (gram)"
      class="q-mb-sm"
      @blur="$v.cekOngkir.weight.$touch"
      :error="$v.cekOngkir.weight.$error"
    />
    <q-select
      outlined
      v-model="cekOngkir.courier"
      :options="couriersWaybill"
      label="Kurir"
      multiple
      use-chips
      class="q-mb-sm"
      @blur="$v.cekOngkir.courier.$touch"
      :error="$v.cekOngkir.courier.$error"
    />
    <q-btn
      label="Cek"
      class="full-width"
      color="primary"
      @click="getCheckOngkir"
    />
  </div>
</template>
<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";
import { listCouriersWaybill, cityList } from "../lib/api";

export default {
  components: {
    SingleSelector: () => import("components/SingleSelector")
  },
  data() {
    return {
      isLoading: false,
      cekOngkir: {},
      courierSelected: [],
      couriersWaybill: []
    };
  },
  validations: {
    cekOngkir: {
      origin: {
        required
      },
      destination: {
        required
      },
      weight: {
        required
      },
      courier: {
        required
      }
    }
  },
  computed: {
    initialOrigin() {
      return null;
    },
    initialDestination() {
      return null;
    }
  },
  mounted() {
    this.getCourierListWaybill();
  },
  methods: {
    getCourierListWaybill() {
      this.$q.loading.show();
      listCouriersWaybill()
        .then(r => {
          this.couriersWaybill = r.data.map(c => {
            return { label: c.toUpperCase(), value: c };
          });
          this.$q.loading.hide();
        })
        .catch(e => {
          console.log("failed get courier list");
          this.$q.loading.hide();
        });
    },
    getCheckOngkir() {
      this.$v.cekOngkir.$touch();
      if (this.$v.cekOngkir.$invalid && false) {
        Notify.create({
          message: "Silahkan cek kembali form",
          timeout: 1000,
          type: "negative",
          color: "negative",
          icon: "warning",
          detail: "Form tidak valid"
        });
        this.isLoading = false;
      } else {
        const couriers = this.cekOngkir.courier;
        this.$emit("cekOngkirData", this.cekOngkir);
        // Notify.create({
        //   message: "Fitur sedang dalam pengembangan",
        //   timeout: 1000,
        //   type: "positive",
        //   color: "positive",
        //   icon: "info"
        // });
        // this.actionCheckOngkir();
      }
    },
    cityFilterApi(params) {
      params.limit = 99999999;
      return cityList(params).then(response => {
        return response.data.map(c => {
          const province = c.province;
          return {
            label: `${c.type} ${c.name}, ${province.name}`,
            value: c.id
          };
        });
      });
    }
  }
};
</script>
