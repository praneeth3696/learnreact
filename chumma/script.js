const albums = {
    ram: {
        title: "Random Access Memories",
        year: "2013",
        cover: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
        tracks: [
            ["Give Life Back to Music","4:35","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"],
            ["Get Lucky","6:09","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"],
        ]
    },
    discovery: {
        title: "Discovery",
        year: "2001",
        cover: "https://upload.wikimedia.org/wikipedia/en/a/ae/Daft_Punk_-_Discovery.jpg",
        tracks: [
            ["One More Time","5:20","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"],
            ["Digital Love","4:58","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"],
        ]
    },
    homework: {
        title: "Homework",
        year: "1997",
        cover: "https://upload.wikimedia.org/wikipedia/en/9/9c/Daftpunk-homework.jpg",
        tracks: [
            ["Around the World","7:10","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"],
        ]
    }
};

const modal = document.getElementById("albumModal");
const trackList = document.getElementById("trackList");
const audioPlayer = document.getElementById("audioPlayer");
const equalizer = document.getElementById("equalizer");

/* Album Open */
document.querySelectorAll(".album-card").forEach(card=>{
    card.addEventListener("click",()=>{
        const album = albums[card.dataset.album];
        document.getElementById("modalTitle").innerText = album.title;
        document.getElementById("modalYear").innerText = album.year;
        document.getElementById("modalCover").src = album.cover;

        trackList.innerHTML="";
        album.tracks.forEach(track=>{
            const li=document.createElement("li");
            li.innerHTML=`<span>${track[0]}</span><span>${track[1]}</span>`;
            li.addEventListener("click",()=>{
                audioPlayer.src=track[2];
                audioPlayer.play();
                equalizer.classList.add("playing");
            });
            trackList.appendChild(li);
        });

        modal.style.display="flex";
    });
});

/* Stop Audio */
audioPlayer.addEventListener("pause",()=>{
    equalizer.classList.remove("playing");
});

/* Close Modal */
document.querySelector(".close").onclick=()=>{
    modal.style.display="none";
    audioPlayer.pause();
};

/* Mouse Parallax Glow */
document.addEventListener("mousemove",e=>{
    const glow=document.querySelector(".mouse-glow");
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
});