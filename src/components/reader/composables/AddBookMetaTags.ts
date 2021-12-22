import { useMeta } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const title = ref("");
    const description = ref("");

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    function setTitle() {
      title.value = "Another title"; // will automatically trigger a Meta update due to the binding
    }

    return {
      setTitle,
    };
  },
};
