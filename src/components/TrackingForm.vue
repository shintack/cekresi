<template>
  <div>
    <q-input
      outlined
      v-model="cekResi.awb"
      label="No Resi"
      class="q-mb-sm"
      @blur="$v.cekResi.awb.$touch"
      :error="$v.cekResi.awb.$error"
      error-message="Wajib diisi"
    />
    <q-select
      outlined
      v-model="cekResi.courier"
      :options="couriers"
      label="Pilih Kurir"
      class="q-mb-sm"
      @blur="$v.cekResi.courier.$touch"
      :error="$v.cekResi.courier.$error"
      error-message="Wajib diisi"
      map-options
      emit-value
    >
    </q-select>
    <q-btn
      @click="getTracking"
      label="Cek"
      class="q-mb-md full-width"
      color="primary"
    />
  </div>
</template>
<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";
import { listCouriers, tracking } from "../lib/api";
import { setHistoryTracking } from "../lib/helper";

export default {
  props: {
    initialData: {}
  },
  data() {
    return {
      isLoading: false,
      cekResi: {},
      couriers: [],
      trackingResult: null
    };
  },
  validations: {
    cekResi: {
      awb: {
        required
      },
      courier: {
        required
      }
    }
  },
  mounted() {
    this.getCourierList();
  },
  methods: {
    getCourierList() {
      this.$q.loading.show();
      listCouriers()
        .then(r => {
          this.couriers = r.data.map(c => {
            return { label: c.toUpperCase(), value: c };
          });
          this.$q.loading.hide();
        })
        .catch(e => {
          console.log("failed get courier list");
          this.$q.loading.hide();
        });
    },
    getTracking() {
      this.trackingResult = null;
      this.$v.cekResi.$touch();
      if (this.$v.cekResi.$invalid) {
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
        this.$q.loading.show();
        tracking(this.cekResi)
          .then(r => {
            this.trackingResult = r.data;
            setHistoryTracking(this.cekResi.awb, this.cekResi.courier);
            this.$emit("result", r.data);
            this.$q.loading.hide();
          })
          .catch(e => {
            console.log(e);
            this.$q.loading.hide();
          });
      }
    }
  },
  watch: {
    initialData(value) {
      if (value) {
        this.cekResi = value;
      }
    }
  }
};
</script>
