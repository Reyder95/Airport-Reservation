const genericGetResponse = (error, results, response) => {
	if (error) {
		response.status(400).json({
			error: 'Database error!'
		});
	}
	else
	{
		response.status(200).json(results);
	}
}

const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
}

const basicFunctions = {
    genericGetResponse,
    isValidDate
}

export default basicFunctions;
