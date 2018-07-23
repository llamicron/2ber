var x = new Vue({
  el: '#procedures',
  data: {
    config: {
      devices: {
        'thermostat': []
      }
    },
    tools: [
      {
        name: 'Sleep',
        value: '',
        desc: 'Wait for a period of time',
        type: 'tool'
      },
      {
        name: 'Slack',
        value: '',
        desc: 'Send a message in Slack',
        type: 'tool'
      },
      {
        name: 'Wait',
        value: '',
        desc: 'Wait for an amount of time',
        type: 'tool'
      }
    ],
    // procedure: []
    procedure: [{ "address": "4", "controller_address": 0, "name": "HLT Valve", "newState": false, "state": 0, "states": { "0": "Closed", "1": "Open" }, "type": "onOff", "id": "osdsio6cf" }, { "address": 0, "controller_address": 1, "name": "RIMS Thermostat", "state": 1, "states": { "0": "Off", "1": "On" }, "type": "thermostat", "id": "mc31uilho" }, { "address": "9", "controller_address": 0, "name": "Another Thermostat", "state": 1, "states": { "0": "Off", "1": "On" }, "type": "thermostat", "id": "w4fvv65i5", "newState": false }, { "name": "Wait", "value": "", "desc": "Wait for an amount of time", "type": "tool", "id": "00zal54d6" }, { "name": "Slack", "value": "", "desc": "Send a message in Slack", "type": "tool", "id": "tdkdql3kw" }]
  },
  components: {
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'tool-item-list': ToolItemList,
    'devices': AllDevicesTabs,
    'device-state': DeviceState
  },
  methods: {
    addItem(item) {
      item = Object.assign({}, item);
      item.id = Math.random().toString(36).substr(2, 9);
      this.procedure.push(item);
    },
    removeItem(item) {
      this.procedure = this.procedure.filter(x => x.id != item.id)
    }
  },
  updated: function () {
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
