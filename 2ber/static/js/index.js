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
    stateUpdator: null,
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
        this.config = this.addNewStates(response.data);
      }).catch(error => {
        console.log(error);
      })
    },
    addNewStates(config) {
      for (i in config.devices) {
        devices = config.devices[i]
        for (y in devices) {
          dev = devices[y];
          // Write the newState from the current vue to the config we just got. This preserves the state set by the user.
          // Kinda janky, i know, but this shit works, i think
          dev.newState = this.config.devices[i][y].newState;
        }
      }
      return config;
    },
    setState(device) {
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

  mounted() {
    this.stateUpdator = setInterval(() => {
      this.getState();
    }, 3000)
  },
  updated: function() {
    // This is a fix for MDL
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
