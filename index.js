const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
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