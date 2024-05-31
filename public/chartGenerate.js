const from = document.getElementById('from');
const to = document.getElementById('to');
from.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value);

	document.getElementById('heatmap').innerHTML = '';
	createHeatmap(from.value, to.value);
});

to.addEventListener('change', () => {
	document.getElementById('chart').innerHTML = '';
	createChart(from.value, to.value);

	document.getElementById('heatmap').innerHTML = '';
	createHeatmap(from.value, to.value);
});

const createChart = async (from, to) => {
	const response = await fetch(`/data?from=${from}&to=${to}`);
	const data = await response.json();

	const indoor_temperature = data.map(d => d.indoor_temperature);
	const indoor_humidity = data.map(d => d.indoor_humidity);
	const outdoor_temperature = data.map(d => d.outdoor_temperature);
	const outdoor_humidity = data.map(d => d.outdoor_humidity);
	const timestamp = data.map(d => d.timestamp);

	var options = {
		series: [
			{
				name: 'Indoor Temperature',
				data: indoor_temperature
			},
			{
				name: 'Indoor Humidity',
				data: indoor_humidity
			},
			{
				name: 'Outdoor Temperature',
				data: outdoor_temperature
			},
			{
				name: 'Outdoor Humidity',
				data: outdoor_humidity
			}
		],
		chart: {
			height: 400,
			type: 'line',
		},
		stroke: {
			width: 5,
			curve: 'smooth'
		},
		xaxis: {
			type: 'datetime',
			categories: timestamp,
			tickAmount: 10,
			labels: {
				formatter: function (value, timestamp, opts) {
					return opts.dateFormatter(new Date(timestamp), 'dd MMM')
				}
			}
		},
		title: {
			text: 'Classroom Environment',
			align: 'left',
			style: {
				fontSize: "16px",
				color: '#666'
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#FDD835'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		}
	};
	var chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();
}
createChart(from.value, to.value);

const createHeatmap = async (from, to) => {
	const response = await fetch(`/coefficients?from=${from}&to=${to}`);
	const data = await response.json();

	const series = [];
	for (let i = 0; i < data.labels.length; i++) {
		series.push({
			name: data.labels[i],
			data: data.coefficients[i]
		});
	}

	const options = {
		series: series,
		chart: {
			height: 400,
			type: 'heatmap',
		},
		plotOptions: {
			heatmap: {
				colorScale: {
					ranges: [{
						from: -1,
						to: -0.7,
						name: 'Negative Very High',
						color: '#ff0000'
					},
					{
						from: -0.7,
						to: -0.3,
						name: 'Negative High',
						color: '#ff5252'
					},
					{
						from: -0.3,
						to: -0.1,
						name: 'Negative Low',
						color: '#ffa9a9'
					},
					{
						from: -0.1,
						to: 0.1,
						name: 'Neutral',
						color: '#ffffff'
					},
					{
						from: 0.1,
						to: 0.3,
						name: 'Positive Low',
						color: '#a8a8ff'
					},
					{
						from: 0.3,
						to: 0.7,
						name: 'Positive High',
						color: '#5757ff'
					},
					{
						from: 0.7,
						to: 1,
						name: 'Positive Very High',
						color: '#0000ff'
					}
					]
				}
			}
		},
		xaxis: {
			categories: data.labels
		},
		dataLabels: {
			enabled: false
		},
		title: {
			text: 'Correlation Coefficients',
			align: 'left',
			style: {
				fontSize: "16px",
				color: '#666'
			}
		}
	};

	var heatmap = new ApexCharts(document.querySelector("#heatmap"), options);
	heatmap.render();
}
createHeatmap(from.value, to.value);