<template>
  <div class="simple-page">
    <Container @drop="onDrop" lock-axis="y">
      <Draggable v-for="item in itemsCopy" :key="item.id">
        <div class="draggable-item">
          {{ item[$props.dataName] }}
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";

export default {
  name: "ListDraggable",
  components: { Container, Draggable },
  props: {
    items: {
      type: Array,
      required: true,
    },
    dataName: {
      type: String,
      default: "data",
    },
  },
  data() {
    return {
      itemsCopy: this.$props.items,
    };
  },
  methods: {
    onDrop(dropResult) {
      this.itemsCopy = this.applyDrag(this.itemsCopy, dropResult);
      this.$emit("dropped", this.itemsCopy);
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.simple-page {
  max-width: 500px;
  margin: 50px auto;
}

.draggable-item {
  height: 50px;
  line-height: 50px;
  text-align: center;
  display: block;
  background-color: #fff;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 2px;
  margin-top: 2px;
  cursor: default;
  user-select: none;
}
</style>
