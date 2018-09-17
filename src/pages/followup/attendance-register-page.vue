<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex >
          <!-- date picker start -->
          <div >
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="picker"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="picker"
                label="Picker in dialog"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker color="green lighten-1" v-model="picker" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog.save(picker)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <!-- date picker end -->
          <!-- user search input start -->
          <div>
            <v-text-field
              v-model="userNo"
              label="Church No"
              required
            ></v-text-field>
            <v-btn @click="searchUser(userNo)" block color="primary" dark> Search </v-btn>
          </div>
          <!-- user search input end -->
        </v-flex>
          
        <v-flex v-if="member" xs6>
          <v-layout align-center justify-center row>
              <v-btn @click="markAttendance(member)" outline block color="success"> Accept </v-btn>
              <v-btn @click="resetProps('Member attendance canceled successfully')" outline block color="error">Cancel</v-btn>
          </v-layout>
          <v-layout  align-center justify-center row fill-height>
              <elizer-member-biodata :member="member" ></elizer-member-biodata>
          </v-layout>

        </v-flex>
      </v-layout>


    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerMemberBiodata from "../../shared/member/member-profile.vue";

import { format, getDate } from "date-fns";
import { findApiFactory, createApiFactory } from "libs/render";
import {
  Attendance,
  EntityModelNames,
  Member,
  AttendanceStatus,
  DateFormat
} from "@elizer/shared";

// Errors during operations
const noUserError = new Error("user with the no not found");
const userAlreadyMarkedError = new Error(
  "user with the no has already marked his/her attendance"
);
const userAttendanceCreationFail = new Error(
  "user attendance failed during creation"
);

@Component({
  components: {
    ElizerMemberBiodata
  }
})
export default class AttendanceRegisterPage extends Vue {
  // align center for button
  center = true;

// open calender modal
  modal = false;

  // date to be marked for
  public selectedDate = Number(format(format(Date.now(), DateFormat), "x"));

  // user no of the attendance owner
  public userNo = "";

  // info of the current user selected
  public member: Member | null = null;


  // locates the user and displays the user for confrmation
  async searchUser(userNo: string) {
    try {
      const member = await this.getAttendance(await this.getOwner(userNo));
      this.member = member;
    } catch (error) {
      this.$notify({
        title: "Error Searching Member No",
        text: (error as Error).message,
        type: "error"
      });
    }
  }

  resetProps(message?: string) {
    this.member = null;
    this.userNo = "";
    this.$notify({
      title: "Attendance Register",
      type: "success",
      text: message || "operation successfull"
    });
  }

  // mark the user attendance to the database
  async markAttendance(member: Member) {
    try {
      const attendance = await createApiFactory<
        Attendance,
        Partial<Attendance>
      >(EntityModelNames.Attendance, {
        owner: member.id,
        date: this.selectedDate,
        attendance: AttendanceStatus.Present as any,
        // TODO: overide organization to be dynamic for individual organizations
        organization: `RCCG Jesus Palace`
      });
      if (attendance.data) {
        //  handle success
        this.resetProps(`marked attendance for ${member.name}`);
        return;
      }
      // futher expansion add organizationId to member creation
      throw new Error(attendance.error) || userAttendanceCreationFail;
    } catch (error) {
      this.$notify({
        title: "Error While marking Attendance",
        text: (error as Error).message,
        type: "error"
      });
    }
  }

  // get the member which is the owner of the userNo
  async getOwner(userNo: string) {
    const no = parseInt(userNo, 10);
    // futher expansion request orginzationId for the memebr before query
    const memberRespone = await findApiFactory<Member, Partial<Member>>(
      EntityModelNames.Member,
      { churchNo: no }
    );
    if (memberRespone.data && memberRespone.data.length > 0) {
      const member = memberRespone.data[0];
      if (member) {
        return member;
      }
    }
    throw noUserError;
  }

  // confirm attedance if user had been marked before
  async getAttendance(member: Member) {
    const attendance = await findApiFactory<Attendance, Partial<Attendance>>(
      EntityModelNames.Attendance,
      { owner: member.id, date: this.selectedDate }
    );
    if (attendance.data && attendance.data.length > 0) {
      throw userAlreadyMarkedError;
    }
    return member;
  }

  get picker() {
    return format(this.selectedDate, 'YYYY-MM-DD');
  }

  set picker(date: string) {
    this.selectedDate = Number(format(format(date, DateFormat), "x"));
  }
}
</script>

<style lang="scss">

</style>
