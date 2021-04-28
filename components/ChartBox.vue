<template>
  <div class="box d">
      <div id="head">
        <el-date-picker
          v-model="range"
          type="daterange"
          range-separator="|"
          start-placeholder="Start date"
          end-placeholder="End date"
          :clearable="false"
        >
        </el-date-picker>
        <el-button @click="addChartData">Graph it</el-button>
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
    props: ['latLng'],
    data () {
        return {
          range: [],
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
        //responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMax: 24,
                steps: 10,
                stepValue: 4,
                beginAtZero: true, // minimum value will be 0.
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
      }
    }
        
    },
    methods: {
        addChartData() {
          if (this.range.length === 2) {
            let days = this.getDates(this.range[0], this.range[1]);
            let dayData = [];
            for (let i = 0; i < days.length; i++) {
                dayData.push(this.calcdayLenght(days[i]));
            }

            days.forEach(function (part, index, arr) {
                arr[index] = part.toDateString();
            });

            this.chartData = {
                labels: days,
                datasets: [
                {
                    label: "Day lenght",
                    data: dayData,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
                ],
            };
        }
    },
    calcdayLenght(date) {
      let times = this.getTime(date, this.latLng.lat, this.latLng.lng);
      return this.diffHours(times.sunset, times.sunrise)
    },

    addDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1);
      return date;
    },

    getDates(startDate, stopDate) {
      let dateArray = new Array();
      let currentDate = startDate;
      while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = this.addDay(currentDate);
      }
      //console.log(dateArray)
      return dateArray;
    }


    } 
}
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
  .wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 100%;
    background-color: #fff;
    color: #444;
  }
  .d {
    grid-column: 1;
    grid-row: 3;
  }
}

</style>