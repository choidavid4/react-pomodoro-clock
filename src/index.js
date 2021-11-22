import React from "react";
import ReactDOM from "react-dom";
import './index.css';

class MyTimer extends React.Component{
    constructor(props){
        super(props);

        this.INTERVALID = 0;
        this.state = {
            secondsRemaining: this.props.minutes * 60,
            mmss: (this.props.minutes <= 9) ? 
            "0" + this.props.minutes + ":00" : 
            this.props.minutes + ":00" ,
            paused: true
        }

        this.handleInterval = this.handleInterval.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleInterval(){
        let secondsRemaining = this.state.secondsRemaining;
        if(secondsRemaining <= 0){
            clearInterval(this.INTERVALID);
        }else{
            secondsRemaining--;
            let minutes = parseInt(secondsRemaining / 60);
            if(minutes <= 9){
                minutes = "0" + minutes;
            }
            let seconds = secondsRemaining - minutes * 60;
            if(seconds <= 9){
                seconds = "0" + seconds;
            }
            let mmss = minutes + ":" + seconds;
            this.setState({secondsRemaining, mmss});
        }
    }

    handlePause(){
        if(this.state.paused){
            this.INTERVALID = setInterval(this.handleInterval, 1000);
            this.setState({paused: false});
        }else{
            clearInterval(this.INTERVALID);
            this.setState({paused: true});
        }
    }

    handleReset(){
        clearInterval(this.INTERVALID);
        this.setState({
            secondsRemaining: this.props.minutes * 60,
            mmss: (this.props.minutes <= 9) ? 
            "0" + this.props.minutes + ":00" : 
            this.props.minutes + ":00" ,
            paused: true
        });
    }

    render(){
        return(
            <div>
                <h2>{this.state.mmss}</h2>
                <button onClick={this.handlePause} >Start / Pause</button>
                <button onClick={this.handleReset} >Reset</button>
            </div>
        );
    }
}

class TimeLengthControl extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let type = this.props.type;
        let typeUpper = type[0].toUpperCase() + type.slice(1);
        let isBreak = true;
        if(type === "session") isBreak = false;
        return(     
            <div className="length-container">
                <h2 id={type + "-label"}>
                    {typeUpper + " length"}
                </h2>
                <div className="length-controls">
                    <p 
                        id={type + "-length"} 
                        className="length-number"
                    >
                        {this.props.length}
                    </p>
                    <button 
                        id={type + "-decrement"}
                        onClick={() => this.props.handleDec(isBreak)}
                    >-</button>
                    <button 
                        id={type + "-increment"}
                        onClick={() => this.props.handleInc(isBreak)}
                    >+</button>
                </div>
            </div>
        );
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        
        this.INTERVALID = 0;
        this.beep;
        this.state = {
            break: 5,
            session: 25,
            duringSession: true,
            secondsRemaining: 3,
            paused: true,
        };

        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleInterval = this.handleInterval.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount(){
        this.beep = document.getElementById("beep");
    }

    handleDecrement(isBreak){
        if(this.state.paused){
            if(isBreak){
                if(this.state.break > 1){
                    this.setState({
                        break: this.state.break-1,
                    });
                }
            }else{
                if(this.state.session > 1){
                    if(this.state.duringSession){
                        this.setState(
                            {
                                session: this.state.session - 1,
                                secondsRemaining: (this.state.session - 1) * 60
                            }
                        );
                    }else{
                        this.setState(
                            {
                                session: this.state.session - 1,
                            }
                        );
                    }
                }
            }
        }
    }

    handleIncrement(isBreak){
        if(this.state.paused){
            if(isBreak){
                if(this.state.break < 60){
                    this.setState({
                        break: this.state.break+1,
                    });
                }
            }else{
                if(this.state.session < 60){
                    if(this.state.duringSession){
                        this.setState(
                            {
                                session: this.state.session + 1,
                                secondsRemaining: (this.state.session + 1) * 60
                            }
                        );
                    }else{
                        this.setState(
                            {
                                session: this.state.session + 1,
                            }
                        );
                    }
                }
                
            }
        }
    }

    handleInterval(){
        let secondsRemaining = this.state.secondsRemaining;
        if(secondsRemaining <= 0){
            this.playBeep();
            clearInterval(this.INTERVALID);
            if(this.state.duringSession){
                this.startBreak();
            }else{
                this.startSession();
            }
            
        }else{
            secondsRemaining--;
            this.setState({secondsRemaining});
        }
    }


    handlePause(){
        if(this.state.paused){
            this.INTERVALID = setInterval(this.handleInterval, 1000);
            this.setState({paused: false});
        }else{
            clearInterval(this.INTERVALID);
            this.setState({paused: true});
        }
    }

    handleReset(){
        clearInterval(this.INTERVALID);
        this.setState({
            break: 5,
            session: 25,
            duringSession: true,
            secondsRemaining: 25 * 60,
            paused: true,
        });
        this.beep.pause();
        this.beep.load();
    }


    // AUX FUNCTIONS

    startBreak(){
        this.setState({
            duringSession: false,
            secondsRemaining: this.state.break * 60,
            paused: false,
        });
        this.INTERVALID = setInterval(this.handleInterval, 1000);
    }

    startSession(){
        this.setState({
            duringSession: true,
            secondsRemaining: this.state.session * 60,
            paused: false,
        });
        this.INTERVALID = setInterval(this.handleInterval, 1000);
    }


    playBeep(){
        this.beep.play();
    }

    processSeconds(secondsRemaining){
        let minutes = parseInt(secondsRemaining / 60);
        if(minutes <= 9){
            minutes = "0" + minutes;
        }
        let seconds = secondsRemaining - minutes * 60;
        if(seconds <= 9){
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    render(){
        // console.log(this.state);
        let statusString = this.state.duringSession ? "Session" : "Break";
        return(
            <div id="app">
                <div className="lengths">
                    <TimeLengthControl 
                        type = "break"
                        length = {this.state.break}
                        handleDec={(isBreak) => this.handleDecrement(isBreak)}
                        handleInc={(isBreak) => this.handleIncrement(isBreak)}
                    />
                    <TimeLengthControl 
                        type = "session"
                        length = {this.state.session}
                        handleDec={(isBreak) => this.handleDecrement(isBreak)}
                        handleInc={(isBreak) => this.handleIncrement(isBreak)}
                    />
                </div>
                <div className="timer-container">
                    <h2 id="timer-label">{statusString}</h2>
                    <p id="time-left">{this.processSeconds(this.state.secondsRemaining)}</p>
                    <div id="controls">
                        <button 
                        id="start_stop"
                        onClick={this.handlePause}
                        >
                            Start / Pause
                        </button>
                        <button 
                         id="reset"
                         onClick={this.handleReset}
                        >Reset</button>
                    </div>
                </div>
                <audio 
                    id="beep"
                    src="http://soundfxcenter.com/television/dragon-ball-z/8d82b5_Dragon_Ball_Z_Gohan_Yells_Sound_Effect.mp3"
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);


/*
AUDIOS:
    annoying beep: 
    https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav
    
    gohan:
    http://soundfxcenter.com/television/dragon-ball-z/8d82b5_Dragon_Ball_Z_Gohan_Yells_Sound_Effect.mp3

*/

//Pensar como implementar el start/stop
/*
RESET BUTTON
1. stops the running timer
2. break-length returns to 5
3. session length returns to 25
4. time-left resets to default state (25:00)
5. stops audio and rewinds to beginning
*/