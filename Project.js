console.log("Spotify Clone Ready");

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;
let lastVolume = 0.5;


let songLibrary = {
    "bits": [
        "Chill A Thind 128 Kbps.mp3",
        "Komiku - 01 - Intro(chosic.com).mp3",
        "Laid Back Noor Tung 128 Kbps.mp3",
        "Yaari Forever Gavy Varn 128 Kbps.mp3"
    ],
    "children": [
        "Bachhe Man Ke Sachhe - Lata Mangeshkar Children's Day 2025.mp3",
        "nrt-1-abcd-Song.mp3",
        "nrt-12-rock-a-bye-baby.mp3",
        "nrt-3-pat-a-cake.mp3",
        "nrt-8-twinkle-twinkle-little-star.mp3"
    ],
    "bhakt": [
        "Agar Main Radha Radha Gaun Payal.mp3",
        "Haara Hoon Baba Par Tujhpe Bha.mp3",
        "Har-Saans-Mein-Ho-Sumiran-Tera.mp3",
        "Namami-Shamishan-Nirvan-Roopam.mp3",
        "Radhe Radhe Barsane Wali Radha.mp3",
        "Sankatmochan Hanuman Ashtak.mp3",
        "Shiv Chalisa (PenduJatt.Com.Se).mp3",
        "Shree Hanuman Chalisa.mp3",
        "Shree Durga Chalisa 1.mp3",
        "Toone Kaun Se Punya Kiye Radhe 3.mp3",
        "Tujhse Preet Lagi Hai Radhe-(Mr-Jat.in).mp3",
        "Veer Hanumana-(Mr-Jat.in).mp3"
    ],
    "ghost": [
        "Amiri Ghost 128 Kbps (1).mp3",
        "Amiri Ghost 128 Kbps.mp3",
        "Enlightenment Ghost 128 Kbps.mp3",
        "Feel My Love Ghost 128 Kbps.mp3",
        "Pasand Jaskiran 128 Kbps.mp3",
        "Poppin Ghost 128 Kbps.mp3",
        "The Confession Ghost 128 Kbps.mp3"
    ],
    "diljit": [
        "Barbaad Saiyaara 128 Kbps.mp3",
        "Humsafar Saiyaara 128 Kbps.mp3",
        "Saiyaara Reprise Female Saiyaara 128 Kbps.mp3",
        "Title Track Saiyaara 128 Kbps.mp3"
    ],
    "love": [
        "By Myself - The Grey Room Clark Sims.mp3",
        "Claim To Fame - The Grey Room Clark.mp3",
        "F16 - The Grey Room Golden Palms.mp3",
        "On The Flip - The Grey Room.mp3",
        "Density & Time - Copy.mp3",
        "Soaring - The Grey Room Golden Palms - Copy.mp3",
        "Twinkle - The Grey Room Density & Time - Copy.mp3",
        "Windy Road Back To You - The Grey Room Golden Palms - Copy.mp3",
        "Wooden Train Whistle - Copy.mp3"
    ],
    "hits": [
        "Baatein Ye Kabhi Na (PenduJatt.Com.Se).mp3",
        "Enna Sona (PenduJatt.Com.Se).mp3",
        "Kyu Bewafa Ho Gaya 1.mp3",
        "Mareez - E - Ishq (PenduJatt.Com.Se).mp3",
        "Tere Zikr Mein - Tere Ishk Mein 2025 128KBPS.mp3"
    ]
};


function cleanName(name) {
    return name.replace(".mp3", "").replaceAll("_", " ").replaceAll("%20", " ");
}

function secondsToMinutesSeconds(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    let m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


async function getsongs(folder) {
    currFolder = "songs/" + folder;
    return songLibrary[folder] || [];
}


function playMusic(track, pause = false) {
    currentIndex = songs.indexOf(track);
    currentSong.src = `${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerText = cleanName(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    currentSong.volume = document.querySelector(".range input").value / 100;

    document.querySelectorAll(".songlist li").forEach(li => li.classList.remove("active"));
    let active = document.querySelector(`[data-track="${track}"]`);
    if (active) active.classList.add("active");
}


async function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (let folder in songLibrary) {
        cardContainer.innerHTML += `
        <div class="card" data-folder="${folder}">
            <div class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 20V4L19 12L5 20Z" fill="#000"/>
                </svg>
            </div>
            <img src="songs/${folder}/cover.jpg" onerror="this.src='songs/defaultcover.jpg'">
            <h2>${folder}</h2>
            <p>${folder} playlist</p>
        </div>`;
    }
}


function renderSongs() {
    let ul = document.querySelector(".songlist ul");
    ul.innerHTML = "";
    songs.forEach(s => {
        ul.innerHTML += `
        <li data-track="${s}">
            <div class="info"><span>${cleanName(s)}</span></div>
            <div class="playnow"><span>Play Now</span><img src="img/play.svg" class="invert"></div>
        </li>`;
    });
}


async function main() {
    await displayAlbums();

    let firstFolder = Object.keys(songLibrary)[0];
    songs = await getsongs(firstFolder);
    renderSongs();
    playMusic(songs[0], true);

  
    play.onclick = () => currentSong.paused ? (currentSong.play(), play.src = "img/pause.svg") : (currentSong.pause(), play.src = "img/play.svg");
    next.onclick = () => playMusic(songs[(++currentIndex) % songs.length]);
    previous.onclick = () => playMusic(songs[(--currentIndex + songs.length) % songs.length]);

    currentSong.ontimeupdate = () => {
        if (!currentSong.duration) return;
        document.querySelector(".songtime").innerText =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    };

    document.querySelector(".seekbar").onclick = e => {
        currentSong.currentTime = (e.offsetX / e.target.clientWidth) * currentSong.duration;
    };

    document.querySelector(".range input").oninput = e => {
        currentSong.volume = e.target.value / 100;
        document.querySelector(".volume img").src = currentSong.volume === 0 ? "img/mute.svg" : "img/volume.svg";
    };

    document.querySelector(".volume img").onclick = e => {
        if (currentSong.volume > 0) {
            lastVolume = currentSong.volume;
            currentSong.volume = 0;
            e.target.src = "img/mute.svg";
        } else {
            currentSong.volume = lastVolume;
            e.target.src = "img/volume.svg";
        }
        document.querySelector(".range input").value = currentSong.volume * 100;
    };

    document.querySelector(".songlist").onclick = e => {
        let li = e.target.closest("li");
        if (li) playMusic(li.dataset.track);
    };

    document.querySelector(".cardContainer").onclick = async e => {
        let card = e.target.closest(".card");
        if (!card) return;
        songs = await getsongs(card.dataset.folder);
        renderSongs();
        playMusic(songs[0]);
    };

    currentSong.onended = () => next.click();

    document.addEventListener("keydown", e => {
        if (e.code === "Space") { e.preventDefault(); play.click(); }
        if (e.code === "ArrowRight") next.click();
        if (e.code === "ArrowLeft") previous.click();
    });

    document.querySelector(".hamburger").onclick = () => document.querySelector(".left").style.left = "0";
    document.querySelector(".close").onclick = () => document.querySelector(".left").style.left = "-120%";
}

main();

