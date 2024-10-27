import mapboxgl from 'mapbox-gl'
import { useState, useEffect, useRef } from 'react';


export function Map({ response }: { response: { lng: number; lat: number } }) {
    const token: any = process.env.MAPBOX_TOKEN
    mapboxgl.accessToken = token

    const map = useRef<mapboxgl.Map | null>(null)
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const markersRef = useRef<mapboxgl.Marker[]>([])
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

    const test = [[-73.5728, 45.50283], [-73.3420, 45.50283]]

    useEffect(() => {

        async function fetchCoordinates() {
            const response = await fetch("/api/getgeoloc/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const body = await response.json()
            console.log("map component: ", body.body)

            if (!body.body) {
                console.log("NO BODY")
                return
            }

            const fetchedGeolocArray = body.body
            console.log(fetchedGeolocArray[0].geoloc)

        map.current = new mapboxgl.Map({
            container: mapContainer.current!, // ID of the HTML element to render the map
            style: 'mapbox://styles/michaelzoubkoff/cm2phro9t00ds01qiae6k7ifd', // Choose your map style
            //center: [-74.5, 40], // Starting position [lng, lat]
            //zoom: 9 // Starting zoom level
        })

        const bounds = new mapboxgl.LngLatBounds();

        fetchedGeolocArray.forEach((coords: any) => {
            const marker = new mapboxgl.Marker({
                color: "#FFFFFF",
            })
                .setLngLat(coords.geoloc)
                .addTo(map.current!);

                markersRef.current.push(marker)

                bounds.extend(coords)
        });

        }

        fetchCoordinates()

    }, [])

    useEffect(() => {
        //const {lng, lat} = response
        if (!response) {
            return
        }
    const newMarker = new mapboxgl.Marker({
        color: "#FFFFFF",
    }).setLngLat([-73.5728, 45.50283]) //[30.5, 50.5] [lng, lat]
        .addTo(map.current!)

    setMarkers(prevMarkers => [...prevMarkers, newMarker])

    if (markers.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        markers.forEach(marker => {
            bounds.extend(marker.getLngLat())
        })

        bounds.extend(newMarker.getLngLat())

        map.current?.fitBounds(bounds, {
            padding: 20,
        })
    }
}, [response])



    const locations = [
        //{ lng: -74.5, lat: 40, title: 'Marker 1' }
    ]

    return (
        <div ref={mapContainer!} className="z-10 rounded-md" style={{ width: '100%', height: '100%' }}></div>
    )
}