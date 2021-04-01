<template>
  <q-header elevated>
    <q-toolbar
      class="bg-white text-primary shadow-2 bg-teal-9 text-white"
      style="height: 60px; "
    >
      <q-btn
        dense
        flat
        icon="arrow_back"
        @click="$router.go(-1)"
        class="q-mr-sm"
      />
      <img src="statics/icon-admin.png" width="40px" />
      <q-toolbar-title>
        <div class="text-subtitle1">
          Admin
        </div>
        <div class="text-caption">
          online
        </div>
      </q-toolbar-title>
      <!-- <q-btn-dropdown
        flat
        round
        dense
        dropdown-icon="more_vert"
        class="float-right"
      >
        <q-list>
          <q-item clickable v-close-popup :to="{ name: 'home' }">
            <q-item-section>
              <q-item-label>Kembali ke beranda</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown> -->
    </q-toolbar>
  </q-header>
</template>
<script>
export default {};
</script>
