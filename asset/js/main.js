// Element
const musicArea = document.querySelector(".musics");
const categoryArea = document.querySelector(".category");
const songSection = document.querySelector(".song__section");
const songTimeEnd = document.querySelector(".process__end");
const songTimeCurrent = document.querySelector(".process__start");
const processPlaying = document.querySelector("#processPlaying");
const processMain = document.querySelector("#processMain");
// Button
const audio = document.querySelector(".audio");
const btnPrev = document.querySelector("#btnPrev");
const btnPlay = document.querySelector("#btnPlay");
const btnNext = document.querySelector("#btnNext");
const btnRandom = document.querySelector("#btnRandom");
const btnUndo = document.querySelector("#btnUndo");
const playIcon = document.querySelector("#playIcon");
const pauseIcon = document.querySelector("#pauseIcon");
const btnMuted = document.querySelector("#btnMuted");
const btnMute = document.querySelector("#btnMute");
const btnMutes = document.querySelector("#btnMutes");

import data, { category } from "./data.js";

// Render UI
const renderMusic = (data) => {
    const songsRaw = data
        .map((song) => {
            return `
            <div class="musics__item" data-music="${song.musicURL}" data-index="${song.id}">
                <div class="musics__item-no">${song.id}</div>
                <div class="musics__item-img">
                <img src="${song.imgURL}" alt="" />
                </div>
                <div class="musics__item-body">
                <div class="musics__item-title text-one-line">
                    ${song.title}
                </div>
                <div class="musics__item-album text-one-line">
                    ${song.album}
                </div>
                </div>
                <div class="musics__item-time">${song.length}</div>
            </div>
        `;
        })
        .join("");

    musicArea.innerHTML = songsRaw;
};

const renderCategory = (data) => {
    const categoryRaw = data
        .map((item) => {
            return `
            <div class="col-xl-2 col-md-3">
                <div class="category__item">
                    <div class="category__item-img">
                        <img src="${item.imgURL}" alt="" />
                    </div>
                    <div class="category__item-album">${item.album}</div>
                    <div class="category__item-title text-one-line">${item.title}</div>
                    <div class="category__item-time">${item.date}</div>
                </div>
            </div>
        `;
        })
        .join("");
    categoryArea.innerHTML = categoryRaw;
};

const showIcon = (state) => {
    if (state) {
        showIconPause();
        playingState = true;
    } else {
        showIconPlay();
        playingState = false;
    }
};

const showIconPlay = () => {
    playIcon.classList.remove("hide");
    pauseIcon.classList.add("hide");
};

const showIconPause = () => {
    playIcon.classList.add("hide");
    pauseIcon.classList.remove("hide");
};

renderMusic(data);
renderCategory(category);

// Handle Event
const songs = document.querySelectorAll(".musics__item");

let currentIndexSong = 0;
let playingState = false;
let randomState = false;
let undoState = false;
let muteState = false;
const listSongLength = data.length;

// Update current time
const updateCurrentTimePlaying = () => {
    const sectionCurrentTimeSecond = parseInt(audio.currentTime) % 60;
    const sectionCurrentTimeMinute = Math.floor(audio.currentTime / 60);

    // format minute type
    let second = "";
    if (sectionCurrentTimeSecond < 10) {
        second = `0${sectionCurrentTimeSecond}`;
    } else {
        second = sectionCurrentTimeSecond;
    }
    songTimeCurrent.innerText = `${sectionCurrentTimeMinute}:${second}`;

    // update process bar
    processPlaying.style.width = `${parseInt(
        (audio.currentTime / audio.duration) * 100
    )}%`;
};

// Select from list
songs.forEach((song) => {
    song.onclick = () => {
        const currentIndex = song.dataset.index - 1;
        currentIndexSong = currentIndex;
        playSong(currentIndexSong);
    };
});

// Handle controls
const stopSong = () => {
    audio.pause();
    showIcon(false);
};

const playSong = (index) => {
    const musicURL = data[index].musicURL;
    // Active UI
    songs.forEach((song) => {
        song.classList.remove("active");
    });
    songs[currentIndexSong].classList.add("active");

    // set song section
    songTimeEnd.innerText = `${data[index].length}`;
    songSection.innerHTML = `
                            <div class="song__section-img">
                            <img src="${data[index].imgURL}" alt="" />
                            </div>
                            <div class="song__section-title">${data[index].title}</div>
                        `;

    // play song
    audio.src = `./asset/music/${musicURL}`;
    audio.play();

    // Update per second current time
    setInterval(() => {
        updateCurrentTimePlaying();
        // Handle song overl
        if (audio.ended) {
            if (undoState) {
                playSong(currentIndexSong);
            } else {
                nextSong();
            }
        }
    }, 1000);

    // Show icon pause
    showIcon(true);
};

// Control Onclick
const prevSong = () => {
    if (!randomState) {
        if (currentIndexSong > 0) {
            currentIndexSong = currentIndexSong - 1;
            playSong(currentIndexSong);
        } else if (currentIndexSong === 0) {
            currentIndexSong = listSongLength - 1;
            playSong(currentIndexSong);
        }
    } else {
        currentIndexSong = parseInt(Math.random() * listSongLength);
        playSong(currentIndexSong);
        console.log(randomState, currentIndexSong);
    }
};

const nextSong = () => {
    if (!randomState) {
        if (currentIndexSong === listSongLength - 1) {
            currentIndexSong = 0;
            playSong(currentIndexSong);
        } else {
            currentIndexSong = currentIndexSong + 1;
            playSong(currentIndexSong);
        }
    } else {
        currentIndexSong = parseInt(Math.random() * listSongLength);
        playSong(currentIndexSong);
    }
};

// BUTTON NEXT
btnPrev.onclick = () => {
    prevSong();
};
// BUTTON PLAY/PAUSE
btnPlay.onclick = () => {
    if (playingState) {
        stopSong();
    } else {
        audio.play();
        showIcon(true);
    }
};

// BUTTON NEXT
btnNext.onclick = () => {
    nextSong();
};
// BUTTON RANDOM
btnRandom.onclick = () => {
    if (!randomState) {
        btnRandom.classList.add("active");
        randomState = true;
    } else {
        btnRandom.classList.remove("active");
        randomState = false;
    }
};
// BUTTON UNDO
btnUndo.onclick = () => {
    if (!undoState) {
        btnUndo.classList.add("active");
        undoState = true;
    } else {
        btnUndo.classList.remove("active");
        undoState = false;
    }
};

// BUTTON MUTE
btnMutes.onclick = () => {
    if (muteState) {
        btnMuted.classList.add("hide");
        btnMute.classList.remove("hide");
        muteState = false;
    } else {
        btnMuted.classList.remove("hide");
        btnMute.classList.add("hide");
        muteState = true;
    }
    audio.muted = muteState;
};

// PROCESS BAR
processMain.onclick = (e) => {
    const processBarMaxWidth = processMain.offsetWidth;
    const processBarCurrentWidth = e.offsetX;

    // getValue
    const valuePercentProcessOnClick = parseInt(
        (processBarCurrentWidth / processBarMaxWidth) * 100
    );

    // setValue
    processPlaying.style.width = `${valuePercentProcessOnClick}%`;
    audio.currentTime = (valuePercentProcessOnClick / 100) * audio.duration;
    audio.play();
    showIcon(true);
};

// Handle event keydown
document.addEventListener("keydown", (event) => {
    // Play-Pause
    if (event.code === "Space") {
        if (playingState) {
            stopSong();
        } else {
            audio.play();
            showIcon(true);
            playSong(currentIndexSong);
            playingState = true;
        }
        event.preventDefault();
    }
});
