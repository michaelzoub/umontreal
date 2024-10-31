"use server"
import { connectToDatabase } from "@/app/utils/mongo";
import { NextResponse, NextRequest } from "next/server";
import { turnAddressToLngLat } from "@/app/utils/geocode";
import { generateUUID } from "@/app/utils/crypto";

//fetch events
export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const collection = await db.collection("Events")
        const events =  await collection.find( {} ).toArray()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("POST hit")
        const body = await req.json()
        const { db } = await connectToDatabase()
        const collection = await db.collection("Events")
        const collectionGeoloc = await db.collection("Geoloc")
        const uuid = generateUUID()
        await collection.createIndex({ university: 1 })
        await collection.insertOne({
            _id: uuid,
            university: body.university,
            uurl: body.uurl,
            date: body.date,
            event: body.event,
            time: body.time,
            price: body.price,
            location: body.location
        })
        const geoloc = await turnAddressToLngLat(body.location)
        //store geoloc with event id
        console.log("pre uuid gen")
        const insert = await collectionGeoloc.insertOne({
            _id: uuid,
            geoloc: geoloc
        })
        console.log("inserted geoloc: ", insert)
        console.log("add event geoloc response", geoloc)
        return NextResponse.json({status: "ok", body: geoloc})
    } catch (error) {
        return NextResponse.json(error)
    }
}