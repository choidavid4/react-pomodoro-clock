//building a timer from scratch

const INITIAL_MINUTES = 1;

let secondsRemaining = INITIAL_MINUTES * 60;

const INTERVALID = setInterval(handleInterval, 1000);

function handleInterval(){
    let minutes = parseInt(secondsRemaining / 60);
    if(minutes <= 9){
        minutes = "0"+minutes;
    }
    let seconds = secondsRemaining - minutes * 60;
    if(seconds <= 9){
        seconds = "0"+seconds;
    }

    console.log(minutes + ":" + seconds);

    if(minutes === "00" && seconds === "00"){
        console.log("Timer ended");
        clearInterval(INTERVALID);
    }else{
        secondsRemaining--;
    }
}