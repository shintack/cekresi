<template>
  <q-select
    ref="selector"
    outlined
    v-model="model"
    :options="options"
    clearable
    use-input
    :label="label"
    :loading="loading"
    @filter="filter"
    :hint="`Ketik min ${minCharacters} karakter`"
    error-message="Wajib diisi"
    @blur="$v.model.$touch"
    :error="$v.model.$error"
    map-options
    emit-value
    behavior="menu"
    @input="$emit('input', $event)"
  >
    <!-- Pass on all named slots -->
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

    <!-- Pass on all scoped slots -->
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-select>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { uniqBy } from "lodash";

export default {
  props: {
    filterApi: Function,
    label: String,
    minCharacters: Number,
    required: Boolean,
    initialData: Object,
    input: Number,
  },
  data() {
    return {
      model: this.input,
      initialOptions: [],
      options: this.initialData || [],
      loading: false,
    };
  },
  validations() {
    const baseValidations = {
      model: {
        required,
      },
    };
    return this.required ? baseValidations : { model: {} };
  },
  methods: {
    clearInput() {
      if (!this.$refs.selector) {
        return;
      }

      this.$refs.selector.hidePopup();
    },
    filter(val, update, abort) {
      if (val.length < this.minCharacters) {
        abort();
        return;
      }
      this.loading = true;
      this.filterApi({ keyword: val.toLowerCase() })
        .then((options) => {
          this.options = uniqBy([...this.initialOptions, ...options], "value");
          this.loading = false;
          update(() => {});
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    reset() {
      this.model = null;
      this.options = [];
      this.$v.$reset();
    },
    validate() {
      this.$v.$touch();
      return !this.$v.$invalid;
    },
  },
  watch: {
    initialData: {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          this.options = [];
          this.initialOptions = [];
        } else {
          this.initialOptions = [newValue];
          this.options = [newValue];
          this.model = newValue.value;
          this.$emit("input", newValue.value);
          this.$emit("rawdata", newValue);
        }
      },
    },
  },
};
</script>

<style></style>
