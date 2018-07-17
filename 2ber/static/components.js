TempChartComponent = Vue.component('temp-chart', {
  props: ['thermo'],
  data() {
    return {

    }
  },
  mounted() {
    this.init();
    setInterval(() => {
      this.updateThermo(this.thermo);
    }, 2000);
  },
  methods: {
    init() {
      this.thermo.chart = this.newChart('thermo' + this.thermo.address + 'Chart')
      this.updateThermo(this.thermo);
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
  template: "<div class=\"mdl-card colored-card--bluegrey full-width mdl-shadow--2dp\">\
      <div class=\"mdl-card__title\">\
        <h2 class=\"mdl-card__title-text\">{{ thermo.name }}</h2>\
      </div>\
      <div class=\"mdl-card__supporting-text\">\
        <div class=\"temp-chart-container\">\
          <canvas :id=\"'thermo' + thermo.address + 'Chart'\"></canvas>\
        </div>\
      </div>\
      <div class=\"mdl-card__menu\">\
        <button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">\
          <i class=\"material-icons thermo-power-button\">power_settings_new</i>\
        </button>\
      </div>\
    </div>"
})
