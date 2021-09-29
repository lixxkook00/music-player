const musicArea = document.querySelector('.musics')
const categoryArea = document.querySelector('.category')
const songSection = document.querySelector('.song__section')
const songTimeEnd = document.querySelector('.process__end')
const songTimeCurrent = document.querySelector('.process__start')

const audio = document.querySelector('.audio')
const btnPrev = document.querySelector('#btnPrev')
const btnPlay = document.querySelector('#btnPlay')
const btnNext = document.querySelector('#btnNext')
const btnRandom = document.querySelector('#btnRandom')
const btnUndo = document.querySelector('#btnUndo')


import data,  {category} from './data.js'

// Render UI
const renderMusic = (data) => {
    const songsRaw = data.map((song) => {
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
        `
    }).join("");

    musicArea.innerHTML = songsRaw;
}

const renderCategory = (data) => {
    const categoryRaw = data.map((item) => {
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
        `
    }).join("")
    categoryArea.innerHTML = categoryRaw;
}

renderMusic(data)
renderCategory(category)

// Handle Event
let currentIndexSong = 0;
const listSongLength = data.length;

const songs = document.querySelectorAll('.musics__item');

// Select from list
songs.forEach((song) => {
    song.onclick = () => {
        // // Active UI
        // songs.forEach((song) => {
        //     song.classList.remove('active');
        // })
        // song.classList.add('active');
        
        // updata song section
        const currentIndex = song.dataset.index -1
        currentIndexSong = currentIndex
        setSongPlaying(currentIndexSong)

        console.log(song)
    }
})

// Handle controls
const setSongPlaying = (index) => {
    const musicURL = data[index].musicURL;
    // Active UI
    songs.forEach((song) => {
        song.classList.remove('active');
    })
    songs[currentIndexSong].classList.add('active');

    // set song section
    songTimeEnd.innerText = `${data[index].length}`
    songSection.innerHTML = `
                            <div class="song__section-img">
                            <img src="${data[index].imgURL}" alt="" />
                            </div>
                            <div class="song__section-title">${data[index].title}</div>
                        `


    // play song
    audio.src = `./asset/music/${musicURL}`
    audio.play();

    // Update current time
    setInterval(() => {
        // convert to minute
        const sectionCurrentTimeSecond = parseInt(audio.currentTime)%60;
        const sectionCurrentTimeMinute = Math.floor(audio.currentTime/60);

        let second = '';
        if(sectionCurrentTimeSecond < 10){
            second = `0${sectionCurrentTimeSecond}`
        }else{
            second = sectionCurrentTimeSecond
        }
        songTimeCurrent.innerText = `${sectionCurrentTimeMinute}:${second}`
    },1000)
}

// Control Onclick
btnPrev.onclick = () => {
    if(currentIndexSong > 0){
        currentIndexSong = currentIndexSong - 1;
        setSongPlaying(currentIndexSong);
    }else if(currentIndexSong === 0) {
        currentIndexSong = listSongLength-1;
        setSongPlaying(currentIndexSong);
    }
    console.log(currentIndexSong)
}
btnPlay.onclick = () => {
    audio.pause()
}
btnNext.onclick = () => {
    if(currentIndexSong === (listSongLength-1)){
        currentIndexSong = 0;
        setSongPlaying(currentIndexSong);
    }else{
        currentIndexSong = currentIndexSong + 1;
        setSongPlaying(currentIndexSong);
    }
    console.log(currentIndexSong)
}
btnRandom.onclick = () => {
    console.log('random')
}
btnUndo.onclick = () => {
    console.log('undo')
}

