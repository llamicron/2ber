var chart = new Chartist.Line('.thermo-chart', {
  series: [
    {
      name: 'series-1',
      data: [
        { x: new Date(143134652600), y: 53 },
        { x: new Date(143234652600), y: 40 },
        { x: new Date(143340052600), y: 45 },
      ]
    },
    {
      name: 'series-2',
      data: [
        { x: new Date(143134652600), y: 53 },
        { x: new Date(143234652600), y: 35 },
        { x: new Date(143334652600), y: 30 },
      ]
    }
  ]
}, {
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: 5,
      labelInterpolationFnc: function (value) {
        return moment(value).format('MMM D');
      }
    }
  });
