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
    props: ['chartData'],
    data () {
        return {
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
        calcdayLenght(date) {
            let p = Math.asin(
                0.39795 *
                Math.cos(
                    0.2163108 +
                    2 *
                        Math.atan(
                        0.9671396 * Math.tan(0.0086 * (this.dayOfTheYear(date) - 186))
                        )
                )
            );
            let pi = Math.PI;
            //console.log(p)
            let daylightamount =
                24 -
                (24 / pi) *
                Math.acos(
                    (Math.sin((0.8333 * pi) / 180) +
                    Math.sin((this.latLng.lat * pi) / 180) * Math.sin(p)) /
                    (Math.cos((this.latLng.lat * pi) / 180) * Math.cos(p))
                );
            //console.log(daylightamount)
            return daylightamount;
            },
        addChartData() {
            let days = this.getDates(this.range[0], this.range[1]);
            //console.log(days)
            let dayData = [];
            //console.log(days.length)
            for (let i = 0; i < days.length; i++) {
                //console.log(days[i])
                dayData.push(this.calcdayLenght(days[i]));
            }
            //console.log(dayData)

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

</style>