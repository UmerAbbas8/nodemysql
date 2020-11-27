const joi = require('joi');
const { isLatitude, isLongitude } = require('./helper');

async function validateFindTreasureRequest(req, res, next) {
	const findTreasureSchema = joi.object({
		latitude: joi
			.number()
			.custom((value, helper) => {
				if (isLatitude(value)) {
					return true;
				} else {
					return helper.message('Must be a valid latitude');
				}
			})
			.required(),
		longitude: joi
			.number()
			.custom((value, helper) => {
				if (isLongitude(value)) {
					return true;
				} else {
					return helper.message('Must be a valid longitude');
				}
			})
			.required(),
		distance: joi.number().integer().valid(1, 10).required(),
		prize_value: joi.number().integer().min(10).max(30)
	});

	const value = findTreasureSchema.validate(req.body);
	if (value.error) {
		res.json({
			status: false,
			message: value.error.details[0].message
		});
	} else {
		next();
	}
}

async function validateBonusApi(req, res, next) {
	const findTreasureSchema = joi.object({
		latitude: joi
			.number()
			.custom((value, helper) => {
				if (isLatitude(value)) {
					return true;
				} else {
					return helper.message('Must be a valid latitude');
				}
			})
			.required(),
		longitude: joi
			.number()
			.custom((value, helper) => {
				if (isLongitude(value)) {
					return true;
				} else {
					return helper.message('Must be a valid longitude');
				}
			})
			.required()
	});

	const value = findTreasureSchema.validate(req.body);
	if (value.error) {
		res.send({
			status: false,
			message: value.error.details[0].message
		});
	} else {
		next();
	}
}

module.exports = {
	validateFindTreasureRequest: validateFindTreasureRequest,
	validateBonusApi: validateBonusApi
};
