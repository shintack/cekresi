<template>
  <q-header elevated>
    <q-toolbar class="shadow-2" style="height: 60px">
      <q-btn
        dense
        flat
        icon="arrow_back"
        @click="$router.go(-1)"
        class="q-mr-sm"
      />
      <q-toolbar-title>{{ $route.meta.title }}</q-toolbar-title>
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
