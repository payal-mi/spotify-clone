console.log("Spotify Clone Ready");

// --------------------
// Song Library (Exact filenames in your repo)
// --------------------
let songLibrary = {
    "angary": [
        "Angry Mix Sarkar 3.mp3",
        "Sam Dham Sarkar 3.mp3",
        "Sarkar Trance Sarkar.mp3",
        "Thamba Sarkar 3.mp3"
    ],
    "ncs": [
        "NCS Song1.mp3",
        "NCS Song2.mp3"
    ],
    "Bits Play": [
        "Bits Play Song1.mp3",
        "Bits Play Song2.mp3"
    ],
    "chid": [
        "Chid Song1.mp3",
        "Chid Song2.mp3"
    ],
    "diljit songs": [
        "Diljit Song1.mp3",
        "Diljit Song2.mp3"
    ],
    "Love song": [
        "Love Song1.mp3",
        "Love Song2.mp3"
    ],
    "sad song": [
        "Sad Song1.mp3",
        "Sad Song2.mp3"
    ],
    "Super Songs": [
        "Super Song1.mp3",
        "Super Song2.mp3"
    ]
};

// --------------------
let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;
let lastVolume = 0.5;

// --------------------
function cleanName(name){
    return name.replace(".mp3","").replaceAll("_"," ").replaceAll("%20"," ");
}

function secondsToMinutesSeconds(sec){
    if(!sec || isNaN(sec)) return "00:00";
    let m=Math.floor(sec/60), s=Math.floor(sec%60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// --------------------
// Load songs from songLibrary
// --------------------
async function getsongs(folder){
    currFolder = "songs/" + folder;
    return songLibrary[folder] || [];
}

// --------------------
function playMusic(track, pause=false){
    currentIndex = songs.indexOf(track);
    currentSong.src = `${currFolder}/${track}`;
    if(!pause){
        currentSong.play();
        play.src="img/pause.svg";
    }

    document.querySelector(".songinfo").innerText = cleanName(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    currentSong.volume = document.querySelector(".range input").value/100;

    document.querySelectorAll(".songlist li").forEach(li => li.classList.remove("active"));
    let active = document.querySelector(`[data-track="${track}"]`);
    if(active) active.classList.add("active");
}

// --------------------
async function displayAlbums(){
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    for(let folder in songLibrary){
        let info = { title: folder, description: "" };
        try { info = await (await fetch(`songs/${folder}/info.json`)).json(); } catch{}

        cardContainer.innerHTML += `
        <div class="card" data-folder="${folder}">
            <div class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 20V4L19 12L5 20Z" fill="#000"/>
                </svg>
            </div>
            <img src="songs/${folder}/cover.jpg" onerror="this.src='songs/defaultcover.jpg'">
            <h2>${info.title}</h2>
            <p>${info.description}</p>
        </div>`;
    }
}

// --------------------
function renderSongs(){
    let ul = document.querySelector(".songlist ul");
    ul.innerHTML = "";
    songs.forEach(s=>{
        ul.innerHTML += `
        <li data-track=
