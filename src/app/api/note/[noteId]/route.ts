import { NextRequest } from 'next/server';
import { Note } from '../../../../../constants';
import client from '../../../../../connectToDatabase';

export async function POST(req: NextRequest, { params }: { params: { noteId: string } }) {
    try {
        const noteId = Number(params.noteId);
        const result = await client.query(`INSERT INTO notes (id, title, data) VALUES ($1, 'Your-title', 'Your-desciption')`, [noteId]);
        if (result.rowCount)
            return new Response(JSON.stringify(`Inserted note ${noteId}`), { status: 200 });
        else
            return new Response(JSON.stringify('Could not create note'), { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Some error occurred' }), { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { noteId: string } }) {
    try {
        const noteId = Number(params.noteId);
        const noteToBeUpdated: Note = await req.json();
        const result = await client.query(`UPDATE notes SET title=$1, data=$2, date=$3 WHERE id = $4`,
            [noteToBeUpdated.title, noteToBeUpdated.data, noteToBeUpdated.date, noteId]);
        if (result.rowCount)
            return new Response(JSON.stringify(`Updated note ${params.noteId}`), { status: 200 });
        else
            return new Response(JSON.stringify('Could not find note'), { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Some error occurred' }), { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { noteId: string } }) {
    try {
        const noteId = Number(params.noteId);
        const result = await client.query(`DELETE FROM notes WHERE id = $1`, [noteId]);
        if (result.rowCount)
            return new Response(JSON.stringify(`Deleted note ${params.noteId}`), { status: 200 });
        else
            return new Response(JSON.stringify('Could not find note'), { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Some error occurred' }), { status: 500 });
    }
}
