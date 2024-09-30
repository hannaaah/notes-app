import { NextRequest } from "next/server";
import client from "../../../../connectToDatabase";

export async function POST(req: NextRequest) {
    try {
        const result = await client.query(`INSERT INTO notes (title, data) VALUES ('Your-title', 'Your-desciption') RETURNING id`);
        const insertedNoteId = result.rows[0].id;
        if (result.rowCount)
            return new Response(JSON.stringify(insertedNoteId), { status: 200 });
        else
            return new Response(JSON.stringify('Could not create note'), { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Some error occurred' }), { status: 500 });
    }
}