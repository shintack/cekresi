<template>
  <div>
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-avatar square>
            <img
              src="https://mpng.subpng.com/20191221/bqf/transparent-logistic-icon-tracking-icon-order-icon-5dfecae42577f6.2511917515769791721535.jpg"
            />
          </q-avatar>
          ResiMu
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md q-pt-xl">
        <div class="text-h3">
          Paket Kamu Belum Sampai Rumah?
        </div>
        <div class="text-subtitle1">
          ResiMU mencari lokasi terakhir paket secara cepat dan akurat
        </div>
        <div class="q-mt-xl">
          <q-btn
            rounded
            color="primary"
            icon="local_shipping"
            label="Cek Resi"
            :to="{ name: 'cekresi', params: { tab: 'resi' } }"
          />
          <q-btn
            rounded
            color="primary"
            icon="send"
            outline
            class="q-ml-md bg-white"
            label="Cek Ongkir"
            :to="{ name: 'cekresi', params: { tab: 'ongkir' } }"
          />
        </div>
      </q-page>
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar class="">
        <q-toolbar-title class="text-weight-light">
          Lacak paket & cek ongkir akurat
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script>
export default {
  name: "PageIndex"
};
</script>

<style scoped></style>
