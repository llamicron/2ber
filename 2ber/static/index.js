let x = new Vue({
  el: '#dashboard',
  data: {
    configurationSelect: 'select',
    configurations: [],
    configuration: {},
    slackMessage: '',
    sendWhenDone: false,
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
    }
  },

  mounted() {
    this.getConfigurations();
  },

  watch: {
    configurationSelect: function() {
      this.selectConfiguration(this.configurationSelect);
    }
  }
})
