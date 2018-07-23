OnOffState = Vue.component('on-off-state', {
  props: ['device', 'id', 'modifiable'],
  computed: {
    newState() {
      return this.device.newState;
    }
  },
  watch: {
    newState() {
      this.$emit('update', this.device)
    }
  },
  template: `
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" :for="id">
      <input v-model="device.newState" :disabled="!modifiable" type="checkbox" :id="id" class="mdl-switch__input" checked>
    </label>
  `
})

DivertState = Vue.component('divert-state', {
  props: ['device', 'id', 'modifiable'],
  computed: {
    newState() {
      return this.device.newState;
    }
  },
  watch: {
    newState() {
      this.$emit('update', this.device)
    }
  },
  template: `
    <div style="width: 75px;" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <select v-model="device.newState" :disabled="!modifiable" class="mdl-textfield__input" :id="id">
        <option value="0">{{ device.states[0] }}</option>
        <option value="1">{{ device.states[1] }}</option>
      </select>
      <label class="mdl-textfield__label" :for="id">Location</label>
    </div>
  `
})

VariableState = Vue.component('variable-state', {
  props: ['device', 'id', 'modifiable'],
  computed: {
    newState() {
      return this.device.newState;
    }
  },
  watch: {
    newState() {
      this.$emit('update', this.device)
    }
  },
  template: `
    <div class="mdl-textfield variable-valve-state mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="device.newState" :disabled="!modifiable" class="mdl-textfield__input" pattern="-?[0-9]*(\.[0-9]+)?" type="tel" :id="id">
      <label class="mdl-textfield__label" :for="id">State (%)</label>
      <span class="mdl-textfield__error">Needs to be a number</span>
    </div>
  `
})

DeviceState = Vue.component('device-state', {
  props: ['device', 'id', 'modifiable'],
  template: `
    <div>
      <on-off-state   @update="$emit('update', $event)" v-if="device.type == 'onOff'"      :id="id" :modifiable="modifiable" :device="device"></on-off-state>
      <divert-state   @update="$emit('update', $event)" v-if="device.type == 'divert'"     :id="id" :modifiable="modifiable" :device="device"></divert-state>
      <variable-state @update="$emit('update', $event)" v-if="device.type == 'variable'"   :id="id" :modifiable="modifiable" :device="device"></variable-state>
      <on-off-state   @update="$emit('update', $event)" v-if="device.type == 'pump'"       :id="id" :modifiable="modifiable" :device="device"></on-off-state>
    </div>
  `
})

DeviceControlTable = Vue.component('device-control-table', {
  props: ['devices', 'modifiable'],
  methods: {
    id(device) {
      return device.controller_address + '-' + device.address + 'State'
    },
    clicked(device) {
      if (!this.modifiable) {
        this.$emit('clicked', device)
      }
    }
  },
  template: `
    <table class="mdl-data-table full-width mdl-js-data-table mdl-shadow--2dp">
      <thead>
        <tr>
          <th class="mdl-data-table__cell--non-numeric">Name</th>
          <th v-if="modifiable" class="mdl-data-table__cell--non-numeric">State</th>
          <th v-if="modifiable" class="mdl-data-table__cell--non-numeric">New State</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in devices" @click="clicked(device)">
          <td class="mdl-data-table__cell--non-numeric device-table-label">{{ device.name }}</td>
          <td v-if="modifiable" class="mdl-data-table__cell--non-numeric device-table-label">
            {{ device.states[device.state] }}
          </td>
          <td v-if="modifiable" class="mdl-data-table__cell--non-numeric">
            <device-state @update="$emit('update', $event)" :id="id(device)" :modifiable="modifiable" :device="device"></device-state>
          </td>
        </tr>
      </tbody>
    </table>
  `
})

AllDevicesTabs = Vue.component('devices', {
  props: ['devices', 'modifiable'],
  template: `
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__tab-bar">
        <a href="#OnOff-panel" class="mdl-tabs__tab is-active">On/Off</a>
        <a href="#divert-panel" class="mdl-tabs__tab">Diverts</a>
        <a href="#variable-panel" class="mdl-tabs__tab">Variables</a>
        <a href="#pump-panel" class="mdl-tabs__tab">Pumps</a>
      </div>
      <br>
      <div class="mdl-tabs__panel is-active" id="OnOff-panel">
        <device-control-table @clicked="$emit('clicked', $event)" @update="$emit('update', $event)" :modifiable="modifiable" :devices="devices.onOff"></device-control-table>
      </div>
      <div class="mdl-tabs__panel" id="divert-panel">
        <device-control-table @clicked="$emit('clicked', $event)" @update="$emit('update', $event)" :modifiable="modifiable" :devices="devices.divert"></device-control-table>
      </div>
      <div class="mdl-tabs__panel" id="variable-panel">
        <device-control-table @clicked="$emit('clicked', $event)" @update="$emit('update', $event)" :modifiable="modifiable" :devices="devices.variable"></device-control-table>
      </div>
      <div class="mdl-tabs__panel" id="pump-panel">
        <device-control-table @clicked="$emit('clicked', $event)" @update="$emit('update', $event)" :modifiable="modifiable" :devices="devices.pump"></device-control-table>
      </div>
    </div>
  `
})
