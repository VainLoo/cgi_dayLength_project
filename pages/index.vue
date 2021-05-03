<template>
  <div>
    <div class="wrapper">
      <div class="box a">
        <h1>Day Lenght Calculator</h1>
      </div>
      <DataBox @updates="update" ref="dataBox" :latLong="latLng" />
      <ChartBox ref="chartBox" :latLng="latLng" />
      <MapBox @newCords="update" ref="mapBox" :latLong="latLng" />
    </div>
    <footer>
      <p>Author: Allan Loo</p>
      <p>loo_allan@yahoo.com</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      latLng: {
        //For storing latitude/longitude values
        lat: 58.365,
        lng: 26.743,
      },
    };
  },
  methods: {
    //Causes updates to be made.
    update() {
      this.$refs.dataBox.calcDayLenght();
      this.$refs.chartBox.redoChart();
    },
  },
};
</script>

<style>
.a {
  grid-column: 1 / span 2;
}

footer {
  text-align: center;
  padding: 3px;
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
}
</style>
