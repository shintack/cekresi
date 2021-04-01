<template>
  <q-dialog ref="modal" persistent position="bottom" full-width>
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          <q-btn icon="close" flat v-close-popup />
          Verifikasi
        </div>
      </q-card-section>
      <q-card-section>
        <div>
          Untuk melanjutkan silahkan verifikasi no WA kamu
        </div>

        <div class="q-pt-md q-pb-md ">
          <div class="row">
            <div class="col-3">
              <q-select
                outlined
                emit-value
                map-options
                :options="[
                  {
                    label: '+62 ',
                    value: '62'
                  }
                ]"
                v-model="country"
              />
            </div>
            <div class="col">
              <q-input
                class="q-mb-sm"
                bg-color="white"
                outlined
                v-model="tempData.phone"
                type="number"
                hint="8121234xxxx"
                counter
                maxlength="11"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please type something'
                ]"
                :loading="isLoading"
                :disable="isLoading"
                @blur="$v.tempData.phone.$touch"
                :error="$v.tempData.phone.$error"
              >
              </q-input>
            </div>
          </div>
          <!-- <q-input
            v-model="tempData.phone"
            label="No. WA"
            outlined
            @blur="$v.tempData.phone.$touch"
            :error="$v.tempData.phone.$error"
            error-message="Wajib diisi"
            clearable
            :disable="isLoading || needOtp"
            :loading="isLoading"
          /> -->
          <q-input
            v-if="needOtp"
            v-model="tempData.otp"
            label="Kode OTP"
            outlined
            @blur="$v.tempData.otp.$touch"
            :error="$v.tempData.otp.$error"
            error-message="Wajib diisi"
            clearable
            :disable="isLoading"
            :loading="isLoading"
          />
        </div>
        <q-btn
          v-if="!needOtp"
          class="full-width"
          color="primary"
          @click="sendOtp"
          :disable="isLoading"
          :loading="isLoading"
        >
          Kirim OTP
        </q-btn>
        <q-btn
          v-if="needOtp"
          class="full-width"
          color="primary"
          @click="validateOtp"
          :disable="isLoading"
          :loading="isLoading"
        >
          Submit
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";
import { getSegment, getStoreData } from "../lib/helper";
import { requestOtpWa, validateOtpWa } from "../lib/api";
import store from "../store";

export default {
  props: {},
  data() {
    return {
      tempFokus: null,
      tempData: {},
      isLoading: false,
      needOtp: false,
      country: 62,
      store: {}
    };
  },
  validations: {
    tempData: {
      phone: {
        required
      },
      otp: {}
    }
  },
  mounted() {},
  methods: {
    start() {
      this.country = 62;
      this.store = getStoreData(getSegment(1));
      this.$refs.modal.show();
    },
    create() {},
    sendOtp() {
      this.$v.tempData.$touch();
      if (this.$v.tempData.$invalid) {
        Notify.create({
          message: "Silahkan cek kembali inputan data anda",
          timeout: 1000,
          type: "negative",
          color: "negative",
          icon: "warning"
        });
        this.isLoading = false;
      } else {
        this.$q.loading.show();
        const params = {
          shop_id: this.store.id,
          phone: `${this.country}${this.tempData.phone}`,
          otp: this.tempData.otp
        };
        requestOtpWa(params)
          .then(r => {
            this.$q.loading.hide();
            if (r.data.status) {
              this.needOtp = true;
            }
          })
          .catch(e => {
            this.$q.loading.hide();
            console.log("Failed request otp");
          });
      }
    },
    validateOtp() {
      this.$q.loading.show();
      const params = {
        shop_id: this.store.id,
        phone: `${this.country}${this.tempData.phone}`,
        otp: this.tempData.otp
      };
      validateOtpWa(params)
        .then(r => {
          this.$q.loading.hide();
          const user = r.data;
          store.dispatch("user/login", {
            accessToken: user.access_token,
            refreshToken: user.access_token
          });
          store
            .dispatch("user/updateRawProfile", JSON.stringify(user))
            .then(result => {
              this.$emit("verified", user);
            });
        })
        .catch(e => {
          this.$q.loading.hide();
          console.log("Failed validate otp");
        });
    },
    stayHere(e) {
      e.preventDefault();
    }
  },
  computed: {},
  watch: {}
};
</script>

<style></style>
