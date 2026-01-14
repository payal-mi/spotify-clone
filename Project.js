console.log("Spotify Clone Ready");

// Complete Song Library with categories
let songLibrary = {
  "sad": {
    cover: "songs/sad/cover.jpg",
    songs: [
      "Baatein Ye Kabhi Na (PenduJatt.Com.Se).mp3",
      "Enna Sona (PenduJatt.Com.Se).mp3",
      "Kyu Bewafa Ho Gaya 1.mp3",
      "Mareez - E - Ishq (PenduJatt.Com.Se).mp3",
      "Tere Zikr Mein - Tere Ishk Mein 2025 128KBPS.mp3"
    ]
  },
  "hits": {
    cover: "songs/hits/cover.jpg",
    songs: [
      "By Myself - The Grey Room Clark Sims.mp3",
      "Claim To Fame - The Grey Room Clark.mp3",
      "F16 - The Grey Room Golden Palms.mp3",
      "On The Flip - The Grey Room.mp3",
      "Soaring - The Grey Room Golden Palms - Copy.mp3",
      "Twinkle - The Grey Room Density & Time - Copy.mp3",
      "Windy Road Back To You - The Grey Room Golden Palms - Copy.mp3",
      "Wooden Train Whistle - Copy.mp3",
      "Pyaar Karna Hai Neha Kakkar 128.mp3",
      "Lahor.mp3",
      "Patola 1.mp3",
      "Phurr Kis Kisko Pyaar Karoon 2 128 Kbps.mp3",
      "Slowly Slowly 1.mp3"
    ]
  },
  "love": {
    cover: "songs/love/cover.jpg",
    songs: [
      "Barbaad Saiyaara 128 Kbps.mp3",
      "Humsafar Saiyaara 128 Kbps.mp3",
      "Saiyaara Reprise Female Saiyaara 128 Kbps.mp3",
      "Title Track Saiyaara 128 Kbps.mp3"
    ]
  },
  "diljit": {
    cover: "songs/diljit/cover.jpg",
    songs: [
      "Amiri Ghost 128 Kbps (1).mp3",
      "Amiri Ghost 128 Kbps.mp3",
      "Enlightenment Ghost 128 Kbps.mp3",
      "Feel My Love Ghost 128 Kbps.mp3",
      "Pasand Jaskiran 128 Kbps.mp3",
      "Poppin Ghost 128 Kbps.mp3",
      "The Confession Ghost 128 Kbps.mp3"
    ]
  },
  "bhakti": {
    cover: "songs/bhakti/cover.jpg",
    songs: [
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
    ]
  },
  "children": {
    cover: "songs/children/cover.jpg",
    songs: [
      "nrt-1-abcd-Song.mp3",
      "nrt-12-rock-a-bye-baby.mp3",
      "nrt-3-pat-a-cake.mp3",
      "nrt-8-twinkle-twinkle-little-star.mp3",
      "Komiku - 01 - Intro(chosic.com).mp3"
    ]
  },
  "chill": {
    cover: "songs/chill/cover.jpg",
    songs: [
      "Chill A Thind 128 Kbps.mp3",
      "Laid Back Noor Tung 128 Kbps.mp3",
      "Yaari Forever Gavy Varn 128 Kbps.mp3"
    ]
  }
};

// Global variables
let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;
let lastVolume = 0.5;

// Helper functions
function cleanName(name) {
  return name.replace(".mp3", "").replaceAll("_", " ").replaceAll("%20", " ");
}

function secondsToMinutesSeconds(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  let m = Math.floor(sec / 60),
    s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getsongs(folder) {
  currFolder = "songs/" + folder;
  return songLibrary[folder]?.songs || [];
}

// Play music
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
  document.querySelectorAll(".songlist li").forEach((li) =>
    li.classList.remove("active")
  );
  let active = document.querySelector(`[data-track="${track}"]`);
  if (active) active.classList.add("active");
}

// Display album cards
function displayAlbums() {
  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";
  for (let folder in songLibrary) {
    cardContainer.innerHTML += `
      <div class="card" data-folder="${folder}">
        <div class="play">
          <svg width="24" height="24"><path d="M5 20V4L19 12L5 20Z" fill="#000"/></svg>
        </div>
        <img src="${songLibrary[folder].cover}" onerror="this.src='songs/defaultcover.jpg'">
        <h2>${folder}</h2>
        <p></p>
      </div>`;
  }
}

// Render song list
function renderSongs() {
  let ul = document.querySelector(".songlist ul");
  ul.innerHTML = "";
  songs.forEach((s) => {
    ul.innerHTML += `
      <li data-track="${s}">
        <div class="info"><span>${cleanName(s)}</span></div>
        <div class="playnow"><span>Play Now</span><img src="img/play.svg" class="invert"></div>
      </li>`;
  });
}

// Main function
function main() {
  displayAlbums();
  let firstFolder = Object.keys(songLibrary)[0];
  songs = getsongs(firstFolder);
  renderSongs();
  playMusic(songs[0], true);

  play.onclick = () =>
    currentSong.paused
      ? (currentSong.play(), (play.src = "img/pause.svg"))
      : (currentSong.pause(), (play.src = "img/play.svg"));
  next.onclick = () =>
    playMusic(songs[(++currentIndex) % songs.length]);
  previous.onclick = () =>
    playMusic(songs[(--currentIndex + songs.length) % songs.length]);

  currentSong.ontimeupdate = () => {
    if (!currentSong.duration) return;
    document.querySelector(".songtime").innerText =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  };

  document.querySelector(".seekbar").onclick = (e) => {
    currentSong.currentTime =
      (e.offsetX / e.target.clientWidth) * currentSong.duration;
  };

  document.querySelector(".range input").oninput = (e) => {
    currentSong.volume = e.target.value / 100;
    document.querySelector(".volume img").src =
      currentSong.volume === 0 ? "img/mute.svg" : "img/volume.svg";
  };

  document.querySelector(".songlist").onclick = (e) => {
    let li = e.target.closest("li");
    if (li) playMusic(li.dataset.track);
  };

  document.querySelector(".cardContainer").onclick = (e) => {
    let card = e.target.closest(".card");
    if (!card) return;
    songs = songLibrary[card.dataset.folder].songs;
    currFolder = "songs/" + card.dataset.folder;
    renderSongs();
    playMusic(songs[0]);
  };

  currentSong.onended = () => next.click();
}

main();


