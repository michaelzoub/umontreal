import { connectToDatabase } from "@/app/utils/mongo";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { db } = await connectToDatabase()
        const collection = db.collection("Comments")
        const getComments = await collection.findOne({ _id: body })
        return NextResponse.json(getComments)
    } catch (error) {
        return NextResponse.json("Oof")
    }
}