let x = new Vue({
  el: '#dashboard',
  data: {
    config: {
      controllers: {
        'STR116': [],
        'STR008': [],
        'OmegaCN7500': []
      },
      devices: {
        'onOff': [],
        'divert': [],
        'variable': [],
        'pump': [],
        'thermostat': [],
      }
    },
  },
  components: {
    'temp-chart': TempChartComponent,
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'timer': TimerComponent,
    'devices': AllDevicesTabs,
    'slack': SlackCard
  },
  methods: {
    getState() {
      url = '/update/config/' + this.config.id
      axios.get(url)
      .then(response => {
        this.config = response.data;
        console.log(response);
      }).catch(error => {
        console.log(error);
      })
    },
    setState() {
      url = '/update/config/' + this.config.id
      axios.post(url, {
        config: this.config
      }).then(response => {
        this.config = response.data;
        console.log(response);
      }).catch(error => {
        console.log(error);
      })
    }
  },

  updated: function() {
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
