<template>
  <div class="sidebar-container">
    <div class="sidebar-contents">
      <q-list padding class="rounded-borders hotkeys-container">
        <div v-for="(content, index) in contents" :key="index">
          <q-item
            v-if="typeof content.data == 'string'"
            clickable
            v-ripple
            :active="content.active"
            @click="handleClick(content)"
            class="sidebar-item"
          >
            <q-item-section>
              <q-item-label lines="2">{{ content.data }} </q-item-label>
              <q-item-label caption>{{ content.caption }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-expansion-item
            v-else
            expand-separator
            default-opened
            :label="content.name"
          >
            <div
              v-for="(nestedContent, index) in content.data"
              :key="index"
              class="sidebar-nested"
              lock-axis="y"
            >
              <q-item
                clickable
                v-ripple
                class="sidebar-item"
                :active="nestedContent.active"
                active-class="active-bg"
                @click="handleClick(nestedContent)"
              >
                <q-item-section>
                  <q-item-label lines="1"
                    >{{ nestedContent.data }}
                  </q-item-label>
                  <q-item-label caption lines="2">{{
                    nestedContent.caption
                  }}</q-item-label>
                </q-item-section>

                <q-item-section side v-if="nestedContent.edit">
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    class="edit-btn"
                    @click="editClick = true"
                    :ripple="{ early: true }"
                  />
                </q-item-section>

                <q-item-section
                  side
                  v-if="nestedContent.delete"
                  style="padding-left: 0"
                >
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    class="delete-btn"
                    @click="deleteClick = true"
                    :ripple="{ early: true }"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-expansion-item>
          <!-- <q-separator style="margin-bottom: 25px" spaced inset /> -->
        </div>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBarContents",
  components: {},
  props: {
    contents: {
      type: Object,
    },
  },

  data() {
    return {
      currentText: "",
      deleteClick: false,
      editClick: false,
    };
  },
  mounted() {},
  methods: {
    handleClick(content) {
      if (this.deleteClick) {
        this.$emit("deleted", content);
        this.deleteClick = false;
      } else if (this.editClick) {
        this.$emit("editted", content);
        this.editClick = false;
      } else {
        this.$emit("clicked", content);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 100%;
  min-height: 100%;
}

.sidebar-contents {
  width: 92%;
  margin-left: auto;
  margin-right: auto;
}

.sidebar-item {
  border-radius: 10px;
}

.sidebar-nested {
  width: 90%;
  margin-left: 10%;
}

.active-bg {
  // background-color: #93caed;
  background: rgba(173, 216, 230, 0.3);
}

.delete-btn {
  color: rgba(224, 130, 131, 0.8);
}

.edit-btn {
  //color: rgba(144, 238, 144, 0.8);
  color: rgba(35, 203, 167, 0.8);
}

@media (max-width: 768px) {
  .sidebar-contents {
    width: 100%;
  }

  .sidebar-nested {
    width: 95%;
    margin-left: 5%;
  }
}
</style>
