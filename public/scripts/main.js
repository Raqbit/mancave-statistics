let charts = [];

let initialFetch = true;

$(document).ready(() => {
  initCharts();
  initDBListener();
});

function initDBListener() {
  const config = {
    apiKey: "AIzaSyDpVf8H-MxIqeoChmryghVhagskTMKDzuo",
    authDomain: "mancave-statistics.firebaseapp.com",
    databaseURL: "https://mancave-statistics.firebaseio.com",
    storageBucket: "mancave-statistics.appspot.com",
    messagingSenderId: "67467871425"
  };

  firebase.initializeApp(config);

  var ref = firebase.database().ref();
  ref.on('value', gotData, errData);
}

function gotData(data) {
  const value = data.val();

  updateChartConfigs(value);

  if (initialFetch) {
    charts.forEach((chart) => {
      chart.updateAnimation();
    })
    showPage();
    initialFetch = false;
  }
}

function errData(err) {
  console.log(err);
  showSnackbar('An error occurred while fetching the data.', 0);
}

function initCharts(data) {
  charts.push(new CustomChart('msg_chart', msgConfig, 'msgCount'));
  charts.push(new CustomChart('char_chart', charConfig, 'charCount'));
  charts.push(new AverageChart('avg_chart', averageConfig, 'charword'));
  charts.push(new WordChart('word_chart', wordConfig, 'wordCount'));
}

function updateChartConfigs(data) {
  charts.forEach((chart) => {
    if (data[chart.dataName]) {
      // Dataname can be used as key in main data object
      chart.updateChartConfig(data[chart.dataName]);
    } else {
      // Custom data, bit hacky
      if (chart.dataName == 'charword') {
        chart.updateChartConfig({
          charCount: data['charCount'],
          msgCount: data['msgCount']
        });
      }
    }
    chart.updateChart();
  });
}

function showPage() {
  $('#loader')[0].style.display = 'none';
  $('#mainContainer')[0].style.display = 'block';
}

function showSnackbar(content, timeout) {
  let options = {
    content: content,
    timeout: timeout
  }
  $.snackbar(options);
}
