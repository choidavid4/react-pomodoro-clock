import React from "react";
import ReactDOM from "react-dom";
import './index.css';

/*
User Story #1: I can see an element with id="break-label" that contains a string (e.g. "Break Length"). DONE

User Story #2: I can see an element with id="session-label" that contains a string (e.g. "Session Length"). DONE

User Story #3: I can see two clickable elements with corresponding IDs: id="break-decrement" and id="session-decrement". DONE

User Story #4: I can see two clickable elements with corresponding IDs: id="break-increment" and id="session-increment". DONE

User Story #5: I can see an element with a corresponding id="break-length", which by default (on load) displays a value of 5. DONE

User Story #6: I can see an element with a corresponding id="session-length", which by default displays a value of 25. DONE

User Story #7: I can see an element with a corresponding id="timer-label", that contains a string indicating a session is initialized (e.g. "Session"). DONE

User Story #8: I can see an element with corresponding id="time-left". NOTE: Paused or running, the value in this field should always be displayed in mm:ss format (i.e. 25:00). DONE

User Story #9: I can see a clickable element with a corresponding id="start_stop". DONE

User Story #10: I can see a clickable element with a corresponding id="reset". DONE

User Story #11: When I click the element with the id of reset, any running timer should be stopped, the value within id="break-length" should return to 5, the value within id="session-length" should return to 25, and the element with id="time-left" should reset to its default state. 

User Story #12: When I click the element with the id of break-decrement, the value within id="break-length" decrements by a value of 1, and I can see the updated value. DONE

User Story #13: When I click the element with the id of break-increment, the value within id="break-length" increments by a value of 1, and I can see the updated value. DONE

User Story #14: When I click the element with the id of session-decrement, the value within id="session-length" decrements by a value of 1, and I can see the updated value. DONE

User Story #15: When I click the element with the id of session-increment, the value within id="session-length" increments by a value of 1, and I can see the updated value. DONE

User Story #16: I should not be able to set a session or break length to <= 0. DONE

User Story #17: I should not be able to set a session or break length to > 60. DONE

User Story #18: When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25. 

User Story #19: If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).

User Story #20: If the timer is running and I click the element with id="start_stop", the countdown should pause.

User Story #21: If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.

User Story #22: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.

User Story #23: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element. 

User Story #24: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a session has begun. 

User Story #25: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown should begin, counting down from the value currently displayed in the id="session-length" element.

User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".

User Story #27: The audio element with id="beep" must be 1 second or longer. DONE

User Story #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.
*/

/*
Elementos obligatorios

id: descripcion

break-label: string "break length" DONE
session-label: string "session length" DONE

break-decrement: break down button DONE
session-decrement: session down button DONE
break-increment: break up button DONE
session-increment: session up button DONE

break-length: break length number DONE
session-length: session length number DONE

timer-label: session/break string DONE
time-left: mm:ss format DONE

start_stop: start/stop button DONE
reset: reset button DONE

beep: html5 audio element DONE
*/

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
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.state = {
            break: 5,
            session: 25,
            duringSession: true,
        };
    }

    handleDecrement(isBreak){
        if(isBreak){
            if(this.state.break > 1){
                this.setState({break: this.state.break-1});
            }
        }else{
            if(this.state.session > 1){
                this.setState({session: this.state.session-1});
            }
        }
    }

    handleIncrement(isBreak){
        if(isBreak){
            if(this.state.break < 60){
                this.setState({break: this.state.break+1});
            }
        }else{
            if(this.state.session < 60){
                this.setState({session: this.state.session+1});
            }
        }
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
                    <p id="time-left">{this.state.session}:00</p>
                    <div id="controls">
                        <button 
                        id="start_stop"
                        >
                            Start / Stop
                        </button>
                        <button id="reset">Reset</button>
                    </div>
                </div>
                <audio 
                    id="beep"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);


//Pensar como implementar el start/stop
/*
RESET BUTTON
1. stops the running timer
2. break-length returns to 5
3. session length returns to 25
4. time-left resets to default state (25:00)
5. stops audio and rewinds to beginning
*/