<template>
  <q-dialog v-model="isOpen" ref="dialog" @escape-key="$emit('close')">
    <q-card class="card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">HotKeys</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          :ripple="{ early: true }"
          @click="$emit('close')"
        />
      </q-card-section>

      <q-card-section>
        <q-list bordered padding class="rounded-borders hotkeys-container">
          <div v-for="(hotkeysGroup, index) in hotkeys" :key="index">
            <q-item-label header>{{ hotkeysGroup[0]["header"] }}</q-item-label>

            <q-item
              clickable
              v-ripple
              v-for="(hotkey, index) in hotkeysGroup"
              :key="index"
            >
              <q-item-section>
                <q-item-label lines="2"
                  ><div
                    style="display: inline-block"
                    v-for="(key, index) in hotkey.keys"
                    :key="index"
                  >
                    <!-- Renders both normal string as well as html symbol code  -->
                    <kbd v-if="!key.startsWith('&')">{{ key }} </kbd>
                    <kbd v-else v-html="key"></kbd>
                    <span
                      style="margin: 0 5px"
                      v-if="index + 1 != hotkey.keys.length"
                      >+</span
                    >
                  </div>
                </q-item-label>
                <q-item-label caption>{{ hotkey.condition }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label lines="1">{{ hotkey.result }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator style="margin-bottom: 25px" spaced inset />
          </div>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="close" outline @click="$emit('close')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "HotKeyInfoDialog",
  props: {
    open: {
      type: Boolean,
    },
    hotkeys: {
      type: Object,
    },
  },
  computed: {
    isOpen() {
      return this.$props.open;
    },
  },

  data() {
    return {
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "orange",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "orange",
        width: "9px",
        opacity: 0.2,
      },
    };
  },

  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.card {
  min-width: 350px;
}

.hotkeys-container {
  min-width: 500px;
}

kbd {
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}
@media (max-width: 480px) {
  .card {
    min-width: 300px;
  }

  .hotkeys-container {
    min-width: 280px;
  }
}

@media (max-width: 480px) {
  .hotkeys-container {
    min-width: 250px;
  }
}
</style>
