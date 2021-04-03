<template>
  <q-card>
    <q-card-section class="bg-green text-white row">
      <div class="col-6 text-subtitle1 text-bold">
        <q-icon name="check" style="font-size: 1.5em;" />
        {{ trackingResult.delivery_status.status }}
      </div>
      <div class="col-6 text-right text-subtitle2">
        {{ trackingResult.summary.courier_name }}
      </div>
    </q-card-section>
    <q-list bordered separator>
      <q-item>
        <q-item-section>
          <q-item-label caption>No Resi</q-item-label>
          <q-item-label class="text-subtitle1">
            {{ trackingResult.summary.waybill_number }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="share"
            label="Bagikan"
            rounded
            size="xs"
            outline
            color="grey"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-section class="row">
      <div class="col-6">
        <div class="text-caption">Pengirim</div>
        <div class="text-subtitle1 text-primary">
          {{ trackingResult.summary.shipper_name }}
        </div>
        <div class="text-caption">
          {{ trackingResult.summary.origin }}
        </div>
      </div>
      <div class="col-6">
        <div class="text-caption">Penerima</div>
        <div class="text-subtitle1 text-primary">
          {{ trackingResult.summary.receiver_name }}
        </div>
        <div class="text-caption">
          {{ trackingResult.summary.destination }}
        </div>
      </div>
    </q-card-section>
    <q-separator spaced />
    <q-card-section>
      <q-timeline color="secondary">
        <q-timeline-entry
          v-for="(item, index) in trackingResult.manifest"
          :key="index"
        >
          <template v-slot:title>
            {{ item.manifest_code }}
          </template>
          <template v-slot:subtitle>
            {{
              `${item.manifest_date} ${item.manifest_time}` | timestampFormat
            }}
          </template>
          <div>
            {{ item.manifest_description }}
          </div>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    trackingResult: {
      type: Object,
      required: true
    }
  }
};
</script>
