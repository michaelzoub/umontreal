"use client"
import Image from "next/image";
import { events } from "./data/testdata";
import { useState, useEffect, useMemo } from "react"
import mcgill from "/public/mcgill.png"
import concordia from "/public/concordia.png"
import hec from "/public/hec.png"
import mapboxgl from 'mapbox-gl';
import { Map } from "./components/map";

export default function Home() {

  const imageObject: any = {
    mcgill,
    concordia,
    hec
  }

  const [publishBox, setPublishBox] = useState(false)
  const [addEventResponse, setAddEventResponse] = useState("")
  const [error, setError] = useState("")
  const [fetchedEvents, setFetchedEvents] = useState([])
  const [fetchedComments, setFetchedComments] = useState<any>([])
  const [specificEvent, setSpecificEvent] = useState<any>()
  const [schoolOfTheWeek, setSchoolOfTheWeek] = useState("")
  const [mapLatLong, setMapLatLong] = useState<any>()

  const [university, setUniversity] = useState<any>("")
  const [date, setDate] = useState("")
  const [event, setEvent] = useState("")
  const [time, setTime] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")

  const [comment, setComment] = useState("")
  const [commentListener, setCommentListener] = useState(false)

  const updatedComments = useMemo(() => 
    fetchedComments.map((e: any, index: number) => 
      <div key={index} className="flex flex-row justify-between gap-1 rounded-md hover:bg-zinc-600 px-2 py-[10px]">
        <div className="w-[70%] break-words whitespace-normal">{e.comment}</div>
        <div className="whitespace-nowrap my-auto">{e.date}</div>
      </div>
    ),
  [fetchedComments]
  )

  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const body = await response.json()
      console.log(body)
      setFetchedEvents(body)
    }
    setSchoolOfTheWeek("McGill")
    fetchEvents()
  }, [])

  useEffect(() => {
    async function fetchComments() {
      console.log(specificEvent?._id)
      const response = await fetch("/api/getcomments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(specificEvent?._id)
      })
      const body = await response.json()
      if (body == "Oof") {
        console.log("Error!!")
        setFetchedComments([{}])
      } else {
        console.log("setFetchedComments")
        setFetchedComments(body.details)
        console.log(body.details)
      }
      console.log(body)
    }
    fetchComments()
  },[specificEvent, comment])

  async function addEvent(e: any) {
    e.preventDefault()

    console.log("addEvent hit")
    if (!university || !date || !event || !time || !location) {
      setError("Missing fields.")
    } if (!university.toLowerCase().includes("mcgill") && !university.toLowerCase().includes("concordia") && !university.toLowerCase().includes("hec") && !university.toLowerCase().includes("udem")) {
      setError("University doesn't exist.")
    } else {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          university: university,
          date: date,
          event: event,
          time: time,
          price: price,
          location: location
        })
      })
      setError("Success.")
      const log = await response.json()
      if (log.status.includes("ok")) {
        const latLongObject = {
          lng: log.body[0],
          lat: log.body[1]
        }
        setMapLatLong(latLongObject)
        console.log("response: ", log.body)
        console.log("latLong object: ", latLongObject)
        setTimeout(() => {
          setError("")
          setAddEventResponse("")
        }, 3000)
        const object: any = {
          university: university,
          date: date,
          event: event,
          time: time,
          price: price,
          location: location
        }
        setFetchedEvents((prev:any) => [])
        setPublishBox(false)
        window.location.reload()
      }
    }
  }

  function closeEventBox() {
    setSpecificEvent("")
    setComment("")
  }

  async function addComment(e:any) {
    e.preventDefault()
    console.log(e.target.value)
    console.log(e.target.getAttribute('data-key'))
    if (!e.target.value) {
      console.log("Not target value")
      console.log(comment)
      const id = e.target.getAttribute('data-key')
      const response = await fetch("/api/addcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          comment: comment
        })
      })
      console.log(response)
      const date = new Date().toISOString().split('T')[0]
      setFetchedComments((prev: any) => [...prev, {comment: comment, date: date}])
    } else {
      const id = e.target.value
      const response = await fetch("/api/addcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          body: JSON.stringify({
            id: id,
            comment: comment
          })
        }
      })
      setFetchedComments((prev: any) => [...prev, comment])
      console.log(response)
    }
  }

  function check(e:any) {
    switch (e.toLowerCase()) {
      case "mcgill":
        return mcgill
      case "hec":
        return hec
      case "concordia":
        return concordia
    }
  }

  return (
  <main className="flex flex-col h-screen w-full bg-zinc-900 overflow-hidden overflow-scroll overflow-x-hidden md:overflow-hidden md:overflow-x-visible">
    <div className={`${publishBox ? "z-50 absolute text-white w-full h-screen backdrop-blur px-[20px] md:px-[100px] pt-10" : "hidden"}`}>
      <div className="flex flex-col w-full p-10 mx-auto my-auto rounded-md bg-zinc-800 border-[2px] border-zinc-700 overflow-hidden md:w-[650px]">
        <div className="flex flex-col justify-between">
          <button className="ml-[100%] mt-[-30px] text-xl hover:text-zinc-300" onClick={() => setPublishBox(false)}>⨯</button>
          <div className="mx-auto my-2 text-lg">Are you an event organiser? Add it here:</div>
        </div>
        <form className="grid gap-2" onSubmit={addEvent}>
          <div className="flex flex-col">
            <div className="text-xs text-gray">University name</div>
            <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="University" onChange={(e:any) => setUniversity(e.target.value)}></input>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-gray">Date</div>
            <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="Date" onChange={(e:any) => setDate(e.target.value)}></input>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-gray">Event name</div>
            <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="Event" onChange={(e:any) => setEvent(e.target.value)}></input>
          </div>
          <div className="flex flex-col gap-2 w-full md:flex-row">
            <div className="flex flex-col w-full">
              <div className="text-xs text-gray">Time</div>
              <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="Time" onChange={(e:any) => setTime(e.target.value)}></input>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-gray">Price (input 0 if none)</div>
              <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="Price" onChange={(e:any) => setPrice(e.target.value)}></input>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-gray">Location</div>
            <input className="px-2 bg-zinc-600 border-[2px] border-blue-500 rounded-md" placeholder="Address" onChange={(e:any) => setLocation(e.target.value)}></input>
          </div>
          <div className={`${error ? `px-4 py-[0.5px] text-xs w-fit mx-auto rounded-md border-[2px] ${error.includes("Success") ? "bg-green-700 border-green-500" : "bg-red-700 border-red-500"}` : "hidden"}`}>{error}</div>
          <button className="mx-auto h-fit px-6 py-1 rounded-md text-center bg-blue-500 text-white shadow-inner border-[2px] border-blue-400 transition ease-in-out hover:scale-105">Submit!</button>
          <div className={`${addEventResponse ? "px-4 py-[0.5px] text-sm w-fit mx-auto rounded-md bg-green-700 border-[2px] border-green-500" : "hidden"}`}>{addEventResponse} ☑</div>
        </form>
      </div>
    </div>
    <div className={`${specificEvent ? "z-50 absolute text-white w-full h-screen backdrop-blur px-[20px] md:px-[100px] pt-10" : "hidden"}`}>
      <div className="flex flex-col w-full p-10 mx-auto my-auto rounded-md bg-zinc-800 border-[2px] border-zinc-700 overflow-hidden md:w-[650px]">
        <div className="flex flex-col justify-between">
          <button className="ml-[100%] mt-[-30px] text-xl hover:text-zinc-300" onClick={closeEventBox}>⨯</button>
          <div className="mx-auto my-2 text-xl">{specificEvent?.event}</div>
        </div>
        <div className="flex flex-row justify-between">
          <div>{specificEvent?.event}</div>
          <div>${specificEvent?.price}</div>
        </div>
        <div className="flex flex-row justify-between">
          <div>{specificEvent?.location}</div>
          <div>At {specificEvent?.time}</div>
        </div>
        <div className="mt-6">
          <div className="mx-auto w-fit text-lg">Comments:</div>
          <div className="h-96 overflow-scroll rounded-md border-[2px] border-zinc-500 p-2">
            {updatedComments}
          </div>
          <form onSubmit={addComment} data-key={specificEvent?._id}>
            <input className="w-full px-2 py-[2px] bg-zinc-600 border-[2px] border-blue-500 rounded-md mt-6" placeholder="Anything to say?" type="text" value={comment} onChange={(e) => setComment(e.target.value)}></input>
            <button className="absolute mt-[30px] ml-[-30px] text-xs bg-blue-500 rounded-md px-2 py-[1px]" value={specificEvent?._id}>↑</button>
          </form>
        </div>
      </div>
    </div>
    <header className="flex flex-row w-full h-[13%] justify-between">
      <div className="flex flex-col text-white gap-2 m-2 mx-6">
        <div className="text-3xl font-semibold">uMontreal</div>
        <div className="w-44 md:w-[410px]">Montreal's destination for college/university events and parties.</div>
        <div className="flex flex-row gap-2 my-auto">
          <div className="my-auto w-2 h-2 bg-blue-500 rounded-full shadow shadow-blue-400"></div>
          <div className="my-auto">Party school of the week</div>
        </div>
      </div>
      <button className="mx-4 my-auto h-fit px-2 py-1 rounded-md text-center bg-blue-500 text-white shadow-inner border-[2px] border-blue-400 transition ease-in-out hover:scale-105" onClick={() => setPublishBox(true)}>Publish Event</button>
    </header>
    <div className="visible mt-[100px] h-[73%] px-6 rounded-md md:w-[50%] md:hidden">
      <link className={`${publishBox || specificEvent ? "hidden" : "visible"}`} href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
      <Map response={mapLatLong}></Map>
    </div>
    <div className="flex flex-row w-full h-[90%]">
      <div className="mt-10 w-full px-6 h-[90%] overflow-scroll mb-20 md:w-[50%]" key="key">
        {fetchedEvents?.map((e: any) => 
          <button className={`${e.university.toLowerCase().includes(schoolOfTheWeek.toLowerCase()) ? "flex flex-row w-full overflow-hidden justify-between text-white mx-0 my-4 rounded-md border-[2px] border-blue-500 shadow md:mx-6 md:w-[75%] transition ease-in-out hover:scale-105" : "flex flex-row w-full overflow-hidden justify-between text-white mx-0 my-2 rounded-md border-[2px] border-white shadow md:mx-6 md:w-[75%] transition ease-in-out hover:scale-105"}`} key={e.id} value={e} onClick={() => setSpecificEvent(e)}>
            <div className="flex flex-row gap-4">
              <Image src={imageObject[e.university.toLowerCase()]} alt="University logo" width={50} height={50} className="p-2"></Image>
              <div className="my-auto w-[110px] overflow-hidden whitespace-nowrap text-ellipsis md:w-[150px]">{e.university}</div>
            </div>
            <div className="my-auto mx-2">{e.date}</div>
          </button>
        )}
      </div>
      <div className="absolute right-[10000px] md:w-[50%] md:visible md:relative md:mr-0 md:right-0">
        <link className={`${publishBox || specificEvent ? "hidden" : "visible"}`} href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
        <Map response={mapLatLong}></Map>
      </div>
    </div>
  </main>
  );
}
