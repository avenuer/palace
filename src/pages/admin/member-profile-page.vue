<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
  <div v-if="member">
    <elizer-member-biodata :image="image.link" :member="member" :actions="true" :deleteMember="deleteMember" :edit="editMember" ></elizer-member-biodata>
  </div>
</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerMemberBiodata from "../../shared/member/member-profile.vue";
import { getApiFactory, AdminRoutesNames, deleteApiFactory, findApiFactory } from "libs/render";
import { EntityModelNames, Member, Image } from "@elizer/shared";

@Component({
  components: {
    ElizerMemberBiodata
  }
})
export default class MemberProfilePage extends Vue {
  private member: Member | null = null;

  private image: Image | undefined = {  } as any;

  actions = false;

  /** gets the member with the router id from the database */
  async loadMember(id: string) {
    const member = await getApiFactory<Member>(EntityModelNames.Member, id);
    if (member.data) {
      // handle success
      this.member = member.data;
      this.$notify({ title: 'Retrived Member Details', type: 'success', text: `successfully retrived member details` });
      return;
    }
    this.$notify({
      title: `Error Retrieving Member Details`,
      type: "error",
      text: `error while getting member details with ${this.$route.params.id}`
    });
  }
  
  /** retrieves the image of the owner from the Database */
  async loadImage(owner: string) {
    const { data, error } = await findApiFactory<Image, Partial<Image>>(EntityModelNames.Image, { owner });
    if (data) {
      this.image = data[0] || {};
      this.$notify({ title: 'Retrived Member Image', type: 'success', text: `successfully retrived member Image` });
      return;
    }
    if (error) {
      this.$notify({
        title: `Error Retrieving Member Image`,
        type: "error",
        text: `error while getting member image or Image doesn't exist`
      });
    }
  }


/** deletes the member from the database */
  async deleteMember(member: Member) {
    console.log('delete', member.id);
    const { data, error } = await deleteApiFactory(EntityModelNames.Member, member.id as string);
    if (!data && !error) {
      this.$notify({ title: 'Deleted Member Details', type: 'success', text: `successfully Deleted member details` });
      if (this.image) { 
        return this.deleteImage(this.image.id as string);
      }
      return this.navigateHome();
    }
    this.$notify({
      title: `Error Deleting Member Details`,
      type: "error",
      text: `error while deleting member details with ${this.$route.params.id}`
    });
  }

  /** deletes the image withthe id from the database */
  async deleteImage(id: string) {
    const { data, error } = await deleteApiFactory(EntityModelNames.Image, id);
    console.log({ data, error })
    if (!data && !error) {
      this.$notify({ title: 'Deleted Image Upload', type: 'success', text: `successfully Deleted member image upload` });
      this.navigateHome();
      return;
    }
    this.$notify({
      title: `Error Deleting Image Upload`,
      type: "error",
      text: `error while member image upload`
    });
    this.navigateHome();
  }

  /** changes the page to admin base page */
  navigateHome() {
    this.$router.push(AdminRoutesNames.Home);
  }

/** navigates the router to the form page for edit or update */
  editMember({ id }: Member) {
    this.$router.push({ name: AdminRoutesNames.MemberEdit, params: { id: id as string } });
  }

  /** check if edit actions should be allowed on the component route */
  mounted() {
    if (this.$route.path.match('regx')) {
      this.actions = true;
    }
    this.loadMember(this.$route.params.id);
    this.loadImage(this.$route.params.id);
  }
}
</script>

