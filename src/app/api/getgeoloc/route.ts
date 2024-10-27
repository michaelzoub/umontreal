import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongo";

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const collection = db.collection("Geoloc")
        const all = await collection.find( {} ).toArray()
        return NextResponse.json({ status: 200, body: all })
    } catch (error) {
        return NextResponse.json({ status: 500 })
    }
}