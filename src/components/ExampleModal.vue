<template>
  <q-dialog ref="modal" minimized>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ currentAction }} Rekening</div>
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          v-model="tempData.bank"
          label="Nama Bank"
          @blur="$v.tempData.bank.$touch"
          :error="$v.tempData.bank.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
      </q-card-section>

      <q-card-section>
        <div class="row q-mt-sm" v-if="mode === 'update'">
          <template v-if="isDeleted">
            <q-btn
              color="primary"
              label="Aktifkan"
              class="q-mr-md"
              @click="confirm"
              :loading="isLoading"
              :disable="isLoading"
              testcafe-tag="aktifkan"
            />
          </template>
          <template v-else>
            <q-btn
              color="primary"
              label="Ubah"
              class="q-mr-md"
              @click="update"
              :loading="isLoading"
              :disable="isLoading"
              testcafe-tag="ubah"
            />
            <q-btn
              v-if="$route.name === 'admin-rekening'"
              color="red"
              label="Non-Aktifkan"
              class="q-mr-md"
              @click="confirm"
              :loading="isLoading"
              :disable="isLoading"
              testcafe-tag="nonaktifkan"
            />
            <q-btn
              v-close-popup
              flat
              label="Batal"
              :loading="isLoading"
              :disable="isLoading"
            />
          </template>
        </div>
        <div class="row q-mt-md" v-else>
          <q-btn
            color="primary"
            label="Tambah"
            class="q-mr-md"
            @click="create"
            :loading="isLoading"
            :disable="isLoading"
          />
          <q-btn
            flat
            v-close-popup
            :loading="isLoading"
            :disable="isLoading"
            label="Batal"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";

export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
    initialData: {
      type: Object,
    },
  },
  data() {
    return {
      options: [],
      tempFokus: null,
      tempData: {},
      isLoading: false,
    };
  },
  validations: {
    tempData: {
      bank: {
        required,
      },
    },
  },
  methods: {
    start() {
      this.$v.tempData.$reset();
      this.$refs.modal.show();
    },
  },
  computed: {
    currentAction() {
      return this.mode === "create" ? "Tambah" : "Ubah";
    },
    isDeleted() {
      return this.mode === "update" && !!this.tempData.deleted_at;
    },
  },
  watch: {
    tempFokus(value) {
      if (value) {
        this.tempData.id_fokus = value.id;
      }
    },
    initialData(value) {
      this.tempData = { ...value };
      this.tempFokus = value.fokus;
      if (!this.tempData.id) {
        this.tempData.status = 0;
      }
    },
  },
};
</script>

<style></style>
