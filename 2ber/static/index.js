let x = new Vue({
  el: '#dashboard',
  data: {
    configurationSelect: 'select',
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
  },

  methods: {
    // Configurations
    getConfigurations() {
      // Get the list of saved configurations to choose from
      axios.get('/configurations').then(response => {
        this.configurations = response.data;
        // FIXME: Remove this
        this.selectConfiguration('Testing'); // Only for dev
      }).catch(error => {
        console.log(error);
      })
    },
    selectConfiguration(name) {
      // finds a configuration from the list by name and sets it as the current one
      this.configuration = this.configurations.filter(x => x.name == name)[0];
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
    sendSlackMessage() {
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

    // Temp Charts
    drawBaseCharts() {
      // For each thermostat, find it's DOM element and render it's chart
      // Also attach the Chartist object to the thermostat
      for (let i = 0; i < this.deviceType('thermostat').length; i++) {
        const thermo = this.deviceType('thermostat')[i];
        data = {
          series: [{
            name: 'pv',
            data: [
              { x: 1531838135, y: 53 },
            ]
          },
          {
            name: 'sv',
            data: [
              { x: 1531838135, y: 53 },
            ]
          }]
        }
        options = {
          axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: function (value) {
              return moment(value).format('HH:MM:SS');
            }
          }
        }
        thermo.chart = new Chartist.Line('#thermo' + thermo.address + 'Chart', data, options);
      }
    },

    updateThermoTemps() {
      // Post all thermostats to Flask. Flask will add temperature data and return the collection
      thermos = this.configuration.devices['thermostat'];
      axios.post('/update-thermo-data', {
        // Well I'll be fucked
        // Chartist has a circular reference -_-
        thermostats: CircularJSON.stringify(thermos)
      }).then(response => {
        this.configuration.devices['thermostat'] = response.data;
        console.log(response);
      }).catch(error => {
        console.log(error);
      });
    },

    updateCharts() {

    },
  },

  mounted() {
    this.getConfigurations();
    this.timer = new Tock({
      countdown: true,
      interval: 1000,
      callback: this.tick,
      complete: this.timerDone,
    });
    setTimeout(() => {
      this.drawBaseCharts();
    }, 50);
  },

  watch: {
    configurationSelect: function() {
      this.selectConfiguration(this.configurationSelect);
    }
  }
})
