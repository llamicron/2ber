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
    slackMessage: '',
    sendWhenDone: false,
  },
  components: {
    'temp-chart': TempChartComponent,
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'timer': TimerComponent,
    'devices': AllDevicesTabs,
  },

  methods: {
    deviceType(type) {
      // Returns an array of devices of a certain type
      // This looks stupid but it's for backwards compatibility
      if (!this.config) return [];
      return this.config.devices[type]
    },
    controllerType(type) {
      // returns an array of controllers of a certain type
      // This looks stupid but it's for backwards compatibility
      // console.log(this.config)
      if (!this.config) return [];
      return this.config.controllers[type];
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

      axios.post(this.config.slackWebhook, JSON.stringify(options))
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
