<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

    <v-container fluid></v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";


@Component({
  components: {

  }
})
export default class FollowUpStaticsPage extends Vue {

}
</script>

<style lang="scss">

</style>
