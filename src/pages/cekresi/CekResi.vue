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
          <div class="row ">
            <div class="col-sm-6 col-12 q-pa-sm">
              <TrackingForm
                @result="handleTrackingResult"
                :initialData="initialData"
              />
            </div>
            <TrackingHistory
              class="col-sm-6 col-12 q-pa-sm"
              @selected="setInitialValue"
              ref="historyData"
            />
          </div>

          <TrackingResult
            v-if="trackingResult"
            :trackingResult="trackingResult"
            class="q-mt-md"
          />
        </q-tab-panel>

        <q-tab-panel name="ongkir">
          <h5 class="text-bold text-primary">
            <q-icon name="send" />
            Cek Ongkos Kirim
            <q-separator spaced />
          </h5>
          <OngkirForm @cekOngkirData="handleCekOngkirData" />
          <q-card v-if="cekOngkirData" class="q-mt-xl">
            <q-card-section
              class="bg-secondary text-white text-subtitle1 text-bold q-pa-xs"
            >
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Hasil Cek Ongkir
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      label="simpan"
                      icon="save"
                      color="primary"
                      rounded
                      size="sm"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-list separator>
              <OngkirResult
                v-for="(d, i) in cekOngkirData.courier"
                :key="i"
                :initialData="{ ...cekOngkirData, courier: d }"
              />
            </q-list>
          </q-card>
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
export default {
  name: "PageIndex",
  components: {
    TrackingForm: () => import("components/TrackingForm"),
    TrackingResult: () => import("components/TrackingResult"),
    TrackingHistory: () => import("components/TrackingHistory"),
    OngkirForm: () => import("components/OngkirForm"),
    OngkirResult: () => import("components/OngkirResult")
  },
  data() {
    return {
      tab: "resi",
      trackingResult: null,
      initialData: null,
      cekOngkirData: null
    };
  },
  computed: {},
  mounted() {
    this.checkTab();
  },
  methods: {
    checkTab() {
      const tab = this.$route.params.tab;
      if (tab) {
        this.tab = tab;
      }
    },
    handleTrackingResult(value) {
      this.trackingResult = value;
    },
    setInitialValue(value) {
      this.initialData = value;
    },
    handleCekOngkirData(value) {
      this.cekOngkirData = value;
    }
  },
  watch: {}
};
</script>
