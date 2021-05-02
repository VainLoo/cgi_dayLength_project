import Vue from 'vue'
let SunCalc = require("suncalc");
Vue.mixin({
    methods: {
        //Returns the given dates day number in that year.
        /* Not used any more
        dayOfTheYear(date) {
            return Math.floor(
                (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        },*/

        //Returns the time difference between two dates in decimal hours.
        diffHours(dt2, dt1) {

            let diff = (dt2.getTime() - dt1.getTime()) / 10;
            diff /= (60 * 60);
            return Math.abs(Math.round(diff) / 100);

        },
        //Gets time values using SunCalc given date, latitude, longitude
        getTime(date, lat, lng) {
            return SunCalc.getTimes(date, lat, lng);
        },
        //Rounds the coordinates
        roundCoords(coord) {
            return Math.round(coord*10000000)/10000000;
        }
    }
})