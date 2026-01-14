console.log("Spotify Clone Ready");

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;
let lastVolume = 0.5;


function cleanName(name){
    return name.replace(".mp3","").replaceAll("_"," ").replaceAll("%20"," ");
}

function secondsToMinutesSeconds(sec){
    if(!sec || isNaN(sec)) return "00:00";
    let m=Math.floor(sec/60), s=Math.floor(sec%60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}


async function getsongs(folder){
    currFolder = "songs/" + folder;
    let res = await fetch(currFolder + "/");
    let html = await res.text();
    let div = document.createElement("div");
    div.innerHTML = html;
    let links = div.getElementsByTagName("a");

    let arr = [];
    for(let a of links){
        let text = a.textContent.trim();
        if(text.toLowerCase().endsWith(".mp3")) arr.push(text);
    }
    return arr;
}


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


async function displayAlbums(){
    let res = await fetch("songs/");
    let html = await res.text();
    let div = document.createElement("div");
    div.innerHTML = html;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    for(let a of anchors){
        let folder = a.textContent.trim();
        if(!folder || folder.endsWith(".mp3") || folder.endsWith(".json") || folder=="../") continue;

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

function renderSongs(){
    let ul = document.querySelector(".songlist ul");
    ul.innerHTML = "";
    songs.forEach(s=>{
        ul.innerHTML += `
        <li data-track="${s}">
            <div class="info"><span>${cleanName(s)}</span></div>
            <div class="playnow"><span>Play Now</span><img src="img/play.svg" class="invert"></div>
        </li>`;
    });
}


async function main(){
    await displayAlbums();
    songs = await getsongs("ncs");
    renderSongs();
    playMusic(songs[0], true);

    play.onclick = ()=> currentSong.paused ? (currentSong.play(), play.src="img/pause.svg") : (currentSong.pause(), play.src="img/play.svg");
    next.onclick = ()=> playMusic(songs[(++currentIndex)%songs.length]);
    previous.onclick = ()=> playMusic(songs[(--currentIndex+songs.length)%songs.length]);

    currentSong.ontimeupdate = ()=>{
        if(!currentSong.duration) return;
        document.querySelector(".songtime").innerText =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime/currentSong.duration)*100 + "%";
    };

    document.querySelector(".seekbar").onclick = e=>{
        currentSong.currentTime = (e.offsetX/e.target.clientWidth)*currentSong.duration;
    };

    document.querySelector(".range input").oninput = e=>{
        currentSong.volume = e.target.value/100;
        document.querySelector(".volume img").src = currentSong.volume===0 ? "img/mute.svg" : "img/volume.svg";
    };

    document.querySelector(".volume img").onclick = e=>{
        if(currentSong.volume>0){
            lastVolume=currentSong.volume;
            currentSong.volume=0;
            e.target.src="img/mute.svg";
        } else {
            currentSong.volume=lastVolume;
            e.target.src="img/volume.svg";
        }
        document.querySelector(".range input").value=currentSong.volume*100;
    };

    document.querySelector(".songlist").onclick = e=>{
        let li=e.target.closest("li");
        if(li) playMusic(li.dataset.track);
    };

    document.querySelector(".cardContainer").onclick = async e=>{
        let card=e.target.closest(".card");
        if(!card) return;
        songs = await getsongs(card.dataset.folder);
        renderSongs();
        playMusic(songs[0]);
    };

    currentSong.onended = ()=> next.click();

    document.addEventListener("keydown", e=>{
        if(e.code==="Space"){ e.preventDefault(); play.click(); }
        if(e.code==="ArrowRight") next.click();
        if(e.code==="ArrowLeft") previous.click();
    });

    document.querySelector(".hamburger").onclick = ()=> document.querySelector(".left").style.left="0";
    document.querySelector(".close").onclick = ()=> document.querySelector(".left").style.left="-120%";
}

main();
