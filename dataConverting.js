const fs = require('fs')
const path = require('path')
const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

const getCsvData = (filename, dateIndex) => {
	const csvPath = path.join(__dirname, '.', filename + '.csv');
	const csv = fs.readFileSync(csvPath, "utf-8");

	const rowData = [];

	var allRows = csv.split(/\r?\n/);
	for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
		var data = allRows[singleRow].split(',');
		data.push(new Date(data[dateIndex]));
		rowData.push(data);
	}
	return rowData;
}

const joinData = () => {
	let joinedData = [];
	const kmaWeatherData = getCsvData('kma_weather', 2);
	const indoorData = getCsvData('data', 7);
	// join data if time delta is less than 10 minutes
	for (let i = 0; i < kmaWeatherData.length; i++) {
		for (let j = 0; j < indoorData.length; j++) {
			if (Math.abs(new Date(kmaWeatherData[i][5]).getTime() - new Date(indoorData[j][8]).getTime()) < 600000) {
				joinedData.push({
					indoor_temperature: indoorData[j][5],
					indoor_humidity: indoorData[j][6],
					outdoor_temperature: kmaWeatherData[i][3],
					outdoor_humidity: kmaWeatherData[i][4],
					timestamp: new Date(kmaWeatherData[i][5]),
				});
			}
		}
	}
	return joinedData;
}

console.log(joinData());

async function main() {
	await prisma.data.deleteMany();
	const data = await prisma.environment.createMany({
		data: getCsvData('data'),
		skipDuplicates: true,
	});
}

// main()
// 	.catch((e) => {
// 		console.error(e.message);
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});