function sendSignIn(){
  let username = document.getElementById("username1").value;
  let password = document.getElementById("password1").value;
  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ data: [username, password] })
  })

  .then(response=>{
    if(!response.ok){
      console.log("Error: response was not in fact okay")
    }else{
      return response.json();
    }
  })

  .then(data => {
    if (data.message === "YIPPEE!! SIGNED UP!!") {
      window.location.href = data.redirect;
    }else{
      document.getElementById("errorMsg").innerText = data.message;
    }
  })

  .catch(error=>{
    console.log(`Error: ${error}`);
  })
}

function sendLogIn(){
  let username = document.getElementById("username2").value;
  let password = document.getElementById("password2").value;
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ data: [username, password] })
  })

  .then(response=>{
    if(!response.ok){
      console.log("Error: response was not in fact okay")
    }else{
      return response.json();
    }
  })

  .then(data => {
    if (data.message === "YIPPEE!! LOGGED IN!!") {
      window.location.href = data.redirect;
    }else{
      document.getElementById("errorMsg").innerText = data.message;
    }
  })

  .catch(error=>{
    console.log(`Error: ${error}`);
  })
}

function info(username, treesPlanted, treeGoal, level){
  document.getElementById("welcome").innerText = `Welcome, ${username}!`
  document.getElementById("levelDisplay").innerText = `Level ${level}`;
  document.getElementById("planteds").innerText = `Goal: ${treesPlanted} out of ${treeGoal} trees planted`;
  document.getElementById("progsbar").style.width = `${((treesPlanted-((level-1)*10))/(treeGoal-((level-1)*10)))*100}%`;
  document.getElementById("currentLvl").innerText = `Level ${level}`;
  document.getElementById("nextLvl").innerText = `Level ${level+1}`
}

function plantTreeSite(){
  window.location.href = "/plantatree";
}

function redirectDashboard(){
  window.location.href = "/toMain";
}

function setLeaderboard(leaderboardArr){
  let leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";
  for(let i = 0; i < leaderboardArr.length; i++){
    li = document.createElement("li");
    li.textContent = `${leaderboardArr[i][0]} (level ${leaderboardArr[i][1]}): ${leaderboardArr[i][2]} trees planted`;
    leaderboard.append(li);
    li.onclick = function(){
      profile(leaderboardArr[i][0], leaderboardArr[i][1], leaderboardArr[i][2])
    };
  }
}

function communitySite(){
  window.location.href = "/communitypage";
}

function myprofile(){
  window.location.href = "/myprofile";
}

function profile(usern, lvl, plantedTotal){
  fetch("/profile", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ data: [usern, lvl, plantedTotal] })
  })

  .then(response=>{
    if(!response.ok){
      console.log("response is NOT okay :(");
    }else{
      return response.json();
    }
  })

  .then(data =>{
    window.location.href = data.redirect;
  })
}

function updatePfp(){
  let pfp = document.getElementById("pfp");
  let imgAdrs = document.getElementById("pfpFile").value;
  pfp.src = imgAdrs;
  fetch("/updatePfp", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ data: imgAdrs })
  })

  .then(response=>{
    if(!response.ok){
      console.log("the response is NOT okay :(");
    }else{
      return response.json();
    }
  })

  .then(data=>{
    if (data.message === "profile loaded") {
      window.location.href = data.redirect;
    }else{
      console.log("There was an error in loading the profile");
    }
  })

  .catch(error=>{
    console.log("Error: ", error);
  })
}