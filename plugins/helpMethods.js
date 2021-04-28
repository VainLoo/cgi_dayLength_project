import Vue from 'vue'
let SunCalc = require("suncalc");
Vue.mixin({
    methods:{
        dayOfTheYear(date) {
        return Math.floor(
            (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        },
        diffHours(dt2, dt1) {

            let diff =(dt2.getTime() - dt1.getTime()) / 10;
            diff /= (60 * 60);
            return Math.abs(Math.round(diff)/100);
            
        },
        getTime(date, lat, lng) {
            return SunCalc.getTimes(date, lat, lng);
        }
    }
})