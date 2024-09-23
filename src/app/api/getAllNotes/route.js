import client from '../../../../connectToDatabase';

export async function GET() {
    try {
        const result = await client.query('SELECT * FROM notes ');
        if (result.rows.length) {
            return new Response(JSON.stringify(result.rows), {
                status: 200
            });
        } else {
            return new Response(JSON.stringify('No notes found'), {
                status: 404
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Some error occurred' }), {
            status: 500
        });
    }
}

