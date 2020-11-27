const express = require('express');
const DB = require('./db');
const { validateFindTreasureRequest, validateBonusApi } = require('./middlewares');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send({ message: 'API works' });
});

// Create DB
app.get('/create_tables', async (req, res) => {
	console.log(' create_tables ');

	let tables_created = [];
	let tables_failed = [];

	var create_treasures_table_sql =
		'CREATE TABLE treasures(id INT UNSIGNED PRIMARY KEY, latitude DECIMAL(10, 8) NOT NULL, longitude DECIMAL(11, 8) NOT NULL, name VARCHAR(8))';

	var query_resp = await DB.run_query(create_treasures_table_sql);
	if (query_resp.status) {
		// console.log(query_resp.result);
		tables_created.push('treasures');

		//insert treasures sample data
		let dataArr = [
			[ 100, 1.33125924, 103.8980486, 'T1' ],
			[ 101, 1.32255754, 103.8943086, 'T2' ],
			[ 102, 1.3166356, 103.8891225, 'T3' ],
			[ 103, 1.31286055, 103.8545565, 'T4' ],
			[ 104, 1.34439896, 103.8765938, 'T5' ],
			[ 105, 1.33616189, 103.8770866, 'T6' ],
			[ 106, 1.32552844, 103.8691014, 'T7' ],
			[ 107, 1.32303589, 103.8774815, 'T8' ],
			[ 108, 1.33465304, 103.870449, 'T9' ],
			[ 109, 1.32606138, 103.8793007, 'T10' ],
			[ 110, 1.25886946, 103.898879, 'T11' ],
			[ 111, 1.26973345, 103.8810448, 'T12' ],
			[ 112, 1.32914713, 103.8334781, 'T13' ],
			[ 113, 1.32960595, 103.8807937, 'T14' ],
			[ 114, 1.33700251, 103.8492249, 'T15' ],
			[ 115, 1.27845714, 103.8571762, 'T16' ],
			[ 116, 1.36019784, 103.8563582, 'T17' ],
			[ 117, 1.31551921, 103.8632839, 'T18' ]
		];

		insert_sql = 'INSERT INTO treasures (id, latitude, longitude, name) VALUES ?';

		let query_resp = await DB.run_query(insert_sql, [ dataArr ]);
		if (query_resp.status) {
			console.log('treasures sample data inserted');
		} else {
			console.log('an error occured while inserting treasures sample data');
			console.log(query_resp.error);
		}
	} else {
		// console.log(query_resp.error);
		tables_failed.push('treasures');
	}

	var create_users_table_sql =
		'CREATE TABLE users(id INT UNSIGNED PRIMARY KEY, name VARCHAR(30), age INT(3) UNSIGNED, password VARCHAR(20), email VARCHAR(50))';

	var query_resp = await DB.run_query(create_users_table_sql);
	if (query_resp.status) {
		// console.log(query_resp.result);
		tables_created.push('users');

		//insert users sample data
		let dataArr = [
			[ 3000, 'U1', 21, 'luckyshine001', 'u1@luckyshine.xyz' ],
			[ 3001, 'U2', 51, 'luckyshine002', 'u2@luckyshine.xyz' ],
			[ 3002, 'U3', 31, 'luckyshine003', 'u1@luckyshine.xyz' ],
			[ 3003, 'U4', 18, 'luckyshine004', 'u2@luckyshine.xyz' ],
			[ 3004, 'U5', 21, 'luckyshine005', 'u1@luckyshine.xyz' ],
			[ 3005, 'U6', 35, 'luckyshine006', 'u2@luckyshine.xyz' ]
		];

		insert_sql = 'INSERT INTO users (id, name, age, password, email) VALUES ?';

		let query_resp = await DB.run_query(insert_sql, [ dataArr ]);
		if (query_resp.status) {
			console.log('users sample data inserted');
		} else {
			console.log('an error occured while inserting users sample data');
			console.log(query_resp.error);
		}
	} else {
		// console.log(query_resp.error);
		tables_failed.push('users');
	}

	var create_money_values_table_sql = 'CREATE TABLE money_values(treasure_id INT UNSIGNED, amt INT(2))';

	var query_resp = await DB.run_query(create_money_values_table_sql);
	if (query_resp.status) {
		// console.log(query_resp.result);
		tables_created.push('money_values');

		//insert money_values sample data
		let dataArr = [
			[ 100, 15 ],
			[ 101, 10 ],
			[ 102, 15 ],
			[ 103, 15 ],
			[ 104, 10 ],
			[ 105, 15 ],
			[ 106, 15 ],
			[ 107, 10 ],
			[ 108, 15 ],
			[ 109, 15 ],
			[ 110, 10 ],
			[ 111, 15 ],
			[ 112, 15 ],
			[ 113, 10 ],
			[ 114, 15 ],
			[ 115, 15 ],
			[ 116, 10 ],
			[ 117, 15 ],
			[ 100, 20 ],
			[ 101, 25 ],
			[ 102, 20 ],
			[ 103, 25 ],
			[ 107, 30 ],
			[ 108, 30 ],
			[ 109, 30 ]
		];

		insert_sql = 'INSERT INTO money_values (treasure_id, amt) VALUES ?';

		let query_resp = await DB.run_query(insert_sql, [ dataArr ]);
		if (query_resp.status) {
			console.log('money_values sample data inserted');
		} else {
			console.log('an error occured while inserting money_values sample data');
			console.log(query_resp.error);
		}
	} else {
		// console.log(query_resp.error);
		tables_failed.push('money_values');
	}

	res.send({
		tables_created_count: tables_created.length,
		tables_created: tables_created,
		tables_failed_count: tables_failed.length,
		tables_failed: tables_failed
	});
});

// Find treasures
app.post('/find_treasure', validateFindTreasureRequest, async (req, res) => {
	let lat = req.body.latitude;
	let long = req.body.longitude;
	let dist = req.body.distance;
	let prize_value =
		typeof req.body.prize_value != 'undefined' && req.body.prize_value != '' ? req.body.prize_value : '';

	if (prize_value != '') {
		var find_treasures_sql =
			'SELECT *, MIN(mv.amt) FROM( SELECT *,(((acos(sin((' +
			lat +
			'*pi()/180)) * sin((latitude*pi()/180))+cos((' +
			lat +
			'*pi()/180)) * cos((latitude*pi()/180)) * cos(((' +
			long +
			' - longitude)*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM treasures) t JOIN money_values as mv WHERE (mv.treasure_id = t.id AND mv.amt >= ' +
			prize_value +
			') AND distance <= ' +
			dist;
	} else {
		var find_treasures_sql =
			'SELECT * FROM( SELECT *,(((acos(sin((' +
			lat +
			'*pi()/180)) * sin((latitude*pi()/180))+cos((' +
			lat +
			'*pi()/180)) * cos((latitude*pi()/180)) * cos(((' +
			long +
			' - longitude)*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM treasures) t WHERE distance <= ' +
			dist;
	}

	// console.log(find_treasures_sql);

	var query_resp = await DB.run_query(find_treasures_sql);
	if (query_resp.status) {
		res.send({
			status: true,
			data: query_resp.result
		});
	} else {
		res.send({
			status: false,
			message: query_resp.error
		});
	}
});
// End Find treasures

/* ********* Bonus API (find biggest treasure near me) ************** */
app.post('/find_biggest_treasure_near_me', validateBonusApi, async (req, res) => {
	let lat = req.body.latitude;
	let long = req.body.longitude;

	var find_treasures_sql =
		'SELECT *, MAX(mv.amt), MIN(distance) FROM( SELECT *,(((acos(sin((' +
		lat +
		'*pi()/180)) * sin((latitude*pi()/180))+cos((' +
		lat +
		'*pi()/180)) * cos((latitude*pi()/180)) * cos(((' +
		long +
		' - longitude)*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM treasures) t1 JOIN money_values as mv WHERE mv.treasure_id = t1.id';

	// console.log(find_treasures_sql);

	var query_resp = await DB.run_query(find_treasures_sql);
	if (query_resp.status) {
		res.send({
			status: true,
			data: query_resp.result
		});
	} else {
		res.send({
			status: false,
			message: query_resp.error
		});
	}
});
/* ********* End Bonus API ((find biggest treasure near me)) ********** */

module.exports = app;
