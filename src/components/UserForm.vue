<template>
  <q-dialog ref="modal">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ currentAction }} User</div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md" style="width:100%" v-if="tempData.avatar_url">
          <q-avatar size="100px">
            <img :src="tempData.avatar_url" />
          </q-avatar>
        </div>
        <q-img
          :src="tempData.ktp_url"
          v-if="tempData.ktp_url"
          class="q-mb-md"
          style="max-width:500px;"
        />

        <q-input
          outlined
          v-model="tempData.name"
          label="Nama"
          @blur="$v.tempData.name.$touch"
          :error="$v.tempData.name.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
        <q-input
          outlined
          v-model="tempData.email"
          label="Email"
          type="email"
          @blur="$v.tempData.email.$touch"
          :error="$v.tempData.email.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
        <q-input
          outlined
          type="number"
          v-model="tempData.phone"
          label="Phone"
          @blur="$v.tempData.phone.$touch"
          :error="$v.tempData.phone.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
        <q-input
          outlined
          v-model="tempData.job"
          label="Pekerjaan"
          @blur="$v.tempData.job.$touch"
          :error="$v.tempData.job.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
        <q-input
          type="textarea"
          outlined
          v-model="tempData.address"
          label="Alamat Lengkap"
          @blur="$v.tempData.address.$touch"
          :error="$v.tempData.address.$error"
          error-message="Wajib diisi"
          clearable
          :disable="isDeleted"
        />
        <q-input
          outlined
          v-model="tempData.password"
          label="Password"
          @blur="$v.tempData.password.$touch"
          :error="$v.tempData.password.$error"
          error-message="Wajib diisi"
          type="password"
          clearable
          :disable="isDeleted"
        />
        <q-select
          class="col"
          outlined
          v-model="tempData.role_id"
          :options="roleOptions"
          @blur="$v.tempData.role_id.$touch"
          :error="$v.tempData.role_id.$error"
          emit-value
          map-options
          clearable
          stack-label
          label="Role"
        />
      </q-card-section>

      <q-card-section>
        <div class="row q-mt-md" v-if="mode === 'update'">
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
              color="red"
              label="Non-Aktifkan"
              class="q-mr-md"
              @click="confirm"
              :loading="isLoading"
              :disable="isLoading"
              testcafe-tag="nonaktifkan"
            />
            <q-btn v-close-popup flat label="Batal" :loading="isLoading" :disable="isLoading" />
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
          <q-btn flat v-close-popup :loading="isLoading" :disable="isLoading" label="Batal" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from "quasar";
import { required } from "vuelidate/lib/validators";
import { register, userUpdate, userDelete, userRestore } from "../lib/api";

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
      roleOptions: [],
    };
  },
  validations: {
    tempData: {
      name: {
        required,
      },
      email: {
        required,
      },
      phone: {
        required,
      },
      job: {},
      address: {},
      password: {},
      role_id: {},
    },
  },
  methods: {
    create() {
      this.isLoading = true;
      this.$v.tempData.$touch();

      if (this.$v.tempData.$invalid) {
        Notify.create({
          message: "Error",
          timeout: 1000,
          type: "negative",
          color: "negative",
          icon: "warning",
          detail: "Form tidak valid",
        });
        this.isLoading = false;
      } else {
        const {
          name,
          email,
          phone,
          password,
          role_id,
          job,
          address,
        } = this.tempData;
        if (!password) {
          Notify.create({
            message: "Password wajib di isi",
            timeout: 1000,
            type: "negative",
            color: "negative",
            icon: "warning",
            detail: "Password wajib di isi",
          });
          this.isLoading = false;
          return false;
        }
        register({ name, email, phone, password, role_id, job, address })
          .then((payload) => {
            if (!payload.errors) {
              const result = payload.data;

              Notify.create({
                message: "Success",
                timeout: 1000,
                type: "positive",
                color: "positive",
                icon: "done",
                detail: `Aksi #${result.id} berhasil ditambahkan`,
              });

              this.$emit("registerSuccess", result);
              this.$refs.modal.hide();
            }

            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
          });
      }
    },
    update() {
      this.$v.tempData.$touch();
      this.isLoading = true;

      if (this.$v.tempData.$invalid) {
        Notify.create({
          message: "Error",
          timeout: 1000,
          type: "negative",
          color: "negative",
          icon: "warning",
          detail: "Form tidak valid",
        });
        this.isLoading = false;
      } else {
        const {
          name,
          email,
          phone,
          password,
          role_id,
          job,
          address,
        } = this.tempData;

        userUpdate(this.tempData.id, {
          name,
          email,
          phone,
          password,
          role_id,
          job,
          address,
        })
          .then((payload) => {
            if (!payload.errors) {
              this.tempData = payload.data;

              Notify.create({
                message: "Success",
                timeout: 1000,
                type: "positive",
                color: "positive",
                icon: "done",
                detail: `Aksi #${this.tempData.id} berhasil di-update`,
              });
            }

            this.isLoading = false;
            this.$emit("updateSuccess", this.tempData);

            this.$refs.modal.hide();
          })
          .catch((error) => {
            this.isLoading = false;
          });
      }
    },
    deactivate() {
      this.isLoading = true;
      userDelete(this.tempData.id)
        .then((payload) => {
          if (!payload.errors) {
            this.tempData = payload.data;

            Notify.create({
              message: "Success",
              timeout: 1000,
              type: "positive",
              color: "positive",
              icon: "done",
              detail: `Aksi #${this.tempData.id} berhasil di-nonaktifkan`,
            });
          }

          this.isLoading = false;
          this.$emit("updateSuccess", this.tempData);
          this.$refs.modal.hide();
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    activate() {
      this.isLoading = true;
      userRestore(this.tempData.id)
        .then((payload) => {
          if (!payload.errors) {
            this.tempData = payload.data;

            Notify.create({
              message: "Success",
              timeout: 1000,
              type: "positive",
              color: "positive",
              icon: "done",
              detail: `Aksi #${this.tempData.id} berhasil di-aktifkan`,
            });
          }
          this.isLoading = false;
          this.$emit("updateSuccess", this.tempData);
          this.$refs.modal.hide();
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    start() {
      this.$v.tempData.$reset();
      this.$refs.modal.show();
    },
    confirm() {
      this.$q
        .dialog({
          title: "Konfirmasi",
          message: `Anda yakin akan ${
            this.mode === "update" && !!this.tempData.deleted_at
              ? `mengaktifkan #${this.tempData.email}`
              : `menon-aktifkan #${this.tempData.email}`
          } ?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          if (this.mode === "update" && !!this.tempData.deleted_at) {
            this.activate();
          } else {
            this.deactivate();
          }
        })
        .onOk(() => {
          return true;
        })
        .onCancel(() => {
          return false;
        })
        .onDismiss(() => {
          return false;
        });
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
      this.roleOptions = value.roleOptions;
    },
  },
};
</script>

<style></style>
