var x = new Vue({
  el: '#configure',
  data: {
    configurationSelect: 'create',
    newConfigurationName: '',
    slackWebhook: '',
    "controllers": {
      "STR116": [
        {
          "name": "Main STR116",
          "address": 0
        }
      ],
      "STR008": [],
      "OmegaCN7500": [
        {
          "name": "Main Omega",
          "address": 1
        }
      ]
    },
    "devices": {
      "onOffs": [
        {
          "name": "HLT Valve",
          "address": "4",
          "controller_address": 0,
          "state": 0
        }
      ],
      "diverts": [
        {
          "name": "RIMS Divert",
          "address": 3,
          "controller_address": 0,
          "locations": {
            "0": "boil",
            "1": "mash"
          },
          "state": 1
        }
      ],
      "variables": [
        {
          "name": "Propane Valve",
          "address": 2,
          "controller_address": 0,
          "state": 0.4
        }
      ],
      "pumps": [
        {
          "name": "RIMS Pump",
          "address": 1,
          "controller_address": 0,
          "state": 1
        }
      ],
      "thermostats": [
        {
          "name": "RIMS Thermostat",
          "address": 0,
          "controller_address": 1,
          "pv": 82.4,
          "sv": 142.7,
          "state": 1
        }
      ]
    },
    newController: {
      name: '',
      address: ''
    },

  },

  methods: {
    addController() {
      this.controllers[this.newController.type].push(this.newController);
      this.newController = {
        name: '',
        address: ''
      }
    }
  },

  mounted() {

  }
})
