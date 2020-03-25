const database = require('../database/database');

module.exports = {
    async index(request, response) {
        const { page = 1, ong_id } = request.query;

        const [count] = await database('incidents').count();

        const incidents = await database('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .where((qb) => {
                if (ong_id) {
                    qb.where('incidents.ong_id', ong_id);
                }
            })
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

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const {title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await database('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

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

        await connection('incidents').where('id', id).delete();

        return response.status(200).send();
    }
}