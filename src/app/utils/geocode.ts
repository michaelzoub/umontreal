
export async function turnAddressToLngLat(address: string) {

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    const addressSplit = address.split(" ")
    console.log(addressSplit)
    const addressNumber = addressSplit[0]
    const street = addressSplit[1] + addressSplit[2]
    console.log("Street: ", street)

    const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?country=ca&address_number=${addressNumber}&street=${street}&place=Montreal&proximity=-73.5673,45.5017&access_token=${accessToken}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("response geocode: ", response)

    const body = await response.json()
    console.log("Geolocation api response: ", body.features[0].geometry.coordinates)
    // Set marker options.
    return body.features[0].geometry.coordinates
}