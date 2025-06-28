const API_URL = "https://api.jamendo.com/v3.0/tracks/?client_id=f42ab926&format=json&limit=7&audioformat=mp32";

const masterPlay = document.getElementById("masterPlay");
const progressBar = document.getElementById("songBar");
const gif = document.getElementById("gif");
const masterSongName = document.getElementById("masterSongName");
const volumeControl = document.getElementById("volume");

let audio = new Audio();
let currentIndex = -1;
let songList = [];

async function loadSongs() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    songList = data.results;
    
    const container = document.getElementById("songListContainer");

    songList.forEach((song, index) => {
      const songDiv = document.createElement("div");
      songDiv.className = "songItem";
      songDiv.innerHTML = `
        <img src="${song.album_image}" class="bannerImg" alt="cover">
        <span class="songName">${song.name}</span>
        <span class="songlistplay">
          <span class="timeStamp">${Math.floor(song.duration / 60)}:${("0" + (song.duration % 60)).slice(-2)}</span>
          <span><img id="play-${index}" class="songListIcon" src="icons/play-solid.svg" alt="Play"></span>
        </span>
      `;
      container.appendChild(songDiv);

      const playButton = document.getElementById(`play-${index}`);
      playButton.addEventListener("click", () => {
        playSong(index);
      });
    });
  } catch (err) {
    console.error("Error loading songs:", err);
  }
}

function playSong(index) {
  const song = songList[index];
  if (!song) return;

  audio.src = song.audio;
  audio.load(); // reload in case src is the same
  audio.volume = volumeControl.value;
  audio.play()
    .then(() => {
      currentIndex = index;
      masterSongName.textContent = `${song.name} - ${song.artist_name}`;
      gif.style.opacity = 1;
      masterPlay.src = "icons/pause-solid.svg";
    })
    .catch(err => {
      console.error("Audio play failed:", err);
      alert("Playback failed. Jamendo might be blocking the stream or browser autoplay is preventing it.");
    });
}

masterPlay.addEventListener("click", () => {
  if (audio.paused || audio.currentTime <= 0) {
    audio.play().then(() => {
      masterPlay.src = "icons/pause-solid.svg";
      gif.style.opacity = 1;
    });
  } else {
    audio.pause();
    masterPlay.src = "icons/play-solid.svg";
    gif.style.opacity = 0;
  }
});

audio.addEventListener("timeupdate", () => {
  const progress = parseInt((audio.currentTime / audio.duration) * 100);
  progressBar.value = progress || 0;
});

progressBar.addEventListener("change", () => {
  if (!isNaN(audio.duration) && audio.duration > 0) {
    audio.currentTime = (progressBar.value * audio.duration) / 100;
  }
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

loadSongs();
