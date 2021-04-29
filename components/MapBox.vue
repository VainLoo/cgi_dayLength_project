<template>
  <div class="box b">
    <div id="map-wrap" style="height: 300pt">
      <client-only>
        <l-map :zoom="6" :center="[58.365, 26.743]" @click="addMarker">
          <l-tile-layer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            :noWrap="true"
          ></l-tile-layer>
          <l-marker :lat-lng="latLng"></l-marker>
        </l-map>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  props: ["latLong"],
  data() {
    return {
      latLng: this.latLong,
    };
  },
  methods: {
    addMarker(data) {
      this.latLng.lat = this.roundCoords(data.latlng.lat);
      this.latLng.lng = this.roundCoords(data.latlng.lng);

      if (data.latlng.lng > 180) {
        this.latLng.lng = 180;
      } else if (data.latlng.lng < -180) {
        this.latLng.lng = -180;
      }
    
      this.$emit("newCords");
    },
  },
};
</script>

<style scoped>
.b {
  grid-column: 1 / span 2;
  grid-row: 3;
}
@media only screen and (max-width: 768px) {
  .b {
    grid-column: 1;
    grid-row: 4;
  }
}
</style>