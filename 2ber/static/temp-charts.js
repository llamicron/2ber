var ctx = document.getElementById("tempChart").getContext('2d');
var tempChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [new Date().toLocaleTimeString()],
    datasets: [
      {
        label: 'Actual Temperature ( ˚ F)',
        data: [100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      },
      {
        label: "Target Temperature",
        data: [100, 100],
      }
    ]
  }
});
