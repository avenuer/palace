<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

  <v-container fluid>
      <image-upload @submit="setImg($event)"></image-upload>
      <elizer-member-form v-if="member"  @submit="saveUser($event)" v-bind:input="member" ></elizer-member-form>
  </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerMemberForm from "../../shared/member/member-form.vue";
import ImageUpload from "../../shared/image-upload.vue";
import {
  createApiFactory,
  getApiFactory,
  AdminRoutesNames,
  findApiFactory,
  updateApiFactory,
  OrgModuleGetters
} from "libs/render";
import { Member, EntityModelNames, Image } from "@elizer/shared";
import { genMember } from "@elizer/gen";
import { error } from "util";

@Component({
  components: {
    ElizerMemberForm,
    ImageUpload
  }
})
export default class MemberFormPage extends Vue {
  public member: Member | null = null ;

  private image: string | undefined;

  private newChurchNo: number | undefined;

  async saveUser($event: Partial<Member>) {
    $event.churchNo = $event.churchNo || this.newChurchNo;
    $event.organization = $event.organization || this.organization;

    const { data, error } = await this.operation($event);
    if (data) {
      this.$notify({
        type: "success",
        text: `${data.name} registered succesfully`,
        title: "Saving Member Successfull"
      });
      if (this.image) {
        return this.uploadImage(data.id as string, this.image);
      }
      return this.changeRoute(data.id as string);
    }
    this.$notify({
      type: "error",
      title: "Error Saving Member",
      text: error
    });
  }

/** select the crud operation based on route name */
  operation($event: Partial<Member>) {
    const { Member } = EntityModelNames;
    return this.$route.name === AdminRoutesNames.MemberCreate
      ? createApiFactory<Member, Partial<Member>>(Member, $event)
      : updateApiFactory<Member, Partial<Member>>(Member, $event);
  }

/** sets the image attribute */
  setImg(img: string) {
    this.image = img;
  }

/** uploads the image */
  async uploadImage(owner: string, image: string) {
    const event: Partial<Image> = {
      owner,
      link: image,
      organization: this.organization
    };
    const { error, data } = await createApiFactory<Image, Partial<Image>>(
      EntityModelNames.Image,
      event
    );
    if (data) {
      this.$notify({
        type: "success",
        text: `${data.owner} Image succesfully uploaded`,
        title: "Image Upload Successfull"
      });
      return this.changeRoute(owner);
    }
    this.$notify({
      type: "error",
      title: "Error Uploading Member Image",
      text: error
    });
  }


  /** changes the view to profile page after success registration */
  changeRoute(id: string) {
    this.$router.push({ name: AdminRoutesNames.MemberProfile, params: { id } });
  }

/** sets the image for upload */
  public setImage($event: string) {
    this.image = $event;
  }

/** retrieve the member for edit operation */
  async retriveMember(id: string) {
    const res = await getApiFactory<Member>(EntityModelNames.Member, id);
    if (res.data) {
      this.member = res.data;
      this.$notify({ title: "Retrieve User with " + id, type: "success" });
      return;
    }
    this.$notify({
      title: "User Not Found",
      text: `user with this unique id not found please reconfirm`,
      type: "error"
    });
  }

/** gets the total number of members and sets new member number */
  async setTotal() {
    const { total } = await findApiFactory(EntityModelNames.Member, {});
    this.newChurchNo = total + 1;
    if (error) {
      this.$notify({
        title: `Error Retriving Total Users Registered`,
        type: "error",
        text: `error setting getting a new churchNo for member`
      });
    }
  }

  get organization() {
    return this.$store.getters[OrgModuleGetters.orgId];
  }

  mounted() {
    // if its the edit page requested with route params
    if (this.$route.name === AdminRoutesNames.MemberEdit) {
      this.retriveMember(this.$route.params.id);
    } else {
      this.member = {} as any;
    }
    this.setTotal();
  }
}
</script>

