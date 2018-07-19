TempChartComponent = Vue.component('temp-chart', {
  props: ['thermo'],
  data() {
    return {
      updateInterval: 2
    }
  },
  mounted() {
    this.init();
    this.updater = setInterval(() => {
      this.updateThermo(this.thermo);
    }, this.updateInterval * 1000);
  },
  watch: {
    updateInterval: function() {
      clearInterval(this.updater);
      if (this.updateInterval == 0) {
        return;
      }
      this.updater = setInterval(() => {
        this.updateThermo(this.thermo);
      }, this.updateInterval * 1000)
    }
  },
  methods: {
    init() {
      this.thermo.chart = this.newChart('thermo' + this.thermo.address + 'Chart')
      this.updateThermo(this.thermo);
    },
    updateThermo(thermo) {
      axios.post('/thermo-temps', {
        // Post the location information so python knows where to look for temps
        controller_address: thermo.controller_address,
        address: thermo.address
      }).then(response => {
        // Add the returned data
        this.addData(thermo.chart, response.data);
        // console.log(response);
      }).catch(error => {
        console.log(error);
      })
    },
    newChart(elementId) {
      // Returns a new Chart (Chart.js)
      el = document.getElementById(elementId)
      console.log(this.$refs)
      var ctx = el.getContext('2d');

      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Current Temp',
              data: [],
              tempType: 'pv',
              backgroundColor: colors.invisible,
              borderColor: colors.redBorder,
              borderWidth: 2
            },
            {
              label: 'Target Temp',
              data: [],
              tempType: 'sv',
              backgroundColor: colors.invisible,
              borderColor: colors.blueBorder,
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  'millisecond': 'hh:mm',
                  'second': 'hh:mm',
                  'minute': 'hh:mm',
                  'hour': 'hh:mm',
                  'day': 'hh:mm',
                  'week': 'hh:mm',
                  'month': 'hh:mm',
                  'quarter': 'hh:mm',
                  'year': 'hh:mm',
                }
              }
            }]
          },
          elements: {
            line: {
              tension: 0.1
            }
          }
        }
      });
      return chart;
    },
    addData(chart, data) {
      chart.data.datasets.forEach((dataset) => {
        if (dataset.data.length > 0) {
          dataset.data = dataset.data.slice(Math.max(dataset.data.length - 20, 0))
        }
        if (dataset.tempType == 'pv') {
          dataset.data.push(data.new_pv);
        }

        if (dataset.tempType == 'sv') {
          dataset.data.push(data.new_sv);
        }
      });
      chart.update();
    },
  },
  template: `
    <div class="mdl-card colored-card--bluegrey full-width mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ thermo.name }}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <div class="temp-chart-container">
          <canvas :id="'thermo' + thermo.address + 'Chart'"></canvas>
        </div>
        <h6>Update Interval</h6>
        <input :id="'updateIntervalvalSlider' + thermo.address" v-model="updateInterval" class= "mdl-slider mdl-js-slider" type="range" min="0" max="20" value="2" tabindex="0" >
        <div class="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" :for="'updateIntervalvalSlider' + thermo.address">
          {{ updateInterval }} seconds
        </div>
      </div>
      <div class="mdl-card__menu">
        <button class="mdl-button mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons thermo-power-button">power_settings_new</i>
        </button>
      </div>
    </div>
  `
});

MainHeaderComponent = Vue.component('main-header', {
  data() {
    return {
      configs: [],
      configurationSelect: '',
    }
  },
  methods: {
    getConfigurations() {
      // Get the list of saved configurations to choose from
      axios.get('/configurations').then(response => {
        this.configs = response.data;
      }).catch(error => {
        console.log(error);
      });
    },
  },
  watch: {
    configurationSelect: function() {
      if (configurationSelect != '') {
        this.$emit('select-config', this.configs.filter(x => x.name == this.configurationSelect)[0]);
      }
    }
  },
  mounted() {
    this.getConfigurations();
  },
  template: `
    <header class="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Dashboard</span>
        <div class="mdl-layout-spacer"></div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <select v-model="configurationSelect" class="mdl-textfield__input" id="configurationSelect" name="configurationSelect">
            <option v-for="config in configs" :value="config.name">{{ config.name }}</option>
          </select>
          <label class="mdl-textfield__label" for="configurationSelect">Configuration</label>
        </div>
      </div>
    </header>
  `
})

DrawerComponent = Vue.component('drawer', {
  template: `
  <div class="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
    <nav class="demo-navigation mdl-navigation mdl-color--blue-grey-800">
      <a class="mdl-navigation__link" href="/dashboard">
        <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Dashboard</a>
      <a class="mdl-navigation__link" href="/configure">
        <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">build</i>Configure</a>
      <a class="mdl-navigation__link" href="/procedures">
        <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">sort</i>Procedures</a>
    </nav>
  </div>
  `
})

TimerComponent = Vue.component('timer', {
  data() {
    return {
      sendWhenDone: false,
      timer: null,
      timeRemaining: 'Done.',
      shaking: false,
      hourInput: '',
      minuteInput: '',
      secondInput: '',
    }
  },
  computed: {
    timerInput: function() {
      return this.hourInput + ':' + this.minuteInput + ':' + this.secondInput;
    }
  },
  mounted() {
    this.timer = new Tock({
      countdown: true,
      interval: 1000,
      callback: this.tick,
      complete: this.timerDone,
    });
  },
  methods: {
    resetInputs() {
      this.hourInput = '';
      this.minuteInput = '';
      this.secondInput = '';
    },
    startTimer() {
      this.timer.start(this.timerInput);
      this.resetInputs();
    },
    pauseTimer() {
      if (this.timeRemaining == 'Done.') {
        return false;
      }
      times = this.timeRemaining.split(':');
      this.hourInput = times[0]
      this.minuteInput = times[1]
      this.secondInput = times[2]
      this.timer.stop();
    },
    resetTimer() {
      this.timer.stop()
      this.timeRemaining = 'Done.';
      this.resetInputs();
    },
    timerDone() {
      this.$emit('timer-finish', this.sendWhenDone);
      this.shaking = true;
    },
    tick() {
      // Tick of the timer (Tock callback)
      this.timeRemaining = this.timer.msToTimecode(this.timer.lap());
    },
  },
  template: `
    <div class="full-width mdl-card mdl-shadow--2dp" @mouseover="shaking = false" :class="{ 'shake shake-constant': shaking, }">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text ">
        {{ timeRemaining }}
        </h2>
      </div>
      <div class="mdl-card__supporting-text">
        <div class="mdl-grid">
          <div class= "mdl-cell--3-col">
            <div class="timer-input-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input @keydown.enter="startTimer" v-model="hourInput" class="mdl-textfield__input" pattern="-?[0-9]*(\.[0-9]+)?" type="text" id="hourInput">
              <label class="mdl-textfield__label" for="hourInput">Hours</label>
              <span class="mdl-textfield__error">Needs to be a number</span>
            </div>
          </div>
          <div class="mdl-cell--3-col">
            <div class="timer-input-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input @keydown.enter="startTimer" v-model="minuteInput" class="mdl-textfield__input" pattern="-?[0-9]*(\.[0-9]+)?" type="text" id="minuteInput">
              <label class="mdl-textfield__label" for="minuteInput">Minutes</label>
              <span class="mdl-textfield__error">Needs to be a number</span>
            </div>
          </div>
          <div class="mdl-cell--3-col">
            <div class="timer-input-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input @keydown.enter="startTimer" v-model="secondInput" class="mdl-textfield__input" pattern="-?[0-9]*(\.[0-9]+)?" type="text" id="secondInput">
              <label class="mdl-textfield__label" for="secondInput">Seconds</label>
              <span class="mdl-textfield__error">Needs to be a number</span>
            </div>
          </div>
        </div>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="sendWhenDone">
          <input v-model="sendWhenDone" type="checkbox" id="sendWhenDone" class="mdl-checkbox__input">
          <span class="mdl-checkbox__label">Send Slack Message When Done</span>
        </label>
      </div>
        <div class="mdl-card__actions mdl-card--border">
          <a @click="startTimer" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">play_arrow</i>
          </a>
          <a @click="pauseTimer" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">pause</i>
          </a>
          <a @click="resetTimer" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Clear
          </a>
        </div>
      </div>
    `
})
