const mysql = require('mysql');

// Create DB connection
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'nodemysql'
});

//Create DB connection
(async () => {
	try {
		await new Promise((resolve, reject) => {
			db.connect((err) => {
				return err ? reject(err) : resolve(true);
			});
		});
	} catch (err) {
		console.log('DB connection failed');
	}
})();

function run_query(sql, options = false) {
	return new Promise((resolve) => {
		//for options query like insert etc.
		if (options) {
			db.query(sql, options, (err, result) => {
				if (err) {
					resolve({
						status: false,
						error: err
					});
				} else {
					resolve({
						status: true,
						result: result
					});
				}
			});
		} else {
			//for regualr query without options
			db.query(sql, (err, result) => {
				if (err) {
					resolve({
						status: false,
						error: err
					});
				} else {
					resolve({
						status: true,
						result: result
					});
				}
			});
		}
	});
}

module.exports = {
	run_query: run_query
};
