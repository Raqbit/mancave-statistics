class CustomChart {

    constructor(canvasId, config, dataName) {
        this.ctx = $('#' + canvasId)[0].getContext('2d');
        this.config = config;
        this.dataName = dataName;

        this.chart = new Chart(this.ctx, this.config);

        this.updateChart();
    }

    updateChartConfig(data) {
        const values = Object.values(data);
        const labels = Object.keys(data);

        this.config.data.datasets[0].data = values;
        this.config.data.labels = labels;

        for (let i = 0; i < labels.length; i++) {
            this.config.data.datasets[0].backgroundColor[i] = randomColor({ seed: labels[i], format: 'rgb' });
        }
    }

    updateChart() {
        this.chart.update();
    }

    updateAnimation() {
        this.config.options.animation.duration = 2000;
    }
}

class WordChart extends CustomChart {

    updateChartConfig(data) {
        const hashes = Object.keys(data);

        hashes.sort((a, b) => {
            const a_score = data[a].score;
            const b_score = data[b].score;
            return b_score - a_score;
        });

        let labels = [];
        let scores = [];

        for (let i = 0; i < 10; i++) {
            labels.push(data[hashes[i]].word);
            scores.push(data[hashes[i]].score);
        }

        this.config.data.datasets[0].data = scores;
        this.config.data.labels = labels;

        for (let i = 0; i < labels.length; i++) {
            this.config.data.datasets[0].backgroundColor[i] = randomColor({ seed: labels[i], format: 'rgb' });
        }
    }

}

class AverageChart extends CustomChart {

    updateChartConfig(data) {
        const msgCount = data['msgCount'];
        const charCount = data['charCount'];

        const usernames = Object.keys(msgCount);

        let scores = [];

        for (let i = 0; i < usernames.length; i++) {
            scores[i] = (charCount[usernames[i]] / msgCount[usernames[i]]).toFixed(2);
            this.config.data.datasets[0].backgroundColor[i] = randomColor({ seed: usernames[i], format: 'rgb' });
        }

        this.config.data.datasets[0].data = scores;
        this.config.data.labels = usernames;
    }
}