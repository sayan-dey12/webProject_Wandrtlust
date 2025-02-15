    let my_api=mapKey;
    const lat=Listing.coordinates.latitude;
    const lng=Listing.coordinates.longitude;
    let map = tt.map({
      key: my_api,
      container: "map",
      center:[lng,lat],
      zoom:11,
    }) 
    console.log(my_api);

   
    
    map.addControl(new tt.FullscreenControl());
    new tt.Marker()
        .setLngLat([lng,lat])
        .addTo(map);

    new tt.Popup({ offset: 35 })
        .setHTML(`<h3>${Listing.location}</h3><p>Exact location provided by the owner</p>`)
        .setLngLat([lng,lat])
        .addTo(map);