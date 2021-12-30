<template>
  <div v-if="img == ''">
    <q-uploader
      :label="label"
      auto-upload
      :url="url"
      accept=".jpg, .png, .gif"
      max-file-size="8000000"
      color="black"
      :no-thumbnails="$q.screen.lt.sm"
      :headers="getHeaders"
      @rejected="onRejected"
      @uploaded="onUploaded"
      class="uploader"
    />
  </div>
  <div v-else>
    <q-img
      :src="img"
      loading="lazy"
      spinner-color="white"
      fit="cover"
      v-ripple.early
      class="img"
      @click="confirmDialog = true"
    >
      <div class="label">
        {{ label }}
      </div>
    </q-img>

    <confirm-dialog
      :open="confirmDialog"
      :header="`Reupload ${label} image?`"
      btnLabel="Reupload"
      btnColor="green"
      @confirmed="confirmHandler"
    />
  </div>
</template>

<script>
import ConfirmDialog from "src/components/AppConfirmDialog.vue";

export default {
  name: "ImageUploader",
  components: { ConfirmDialog },
  props: {
    img: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      confirmDialog: false,
    };
  },

  methods: {
    onRejected(rejectedEntries) {
      for (let i = 0; i < rejectedEntries.length; i++) {
        const entry = rejectedEntries[i];
        this.$q.notify({
          type: "negative",
          message: `${
            entry.file.name
          } was rejected as it fails ${entry.failedPropValidation.replaceAll(
            "-",
            " "
          )} validation`,
        });
      }
    },

    getHeaders() {
      let headers = this.$api.defaults.headers.common;
      let headersOutput = [];

      for (const property in headers) {
        let object = { name: property, value: headers[property] };
        headersOutput.push(object);
      }

      return headersOutput;
    },

    onUploaded(info) {
      this.$emit("uploaded", this.$props.label);
    },

    confirmHandler(result) {
      this.confirmDialog = false;
      if (result) {
        this.$emit("clear", this.$props.label);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.uploader {
  max-width: 300px;
}

.img {
  width: 300px;
  height: 300px;
  cursor: pointer;
}

.label {
  font-size: 24px;
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
}

@media (max-width: 768px) {
  .uploader {
    width: 200px;
  }

  .img {
    width: 200px;
    height: 200px;
  }

  .label {
    padding: 8px 16px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .uploader {
    width: 175px;
  }

  .img {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 380px) {
  .uploader {
    width: 165px;
  }
}

@media (max-width: 330px) {
  .uploader {
    width: 150px;
  }
}
</style>
