// Initializing Variables
let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
audioElement.volume = 0.1;
let masterPlay = document.getElementById("masterPlay");
let previousBtn = document.getElementById("previousBtn");
let nextBtn = document.getElementById("nextBtn");
let myProgressBar = document.getElementById("songBar");
let gif = document.getElementById("gif");
let masterSongName = document.getElementById("masterSongName");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let songListIcon = Array.from(document.getElementsByClassName("songListIcon"));

//Song List
let songs = [
    { songName: "Salam-e-ishq1", filePath: "songs/1.mp3", coverPath: "covers/1.jpg", duration: "2:30" },
    { songName: "Salam-e-ishq2", filePath: "songs/2.mp3", coverPath: "covers/2.jpg", duration: "3:15" },
    { songName: "Salam-e-ishq3", filePath: "songs/3.mp3", coverPath: "covers/3.jpg", duration: "4:20" },
    { songName: "Salam-e-ishq4", filePath: "songs/4.mp3", coverPath: "covers/4.jpg", duration: "2:00" },
    { songName: "Salam-e-ishq5", filePath: "songs/5.mp3", coverPath: "covers/5.jpg", duration: "1:40" },
    { songName: "Salam-e-ishq6", filePath: "songs/6.mp3", coverPath: "covers/6.jpg", duration: "4:10" },
    { songName: "Salam-e-ishq7", filePath: "songs/7.mp3", coverPath: "covers/7.jpg", duration: "3:30" },
]

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
    audioElement.src = `songs/${songIndex+1}.mp3`;
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
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.src = "icons/pause-solid.svg";
}

masterPlay.addEventListener("click", playPauseSong);

audioElement.addEventListener("timeupdate", songbarUpdate);

myProgressBar.addEventListener("change", songSync);

songListIcon.forEach((element) => {
    element.addEventListener("click", (e) => {
        makeAllPlay();
        songIndex = parseInt(e.target.id);
        e.target.src = "icons/pause-solid.svg";
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.src = "icons/pause-solid.svg";
    })
});

previousBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);