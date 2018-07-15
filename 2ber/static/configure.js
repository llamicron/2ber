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

  },

  methods: {
    deviceType(type) {
      // Returns an array of devices of a vertain type
      return this.devices.filter(x => x.type == type)
    },

    addController() {
      // Pushes new controller onto the configuration model to be sent and clears newController
      this.controllers.push(this.newController);
      this.newController = {
        name: '',
        address: ''
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
