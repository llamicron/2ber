let x = new Vue({
  el: '#dashboard',
  data: {
    configurationSelect: 'select',
    configurations: [],
    configuration: {},
    slackMessage: '',
    sendWhenDone: false,
    timer: null,
    timeRemaining: 'Done.',
    timerInput: ''
  },

  methods: {
    getConfigurations() {
      // Get the list of saved configurations to choose from
      axios.get('/configurations').then(response => {
        this.configurations = response.data;
        // FIXME: Remove this
        this.selectConfiguration('Testing'); // Only for dev
        console.log(response);
      }).catch(error => {
        console.log(error);
      })
    },
    selectConfiguration(name) {
      // finds a configuration from the list by name and sets it as the current one
      this.configuration = this.configurations.filter(x => x.name == name)[0];
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

    // Timer
    timerDone() {
      if (this.sendWhenDone) {
        this.sendSlackMessage();
      }
      this.timeRemaining = 'Done.'
    },
    tick() {
      // Tick of the timer (Tock callback)
      this.timeRemaining = this.timer.msToTimecode(this.timer.lap());
    }

  },

  mounted() {
    this.getConfigurations();
    this.timer = new Tock({
      countdown: true,
      interval: 1000,
      callback: this.tick,
      complete: this.timerDone,
    })
  },

  watch: {
    configurationSelect: function() {
      this.selectConfiguration(this.configurationSelect);
    }
  }
})
