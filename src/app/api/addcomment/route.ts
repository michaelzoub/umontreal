import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/app/utils/mongo";
import { ObjectId } from 'mongodb';
import { NextComponentType } from "next";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { db } = await connectToDatabase()
        const collection = db.collection("Comments")
        const find = await collection.findOne({ _id: body.id })
        const date = new Date().toISOString().split('T')[0]
        if (!find) {
            console.log("Not found in db")
            await collection.insertOne({
                _id: body.id,
                details: [{comment: body.comment, date: date}]
            })
        } else {
            console.log("else clause")
            await collection.updateOne(
                {_id: body.id},
                { $push: { details: {comment: body.comment, date: date} } }
            )
        }
        return NextResponse.json({ status: "Ok" })
    } catch (error) {
        return NextResponse.json({ status: "Error" })
    }
}