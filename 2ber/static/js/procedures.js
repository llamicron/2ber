var x = new Vue({
  el: '#procedures',
  data: {
    config: {},
    tools: [
      {
        id: 0,
        name: 'Sleep',
        value: '',
        desc: 'Wait for a period of time'
      },
      {
        id: 1,
        name: 'Slack',
        value: '',
        desc: 'Send a message in Slack'
      }
    ],
    procedure: []
  },
  components: {
    'main-header': MainHeaderComponent,
    'drawer': DrawerComponent,
    'tool-item-list': ToolItemList,
  },
  mounted() {

  },
  methods: {
    addItem(item) {
      this.procedure.push(item);
    }
  },
  updated: function () {
    this.$nextTick(function () {
      componentHandler.upgradeDom();
    });
  }
})
