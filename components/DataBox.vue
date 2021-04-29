<template>
  <div class="box c">
    <div>
      <p>Latitude</p>
      <el-input-number
        v-model="latLng.lat"
        controls-position="right"
        @change="handleChangeLat"
        :min="-90"
        :max="90"
      ></el-input-number>
      <p>Longitude</p>
      <el-input-number
        v-model="latLng.lng"
        controls-position="right"
        @change="handleChangeLng"
        :min="-180"
        :max="180"
      ></el-input-number>

      <p>Date</p>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="Pick a day"
        :clearable="false"
        @change="calcDayLenght"
      >
      </el-date-picker>

      <!--<el-button @click="calcDayLenght">Calculate</el-button>-->

      <p>Day Lenght:</p>
      <p>{{ dayLenght }}</p>
      <div>
        <p>Sunrise:</p>
        <el-tooltip
          class="item"
          effect="dark"
          content="Local"
          placement="top-start"
        >
          <span>{{ sunrise.local }} | </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="My timezone"
          placement="top-start"
        >
          <span>{{ sunrise.mytime }}</span>
        </el-tooltip>
      </div>

      <p>Sunset:</p>
      <el-tooltip
        class="item"
        effect="dark"
        content="Local"
        placement="top-start"
      >
        <span>{{ sunset.local }} | </span>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="My timezone"
        placement="top-start"
      >
        <span>{{ sunset.mytime }}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
const moment = require("moment-timezone");
var tzlookup = require("tz-lookup");
export default {
  props: ["latLong"],
  data() {
    return {
      date: new Date(),
      dayLenght: "0",
      sunrise: {
        local: "",
        mytime: "",
      },
      sunset: {
        local: "",
        mytime: "",
      },
      latLng: this.latLong,
    };
  },
  created() {
    this.calcDayLenght();
  },
  methods: {
    handleChangeLat(event) {
      if (typeof event === "undefined") {
        this.latLng.lat = 58.365;
      } else {
        this.latLng.lat = this.roundCoords(this.latLng.lat);
      }
      this.callUpdate();
    },
    handleChangeLng(event) {
      if (typeof event === "undefined") {
        this.latLng.lng = 26.743;
      } else {
        this.latLng.lng = this.roundCoords(this.latLng.lng);
      }
      this.callUpdate();
    },
    callUpdate() {
      this.$emit("updates");
    },
    calcDayLenght() {
      /* Old method for calculating day lenght
      let p = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(0.0086 * (this.dayOfTheYear(this.date) - 186)))));
      let pi = Math.PI;
      let daylightamount =
        24 -
        (24 / pi) *
          Math.acos(
            (Math.sin((0.8333 * pi) / 180) +
              Math.sin((this.latLng.lat * pi) / 180) * Math.sin(p)) /
              (Math.cos((this.latLng.lat * pi) / 180) * Math.cos(p))
          );
      this.dayLenght = this.convertTime(daylightamount);
    */
      let times = this.getTime(this.date, this.latLng.lat, this.latLng.lng);
      let timezone = tzlookup(this.latLng.lat, this.latLng.lng);
      this.dayLenght = this.convertTime(
        this.diffHours(times.sunrise, times.sunset)
      );
      let sunrise = this.getSunrise(times, timezone);
      this.sunrise.local = sunrise[0];
      this.sunrise.mytime = sunrise[1];
      let sunset = this.getSunset(times, timezone);
      this.sunset.local = sunset[0];
      this.sunset.mytime = sunset[1];
    },
    convertTime(time) {
      let hours = Math.floor(time);
      let minutes = Math.ceil((time - Math.floor(time)) * 60);
      if (isNaN(hours)) return "Polar night/day";
      return hours + "h:" + minutes + "m";
    },
    getSunrise(time, timezone) {
      if (isNaN(time.sunrise.getHours())) return ["-","-"];

      let sunrise = this.convertTZ(time.sunrise, timezone);
      return [
        sunrise.getHours().toString().padStart(2, "0") +
          ":" +
          sunrise.getMinutes().toString().padStart(2, "0"),
        time.sunrise.getHours().toString().padStart(2, "0") +
          ":" +
          time.sunrise.getMinutes().toString().padStart(2, "0"),
      ];
    },
    getSunset(time, timezone) {
      if (isNaN(time.sunset.getHours())) return ["-","-"];
      let sunset = this.convertTZ(time.sunset, timezone);
      return [
        sunset.getHours().toString().padStart(2, "0") +
          ":" +
          sunset.getMinutes().toString().padStart(2, "0"),
        time.sunset.getHours().toString().padStart(2, "0") +
          ":" +
          time.sunset.getMinutes().toString().padStart(2, "0"),
      ];
    },
    convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string"
          ? new Date(date)
          : date
        ).toLocaleString("en-US", { timeZone: tzString })
      );
    },
  },
};
</script>

<style scoped>
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
  .c {
    grid-column: 1;
    grid-row: 2;
  }
}
</style>