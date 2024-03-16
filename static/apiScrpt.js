function getCoordinates(){
  navigator.geolocation.getCurrentPosition(printPos);
}

let apiKey = "iXO5-s_D0d-z40gQ9OyT_5zLMiD9k6FR4AVvKKtpSdM";
let pos;

function printPos(position){
  pos = position.coords.latitude + "," + position.coords.longitude;

  let apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${pos}&apiKey=${apiKey}&types=address&limit=1`;
  fetch(apiUrl, 
    {mode: "cors", method: "GET"
  })
  .then(response=>{
    return response.json();
  })
    
  .then(jsonData=>{
    address = jsonData.items[0].address
    if(address.houseNumber != undefined){
      document.getElementById("addrssDisplay").innerText = `Want to plant a tree near ${address.houseNumber} ${address.street}, ${address.city} ${address.stateCode}?`;
    }else{
      document.getElementById("addrssDisplay").innerText = `Want to plant a tree near ${address.street}, ${address.city} ${address.stateCode}?`;
    }
    document.getElementById("hint").innerText = "Helpful hint: Clicking on the address of a location will redirect you to Google Maps. :)"
    displayLocs(pos);
  })

  .catch(error=>{
    console.log("Error: " + error);
  })
}

function displayLocs(pos){
  let apiUrl = `https://browse.search.hereapi.com/v1/browse?apiKey=${apiKey}&at=${pos}&categories=550-5510-0358,550-5510-0359	&limit=4`;
  let trailList = document.getElementById("trails");
  fetch(apiUrl, 
    {method: "GET"
  })
  .then(response=>{
    return response.json();
  })

  .then(jsonData=>{
    console.log(jsonData);
    let addr = "";
    trailList.innerHTML = "";
    for(let i = 0; i < jsonData.items.length; i++){
      let listElm = document.createElement("li");
      listElm.innerHTML = `<h4>${jsonData.items[i].title}</h4>`;
      trailList.append(listElm);
      let listAddr = document.createElement("ul");
      addr = jsonData.items[i].address;
      let addrInList = document.createElement("li");
      if(addr.houseNumber!=undefined){
        addrInList.innerText = `${addr.houseNumber} ${addr.street}, ${addr.city} ${addr.stateCode}, ${addr.postalCode}`;
      }else{
        addrInList.innerText = `${addr.street}, ${addr.city} ${addr.stateCode}, ${addr.postalCode}`;
      }
      listAddr.append(addrInList);
      let plantedATree = document.createElement("button");
      plantedATree.onclick = updatePlanteds;
      plantedATree.innerText = "I planted here!"
      listAddr.append(plantedATree);
      trailList.append(listAddr);
      addrInList.addEventListener("click", (event) => {
        address = event.target.innerText.replace(" ", "+");
        url=`https://www.google.com/maps/dir/${pos}/${address}/`;
        window.open(url, "_blank")
      });
    }
  })

  .catch(error=>{
    console.log("Error: " + error);
  })
  
  apiUrl = `https://browse.search.hereapi.com/v1/browse?apiKey=${apiKey}&at=${pos}&categories=350-3522-0239&limit=2`;
  let forestList = document.getElementById("forests");
  fetch(apiUrl, 
    {method: "GET"
  })
  .then(response=>{
    return response.json();
  })

  .then(jsonData=>{
    console.log(jsonData);
    let addr = "";
    forestList.innerHTML = "";
    for(let i = 0; i < jsonData.items.length; i++){
      let listElm = document.createElement("li");
      listElm.innerHTML = `<h4>${jsonData.items[i].title}</h4>`;
      forestList.append(listElm);
      let listAddr = document.createElement("ul");
      addr = jsonData.items[i].address;
      let addrInList = document.createElement("li");
      if(addr.houseNumber!=undefined){
        addrInList.innerText = `${addr.houseNumber} ${addr.street}, ${addr.city} ${addr.stateCode}, ${addr.postalCode}`;
      }else{
        addrInList.innerText = `${addr.street}, ${addr.city} ${addr.stateCode}, ${addr.postalCode}`;
      }
      listAddr.append(addrInList);
      plantedATree = document.createElement("button");
      plantedATree.onclick = updatePlanteds;
      plantedATree.innerText = "I planted here!"
      listAddr.append(plantedATree);
      forestList.append(listAddr);
      addrInList.addEventListener("click", (event) => {
        address = event.target.innerText.replace(" ", "+");
        url=`https://www.google.com/maps/dir/${pos}/${address}/`;
        window.open(url, "_blank")
      });
    }
  })

  .catch(error=>{
    console.log("Error: " + error);
  })

  document.getElementById("areaList").style.display = "block";
}

function updatePlanteds(){
  console.log("EUGEPAE1!!111! YOU PLANTED!!1!!!1 EUGEEE");
  fetch("/updateTrees", {
    headers: {
      "Content-Type" : "application/json"
    }
  })

  .then(response => {
    if(!response.ok){
      console.log("the response is in fact not okay");
    }else{
      return response.json();
    }
  })

  .then(data=>{
    console.log("A tree has been added.");
  })

  .catch(error=>{
    console.log("Error: ", error);
  })
}