<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-white" v-if="showHeader">
      <q-toolbar style="height:70px;">
        <span v-if="$q.platform.is.mobile">
          <!-- <q-btn
            v-if="$route.name === 'home' && !profile"
            dense
            flat
            icon="menu"
            @click="left = !left"
            class="text-primary"
          /> -->
          <q-btn
            v-if="$route.name !== 'home'"
            dense
            flat
            icon="keyboard_backspace"
            @click="$router.go(-1)"
            class="text-primary"
          />
        </span>
        <span v-else>
          <!-- <q-btn
            v-if="$q.platform.is.mobile && !profile"
            dense
            flat
            icon="menu"
            @click="left = !left"
            class="text-primary"
          />-->
          <q-btn dense flat icon="menu" @click="left = !left" class="text-primary" />
        </span>

        <q-separator dark vertical />

        <q-toolbar-title class="text-primary">
          <span
            v-if="$route.meta.title && $q.platform.is.mobile"
            class="text-h5 text-bold"
          >{{ $route.meta.title }}</span>
          <span v-else>
            <!-- <img
              v-if="$q.platform.is.desktop"
              style="max-height:50px; margin-top:10px;"
              src="statics/kppnu.png"
            />
            <img
              v-else
              style="max-height:50px; margin-top:10px;"
              src="statics/logo-kppnu-landscape.png"
            /> -->
            <q-avatar size="50px" class="q-mr-sm" v-if="profile">
              <img :src="profile.avatar_url">
            </q-avatar>
            <span class="text-h5">{{ profile.name }}</span>
          </span>
          <!-- <img
            v-if="$q.platform.is.desktop"
            style="max-height:50px; margin-top:10px;"
            src="statics/logo-kppnu-landscape.png"
          />
          <img v-else style="max-height:60px; margin-top:10px;" src="statics/kppnu.png" />-->
        </q-toolbar-title>
        <!-- <q-select
          outlined
          bottom-slots
          class="q-mt-lg q-mr-sm "
          v-model="location"
          :options="locationOptions"
          label="Lokasi"
          clearable
          standout
          dense
          emit-value
          map-options
          input
        /> -->
        <!-- <q-input
          outlined
          bottom-slots
          class="q-mt-lg q-mr-sm"
          v-model="search"
          label="Search"
          clearable
          standout
          dense
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input> -->
        <span v-if="$q.platform.is.desktop">
          <q-btn flat label="Tentang Kami" color="primary" />
          <q-btn flat label="Bantuan" color="primary" />
          <q-btn
            flat
            label="Login"
            color="white"
            class="bg-primary"
            :to="{name:'login'}"
            v-if="!profile"
          />
          <q-btn
            flat
            label="Register"
            color="primary"
            :to="{name:'register'}"
            v-if="!profile && isAllowRegistration()"
          />
        </span>
        <q-btn
          flat
          color="primary"
          icon="chat"
        />
        <q-btn
          flat
          color="primary"
          icon="notifications"
        />
        <q-btn
          flat
          color="primary"
          icon="shopping_cart"
        />

        <!-- <q-btn-dropdown stretch color="primary" flat icon="notifications" v-if="profile">
          <q-list>
            <q-item clickable v-close-popup tabindex="0">
              <q-item-section>
                <q-item-label>Notification</q-item-label>
              </q-item-section>
            </q-item>
            <q-seprator />
            <q-item clickable v-close-popup tabindex="0">
              <q-item-section>
                <q-item-label>Notification</q-item-label>
              </q-item-section>
            </q-item>
            <q-seprator />
          </q-list>
        </q-btn-dropdown> -->
      </q-toolbar>
    </q-header>

    <q-drawer :show-if-above="false" v-model="left" side="left" bordered>
      <div class="q-pa-sm bg-primary text-white" v-if="profile">
        <!-- <q-avatar size="5rem" class="q-pa-md">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>-->
        <span style="font-size:20px;">{{ profile.name }}</span>
        <br />
        {{ profile.email }}
      </div>
      <q-separator />
      <q-item clickable @click="toHome()">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ profile ? "Dasbor" : "Beranda" }}</q-item-label>
        </q-item-section>
      </q-item>
      <span v-if="profile">
        <q-item clickable to="/project">
          <q-item-section avatar>
            <q-icon name="explore" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Proyek Saya</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/profile">
          <q-item-section avatar>
            <q-icon name="explore" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Akun</q-item-label>
          </q-item-section>
        </q-item>
      </span>

      <q-separator />
      <!-- <q-item clickable to="/create-project">
        <q-item-section avatar>
          <q-icon name="explore" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Publish Project</q-item-label>
        </q-item-section>
      </q-item>-->
      <!-- <q-item clickable>
        <q-item-section avatar>
          <q-icon name="explore" />
        </q-item-section>
        <q-item-section>
          <q-item-label>My Project</q-item-label>
        </q-item-section>
      </q-item>-->
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Tentang Kami</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="contact_support" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Bantuan</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="contact_support" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Syarat & Ketentuan</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <!-- start admin menu  -->
      <span v-if="showMenuAdmin">
        <q-separator />
        <q-item-label header>Menu Admin</q-item-label>
        <q-item clickable @click="toAdminUser()" v-if="hasPermission('manage-user')">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manajemen Pengguna</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="toAdminProject()" v-if="hasPermission('manage-project')">
          <q-item-section avatar>
            <q-icon name="explore" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manajemen Daftar Proyek</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="toAdminPayment()" v-if="hasPermission('manage-payment')">
          <q-item-section avatar>
            <q-icon name="monetization_on" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manajemen Pembayaran</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="toAdminRekening()" v-if="hasPermission('manage-rekening')">
          <q-item-section avatar>
            <q-icon name="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manajemen Rekening</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="hasPermission('manage-master-data')" @click="toAdminMasterData()">
          <q-item-section avatar>
            <q-icon name="storage" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Data Master</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="hasPermission('manage-logs')" @click="toAdminLogs()">
          <q-item-section avatar>
            <q-icon name="storage" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Aktivitas Pengguna</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item clickable v-if="hasPermission('manage-share-profit')">
          <q-item-section avatar>
            <q-icon name="monetization_on" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Setup Share Profit</q-item-label>
          </q-item-section>
        </q-item>-->
        <!-- <q-item clickable v-if="hasPermission('manage-report')">
          <q-item-section avatar>
            <q-icon name="insert_chart_outlined" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Report</q-item-label>
          </q-item-section>
        </q-item>-->
      </span>
      <!-- end admin menu -->
      <q-separator />
      <span v-if="profile">
        <q-item clickable @click="confirmLogout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Keluar</q-item-label>
          </q-item-section>
        </q-item>
      </span>
      <span v-else>
        <q-item clickable to="/login">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/register" v-if="isAllowRegistration()">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>
      </span>
      <q-separator></q-separator>
      <q-item clickable to="/version">
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Info Aplikasi</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- <div class="row q-pa-md bg-green-1">
        <div class="col-sm-4">
          <img
            width="100%"
            src="https://statics.olx.co.id/external/base/img/phone-app.webp"
            alt
            srcset
          />
        </div>
        <div :class="$q.platform.is.desktop ? 'col-sm-4 q-pt-xl' : 'col-sm-4 q-pt-md'">
          <div class="text-h4">COBA APLIKASI KPPNU</div>Beli, jual, dan temukan apa saja menggunakan aplikasi di handphone Anda.
        </div>
        <div :class="$q.platform.is.desktop ? 'col-sm-4 q-pt-xl' : 'col-sm-4 q-pt-md'">
          <q-separator spaced dark vertical />
          <div class="text-bold">DOWNLOAD APLIKASI KPPNU SEKARANG</div>
          <img
            width="40%"
            src="https://cdn.freebiesupply.com/logos/large/2x/google-play-badge-logo-png-transparent.png"
            alt
          />
        </div>
      </div>
      <div class="row bg-green-3 q-pa-md">
        <div class="col-sm-3 q-pa-md">
          <div class="text-h6">Link Title</div>
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
        </div>
        <div class="col-sm-3 q-pa-md">
          <div class="text-h6">Link Title</div>
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
        </div>
        <div class="col-sm-3 q-pa-md">
          <div class="text-h6">Link Title</div>
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
          <a href="#">Link</a>
          <br />
        </div>
        <div class="col-sm-3 q-pa-md">
          <div class="text-h6">Ikuti Kami</div>
          <img
            class="q-mr-sm"
            width="50px"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/267px-F_icon.svg.png"
            alt
            srcset
          />
          <img
            class="q-mr-sm"
            width="50px"
            src="data:image/png;base64,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"
            alt
          />
          <img
            class="q-mr-sm"
            width="50px"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
            alt
          />
        </div>
      </div>
      <div class="row q-pa-md bg-primary text-white">
        <div class="text-center col-12">2020 - KADER PENGGERAK PROPERTI NUSANTARA</div>
      </div> -->
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn round color="negative" icon="store_mall_directory" size="1.5em"  />
      </q-page-sticky>
      <q-footer elevated :show-if-above="false">
        <q-tabs v-model="tab" dense class="bg-grey-2 text-teal">
          <q-tab @click="toPage('home')" name="home" icon="explore" label="Beranda" />
          <q-tab @click="toPage('edukasi')" name="edukasi" icon="school" label="Edukasi" />
          <!-- <q-tab @click="toPage('my-shop')" name="shop" icon="store_mall_directory" label="Toko Saya" /> -->
          <q-tab @click="toPage('my-order')" name="order" icon="store_mall_directory" label="Pesanan" />
          <!-- <q-tab @click="toPage('project')" name="project" icon="explore" label="Proyek" /> -->
          <q-tab
            @click="toPage('profile')"
            name="profile"
            icon="account_circle"
            :label="profile ? 'Akun' : 'Masuk'"
          />
          <!-- <q-tab @click="left = !left" name="admin" icon="menu" label="Menu" /> -->
        </q-tabs>
      </q-footer>

      <!-- <q-footer elevated :show-if-above="false" v-else>
        <q-tabs v-model="tab" dense class="bg-grey-2 text-teal">
          <q-tab @click="toPage('home')" name="home" icon="home" label="Home" />
          <q-tab @click="toPage('project')" name="project" icon="explore" label="Proyek" />
          <q-tab @click="toPage('login')" name="profile" icon="account_circle" label="Login" />
        </q-tabs>
      </q-footer>-->
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from "quasar";
import { logout } from "../lib/SessionHelper";
import { hasPermission, isAllowRegistration } from "../lib/helper";
import store from "../store";

export default {
  name: "DasboardLayout",
  data() {
    return {
      route: window.location.hash,
      page: null,
      left: false,
      leftDrawerOpen: false,
      profile: {},
      selectedAccount: "",
      point: 0,
      isMobile: false,
      tab: "home",
      showMenuAdmin: false,
      search: null,
      showHeader: true,
      hideToogleMenu: false,
      location: 1,
      locationOptions: [
        { label: "Jawa Barat", value: 1 },
        { label: "Jawa Tengah", value: 2 },
        { label: "Jawa Timur", value: 3 },
      ],
    };
  },
  mounted() {
    this.ok();
  },
  methods: {
    hasPermission,
    isAllowRegistration,
    ok() {
      this.profile = store.getters["user/profile"];
    },
    confirmLogout() {
      const vueContext = this;
      this.$q
        .dialog({
          title: "Konfirmasi",
          message: "Apakah anda yakin untuk keluar dari aplikasi?",
          persistent: true,
          cancel: {
            label: "Batal",
            flat: true,
          },
          ok: {
            label: "Ya",
          },
        })
        .onOk(() => {
          logout(vueContext);
        });
    },
    toPage(name) {
      this.$router.push({ name: name });
    },
    toAdminUser() {
      this.$router.push({ name: "admin-user" });
    },
    toAdminProject() {
      this.$router.push({ name: "admin-project" });
    },
    toAdminPayment() {
      this.$router.push({ name: "admin-payment" });
    },
    toAdminRekening() {
      this.$router.push({ name: "admin-rekening" });
    },
    toAdminMasterData() {
      this.$router.push({ name: "admin-master-data" });
    },
    toAdminLogs() {
      this.$router.push({ name: "admin-logs-data" });
    },
    toHome() {
      if (this.profile) {
        this.$router.push({ name: "dashboard" });
      } else {
        this.$router.push({ name: "home" });
      }
    },
  },
  watch: {
    $route(to, from) {
      // console.log(to, from);
      // this.showHeader = this.$q.platform.is.mobile
      //   ? to.name === "dashboard"
      //   : true;
      if (to.name === "home") {
        this.tab = "home";
      } else if (to.name === "project") {
        this.tab = "project";
      } else if (to.name === "profile") {
        this.tab = "profile";
      }
    },
    tab(val) {
      // if (val === "dashboard") {
      //   this.$router.push({ name: "dashboard" });
      // } else if (val === "project") {
      //   this.$router.push({ name: "project" });
      // } else {
      //   this.$router.push({ name: "profile" });
      // }
    },
    profile(val) {
      if (val != null && val.role_id > 0) {
        this.showMenuAdmin = true;
        return true;
      }
      return false;
    },
  },
};
</script>
<style>
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}
</style>
