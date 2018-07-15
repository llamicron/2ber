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
    devices: [
      {
        "name": "HLT Valve",
        "type": "onOff",
        "address": "4",
        "controller_address": 0,
        "state": 0
      },
      {
        "name": "RIMS Divert",
        "type": "divert",
        "address": 3,
        "controller_address": 0,
        "locations": {
          "0": "boil",
          "1": "mash"
        },
        "state": 1
      },
      {
        "name": "Propane Valve",
        "type": "variable",
        "address": 2,
        "controller_address": 0,
        "state": 0.4
      },
      {
        "name": "RIMS Pump",
        "type": "pump",
        "address": 1,
        "controller_address": 0,
        "state": 1
      },
      {
        "name": "RIMS Thermostat",
        "type": "thermostat",
        "address": 0,
        "controller_address": 1,
        "pv": 82.4,
        "sv": 142.7,
        "state": 1
      }
    ],
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
      return this.devices.filter(x => x.type == type)
    },

    controllerType(type) {
      return this.controllers.filter(x => x.type == type)
    },

    addController() {
      // Pushes new controller onto the configuration model to be sent and clears newController
      this.controllers.push(this.newController);
      this.newController = {
        name: '',
        address: ''
      }
    },

    addDevice(type) {
      if (type == 'onOff') {
        this.devices.push(this.newOnOff);
        this.newOnOff = {
          "name": "",
          "type": "onOff",
          "address": "",
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'divert') {
        this.devices.push(this.newDivert);
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
        this.devices.push(this.newVariable);
        this.newVariable = {
          "name": "",
          "type": "variable",
          "address": '',
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'pump') {
        this.devices.push(this.newPump);
        this.newPump = {
          "name": "",
          "type": "pump",
          "address": '',
          "controller_address": '',
          "state": ''
        }
      }

      if (type == 'thermostat') {
        this.devices.push(this.newThermo);
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
      con = this.controllers.filter(x => x.address == adr)[0];
      if (con) {
        return con.name;
      }
      return '';
    }
  },

  computed: {

  },

  mounted() {

  }
})
