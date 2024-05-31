const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/correlations', async (req, res) => {
	res.sendFile(__dirname + '/correlations.html');
});

app.get('/coefficients', async (req, res) => {
	const data = await queryBetweenDate(req.query.from, req.query.to);
	const series = [
		data.map((d) => d.indoor_temperature),
		data.map((d) => d.indoor_humidity),
		data.map((d) => d.outdoor_temperature),
		data.map((d) => d.outdoor_humidity),
	]

	const coefficientData = {
		labels: ['indoor_temperature', 'indoor_humidity', 'outdoor_temperature', 'outdoor_humidity'],
		coefficients: series.map((s) => {
			return series.map((ss) => {
				return coefficient(s, ss);
			});
		})
	}

	res.json(coefficientData);
});

app.get('/dtw', async (req, res) => {
	const data = await queryBetweenDate(req.query.from, req.query.to);
	const series = [
		data.map((d) => d.indoor_temperature),
		data.map((d) => d.indoor_humidity),
		data.map((d) => d.outdoor_temperature),
		data.map((d) => d.outdoor_humidity),
	]

	const dtwData = {
		labels: ['indoor_temperature', 'indoor_humidity', 'outdoor_temperature', 'outdoor_humidity'],
		dtw: series.map((s) => {
			return series.map((ss) => {
				return dtw(normalize(s), normalize(ss));
			});
		})
	}

	res.json(dtwData);
});

app.get('/data', async (req, res) => {
	const data = await queryBetweenDate(req.query.from, req.query.to);
	res.json(data);
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

const queryBetweenDate = async (from, to) => {
	const data = await prisma.environment.findMany({
		where: {
			timestamp: {
				gte: new Date(from),
				lte: new Date(to),
			},
		},
	});
	return data;
}

const normalize = (data) => {
	const min = Math.min(...data);
	const max = Math.max(...data);
	return data.map((d) => (d - min) / (max - min));
}

// pearson correlation coefficient
const coefficient = (x, y) => {
	const n = x.length;
	const meanX = x.reduce((a, b) => a + b) / n;
	const meanY = y.reduce((a, b) => a + b) / n;
	const diffX = x.map((xi) => xi - meanX);
	const diffY = y.map((yi) => yi - meanY);
	const sumXY = diffX.map((d, i) => d * diffY[i]).reduce((a, b) => a + b);
	const sumX2 = diffX.map((d) => d * d).reduce((a, b) => a + b);
	const sumY2 = diffY.map((d) => d * d).reduce((a, b) => a + b);
	const r = sumXY / Math.sqrt(sumX2 * sumY2);
	return r;
}

// Dynamic Time Warping
const dtw = (x, y) => {
	const n = x.length;
	const m = y.length;
	const dist = Array.from({ length: n + 1 }, () => Array.from({ length: m + 1 }, () => Infinity));
	dist[0][0] = 0;
	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= m; j++) {
			const cost = Math.abs(x[i - 1] - y[j - 1]);
			dist[i][j] = cost + Math.min(dist[i - 1][j], dist[i][j - 1], dist[i - 1][j - 1]);
		}
	}
	return dist[n][m];
}