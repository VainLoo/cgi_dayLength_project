<template>


<div class="wrapper">
  <div class="box a">
      <h1>Day Lenght Calculator</h1>

  </div>
  <div class="box b">
      <div id="map-wrap" style="height: 300pt">
            <client-only>
                <l-map :zoom=6 :center="[59.099,26.021]" @click="addMarker">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-marker :lat-lng="latLng"></l-marker>
                </l-map>
            </client-only>
        </div>
  </div>
  <div class="box c">

            <p>Latitude</p>
            <el-input-number v-model="latLng.lat" controls-position="right" @change="handleChange" :min="-1000" :max="1000"></el-input-number> 
            <p>Longitude</p>
            <el-input-number v-model="latLng.lng" controls-position="right" @change="handleChange" :min="-1000" :max="1000"></el-input-number>

                <p>Date picker</p>

                <div class="block">
                
                    <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="Pick a day"
                        :clearable="false">
                    </el-date-picker>
                </div>
                <p>Day lenght: {{dayLenght}}</p>
                <p>Sunrise: {{sunrise}}</p>
                <p>Sunset: {{sunset}}</p>
  </div>
  <div class="box d">
      <div class="block">
                    <el-date-picker
                        v-model="range"
                        type="daterange"
                        range-separator="|"
                        start-placeholder="Start date"
                        end-placeholder="End date">
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
let SunCalc = require('suncalc');

export default {
    data() {
      return {
        longitude: 26.021,
        latitude: 59.099,
        date: new Date(),
        dayLenght: '0',
        sunrise: '',
        sunset: '',
        latLng: [59.099,26.021],
        range: '',
        chartData: {
            labels: [],
            datasets: [{
                label: 'Day lenght',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
        }
    },
    methods: {
        handleChange(value) {
            //console.log(value);
        },
        calcDayLenght() {
            let p = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(.00860 * (this.dayOfTheYear(this.date) - 186)))))
            let pi = Math.PI
            //console.log(pi)
            //console.log(this.dayOfTheYear(date))
            //console.log(p)
            //console.log(this.latLng.lat)
            let daylightamount = 24 - (24 / pi) * Math.acos((Math.sin(0.8333 * pi / 180) + Math.sin(this.latLng.lat * pi / 180) * Math.sin(p)) / (Math.cos(this.latLng.lat * pi / 180) * Math.cos(p)))
            //console.log(daylightamount)
            this.dayLenght = this.convertTime(daylightamount)
            let time = this.getTime(this.date)
            this.sunrise = this.getSunrise(time)
            this.sunset = this.getSunset(time)
        },
        getdayLenght(date) {
            let p = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(.00860 * (this.dayOfTheYear(date) - 186)))))
            let pi = Math.PI
            let daylightamount = 24 - (24 / pi) * Math.acos((Math.sin(0.8333 * pi / 180) + Math.sin(this.latLng.lat * pi / 180) * Math.sin(p)) / (Math.cos(this.latLng.lat * pi / 180) * Math.cos(p)))
            return daylightamount
        },
        dayOfTheYear(date) {
           return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        },
        convertTime(time) {
            let hours = Math.floor(time)
            let minutes = Math.ceil((time-Math.floor(time)) * 60)
            if (isNaN(hours)) return 'Day doesnt end or start'
            return (hours + 'h:' + minutes + 'm')
        },
        getSunrise(time) {
            if (isNaN(time.sunrise.getHours())) return 'Day doesnt end or start'
            return time.sunrise.getHours() + ':' + time.sunrise.getMinutes();
        },
        getSunset(time) {
            if (isNaN(time.sunrise.getHours())) return 'Day doesnt end or start'
            return time.sunset.getHours() + ':' + time.sunset.getMinutes();
        },
        getTime(date) {
            return SunCalc.getTimes(date, this.latLng.lat, this.latLng.lng);
        },
        addMarker(data) {
            //console.log(data.latlng)
            this.latLng = data.latlng
            this.calcDayLenght()
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
                dateArray.push(new Date (currentDate));
                currentDate = this.addDay(currentDate);
            }
            //console.log(dateArray)
            return dateArray;
        },
        addChartData() {

            let days = this.getDates(this.range[0], this.range[1])
            //console.log(days)
            let dayData = []
            //console.log(days.length)
            for (let i = 0; i < days.length; i++) {
                //console.log(days[i])
                dayData.push(this.getdayLenght(days[i]))
            }
            //console.log(dayData)

            days.forEach(function(part, index, arr) {
                arr[index] = part.toDateString()
            });

            this.chartData = {
            labels: days,
            datasets: [{
                label: 'Day lenght',
                data: dayData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
                }]
        }
        }
        
    }
}

</script>

<style>


body {
  margin: 40px;
}

.wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 50% 50%;
    background-color: #fff;
    color: #444;
  }

  .box {
    background-color: #444;
    color: #fff;
    border-radius: 5px;
    padding: 20px;
    font-size: 150%;

  }

  .a {
    grid-column: 1 / span 2;
  }
  .b {
    grid-column: 1 / span 2;
    grid-row: 3;
  }
  .c {
    grid-column: 1 ;
    grid-row: 2 ;
  }
  .d {
    grid-column: 2 ;
    grid-row: 2 ;
  }

.leftBox {
  float: left;
  padding: 10px;
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
    grid-column: 1 ;
    grid-row: 2 ;
  }
  .d {
    grid-column: 1 ;
    grid-row: 3 ;
  }

}

</style>
