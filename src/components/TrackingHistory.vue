<template>
  <q-list bordered separator v-if="historyTracking">
    <q-expansion-item
      expand-separator
      icon="history"
      label="History"
      caption="Riwayat Pelacakan"
    >
      <q-card>
        <q-separator />
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            dense
            v-for="(a, i) in historyTracking"
            :key="i"
            @click="selectData(a)"
          >
            <q-item-section>
              <q-item-label>
                {{ a.awb }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>
                {{ a.courier }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script>
import { getHistoryTracking } from "../lib/helper";

export default {
  data() {
    return {
      historyTracking: null
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    getHistory() {
      this.historyTracking = getHistoryTracking();
    },
    selectData(a) {
      this.$emit("selected", a);
    }
  }
};
</script>
