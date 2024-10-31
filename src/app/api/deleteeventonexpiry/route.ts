import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongo";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { db } = await connectToDatabase()
        const collection = await db.collection("Events")
        const collectionGeoloc = await db.collection("Geoloc")
        await collection.deleteMany({ _id: { $in: body } })
        await collectionGeoloc.deleteMany({ _id: { $in: body } })
        const events =  await collection.find( {} ).toArray()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json({status: 500, message: error})
    }
}