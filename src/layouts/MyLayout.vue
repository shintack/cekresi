<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Diviralin App
        </q-toolbar-title>

        <b>$ {{ point }} </b>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <!-- <q-btn-dropdown
          color="primary"
          :label="selectedAccount"
          v-if="profile.accounts"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="account in profile.accounts"
              :key="account.id"
              @click="changeAccount(account)"
            >
              <q-item-section>
                <q-item-label> {{ account.username }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->
        <q-item-label header>Diviralin App Menu</q-item-label>
        <q-item clickable @click="toMyPoint">
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Saldo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="toCampaign">
          <q-item-section avatar>
            <q-icon name="assignment_turned_in" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Project Campaign</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="toMyAccounts">
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Account</q-item-label>
          </q-item-section>
        </q-item>
        <q-item-label header><hr /></q-item-label>
        <q-item clickable @click="toProfile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Profile</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="confirmLogout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { logout } from "../lib/SessionHelper";
import store from "../store";

export default {
  name: "MyLayout",

  data() {
    return {
      leftDrawerOpen: false,
      profile: {},
      selectedAccount: "",
      point: 0
    };
  },
  mounted() {
    this.ok();
  },
  methods: {
    ok() {
      this.profile = store.getters["user/profile"];
      setTimeout(() => {
        const point = store.getters["user/point"];
        this.point = point.saldo ? point.saldo : 0;
      }, 2000);
      this.selectedAccount = this.profile.accounts
        ? this.profile.accounts[0].username
        : "";
    },
    changeAccount(data) {
      this.selectedAccount = data.username;
    },
    toMyPoint() {
      this.$router.push({
        name: "myPoints"
      });
    },
    toMyAccounts() {
      this.$router.push({
        name: "myAccounts"
      });
    },
    toCampaign() {
      this.$router.push({
        name: "campaign"
      });
    },
    toProfile() {
      this.$router.push({
        name: "profile"
      });
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
            flat: true
          },
          ok: {
            label: "Ya"
          }
        })
        .onOk(() => {
          logout(vueContext);
        });
    }
  }
};
</script>
