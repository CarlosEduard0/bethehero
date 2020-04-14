const database = require('../database/database');

module.exports = {
    async index(request, response) {
        const { page = 1, ong_id } = request.query;

        const [count] = await database('incidents').count();
        let incidents = [];

        if (ong_id) {
            incidents = await database('incidents').where('ong_id', ong_id).select('*');
        } else {
            incidents = await database('incidents')
                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                .limit(5)
                .offset((page - 1) * 5)
                .select([
                    'incidents.*',
                    'ongs.name',
                    'ongs.email',
                    'ongs.whatsapp',
                    'ongs.city',
                    'ongs.uf'
                ]);
        }

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const {title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const ong = await database('ongs').where('id', ong_id).first('*');

        if (!ong) {
            return response.status(401).send();
        }

        const [id] = await database('incidents').insert({
            title,
            description,
            value,
            ong_id
        }).returning('id');

        return response.json({id});
    },

    async delete(request, response) {
        const {id} = request.params;
        const ong_id = request.headers.authorization;

        const incident = await database('incidents').where('id', id).select('ong_id').first();

        if (incident === undefined) {
            return response.status(404).send();
        }

        if (incident.ong_id !== ong_id) {
            return response.status(401).send();
        }

        await database('incidents').where('id', id).delete();

        return response.status(200).send();
    }
}