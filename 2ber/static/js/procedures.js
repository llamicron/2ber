var x = new Vue({
  el: '#procedures',
  data: {
    config: {},
  },
  components: {
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent
  },
  updated: function () {
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
