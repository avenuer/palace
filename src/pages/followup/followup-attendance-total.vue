<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
<div>

  <v-container fluid>
    <v-dialog v-model="showDialogue" >
      <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
      <v-card>
        <v-flex xs12>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="showDialogue = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Chart</v-toolbar-title>
          </v-toolbar>
        </v-flex>
        <v-flex  class="chart-view" xs12>
            <canvas id="myChart" height="100%"></canvas>
        </v-flex>

      </v-card>
    </v-dialog>

    <v-layout row wrap>
      <v-flex xs12>
        <v-card>

          <v-data-table :headers="headers" :items="membersMaped" :total-items="total" :rows-per-page-items="[15]" :pagination.sync="pagination" class="elevation-1">
            <template slot="items" slot-scope="props">
              <td >{{ props.item.date }}</td>
              <td class="text-xs-right">{{ props.item.female }}</td>
              <td class="text-xs-right">{{ props.item.male }}</td>
              <td class="text-xs-right">{{ props.item.total }}</td>
</template>
          </v-data-table>
    
    </v-card>
        </v-flex>
      </v-layout>
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="primary"
        @click="showChart()"
      >
        <v-icon>assessment</v-icon>
      </v-btn>

    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth, getMilliseconds } from "date-fns";
import {
  findMembersAttendance,
  FollowUpRoutesNames,
  attendanceSumationStatics
} from "libs/render";
import {
  EntityModelNames,
  Member,
  ApiStatus,
  DateFormat,
  FindQueryParams,
  MemberAttendanceQuery,
  TotalAttendanceStatics
} from "@elizer/shared";
import { MembersAttendance } from "libs/followup/attendance";
import { TableHeader, TablePagination } from "@elizer/members";
import { ChartData, ChartOptions, Chart } from "chart.js";
import DynamChart from "../../shared/charts/dynam-chart.vue";

interface ChartView {
  config: ChartOptions;
  data: ChartData;
  type: string;
  show: boolean;
} 


@Component({
  components: {
    // DynamChart
  }
})
export default class FollowUpAttendanceStatsPage extends Vue {
  /** query for search */
  private query: Partial<Member> = {};

  /** the total amount of result */
  private total = 0;
  /** limit of data retuned */
  private limit = 0;
  /** amount of data to skip */
  private skip = 0;

  /** Table Header configuration */
  headers: TableHeader<TotalAttendanceStatics>[] = [
    {
      text: "Date",
      value: "date",
      align: "center"
    },
    {
      text: "Female",
      value: "female",
      align: "center"
    },
    {
      text: "Male",
      value: "male",
      align: "center"
    },
    {
      text: "Total",
      value: "total",
      align: "center"
    }
  ];

  /** member details array */
  private dateStats: TotalAttendanceStatics[] = [];

  /** chart options for chart controls */
  private chart: Chart | null = null;

  public showDialogue = false;

  async attendanceStatics(query: Partial<Member>, skip: number = 0) {
    try {
      const resp = await attendanceSumationStatics(query, {
        skip
      });
      if (resp.data) {
        this.dateStats = resp.data;
        this.limit = resp.limit;
        this.skip = resp.skip + resp.limit;
        this.total = resp.total;
        this.$notify({
          type: "success",
          title: "Attendance Statics",
          text: `successfully retrieved attendance statics for dates`
        });
        const { limit, skip, total } = resp;
        return;
      }
      throw new Error(resp.error);
    } catch (error) {
      this.$notify({
        title: "Attendance Statics",
        type: "error",
        text: (error as Error).message
      });
    }
  }


  showChart() {
    this.showDialogue = !this.showDialogue;
    if (this.showDialogue) {
      this.createChart(this.dateStats);
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart(dataSet: TotalAttendanceStatics[]) {
    const elem = document.getElementById("myChart") as HTMLCanvasElement;
    if (elem) {
      this.chart = new Chart(elem.getContext("2d") as CanvasRenderingContext2D, { 
        type: 'bar',
        data: this.chartDataPreset(dataSet),
        options: {
          responsive: true,
        maintainAspectRatio: true,
        scales: {
          ticks: {
            beginAtZero: true
          }
        },
        }
      });
    }
    // throw new Error("Canvas Element not found");
  }

  /** cleans the attendance graph map to a valid chart data */
  chartDataPreset(stats: TotalAttendanceStatics[]): ChartData {
    const labels = stats.map(e => e.date);
    const females = stats.map(e => e.female);
    const males = stats.map(e => e.male);
    const total = stats.map(e => e.total);
    return {
      labels,
      datasets: [
        {
          data: females,
          label: "females",
          fillColor: 'red'
        } as any,
        {
          data: males,
          label: "males",
          fillColor: 'red'
        },
        {
          data: total,
          label: "total",
          fillColor: 'red'
        }
      ]
    };
  }

  /** returns the remapped date details */
  get membersMaped() {
    return this.dateStats;
  }

  set membersMaped(v: any) {}

  /** returns the pagination information */
  get pagination() {
    return {} as any;
  }

  /** updates pagination condition */
  set pagination(v: TablePagination<MembersAttendance>) {
    this.attendanceStatics(this.query, this.limit * (v.page - 1));
  }
}
</script>

<style lang="scss">
</style>
