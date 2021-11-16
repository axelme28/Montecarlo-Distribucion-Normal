const results = document.getElementById('results');
const min_value = document.getElementById('input_min');
const max_value = document.getElementById('input_max');
const generate = document.getElementById('generate');
const evaluate = document.getElementById('evaluate');
const montecarloRandom = document.getElementById('montecarlo_random');

let graphicGenerated = false;
let maxNormalValue = 0;
let chart;
let values = [];
let intervals = [];
let randomList = [];

generate.addEventListener('click', normalDistribution);
evaluate.addEventListener('click', generateRandom);

function normalDistribution() {
    let randomNumbers = [];
    let min = Number(min_value.value);
    let max = Number(max_value.value);
    if (min < max) {
        let mean = (min + max) / 2;
        let desv = (max - min) / 10;
        let maxIntervals = 30;
        intervals = getIntervals(min, max, maxIntervals);
        for (let i = 0; i < maxIntervals; i++) {
            values.push(0);
        }
        let actualRandom = 0;
        for (let i = 0; i < 10000; i++) {
            actualRandom = randomNormalDistribution(mean, desv);
            randomNumbers.push(actualRandom);
            for (let j = 0; j < (intervals.length)-1; j++) {
                if (actualRandom < intervals[j+1]) {
                    values[j]++;
                    break;
                }
            }
        }
        maxNormalValue = Math.max(...values);
        let title = `Distribución Normal (${min} - ${max})`;
        graphic(intervals, values, title);
        graphicGenerated = true;
        results.innerHTML = `<p><strong>Media: ${mean}</strong></p><p><strong>Desv. Estándar: ${desv}</strong></p>`;
    } else {
        window.alert('El rango de valores es incorrecto');
    }
}

function graphic(intervals, dataList, title) {
    let ctx = document.getElementById('myChart').getContext('2d');
    if (graphicGenerated) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        data: {
            labels: intervals,
            datasets: [{
                type: 'line',
                label: title,
                data: dataList,
                backgroundColor: [
                    'rgba(0, 212, 85, 0.5)'
                ],
                borderColor: [
                    'rgba(0, 212, 85, 1)'
                ],
                borderWidth: 1
            },
            {
                type: 'scatter',
                label: 'Aleatorio',
                data: randomList,
                backgroundColor: [
                    'rgba(214, 0, 37, 0.5)'
                ],
                borderColor: [
                    'rgba(214, 0, 37, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getIntervals(min, max, intervalsQuantity) {
    let intervalList = [];
    let increments = (max - min) / intervalsQuantity;
    for (let i = 0; i < intervalsQuantity; i++) {
        let interval = min+(increments * i);
        intervalList.push(interval.toFixed(3));
    }
    return intervalList;
}

function randomNormalDistribution(mean, standardDeviation) {
    let u1 = 0;
    let u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
	let normalDist = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return mean + standardDeviation * normalDist;
}

function generateRandom() {
    if (graphicGenerated) {
        let min = Number(min_value.value);
        let max = Number(max_value.value);
        let randomX = (Math.random() * (max - min)) + min;
        let randomY = Math.floor(Math.random() * maxNormalValue);
        let interval = 0;
        for (let i = 0; i < (intervals.length)-1; i++) {
            if (randomX < intervals[i+1]) {
                interval = i;
                break;
            }
        }
        if (randomY <= values[interval]) {
            montecarloRandom.innerHTML = `<p><strong>El punto con las coordenadas X:${randomX.toFixed(2)} - Y:${randomY} ESTA dentro de la curva</p></strong>`;
        } else {
            montecarloRandom.innerHTML = `<p><strong>El punto con las coordenadas X:${randomX.toFixed(2)} - Y:${randomY} NO esta dentro de la curva</p></strong>`;
        }

        for (let i = 0; i < values.length; i++) {
            if (i === interval) {
                randomList.push(randomY);
            } else {
                randomList.push(null);
            }
        }
        randomList.push();
        chart.data.datasets[1].data = randomList;
        chart.update();
        randomList = [];
    } else {
        window.alert('Aun no se ha generado un grafico');
    }
}