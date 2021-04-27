<template>
  <div class="wrapper">
    <div class="box a">
      <h1>Day Lenght Calculator</h1>
    </div>
    <div class="box b">
      <div id="map-wrap" style="height: 300pt">
        <client-only>
          <l-map :zoom="6" :center="[58.365, 26.743]" @click="addMarker">
            <l-tile-layer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
            <l-marker :lat-lng="latLng"></l-marker>
          </l-map>
        </client-only>
      </div>
    </div>
    <div class="box c">
      <div>
        <p>Latitude</p>
        <el-input-number
          v-model="latLng.lat"
          controls-position="right"
          @change="handleChangeLat"
        ></el-input-number>
        <p>Longitude</p>
        <el-input-number
          v-model="latLng.lng"
          controls-position="right"
          @change="handleChangeLng"
        ></el-input-number>

        <p>Date</p>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="Pick a day"
          :clearable="false"
        >
        </el-date-picker>

        <p>Day Lenght: {{ dayLenght }}</p>
        <p>Sunrise: {{ sunrise }}</p>
        <p>Sunset: {{ sunset }}</p>

        <el-button @click="calcDayLenght">Calculate</el-button>
      </div>
    </div>
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
  </div>
</template>

<script>
let SunCalc = require("suncalc");

export default {
  data() {
    return {
      date: new Date(),
      dayLenght: "0",
      sunrise: "",
      sunset: "",
      latLng: {
        lat: 58.365,
        lng: 26.743,
      },
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
      },
    };
  },
  created() {
    this.calcDayLenght();
  },
  methods: {
    handleChangeLat(event) {
      if (typeof event === "undefined") {
        this.latLng.lat = 58.365;
      }
    },
    handleChangeLng(event) {
      if (typeof event === "undefined") {
        this.latLng.lng = 26.743;
      }
    },
    calcDayLenght() {
      console.log(isNaN(this.latLng.lat) || isNaN(this.latLng.lng));
      console.log(this.latLng);
      let p = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(0.0086 * (this.dayOfTheYear(this.date) - 186)))));
      let pi = Math.PI;
      //console.log(pi)
      //console.log(this.dayOfTheYear(date))
      //console.log(p)
      //console.log(this.latLng.lat)
      let daylightamount =
        24 -
        (24 / pi) *
          Math.acos(
            (Math.sin((0.8333 * pi) / 180) +
              Math.sin((this.latLng.lat * pi) / 180) * Math.sin(p)) /
              (Math.cos((this.latLng.lat * pi) / 180) * Math.cos(p))
          );
      //console.log(daylightamount)
      this.dayLenght = this.convertTime(daylightamount);
      let time = this.getTime(this.date);
      this.sunrise = this.getSunrise(time);
      this.sunset = this.getSunset(time);
    },
    calcdayLenght(date) {
      let p = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(0.0086 * (this.dayOfTheYear(date) - 186))))
      );
      let pi = Math.PI;
      //console.log(p)
      let daylightamount = 24 - (24 / pi) * Math.acos((Math.sin((0.8333 * pi) / 180) + Math.sin((this.latLng.lat * pi) / 180) * Math.sin(p)) / (Math.cos((this.latLng.lat * pi) / 180) * Math.cos(p)));
      //console.log(daylightamount)
      return daylightamount;
    },
    dayOfTheYear(date) {
      return Math.floor(
        (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
      );
    },
    convertTime(time) {
      let hours = Math.floor(time);
      let minutes = Math.ceil((time - Math.floor(time)) * 60);
      if (isNaN(hours)) return "Day doesnt end or start";
      return hours + "h:" + minutes + "m";
    },
    getSunrise(time) {
      if (isNaN(time.sunrise.getHours())) return "Day doesnt end or start";
      return (
        time.sunrise.getHours().toString().padStart(2, "0") +
        ":" +
        time.sunrise.getMinutes().toString().padStart(2, "0")
      );
    },
    getSunset(time) {
      if (isNaN(time.sunrise.getHours())) return "Day doesnt end or start";
      return (
        time.sunset.getHours().toString().padStart(2, "0") +
        ":" +
        time.sunset.getMinutes().toString().padStart(2, "0")
      );
    },
    getTime(date) {
      return SunCalc.getTimes(date, this.latLng.lat, this.latLng.lng);
    },
    addMarker(data) {
      console.log(data.latlng);
      this.latLng.lat = data.latlng.lat;
      this.latLng.lng = data.latlng.lng;
      this.calcDayLenght();
      if (this.range.length === 2) {
        this.addChartData();
      }
      //console.log(this.range)
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
  },
};
</script>

<style>
.a {
  grid-column: 1 / span 2;
}
.b {
  grid-column: 1 / span 2;
  grid-row: 3;
}
.c {
  grid-column: 1;
  grid-row: 2;
}
.d {
  grid-column: 2;
  grid-row: 2;
}

.c > * {
  max-width: 200px;
  margin: auto;
  text-align: center;
}

.d > #head {
  margin: auto;
  text-align: center;
}

.c > * > p {
  padding: 5px;
}
</style>
