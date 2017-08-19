let charts = [];

let initialFetch = true;
let showJSON = false;

$(document).ready(() => {
  initCharts();
  initJSON();
  initDBListener();
});

function initDBListener() {
  const config = {
    apiKey: 'AIzaSyDpVf8H-MxIqeoChmryghVhagskTMKDzuo',
    authDomain: 'mancave-statistics.firebaseapp.com',
    databaseURL: 'https://mancave-statistics.firebaseio.com',
    storageBucket: 'mancave-statistics.appspot.com',
    messagingSenderId: '67467871425'
  };

  firebase.initializeApp(config);

  var ref = firebase.database().ref();
  ref.on('value', gotData, errData);
}

function gotData(data) {
  const value = data.val();

  updateGlobalStats(value['global']);
  updateChartConfigs(value);

  updateJSON({
    global: value['global'],
    charCount: value['charCount'],
    msgCount: value['msgCount']
  });

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

function initCharts() {
  charts.push(new CustomChart('msg_chart', msgConfig, 'msgCount'));
  charts.push(new CustomChart('char_chart', charConfig, 'charCount'));
  charts.push(new AverageChart('avg_chart', averageConfig, 'charword'));
  charts.push(new WordChart('word_chart', wordConfig, 'wordCount'));
}

function initJSON() {
  $('#json-toggle-input').change(function () {
    if (this.checked) {
      showJSON = true;
      $('#json_hidden_txt')[0].style.display = 'none';
      $('#json_highlight_container')[0].style.display = 'block';
    } else {
      showJSON = false;
      $('#json_hidden_txt')[0].style.display = 'block';
      $('#json_highlight_container')[0].style.display = 'none';
    }
  });
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

function updateJSON(data) {
  const code = JSON.stringify(data, null, 2);
  const html = Prism.highlight(code, Prism.languages.json);
  $('#json_highlight')[0].innerHTML = html;
}

function updateGlobalStats(globalStats) {
  $('#stat_global_msg')[0].innerHTML = globalStats['msgCount'];
  $('#stat_global_char')[0].innerHTML = globalStats['charCount'];
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
