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
          <td>{{ tool.desc }}</td>
        </tr>
      </tbody>
    </table>
  `
})
