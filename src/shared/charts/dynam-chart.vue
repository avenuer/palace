<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

  <canvas id="myChart" height="320"></canvas>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Chart, ChartData, ChartOptions } from "chart.js";

@Component({
  components: {}
})
export default class DynamChart extends Vue {
  @Prop() public data!: ChartData;
  @Prop() public options!: ChartOptions;
  @Prop() public type!: string;

  private chart: Chart | null = null;

  canvas() {
    const elem = document.getElementById("myChart") as HTMLCanvasElement;
    if (elem) {
      return elem.getContext("2d") as CanvasRenderingContext2D;
    }
    throw new Error("Canvas Element not found");
  }

  create() {
    const ctx = this.canvas();
    return new Chart(ctx, { type:  this.type, data: this.data, options: this.options });
  }

  mounted() {
   this.create(); 
  }
}
</script>

