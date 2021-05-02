<template>
  <div class="box d">
    <div id="head">
      <el-date-picker
        v-model="range"
        type="daterange"
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        @change="redoChart"
        :clearable="false"
      >
      </el-date-picker>

      <div>
        <el-checkbox v-model="checked" @change="redoChart"
          >Compare 2 points</el-checkbox
        >
        <div v-if="checked">
          <div>
            <p>Latitude</p>
            <el-input-number
              v-model="latLng2.lat"
              controls-position="right"
              @change="handleChangeLat"
              :min="-90"
              :max="90"
            ></el-input-number>
          </div>

          <div>
            <p>Longitude</p>
            <el-input-number
              v-model="latLng2.lng"
              controls-position="right"
              @change="handleChangeLng"
              :min="-180"
              :max="180"
            ></el-input-number>
          </div>
        </div>
      </div>
    </div>
    <div>
      <client-only>
        <line-chart :chart-data="chartData" :options="options"></line-chart>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  props: ["latLng"],
  data() {
    return {
      //The default date range is current date - 60 days from now
      range: [new Date(), new Date().setDate(new Date().getDate() + 60)],
      //Second comparsion point values.
      latLng2: {
        lat: 0,
        lng: 0,
      },
      checked: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Day lenght",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                max: 24,
                beginAtZero: true,
                stepSize: 4,
              },
              scaleLabel: {
                display: true,
                labelString: "Day Lenght (Decimal hours)",
              },
            },
          ],
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Date",
              },
            },
          ],
        },
      },
    };
  },
  created() {
    //Fill the chart on creation.
    this.addChartData(false);
  },
  methods: {
    //When latitude value changes
    handleChangeLat(event) {
      if (typeof event === "undefined") {
        this.latLng2.lat = 0;
      } else {
        this.latLng2.lat = this.roundCoords(this.latLng2.lat);
      }
      this.addChartData(true);
    },
    //When longitude value changes
    handleChangeLng(event) {
      if (typeof event === "undefined") {
        this.latLng2.lng = 0;
      } else {
        this.latLng2.lng = this.roundCoords(this.latLng2.lng);
      }
      this.addChartData(true);
    },
    //Peforms needed operations for getting data for the chart and filling it.
    addChartData(compare) {
      if (this.range.length === 2) {
        let days = this.getDates(this.range[0], this.range[1]);
        let dayData = [];
        for (let i = 0; i < days.length; i++) {
          dayData.push(this.calcdayLenght(days[i], this.latLng));
        }

        let datasets = [];

        //if we have a comparison point
        if (compare) {
          let dayData2 = [];
          for (let i = 0; i < days.length; i++) {
            dayData2.push(this.calcdayLenght(days[i], this.latLng2));
          }
          datasets = [
            {
              label: "Day lenght, point 1",
              data: dayData,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Day lenght, point 2",
              data: dayData2,
              borderColor: "rgb(214, 2, 27)",
              tension: 0.1,
            },
          ];
          this.chartData = {
            labels: days,
            datasets: datasets,
          };
        } else {
          datasets = [
            {
              label: "Day lenght",
              data: dayData,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ];
          this.chartData = {
            labels: days,
            datasets: datasets,
          };
        }
        //Make date labels readable.
        days.forEach(function (part, index, arr) {
          arr[index] = part.toDateString();
        });
      }
    },
    //Returns time difference between sunset and sunrise.
    calcdayLenght(date, coords) {
      let times = this.getTime(date, coords.lat, coords.lng);
      return this.diffHours(times.sunset, times.sunrise);
    },
    //Retruns a new date where the date has incread by one.
    addDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1);
      return date;
    },
    //Gets all the dates between two dates.
    //Returns an array of all the dates.
    getDates(startDate, stopDate) {
      let dateArray = new Array();
      let currentDate = startDate;
      while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = this.addDay(currentDate);
      }
      return dateArray;
    },
    //For calling for a chart update.
    //Chooses if it is a comparison chart or not.
    redoChart() {
      if (this.checked) {
        this.addChartData(true);
      } else {
        this.addChartData(false);
      }
    },
  },
};
</script>

<style scoped>
.d {
  grid-column: 2;
  grid-row: 2;
}
.d > #head {
  margin: auto;
  text-align: center;
}

@media only screen and (max-width: 768px) {
  .d {
    grid-column: 1;
    grid-row: 3;
  }
}
</style>