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
  updateRaw(value);

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
  charts.push(new WordChart('word_chart', wordConfig, 'wordCount'));
}

function updateChartConfigs(data) {
  charts.forEach((chart) => {
    chart.updateChartConfig(data[chart.dataName]);
    chart.updateChart();
  })
}

function updateRaw(data) {
  var html = Prism.highlight(JSON.stringify(data, null, 2), Prism.languages.json);
  $('#json').empty();
  $('#json').append(html);
}

function showPage() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
}

function showSnackbar(content, timeout) {
  let options = {
    content: content,
    timeout: timeout
  }
  $.snackbar(options);
}
