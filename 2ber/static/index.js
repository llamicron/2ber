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
    initCharts() {
      var ctx = document.getElementById("thermo0Chart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
          {
            label: 'Current Temp',
            data: [{
              x: 1531841870,
              y: 1
            },
            {
              x: 1531871970,
              y: 10
            },
            {
              x: 1531884180,
              y: 8
            }],
            backgroundColor: colors.invisible,
            borderColor: colors.redBorder,
            borderWidth: 2
          },
          {
            label: 'Target Temp',
            data: [{
              x: 1531841870,
              y: 8
            },
            {
              x: 1531871970,
              y: 5
            },
            {
              x: 1531884180,
              y: 8
            }],
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
    },

    updateThermoTemps() {

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
      this.initCharts();
    }, 50);
  },

  watch: {
    configurationSelect: function () {
      this.selectConfiguration(this.configurationSelect);
    }
  }
})
