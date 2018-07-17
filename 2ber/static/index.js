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
    thermoUpdateInterval: 2,
  },
  components: {
    'temp-chart': TempChartComponent
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
    initCharts() {
      // Makes a new chart for each thermostat
      for (let i = 0; i < this.deviceType('thermostat').length; i++) {
        const thermo = this.deviceType('thermostat')[i];
        thermo.chart = this.newChart('thermo' + thermo.address + "Chart");
      }
    },

    newChart(elementId) {
      // Returns a new Chart (Chart.js)
      var ctx = document.getElementById(elementId).getContext('2d');
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Current Temp',
              data: [],
              tempType: 'pv',
              backgroundColor: colors.invisible,
              borderColor: colors.redBorder,
              borderWidth: 2
            },
            {
              label: 'Target Temp',
              data: [],
              tempType: 'sv',
              backgroundColor: colors.invisible,
              borderColor: colors.blueBorder,
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  'millisecond': 'hh:mm',
                  'second': 'hh:mm',
                  'minute': 'hh:mm',
                  'hour': 'hh:mm',
                  'day': 'hh:mm',
                  'week': 'hh:mm',
                  'month': 'hh:mm',
                  'quarter': 'hh:mm',
                  'year': 'hh:mm',
                }
              }
            }]
          },
          elements: {
            line: {
              tension: 0.1
            }
          }
        }
      });
      return chart;
    },

    addData(chart, data) {
      chart.data.datasets.forEach((dataset) => {
        if (dataset.data.length > 0) {
          dataset.data = dataset.data.slice(Math.max(dataset.data.length - 20, 0))
        }
        if (dataset.tempType == 'pv') {
          dataset.data.push(data.new_pv);
        }

        if (dataset.tempType == 'sv') {
          dataset.data.push(data.new_sv);
        }
      });
      chart.update();
    },

    updateThermo(thermo) {
      axios.post('/thermo-temps', {
        // Post the location information so python knows where to look for temps
        controller_address: thermo.controller_address,
        address: thermo.address
      }).then(response => {
        // Add the returned data
        this.addData(thermo.chart, response.data);
        // console.log(response);
      }).catch(error => {
        console.log(error);
      })
    },

    updateAllThermos() {
      // I can't send the whole object back because chart js has a circular reference
      for (let i = 0; i < this.deviceType('thermostat').length; i++) {
        const thermo = this.deviceType('thermostat')[i];
        this.updateThermo(thermo);
      }
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
      this.initCharts();
    }, 2000);
    // this.updater = setInterval(() => {
    //   this.updateAllThermos();
    // }, this.thermoUpdateInterval * 1000)
  },

  watch: {
    configurationSelect: function () {
      this.selectConfiguration(this.configurationSelect);
    },
    thermoUpdateInterval: function () {
      clearInterval(this.updater)
      if (this.thermoUpdateInterval > 0) {
        this.updater = setInterval(() => {
          this.updateAllThermos();
        }, this.thermoUpdateInterval * 1000)
      }
    }
  }
})
