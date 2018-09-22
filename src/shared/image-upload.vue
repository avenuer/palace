<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
    
    <v-container fluid>
      <v-layout justify-center>
        <v-flex xs12 sm8>
          <v-img
            v-bind:src="image"
          ></v-img>
          <v-text-field xs8
            v-model="path"
            append-icon="person"
            label="Image Path"
          ></v-text-field>
          <input @change="recieveImage($event)"  type="file" name="" id="">
        </v-flex> 
      </v-layout>
    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { fileBase64 } from "@elizer/screwbox";

@Component({
  components: {}
})
export default class ImageUpload extends Vue {
  @Prop() public link!: string;
  

  /** image file path */
  private path = "";
  /** new image base url */
  private image: string = '';

  async recieveImage($event: Event) {
    const files = ($event.srcElement as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const file = files.item(0);
    if (file) {
      this.path = file.path;
      this.image = await fileBase64(file);
      this.$emit('submit', this.image);
    }
  }

  mounted() {
    this.image = this.link;
  }

}
</script>

