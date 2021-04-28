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
    <ChartBox ref="chartBox" :latLng="latLng"  />

  </div>
</template>

<script>
const moment = require('moment-timezone');
var tzlookup = require("tz-lookup");
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

      /*
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
*/
      let times = this.getTime(this.date, this.latLng.lat, this.latLng.lng);
      let timezone = tzlookup(this.latLng.lat, this.latLng.lng)
      this.dayLenght = this.convertTime(this.diffHours(times.sunrise, times.sunset))
      this.sunrise = this.getSunrise(times, timezone);
      this.sunset = this.getSunset(times, timezone);
    },
    convertTime(time) {
      let hours = Math.floor(time);
      let minutes = Math.ceil((time - Math.floor(time)) * 60);
      if (isNaN(hours)) return "Day doesnt end or start";
      return hours + "h:" + minutes + "m";
    },
    getSunrise(time, timezone) {
      if (isNaN(time.sunrise.getHours())) return "Day doesnt end or start";
      
      let sunrise = this.convertTZ(time.sunrise, timezone)
      return (
        sunrise.getHours().toString().padStart(2, "0") +
        ":" +
        sunrise.getMinutes().toString().padStart(2, "0")
      );
    },
    getSunset(time, timezone) {
      if (isNaN(time.sunrise.getHours())) return "Day doesnt end or start";
      let sunset = this.convertTZ(time.sunset, timezone)
      return (
        sunset.getHours().toString().padStart(2, "0") +
        ":" +
        sunset.getMinutes().toString().padStart(2, "0")
      );
    },
    addMarker(data) {
      this.latLng.lat = data.latlng.lat;
      this.latLng.lng = data.latlng.lng;
      this.calcDayLenght();
      this.$refs.chartBox.addChartData()
    },
    convertTZ(date, tzString) {
      return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
    }
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

.c > * {
  max-width: 200px;
  margin: auto;
  text-align: center;
}


.c > * > p {
  padding: 5px;
}

@media only screen and (max-width: 768px) {
  .wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 100%;
    background-color: #fff;
    color: #444;
  }

  .a {
    grid-column: 1;
    grid-row: 1;
  }
  .b {
    grid-column: 1;
    grid-row: 4;
  }
  .c {
    grid-column: 1;
    grid-row: 2;
  }
}

</style>
