const from = document.getElementById('from');
const to = document.getElementById('to');
const x_axis = document.getElementById('x_axis_selector');
const y_axis = document.getElementById('y_axis_selector');
const normalize_button = document.getElementById('normalize');
const correlation = document.getElementById('correlation');
const tab_selector = document.getElementById('tab_selector');
from.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value, x_axis.value, y_axis.value, normalize_button.selected);
});

to.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value, x_axis.value, y_axis.value, normalize_button.selected);
});

x_axis.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value, x_axis.value, y_axis.value, normalize_button.selected);
});

y_axis.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value, x_axis.value, y_axis.value, normalize_button.selected);
});

normalize_button.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value, x_axis.value, y_axis.value, normalize_button.selected);
});

tab_selector.addEventListener('change', (event) => {
	if (event.target.activeTabIndex === 0) {
		location.href = '/';
	} else if (event.target.activeTabIndex === 1) {
		location.href = '/correlations';
	}
});
const createChart = async (from, to, x_axis, y_axis, normalizeOption = false) => {
	const response = await fetch(`/data?from=${from}&to=${to}`);
	const data = await response.json();

	let x;
	let y;

	if (x_axis === 'indoor_temperature') {
		x = data.map((d) => d.indoor_temperature);
	} else if (x_axis === 'indoor_humidity') {
		x = data.map((d) => d.indoor_humidity);
	} else if (x_axis === 'outdoor_temperature') {
		x = data.map((d) => d.outdoor_temperature);
	} else if (x_axis === 'outdoor_humidity') {
		x = data.map((d) => d.outdoor_humidity);
	}

	if (y_axis === 'indoor_temperature') {
		y = data.map((d) => d.indoor_temperature);
	} else if (y_axis === 'indoor_humidity') {
		y = data.map((d) => d.indoor_humidity);
	} else if (y_axis === 'outdoor_temperature') {
		y = data.map((d) => d.outdoor_temperature);
	} else if (y_axis === 'outdoor_humidity') {
		y = data.map((d) => d.outdoor_humidity);
	}

	if (normalizeOption) {
		x = normalize(x);
		y = normalize(y);
	}

	const coefficientResponse = await fetch(`/coefficients?from=${from}&to=${to}`);
	const coefficientData = await coefficientResponse.json();

	const coefficient = coefficientData.coefficients[coefficientData.labels.indexOf(x_axis)][coefficientData.labels.indexOf(y_axis)];

	correlation.innerHTML = `Correlation: ${coefficient}`;

	const options = {
		series: [
			{
				name: "Scatter",
				type: 'scatter',
				data: x.map((d, i) => [d, y[i]])
			},
			{
				name: "Line",
				type: 'line',
				data: x.map((d, i) => [d, d * coefficient])
			}
		],
		chart: {
			type: 'line',
			height: 700
		},
		markers: {
			size: [6, 0]
		},
		xaxis: {
			title: {
				text: x_axis
			},
			type: 'numeric',
			min: normalizeOption ? 0 : Math.min(...x),
			max: normalizeOption ? 1 : Math.max(...x),
			tickAmount: 10
		},
		yaxis: {
			title: {
				text: y_axis
			},
			type: 'numeric',
			min: normalizeOption ? 0 : Math.min(...y),
			max: normalizeOption ? 1 : Math.max(...y)
		}
	}

	const chart = new ApexCharts(document.getElementById('chart'), options);
	chart.render();
}

const normalize = (data) => {
	const min = Math.min(...data);
	const max = Math.max(...data);
	return data.map((d) => (d - min) / (max - min));
}

createChart(from.value, to.value, "indoor_temperature", "indoor_temperature", normalize_button.selected);