// Melody Web: Dynamic Song Loader with Infinite Scroll

let offset = Math.floor(Math.random() * 1000); // start with random offset
let loading = false;
let songList = [];

const masterPlay = document.getElementById("masterPlay");
const progressBar = document.getElementById("songBar");
const gif = document.getElementById("gif");
const masterSongName = document.getElementById("masterSongName");
const volumeControl = document.getElementById("volume");
const audio = new Audio();

// Format seconds to mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Load songs from Jamendo API
async function loadSongs(offsetValue = 0) {
  loading = true;
  const API_URL = `https://api.jamendo.com/v3.0/tracks/?client_id=f42ab926&format=json&limit=7&audioformat=mp32&order=popularity_total&offset=${offsetValue}`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const songs = data.results;
    const container = document.getElementById("songListContainer");

    songs.forEach((song, index) => {
      const globalIndex = container.children.length;
      const songDiv = document.createElement("div");
      songDiv.className = "songItem";
      songDiv.innerHTML = `
        <img src="${song.album_image}" class="bannerImg" alt="cover">
        <span class="songName">${song.name}</span>
        <span class="songlistplay">
          <span class="timeStamp">${formatTime(song.duration)}</span>
          <span><img id="play-${globalIndex}" class="songListIcon" src="icons/play-solid.svg" alt="Play"></span>
        </span>
      `;
      container.appendChild(songDiv);

      document.getElementById(`play-${globalIndex}`).addEventListener("click", () => {
        playSong(song);
      });
    });

    loading = false;
  } catch (err) {
    console.error("Error loading songs:", err);
    loading = false;
  }
}

function playSong(song) {
  if (!song) return;

  audio.src = song.audio;
  audio.load();
  audio.volume = volumeControl.value;
  audio.play()
    .then(() => {
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
  if (!isNaN(audio.duration)) {
    const progress = parseInt((audio.currentTime / audio.duration) * 100);
    progressBar.value = progress || 0;

    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
    document.getElementById("totalDuration").textContent = formatTime(audio.duration);
  }
});

progressBar.addEventListener("change", () => {
  if (!isNaN(audio.duration) && audio.duration > 0) {
    audio.currentTime = (progressBar.value * audio.duration) / 100;
  }
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

const scrollContainer = document.querySelector(".songItemcontainer");
scrollContainer.addEventListener("scroll", () => {
  const threshold = 100;
  const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold;

  if (atBottom && !loading) {
    offset += 7;
    loadSongs(offset);
  }
});

// Initial load
loadSongs(offset);
