<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
  <router-view></router-view>
</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { }
})
export default class AdminBasePage extends Vue {
  
}
</script>

