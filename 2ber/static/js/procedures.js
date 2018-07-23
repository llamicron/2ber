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
        proc_desc: 'Wait for a period of time. Format: 00:00:00',
        type: 'tool'
      },
      {
        name: 'Slack',
        value: '',
        proc_desc: 'Send a message in Slack',
        type: 'tool'
      },
      {
        name: 'Wait',
        proc_desc: 'Stops procedure until you click "continue"',
        type: 'tool'
      }
    ],
    procedure: []
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
