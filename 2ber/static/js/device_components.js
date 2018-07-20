OnOffState = Vue.component('on-off-state', {
  props: ['device', 'id'],
  template: `
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" :for="id">
      <input type="checkbox" :id="id" class="mdl-switch__input" checked>
    </label>
  `
})

DivertState = Vue.component('divert-state', {
  props: ['device', 'id'],
  template: `
    <div style="width: 75px;" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <select class="mdl-textfield__input" :id="id">
        <option :value="device.locations[0]">{{ device.locations[0] }}</option>
        <option :value="device.locations[1]">{{ device.locations[1] }}</option>
      </select>
      <label class="mdl-textfield__label" :for="id">Location</label>
    </div>
  `
})

VariableState = Vue.component('variable-state', {
  props: ['device', 'id'],
  template: `
    <div class="mdl-textfield variable-valve-state mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" pattern="-?[0-9]*(\.[0-9]+)?" type="tel" :id="id">
      <label class="mdl-textfield__label" :for="id">State</label>
      <span class="mdl-textfield__error">Needs to be a number</span>
    </div>
  `
})


DeviceState = Vue.component('device-state', {
  props: ['device', 'id'],
  template: `
    <div>
      <on-off-state v-if="device.type == 'onOff'" :id="id" :device="device"></on-off-state>
      <divert-state v-if="device.type == 'divert'" :id="id" :device="device"></divert-state>
      <variable-state v-if="device.type == 'variable'" :id="id" :device="device"></variable-state>
      <on-off-state v-if="device.type == 'pump'" :id="id" :device="device"></on-off-state>
    </div>
  `
})

DeviceControlTable = Vue.component('device-control-table', {
  props: ['devices'],
  methods: {
    id(device) {
      return device.controller_address + '-' + device.address + 'State'
    }
  },
  template: `
    <table class="mdl-data-table full-width mdl-js-data-table mdl-shadow--2dp">
      <thead>
        <tr>
          <th class="mdl-data-table__cell--non-numeric">Name</th>
          <th class="mdl-data-table__cell--non-numeric">State</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in devices">
          <td class="mdl-data-table__cell--non-numeric">{{ device.name }}</td>
          <td class="mdl-data-table__cell--non-numeric">
            <device-state :id="id(device)" :device="device"></device-state>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
