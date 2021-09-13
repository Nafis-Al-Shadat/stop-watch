let start = true;
let stopBtn = false;
let resetBtn = false;
let counter = false;
let speaker = true;
let lapCount = 1;
let timer;

// function for getting elm by id 
const getELm = id =>{
   return document.getElementById(id)
}
// function  for event listeners
const addEvent = (id,name,func,obj) =>{
    getELm(id).addEventListener(name,func,obj);
}
//height 
let height = getELm('main').offsetHeight;
// sound elements 
const secondAudio = getELm('second-audio');
const minuteAudio = getELm('minute-audio');
const successAudio = getELm('success-audio');
const buttonAudio = getELm('button-audio');
successAudio.volume = 0.05;
// speaker icon change button
addEvent('speaker','click',()=>{
    buttonAudio.play(); 
    speaker = !speaker;
    if(speaker){
        getELm('speaker').innerHTML = `<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#eee">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg> </div>`
    } else{
        getELm('speaker').innerHTML = `<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg></div>`
    }
});
// start button 
addEvent('start-btn','click',()=>{
    if(start){
        if(speaker){
            buttonAudio.play();
        }  
        start = false;
        resetBtn = false;
        counter = true;
        startTimer();
        getELm('laps').innerHTML = '';
        // setting localStorage 
        localStorage.removeItem('laps')
        // displaying laps none 
        getELm('remove').style.display = 'none';
        getELm('laps').style.display = 'none';
        getELm('main-section').style.margin = "0";
        getELm('main-section').style.padding = "0";
        getELm('main').style.marginTop = '0';
        getELm('main-section').style.height = "100vh";
        lapCount = 1;
   }
});
// toast cross button
addEvent('toast-btn','click',()=>{
    getELm('liveToast').style.display = 'none'
});
// lap button toast showing
addEvent('lap-btn','click',()=>{
    if(lapCount === 1){
        const milisecond = getELm('milisecond').innerText;
        const second = getELm('second').innerText;
        const minute = getELm('minute').innerText;
        const hour = getELm('hour').innerText;
        if(!(+milisecond !== 0 || +second !== 0 || +minute !== 0 || +hour !== 0)) return
        getELm('liveToast').style.display = 'block'
        setTimeout(()=>{
            getELm('liveToast').style.opacity = '0';
            getELm('liveToast').style.transition = 'all 1s ease';
        },7000);
    }
},{once:true});
addEvent('liveToast','transitionend',()=>{
    getELm('liveToast').style.display = "none"
});
// lap button
addEvent('lap-btn','click',()=>{
    const milisecond = getELm('milisecond').innerText;
    const second = getELm('second').innerText;
    const minute = getELm('minute').innerText;
    const hour = getELm('hour').innerText;
    const laps = getELm('laps');
    if(!(+milisecond !== 0 || +second !== 0 || +minute !== 0 || +hour !== 0)) return
    if(speaker){
        successAudio.play();
        successAudio.currentTime = 0;
    }
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="m-3">${+lapCount}. &nbsp; ${+hour}hr, ${+minute}min, ${+second}sec, and ${+milisecond*10} milisec</div>
    `;
    laps.appendChild(div);
    getELm('remove').style.display = 'block';
    getELm('laps').style.display = 'block';
    // scrolling to the bottom of laps 
    laps.scrollTo(0,document.getElementById('laps').scrollHeight);
    updateLocal({hour,minute,second,milisecond,lapCount});
    lapCount++;
    deviceFriendly();
});
//stop button
addEvent('stop-btn','click',()=>{
    if(speaker){
        buttonAudio.play();
    } 
    start = true;
    stopBtn = true;
    counter = false;
    startTimer();
});
//reset button
addEvent('reset-btn','click',()=>{
    if(speaker){
        buttonAudio.play(); 
    }
    start = true;
    resetBtn = true;
    counter = false;
    // resetting times laps and calling timer 
    getELm('milisecond').innerText = '00';
    getELm('second').innerText = '00';
    getELm('minute').innerText = '00';
    getELm('hour').innerText = '00';
    startTimer();
});
// remove lap button
addEvent('remove','click',()=>{
    if(speaker){
        buttonAudio.play(); 
    }
    localStorage.removeItem('laps')
    getELm('laps').textContent = '';
    lapCount = 1;
    getELm('remove').style.display = 'none';
    getELm('laps').style.display = 'none';
    deviceFriendly();
    getELm('main').style.marginTop = '0';
    getELm('main-section').style.margin = "0";
    getELm('main-section').style.padding = "0";
    getELm('main-section').style.height = '100vh';
});
// updating local storage 
const updateLocal = obj =>{
    const laps = getLaps();
    console.log(laps)
    laps.count = lapCount;
    if(laps.results){
        laps.results = laps.results;
    }else{
        laps.results = [];
    }
    laps.results.push(obj);
    localStorage.setItem('laps',JSON.stringify(laps))
}
const getLaps = ()=>{
    let laps = localStorage.getItem('laps')
    if(laps && laps !== {}){
        return JSON.parse(laps);
    }else{
        return laps = {};
    }
}
// displaying local storage data 
const displayLocalStorage = () =>{
    let laps = localStorage.getItem('laps');
    laps = JSON.parse(laps)
    if(laps && laps !== {}){
        laps?.results?.forEach(result=>{
            getELm('laps').style.display = 'block'
            const laps = getELm('laps');
            const div = document.createElement('div');
            div.innerHTML = `
            <div class="m-3">${+result.lapCount}. &nbsp; ${+result.hour}hr, ${+result.minute}min, ${+result.second}sec, and ${+result.milisecond*10} milisec</div>
            `;
            laps.appendChild(div);
        });
        if(laps.count){
            lapCount = +laps.count + 1;
        }else{
            getELm('remove').style.display = 'none';
            getELm('laps').style.display = 'none';
        }
    }else{
        getELm('remove').style.display = 'none';
        getELm('laps').style.display = 'none';
    }

}
displayLocalStorage();

// starting the stop watch an setting its time in dom 

const startTimer = () =>{
    if(counter){
        timer = setInterval(()=>{
            const milisec = getELm('milisecond');
            // setting milisec 
            if(+milisec.innerText <9){
                const zero = '0';
                const result = (+milisec.innerText + 1)+''
                milisec.innerText = zero + result;
            }
            else{
            milisec.innerText = +milisec.innerText + 1
            }
            // setting sec 
            if(+milisec.innerText > 99){
                if(speaker){
                    secondAudio.play();
                }
                const sec = getELm('second')
                if(+sec.innerText<9){
                    const zero = "0";
                    const result =  +sec.innerText + 1;
                    sec.innerText = zero + result;
                }else{
                sec.innerText = +sec.innerText + 1;
                }
                milisec.innerText = '00';
                //setting min
                if(+sec.innerText >59){
                    if(speaker){
                        minuteAudio.play();
                    setTimeout(() => {
                        minuteAudio.pause();
                        minuteAudio.currentTime = 0;
                    }, 1000);
                    }
                    const min = getELm('minute')
                    if(+min.innerText < 9){
                        const zero = "0";
                        const result =  +min.innerText + 1;
                        min.innerText = zero + result;
                    }else{
                        min.innerText = +min.innerText + 1; 
                    }
                    sec.innerText = '00';
                    //setting hour
                        if(+min.innerText > 59){
                            const hour = getELm('hour')
                        if(+hour.innerText < 9){
                            const zero = "0";
                            const result =  +hour.innerText + 1;
                            hour.innerText = zero + result;
                        }else{
                            hour.innerText = +hour.innerText + 1; 
                        }
                        min.innerText = '00';
                        }
                }
            }
        },10)
    }else{
        clearInterval(timer)
    }
}

// making it device friendly 
window.onload = ()=>{
    if(lapCount > 1){
        height = getELm('main').offsetHeight;
        deviceFriendly()
    }
}
const deviceFriendly = () =>{
    if(window.innerWidth < 650){
        getELm('main-section').style.height = "auto";
        getELm('main').style.marginTop = "90px";
        getELm('main-section').style.marginBottom = "10px";
        height = getELm('main').offsetHeight;
        getELm('main-section').style.height = "auto";getELm('laps').style.top = (height + 150)+'px';
        getELm('laps').style.height = window.innerHeight - getELm('remove').offsetHeight - 200 -height+ 'px';
    }
    if(window.innerHeight > 1000 && window.innerWidth > 700){
        getELm('main-section').style.height = "auto";
        getELm('main').style.marginTop = "290px";
        getELm('main-section').style.marginBottom = "10px";
        height = getELm('main').offsetHeight;
        getELm('laps').style.top = (height + 350)+'px';
        getELm('laps').style.height = window.innerHeight - getELm('remove').offsetHeight - 500 -height+ 'px';
    }
}
// deviceFriendly();
