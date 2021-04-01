<template>
  <q-page-container>
    <q-page>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="resi">
          <h5 class="text-bold text-primary">
            <q-icon name="local_shipping" />
            Lacak Paket
            <q-separator spaced />
          </h5>
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
          <div v-if="trackingResult" class="q-mt-md">
            <q-card>
              <q-card-section class="bg-green text-white row">
                <div class="col-6 text-subtitle1 text-bold">
                  <q-icon name="check" style="font-size: 1.5em;" />
                  {{ trackingResult.delivery_status.status }}
                </div>
                <div class="col-6 text-right text-subtitle2">
                  {{ trackingResult.summary.courier_name }}
                </div>
              </q-card-section>
              <q-card-section class="row">
                <div class="col-12 q-mb-md">
                  <div class="text-caption">No Resi</div>
                  <div class="text-subtitle1">
                    {{ trackingResult.summary.waybill_number }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption">Pengirim</div>
                  <div class="text-subtitle1">
                    {{ trackingResult.summary.shipper_name }}
                  </div>
                  <div class="text-caption">
                    {{ trackingResult.summary.origin }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption">Penerima</div>
                  <div class="text-subtitle1">
                    {{ trackingResult.summary.receiver_name }}
                  </div>
                  <div class="text-caption">
                    {{ trackingResult.summary.destination }}
                  </div>
                </div>
              </q-card-section>
              <q-separator spaced />
              <q-card-section>
                <q-timeline color="secondary">
                  <q-timeline-entry
                    v-for="(item, index) in trackingResult.manifest"
                    :key="index"
                  >
                    <template v-slot:title>
                      {{ item.manifest_code }}
                    </template>
                    <template v-slot:subtitle>
                      {{
                        `${item.manifest_date} ${item.manifest_time}`
                          | timestampFormat
                      }}
                    </template>
                    <div>
                      {{ item.manifest_description }}
                    </div>
                  </q-timeline-entry>
                </q-timeline>
              </q-card-section>
            </q-card>
          </div>
          <!-- <div v-if="couriers">
            <q-btn
              v-for="(item, index) in couriers"
              :key="index"
              :label="item.label"
              outline
              rounded
              size="sm"
              class="q-ma-xs"
            />
          </div> -->
        </q-tab-panel>

        <q-tab-panel name="ongkir">
          <h5 class="text-bold text-primary">
            <q-icon name="send" />
            Cek Ongkos Kirim
            <q-separator spaced />
          </h5>
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
        </q-tab-panel>
      </q-tab-panels>
      <q-footer bordered class="bg-white text-primary">
        <q-tabs active-color="white" class="text-grey bg-primary" v-model="tab">
          <q-tab name="resi" label="Cek Resi" icon="local_shipping" />
          <q-tab name="ongkir" label="Cek Ongkir" icon="send" />
        </q-tabs>
      </q-footer>
    </q-page>
  </q-page-container>
</template>

<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";
import {
  listCouriers,
  listCouriersWaybill,
  tracking,
  postage,
  cityList
} from "../../lib/api";

export default {
  name: "PageIndex",
  components: {
    SingleSelector: () => import("components/SingleSelector")
  },
  data() {
    return {
      isLoading: false,
      tab: "resi",
      cekResi: {},
      cekOngkir: {},
      couriers: [],
      trackingResult: null,
      couriersWaybill: [],
      courierSelected: []
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
    },
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
    this.checkTab();
    this.getCourierList();
    this.getCourierListWaybill();
  },
  methods: {
    checkTab() {
      const tab = this.$route.params.tab;
      if (tab) {
        this.tab = tab;
      }
    },
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
            this.$q.loading.hide();
          })
          .catch(e => {
            console.log(e);
            this.$q.loading.hide();
          });
      }
    },
    getCheckOngkir() {
      this.$v.cekOngkir.$touch();
      if (this.$v.cekOngkir.$invalid) {
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
        this.courierSelected = couriers;
        Notify.create({
          message: "Fitur sedang dalam pengembangan",
          timeout: 1000,
          type: "positive",
          color: "positive",
          icon: "info"
        });
        // this.actionCheckOngkir();
      }
    },
    actionCheckOngkir() {
      this.isLoading = true;
      this.$q.loading.show();
      const couriers = this.cekOngkir.couriers.map(c => {
        return c.value;
      });
      this.cekOngkir.couriers = couriers;
      postage(this.cekOngkir)
        .then(r => {
          this.trackingResult = r.data;
          this.$q.loading.hide();
          this.isLoading = false;
        })
        .catch(e => {
          console.log(e);
          this.$q.loading.hide();
          this.isLoading = false;
        });
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
    },
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = stringOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  }
};
</script>
