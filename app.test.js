const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
	test('It should response the GET method', (done) => {
		request(app).get('/').then((response) => {
			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBeDefined();
			done();
		});
	});
});

describe('Test to find treasure within 1/10Km', () => {
	test('It should response the POST method', (done) => {
		request(app)
			.post('/find_treasure')
			.send({
				latitude: '1.3273451',
				longitude: '103.8756757',
				distance: '10'
			})
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.status).toBeTruthy();
				expect(response.body.data).toBeDefined();
				done();
			});
	});
});

describe('Test to find treasure within 1/10Km with prize value greater than or equal to $15', () => {
	test('It should response the POST method', (done) => {
		request(app)
			.post('/find_treasure')
			.send({
				latitude: '1.3273451',
				longitude: '103.8756757',
				distance: '1',
				prize_value: '10'
			})
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.status).toBeTruthy();
				expect(response.body.data).toBeDefined();
				done();
			});
	});
});

describe('Test to find biggest treasure near me', () => {
	test('It should response the POST method', (done) => {
		request(app)
			.post('/find_biggest_treasure_near_me')
			.send({
				latitude: '1.3273451',
				longitude: '103.8756757'
			})
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toBeDefined();
				expect(response.body.status).toBeDefined();
				done();
			});
	});
});

describe('Test to find biggest treasure near me with in valid request', () => {
	test('It should response the POST method', (done) => {
		request(app)
			.post('/find_biggest_treasure_near_me')
			.send({
				latitude: '1.3273451'
			})
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.status).toBeFalsy();
				expect(response.body.message).toBeDefined();
				done();
			});
	});
});
