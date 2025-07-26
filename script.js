let offset = Math.floor(Math.random() * 1000); // start with random offset
let loading = false;
let masterPlayInitialized = false;
currentSongIndex = -1;
let songList = [];
let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

const masterPlay = document.getElementById("masterPlay");
const progressBar = document.getElementById("songBar");
const gif = document.getElementById("gif");
const masterSongName = document.getElementById("masterSongName");
const volumeControl = document.getElementById("volume");
const volumeIcon = document.querySelector(".volumeIcon");
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
    songList = songList.concat(songs);
    const container = document.getElementById("songListContainer");

    songs.forEach((song, index) => {
      const globalIndex = container.children.length;
      const songDiv = document.createElement("div");
      songDiv.className = "songItem";
      songDiv.setAttribute("data-index", globalIndex);
      songDiv.innerHTML = `
        <img src="${song.album_image}" class="bannerImg" alt="cover">
        <span class="songName">${song.name}</span>
        <span class="songlistplay">
          <span class="timeStamp">
            ${formatTime(song.duration)}
          </span>
          <span>
            <img id="play-${globalIndex}" class="songListIcon" src="icons/play-solid.svg" alt="Play">
          </span>
          <span>
            <img id="like-${globalIndex}" class="likeIcon" src="icons/heart-regular.svg" alt="Like" style="width:18px; cursor:pointer;">
          </span>
        </span>
      `;
      container.appendChild(songDiv);

      document.getElementById(`play-${globalIndex}`).addEventListener("click", () => {
        playSong(song, globalIndex);
      });

      document.getElementById(`like-${globalIndex}`).addEventListener('click', () =>{
        toggleLike(song, globalIndex);
      })

      if (likedSongs.includes(String(song.id))) {
        const likeIcon = document.getElementById(`like-${globalIndex}`);
        likeIcon.src = "icons/heart-solid.svg";
        likeIcon.classList.add("liked");
      }
    });

    // Set first song in master player (only on first load)
    if (!masterPlayInitialized && songs.length > 0) {
      masterPlayInitialized = true;
      const firstSong = songs[0];
      audio.src = firstSong.audio;
      currentSongIndex = 0;
      masterSongName.innerHTML = `
        <span class="track-title">${firstSong.name}</span>
        <span class="track-artist">${firstSong.artist_name}</span>
      `;
      document.getElementById("currentTime").textContent = "00:00";
      document.getElementById("totalDuration").textContent = formatTime(firstSong.duration);
      gif.style.opacity = 0;
      progressBar.value = 0;
      volumeControl.value = 0.5; 
      audio.volume = volumeControl.value;
      masterPlay.src = "icons/play-solid.svg";
    }

    loading = false;
  } catch (err) {
    console.error("Error loading songs:", err);
    loading = false;
  }
}

function playSong(song, index = null) {
  if (!song) return;

  document.querySelectorAll(".songListIcon").forEach(el => el.classList.remove("playing"));

  audio.src = song.audio;
  audio.load();
  audio.volume = volumeControl.value;
  audio.play()
    .then(() => {
      currentSongIndex = index !== null ? index : songList.findIndex(s => s.audio === song.audio);

      masterSongName.innerHTML = `
        <span class="track-title" title="${song.name}">${truncateText(song.name)}</span><br>
        <span class="track-artist" title="${song.artist_name}">${truncateText(song.artist_name)}</span>
      `;
      gif.style.opacity = 1;
      masterPlay.src = "icons/pause-solid.svg";
      if (index !== null) {
        const currentSong = document.getElementById(`play-${index}`);
        if (currentSong) {
          currentSong.classList.add("playing");
        }
      }
    })
    .catch(err => {
      console.error("Audio play failed:", err);
      alert("Playback failed. Jamendo might be blocking the stream or browser autoplay is preventing it.");
    });
}

function toggleLike(song, index) {
  const likeIcon = document.getElementById(`like-${index}`);
  const songId = String(song.id);
  const isLiked = likedSongs.includes(songId);

  if(isLiked){
    likedSongs = likedSongs.filter(index => index !== songId);
    likeIcon.src = "icons/heart-regular.svg";
    likeIcon.classList.remove("liked");
  }
  else {
    likedSongs.push(songId);
    likeIcon.src = "icons/heart-solid.svg";
    likeIcon.classList.add("liked");
  }

  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
}

function truncateText(text, maxLength = 15) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
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
    document.querySelectorAll(".songListIcon").forEach(icon => icon.classList.remove("playing"));
  }
});

document.addEventListener("keydown", function (e) {
  const tag = e.target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;

  switch (e.key) {
    case " ": // Spacebar
      e.preventDefault();
      masterPlay.click();
      break;

    case "ArrowRight": // Next
      document.getElementById("nextBtn").click();
      break;

    case "ArrowLeft": // Previous
      document.getElementById("previousBtn").click();
      break;

    case "ArrowUp": // Volume up
      e.preventDefault();
      volumeControl.value = Math.min(1, parseFloat(volumeControl.value) + 0.1).toFixed(2);
      audio.volume = volumeControl.value;
      break;

    case "ArrowDown": // Volume down
      e.preventDefault();
      volumeControl.value = Math.max(0, parseFloat(volumeControl.value) - 0.1).toFixed(2);
      audio.volume = volumeControl.value;
      break;

    case "m":
    case "M": // Mute toggle
      e.preventDefault();
      if (audio.volume > 0) {
        audio.volume = 0;
        volumeControl.value = 0;
        volumeIcon.src = "icons/volume-mute-solid.svg";
      } else {
        audio.volume = 0.5;
        volumeControl.value = 0.5;
        volumeIcon.src = "icons/volume-up-solid.svg";
      }
      break;
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentSongIndex < songList.length - 1) {
    playSong(songList[currentSongIndex + 1], currentSongIndex + 1);
  }
});

document.getElementById("previousBtn").addEventListener("click", () => {
  if (currentSongIndex > 0) {
    playSong(songList[currentSongIndex - 1], currentSongIndex - 1);
  }
});

volumeIcon.addEventListener("click", () => {
  if (audio.volume > 0) {
    audio.volume = 0;
    volumeControl.value = 0; 
    volumeIcon.src = "icons/volume-xmark-solid.svg";
  } else {
    audio.volume = 0.5;
    volumeControl.value = 0.5;
    volumeIcon.src = "icons/volume-high-solid.svg";
  }
});
audio.addEventListener("ended", () => {
  masterPlay.src = "icons/play-solid.svg";
  gif.style.opacity = 0;
  if (currentSongIndex < songList.length - 1) {
    playSong(songList[currentSongIndex + 1], currentSongIndex + 1);
  } else {
    audio.currentTime = 0; // Reset to start if no next song
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

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

const throttledScrollHandler = throttle(() => {
  const threshold = 100;
  const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= 
    scrollContainer.scrollHeight - threshold;

  if (atBottom && !loading) {
    offset += 7;
    loadSongs(offset);
  }
}, 250);

const scrollContainer = document.querySelector(".songItemcontainer");
scrollContainer.addEventListener("scroll", throttledScrollHandler);

// Add to script.js
function showMobileLoader() {
  const loader = document.createElement('div');
  loader.className = 'mobile-loader';
  loader.innerHTML = `
    <div class="spinner"></div>
    <p>Loading more songs...</p>
  `;
  document.querySelector('.songItemcontainer').appendChild(loader);
}

function hideMobileLoader() {
  const loader = document.querySelector('.mobile-loader');
  if (loader) loader.remove();
}

// Add to script.js
let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.log('Wake lock not supported');
  }
}

// Call when music starts playing
audio.addEventListener('play', requestWakeLock);

// Release when paused
audio.addEventListener('pause', () => {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
});

// Initial load
loadSongs(offset);
