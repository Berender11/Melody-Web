// Initializing Variables
let songIndex = 0;
let volumeCount = 1;
let audioElement = new Audio("songs/acousticbreeze.mp3");
let masterPlay = document.getElementById("masterPlay");
let previousBtn = document.getElementById("previousBtn");
let nextBtn = document.getElementById("nextBtn");
let myProgressBar = document.getElementById("songBar");
let gif = document.getElementById("gif");
let masterSongName = document.getElementById("masterSongName");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let songListIcon = Array.from(document.getElementsByClassName("songListIcon"));
let volumeBtn = document.querySelector(".volumeIcon");
let volumeValue = document.querySelector("#volume");

//Song List
let songs = [
    { songName: "Acousticbreeze", filePath: "songs/acousticbreeze.mp3", coverPath: "covers/acousticbreeze.jpg", duration: "2:30" },
    { songName: "Creativeminds", filePath: "songs/creativeminds.mp3", coverPath: "covers/creativeminds.jpg", duration: "3:15" },
    { songName: "Echoing Streets", filePath: "songs/echoing-streets.mp3", coverPath: "covers/echoing-streets.jpg", duration: "4:20" },
    { songName: "Elektronomia", filePath: "songs/Elektronomia - Energy.mp3", coverPath: "covers/Elektronomia - Energy.jpg", duration: "2:00" },
    { songName: "Jazzcomedy", filePath: "songs/jazzcomedy.mp3", coverPath: "covers/jazzcomedy.jpg", duration: "1:40" },
    { songName: "Slow-burn", filePath: "songs/Kevin-Slow-burn.mp3", coverPath: "covers/Kevin-Slow-burn.jpg", duration: "4:10" },
    { songName: "Ukulele", filePath: "songs/ukulele.mp3", coverPath: "covers/ukulele.jpg", duration: "3:30" },
]

masterSongName.innerText = songs[0].songName;
audioElement.volume = 0.2;

songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
    element.getElementsByClassName("timeStamp")[0].innerHTML = songs[i].duration;
})
//FUNCTIONS
let playPauseSong = () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.src = "icons/pause-solid.svg";
        gif.style.opacity = 1;
    }
    else {
        audioElement.pause();
        masterPlay.src = "icons/play-solid.svg";
        gif.style.opacity = 0;
    }
};

let songSync = () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
};

let songbarUpdate = () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
}

const makeAllPlay = () => {
    Array.from(document.getElementsByClassName("songListIcon")).forEach((element) => {
        element.src = "icons/play-solid.svg";
    })
};

let previousSong = () => {
    if (songIndex <= 0) {
        songIndex = 0;
    }
    else {
        songIndex -= 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.src = "icons/pause-solid.svg";
}

let nextSong = () => {
    if (songIndex >= 6) {
        songIndex = 0;
    }
    else {
        songIndex += 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.src = "icons/pause-solid.svg";
}

let volumeControl = () => {
    if (volumeCount == 1) {
        audioElement.volume = 0;
        volumeValue.value = 0;
        volumeBtn.src = "icons/volume-xmark-solid.svg";
        volumeCount = 0;
    } else {
        audioElement.volume = 0.2;
        volumeBtn.src = "icons/volume-high-solid.svg";
        volumeValue.value = 0.2;
        volumeCount = 1;
    }
}

masterPlay.addEventListener("click", playPauseSong);

audioElement.addEventListener("timeupdate", songbarUpdate);

myProgressBar.addEventListener("change", songSync);

volumeValue.addEventListener("change", ()=>{
    if (volumeValue.value == 0) {
        volumeBtn.src = "icons/volume-xmark-solid.svg";
        audioElement.volume = 0;
    } else {
        volumeBtn.src = "icons/volume-high-solid.svg";
        audioElement.volume = volumeValue.value;
    }
});

songListIcon.forEach((element) => {
    element.addEventListener("click", (e) => {
        makeAllPlay();
        songIndex = parseInt(e.target.id);
        e.target.src = "icons/pause-solid.svg";
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.src = "icons/pause-solid.svg";
    })
});

previousBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);
volumeBtn.addEventListener("click", volumeControl);