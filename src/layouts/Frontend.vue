<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <div v-if="$q.platform.is.mobile">
          <q-btn dense flat round icon="menu" @click="left = !left" />
          <q-separator dark vertical inset />
        </div>
        <q-toolbar-title>
          <img
            style="max-height:40px;"
            src="https://www.etalaseweb.com/storage/2020/05/Logo-Etalaseweb-Mini-putih.png"
          />
        </q-toolbar-title>
        <!-- <q-btn-dropdown stretch flat label="Dropdown">
          <q-list>
            <q-item-label header>Folders</q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item-label header>Files</q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>-->
        <q-btn stretch flat v-if="$q.platform.is.desktop" label="Login" to="/login" />
        <q-btn stretch flat v-if="$q.platform.is.desktop" label="Register" to="/register" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      bordered
      elevated
      v-if="$q.platform.is.mobile"
    >
      <q-item clickable to="/dashboard">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="explore" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Project</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section>
          <q-item-label>About Us</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="contact_support" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Faq</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable to="/login">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Login</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable to="/register">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Register</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false
    };
  }
};
</script>
