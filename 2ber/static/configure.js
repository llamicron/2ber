var x = new Vue({
  el: '#configure',
  data: {
    // These are the old ones
    configurations: [],
    configurationSelect: 'create',
    // This is the current one
    configuration: {
      name: '',
      slackWebhook: '',
      controllers: [],
      devices: [],
    },
    newController: {
      name: '',
      address: ''
    },
    newOnOff: {
      "name": "",
      "type": "onOff",
      "address": "",
      "controller_address": '',
      "state": ''
    },
    newDivert: {
      "name": "",
      "type": "divert",
      "address": '',
      "controller_address": '',
      "locations": {
        "0": "",
        "1": ""
      },
      "state": ''
    },
    newVariable: {
      "name": "",
      "type": "variable",
      "address": '',
      "controller_address": '',
      "state": ''
    },
    newPump: {
      "name": "",
      "type": "pump",
      "address": '',
      "controller_address": '',
      "state": ''
    },
    newThermo: {
      "name": "",
      "type": "thermostat",
      "address": '',
      "controller_address": '',
      "pv": 0,
      "sv": 0,
      "state": 0
    }

  },

  methods: {
    deviceType(type) {
      // Returns an array of devices of a vertain type
      return this.configuration.devices.filter(x => x.type == type)
    },

    controllerType(type) {
      return this.configuration.controllers.filter(x => x.type == type)
    },

    addController() {
      // Pushes new controller onto the configuration model to be sent and clears newController
      this.configuration.controllers.push(this.newController);
      this.newController = {
        name: '',
        address: ''
      }
    },

    addDevice(type) {
      if (type == 'onOff') {
        this.configuration.devices.push(this.newOnOff);
        this.newOnOff = {
          "name": "",
          "type": "onOff",
          "address": "",
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'divert') {
        this.configuration.devices.push(this.newDivert);
        this.newDivert = {
          "name": "",
          "type": "divert",
          "address": '',
          "controller_address": '',
          "locations": {
            "0": "",
            "1": ""
          },
          "state": ''
        }
      }

      if (type == 'variable') {
        this.configuration.devices.push(this.newVariable);
        this.newVariable = {
          "name": "",
          "type": "variable",
          "address": '',
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'pump') {
        this.configuration.devices.push(this.newPump);
        this.newPump = {
          "name": "",
          "type": "pump",
          "address": '',
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'thermostat') {
        this.configuration.devices.push(this.newThermo);
        this.newThermo = {
          "name": "",
          "type": "thermostat",
          "address": '',
          "controller_address": '',
          "pv": 0,
          "sv": 0,
          "state": 0
        }
      }
    },

    controllerNameByAddress(adr) {
      con = this.configuration.controllers.filter(x => x.address == adr)[0];
      if (con) {
        return con.name;
      }
      return '';
    },

    saveConfiguration() {
      axios.post('/configurations', {
        configuration: this.configuration
      }).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      })
    },

    getSavedConfigurations() {
      // Get from Flask
      axios.get('/configurations').then(response => {
        this.configurations = response.data;
      }).catch(error => {
        console.log(error);
      });
    },

    testSlack() {
      // Sends a message to make sure the slack webhook is correct
      const options = {
        text: "Slack works",
      };

      axios.post(this.configuration.slackWebhook, JSON.stringify(options))
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  computed: {

  },

  mounted() {
    this.getSavedConfigurations();
    // This checks 'dirty' mdl-textfields. Just a patch
    window.setInterval(function() {
      var nodeList = document.querySelectorAll('.mdl-textfield');

      Array.prototype.forEach.call(nodeList, function (elem) {
        elem.MaterialTextfield.checkDirty();
      });
    }, 500)
  },

  watch: {
    configurationSelect: function () {
      if (this.configurationSelect != 'create') {
        this.configuration = this.configurations.filter(x => x.safeName == this.configurationSelect)[0];
      } else {
        this.configuration = {
          name: '',
          slackWebhook: '',
          controllers: [],
          devices: []
        }
      }
    },

    configuration: function () {
      document.querySelector('.mdl-textfield').MaterialTextfield.change();
    }
  }
})
