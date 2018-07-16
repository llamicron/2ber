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
      if (!this.validate(this.newController)) {
        return false;
      }
      this.configuration.controllers.push(this.newController);
      this.newController = {
        name: '',
        address: ''
      }
    },

    removeController(name) {
      this.configuration.controllers = this.configuration.controllers.filter(x => x.name != name);
    },

    removeDevice(name) {
      this.configuration.devices = this.configuration.devices.filter(x => x.name != name);
    },

    validate(item) {
      delete item['state']
      for (let key in item) {
        var value = item[key];
        if (value.length == 0) {
          this.validation_message = "Validation failed. Make sure all the fields are filled.";
          return false;
        }
      }
      return true;
    },

    addDevice(type) {
      if (type == 'onOff') {
        if (!this.validate(this.newOnOff)) {
          return false
        }
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
        if (!this.validate(this.newDivert)) {
          return false
        }
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
        if (!this.validate(this.newVariable)) {
          return false
        }
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
        if (!this.validate(this.newPump)) {
          return false
        }
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
        if (!this.validate(this.newThermo)) {
          return false
        }
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
        this.message = "Configuration Saved!";
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
        this.configuration = this.configurations.filter(x => x.name == this.configurationSelect)[0];
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
