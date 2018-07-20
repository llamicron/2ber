let x = new Vue({
  el: '#dashboard',
  data: {
    configuration: {
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
    slackMessage: '',
    sendWhenDone: false,
  },
  components: {
    'temp-chart': TempChartComponent,
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'timer': TimerComponent,
    'device-control-table': DeviceControlTable,
  },

  methods: {
    selectConfiguration(config) {


    },
    deviceType(type) {
      // Returns an array of devices of a certain type
      // This looks stupid but it's for backwards compatibility
      if (!this.configuration) return [];
      return this.configuration.devices[type]
    },
    controllerType(type) {
      // returns an array of controllers of a certain type
      // This looks stupid but it's for backwards compatibility
      // console.log(this.configuration)
      if (!this.configuration) return [];
      return this.configuration.controllers[type];
    },

    // Slack Methods
    sendSlackMessage(checked=true) {
      // Checked is the checkbox in the timer
      if (!checked) return;

      if (this.slackMessage == '') {
        return false;
      }

      const options = {
        text: this.slackMessage,
      };

      axios.post(this.configuration.slackWebhook, JSON.stringify(options))
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });

      this.slackMessage = '';
    },
    openSlack() {
      window.open('https://navasotabrewing.slack.com/', '_blank');
    },
  },

  mounted() {
  },

  watch: {
    // Nothing here yet
  },

  updated: function() {
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
