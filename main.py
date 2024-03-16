from flask import Flask, json, jsonify, render_template, request
import hashlib
import sqlite3

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route("/")
def index():
  return render_template("signin.html")

username = ""
password = ""
password_encoded = ""
treesPlanted = None
goal = None
level = None
pfp = None

@app.route("/signup", methods=["GET", "POST"])
def signup():
  global username
  global treesPlanted
  global goal
  global level
  global pfp
  global desc
  conn = sqlite3.connect("userdata.db")
  cur = conn.cursor()
  cur.execute("CREATE TABLE IF NOT EXISTS userdata(username, password, trees_planted, level, goal, pfp)")
  if not request.json:
    print("No json found")
    return jsonify({"message": "EHEU!"})
  elif "data" not in request.json:
    print("Data not in json")
    return jsonify({"message": "EHEU!"})
  else:
    user_pass = request.json["data"]
    print("Data: ", user_pass)
    username = user_pass[0]
    password = user_pass[1]
    password_encoded = bytes(str(password), encoding="utf-8")
    password_encoded = hashlib.sha256(password_encoded, usedforsecurity=True).hexdigest()
    if (username,) in cur.execute("SELECT username FROM userdata").fetchall():
      print("Username already exists.")
      return jsonify({"message": "Username already exists."})
    else:
      treesPlanted = 0
      level = 1
      goal = 10
      pfp = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      cur.execute("INSERT INTO userdata VALUES (?,?,?,?,?,?)", (username, password_encoded, 0, 1, 10, pfp))
      print("Signed up with username " + username + " and password " + password)
      conn.commit()
      conn.close()
      return jsonify({"message": "YIPPEE!! SIGNED UP!!", "redirect": "/toMain"})

@app.route("/login", methods=["GET", "POST"])
def login():
  global username
  global password
  global treesPlanted
  global goal
  global level
  global password_encoded
  global pfp
  conn = sqlite3.connect("userdata.db")
  cur = conn.cursor()
  if not request.json:
    print("No json found")
    return jsonify({"message": "EHEU!"})
  elif "data" not in request.json:
    print("Data not in json")
    return jsonify({"message": "EHEU!"})
  else:
    user_pass = request.json["data"]
    print("Data: ", user_pass)
    username = user_pass[0]
    password = user_pass[1]
    password_encoded = bytes(str(password), encoding="utf-8")
    password_encoded = hashlib.sha256(password_encoded, usedforsecurity=True).hexdigest()
    if (username,) not in cur.execute("SELECT username FROM userdata"):
      print("Username does not exist.")
      return jsonify({"message": "Username does not exist."})
    elif (username, password_encoded) not in cur.execute("SELECT username,password FROM userdata"):
      print(cur.execute("SELECT username,password FROM userdata").fetchall())
      print("Incorrect password.")
      return jsonify({"message": "Incorrect password."})
    else:
      print("EUGEPAE! Logged in with username " + username + " and password " + password)
      treesPlanted = cur.execute("SELECT trees_planted FROM userdata WHERE (username, password)=(?,?)", (username, password_encoded)).fetchone()[0]
      level = cur.execute("SELECT level FROM userdata WHERE (username, password)=(?,?)", (username, password_encoded)).fetchone()[0]
      goal = cur.execute("SELECT goal FROM userdata WHERE (username, password)=(?,?)", (username, password_encoded)).fetchone()[0]
      pfp = cur.execute("SELECT pfp FROM userdata WHERE (username, password)=(?,?)", (username, password_encoded)).fetchone()[0]
      conn.commit() 
      conn.close()
      return jsonify({"message": "YIPPEE!! LOGGED IN!!", "redirect": "/toMain"})

@app.route("/toMain")
def mainify():
  global username
  global treesPlanted
  global level
  global goal
  global pfp
  conn = sqlite3.connect("userdata.db")
  cur = conn.cursor()
  leaderboard = cur.execute("SELECT username, level, trees_planted FROM userdata ORDER BY trees_planted DESC").fetchmany(10)
  return render_template("main.html", username=str(username), treesPlanted=treesPlanted, level=level, goal=goal, leaderboard=leaderboard, pfp=pfp)

@app.route("/plantatree")
def redirectPlant():
  return render_template("plantATree.html")

@app.route("/communitypage")
def redirectComm():
  return render_template("communities.html")

@app.route("/myprofile")
def redirectProf():
  return render_template("profile.html", username=username, treesPlanted=treesPlanted, level=level, pfp=pfp, vsblty="visible")

otherUser = None
otherLvl = None
otherTrees = None
otherPfp = None

@app.route("/profile", methods=["POST"])
def otherProf():
  global otherUser
  global otherLvl
  global otherTrees
  global otherPfp
  if not request.json:
    print("No json found")
    return jsonify({"message": "EHEU!"})
  elif "data" not in request.json:
    print("Data not in json")
    return jsonify({"message": "EHEU!"})
  else:
    otherUser = request.json["data"][0]
    otherLvl = request.json["data"][1]
    otherTrees = request.json["data"][2]
    conn = sqlite3.connect("userdata.db")
    cur = conn.cursor()
    otherPfp = cur.execute("SELECT pfp FROM userdata WHERE (username, level, trees_planted) = (?,?,?)", (otherUser, otherLvl, otherTrees)).fetchone()[0]
    return jsonify({"message": "profile loaded", "redirect": "/profileOther"})

@app.route("/profileOther")
def profileOther():
   return render_template("profile.html", username=otherUser, treesPlanted=otherTrees, level=otherLvl, pfp=otherPfp, vsblty="hidden")

@app.route("/updatePfp", methods=["POST"])
def updatePfp():
  global pfp
  global username
  global password_encoded
  if not request.json:
    print("No json found")
    return jsonify({"message": "EHEU!"})
  elif "data" not in request.json:
    print("Data not in json")
    return jsonify({"message": "EHEU!"})
  else:
    pfp = request.json["data"]
    print(pfp)
    conn = sqlite3.connect("userdata.db")
    cur = conn.cursor();
    cur.execute("UPDATE userdata SET pfp=? WHERE (username, password)=(?,?)", (pfp, username, password_encoded))
    print("updated")
    conn.commit()
    conn.close()
    return jsonify({"message": "hurray"})

  
@app.route("/updateTrees")
def updateTrees():
  global username
  global password_encoded
  global treesPlanted
  global goal
  global level
  print(username)
  print(password_encoded)
  conn = sqlite3.connect("userdata.db");
  cur = conn.cursor();
  dataRtrvd = cur.execute("SELECT trees_planted, goal, level FROM userdata WHERE (username, password)=(?,?)", (username, password_encoded)).fetchone()
  treesPlanted = dataRtrvd[0]
  goal = dataRtrvd[1]
  level = dataRtrvd[2]
  treesPlanted += 1
  if treesPlanted >= goal:
    goal+=10
    level += 1
  cur.execute("UPDATE userdata SET (trees_planted, goal, level) = (?,?,?) WHERE (username, password) = (?,?)", (treesPlanted, goal, level, username, password_encoded))
  conn.commit()
  conn.close()
  
  return jsonify({"message": "EUGEPAE"});
  
app.run(host="0.0.0.0", port=8080, debug=True)