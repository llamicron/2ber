var x = new Vue({
  el: '#configure',
  data: {
    configurationSelect: 'create',
    newConfigurationName: '',
    slackWebhook: '',
    controllers: [
      {
        "name": "Main STR116",
        "type": "STR116",
        "address": 0
      },
      {
        "name": "Main Omega",
        "type": "OmegaCN7500",
        "address": 1
      }
    ],
    newController: {
      name: '',
      type: '',
      address: ''
    }
  },

  methods: {
    addController() {
      this.controllers.push(this.newController);
      this.newController = {
        name: '',
        type: '',
        address: ''
      }
    }
  },

  mounted() {

  }
})
