const fs = require('fs')
const path = require('path')
const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

const getCsvData = (filename) => {
	const csvPath = path.join(__dirname, '.', filename + '.csv');
	const csv = fs.readFileSync(csvPath, "utf-8");

	const rowData = [];

	var allRows = csv.split(/\r?\n/);
	for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
		var data = allRows[singleRow].split(',');
		var rowCells = {
			temperature: parseInt(data[5]),
			humidity: parseInt(data[6]),
			timestamp: new Date(data[7]),
		}
		rowData.push(rowCells);
	}
	return rowData;
}

const validation = (data) => {
	let flag = true;
	for (let i = 0; i < data.length; i++) {
		if (i > 0 && data[i].timestamp.getHours() - data[i - 1].timestamp.getHours() > 1) {
			console.log(data[i - 1].timestamp, data[i].timestamp);
			flag = false;
		}
	};
	return flag;
}

console.log(validation(getCsvData('preprocessed')));

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