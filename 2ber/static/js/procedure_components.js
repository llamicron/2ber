ToolItemList = Vue.component('tool-item-list', {
  props: ['tools'],
  template: `
    <table class="mdl-data-table full-width mdl-js-data-table mdl-shadow--2dp">
      <thead>
        <tr>
          <th class="mdl-data-table__cell--non-numeric">Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tool in tools" @click="$emit('clicked', Object.assign(tool))">
          <td class="mdl-data-table__cell--non-numeric">{{ tool.name }}</td>
          <td>{{ tool.proc_desc }}</td>
        </tr>
      </tbody>
    </table>
  `
})

ThermoInput = Vue.component('thermo-input', {
  props: ['thermo'],
  methods: {
    id() {
      return this.thermo.controller_address + '-' + this.thermo.address;
    }
  },
  template: `
    <div style="width: 200px" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="thermo.newTemp" class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" :id="id(thermo) + 'NewTemp'">
      <label class="mdl-textfield__label" :for="id(thermo) + 'NewTemp'">New Temp</label>
      <span class="mdl-textfield__error">Needs to be a number</span>
    </div>
  `
})

ToolInput = Vue.component('tool-input', {
  props: ['tool'],
  methods: {
    id() {
      return this.tool.id + 'Input';
    },
  },
  // This pattern on the input is a nightmare
  template: `
    <div style="width: 200px" v-if="tool.name != 'Wait'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="tool.value" :pattern="tool.name == 'Sleep' ? '\\\\d\\\\d:\\\\d\\\\d:\\\\d\\\\d' : '.+'" class="mdl-textfield__input" type="text" :id="id">
      <label class="mdl-textfield__label" :for="id">Value</label>
      <span class="mdl-textfield__error">Needs to be in the format 00:00:00</span>
    </div>
  `
});
