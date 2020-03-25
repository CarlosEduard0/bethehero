const database = require('../database/database');

module.exports = {
    async create(request, response) {
        const {id} = request.body;

        if (!id) {
            return response.status(400).send();
        }

        const ong = await database('ongs').where('id', id).select('name').first();

        if (!ong) {
            return response.status(400).send();
        }

        return response.json(ong);
    }
}