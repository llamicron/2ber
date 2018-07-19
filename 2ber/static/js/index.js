let x = new Vue({
  el: '#dashboard',
  data: {
    configurations: [],
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
    timer: null,
    timeRemaining: 'Done.',
    timerInput: '',
    thermoUpdateInterval: 2,
  },
  components: {
    'temp-chart': TempChartComponent,
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'timer': TimerComponent,
  },

  methods: {
    // Configurations
    getConfigurations() {
      // Get the list of saved configurations to choose from
      axios.get('/configurations').then(response => {
        this.configurations = response.data;
      }).catch(error => {
        console.log(error);
      });
    },
    selectConfiguration(name) {
      console.log(name);
      // finds a configuration from the list by name and sets it as the current one
      // this.configuration = this.configurations.filter(x => x.name == name)[0];
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

    // Timer
    startTimer() {
      if (this.timerInput.length == 2) {
        this.timerInput = '00:' + this.timerInput;
      }
      this.timer.start(this.timerInput);
      this.timerInput = '';
    },
    pauseTimer() {
      if (this.timeRemaining == 'Done.') {
        return false;
      }
      this.timerInput = this.timeRemaining;
      this.timer.stop();
    },
    resetTimer() {
      this.timer.stop()
      this.timeRemaining = 'Done.';
      this.timerInput = '';
    },
    timerDone() {
      if (this.sendWhenDone) {
        this.sendSlackMessage();
      }
      this.timeRemaining = 'Done.'
    },
    tick() {
      // Tick of the timer (Tock callback)
      this.timeRemaining = this.timer.msToTimecode(this.timer.lap());
    },
  },

  mounted() {
    this.getConfigurations();
  },

  watch: {
    thermoUpdateInterval: function () {
      this.$refs.tempChart.forEach(el => {
        el.updateInterval = this.thermoUpdateInterval;
      });
    }
  }
})
