
//creating timer function


//React

//App

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timed: null
    }
    this.handleClickBd = this.handleClickBd.bind(this);
    this.handleClickBi = this.handleClickBi.bind(this);
    this.handleClickSd = this.handleClickSd.bind(this);
    this.handleClickSi = this.handleClickSi.bind(this);
    this.handleClickPs = this.handleClickPs.bind(this);
    this.handleClickR = this.handleClickR.bind(this);
  }
  
  handleClickBd(props){ 
    event.preventDefault();
    if(this.state.timed){
      return;
    }
    this.props.decrementBreak();
    }
  
  handleClickBi(props){ 
    event.preventDefault();
    if(this.state.timed){
      return;
    }
    this.props.incrementBreak();
    }
  
  handleClickSd(props){ 
    event.preventDefault();
    if(this.state.timed){
      return;
    }
    this.props.decrementSession();
    }
  
  handleClickSi(props){ 
    event.preventDefault();
    if(this.state.timed){
      return;
    }
    this.props.incrementSession();
    }
  
  handleClickPs(props){ 
    let breakLength = $("#break-length").text() * 1;
    let sessionLength = $("#session-length").text() * 1;
    if(this.props.pomodoro.breakLength < 10) {breakLength = "0"+breakLength;}
    if(this.props.pomodoro.sessionLength < 10) {sessionLength = "0"+sessionLength;}
    let isSessionSwitch = this.props.isSessionSwitch;
    let isSession = this.props.pomodoro.isSession;
    let timerFunction = function() {
      let theTime = $("#time-left").text();
      if(theTime == "00:00"){
        isSessionSwitch();
        isSession = !isSession;
        document.getElementById("beep").play();
        if(isSession){
          $("#time-left").text(sessionLength+":00");
        } else {
          $("#time-left").text(breakLength+":00");
        }        
        return;
      }
      let fromMinutes = 60000;
      let fromSeconds = 1000;
      let time = $("#time-left").text().match(/\d+/g);
      let timer = parseInt(time[0]) * fromMinutes + parseInt(time[1]) * fromSeconds;
      timer -= 1000;

      let minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timer % (1000 * 60)) / 1000);

      //keeps the mm:ss format
      if(minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}

      $("#time-left").text(minutes + ":" + seconds);  
    }
    
    if(!this.state.timed){
        this.setState({
          timed: setInterval(timerFunction,1000)
        });
        //timed = setInterval(timerFunction, 1000);
        document.getElementById("break-decrement").disabled = true;
        document.getElementById("session-decrement").disabled = true;
        document.getElementById("break-increment").disabled = true;
        document.getElementById("session-increment").disabled = true;
      } else {
        clearInterval(this.state.timed);
        document.getElementById("break-decrement").disabled = false;
        document.getElementById("session-decrement").disabled = false;
        document.getElementById("break-increment").disabled = false;
        document.getElementById("session-increment").disabled = false;
        this.setState({
          timed: null
        });
      }
    }
  
  handleClickR(props){ 
    event.preventDefault();
    this.props.reset();
    if(this.state.timed){
      clearInterval(this.state.timed);
      this.setState({
        timed: null
      });
    }
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    $("#time-left").text(this.props.pomodoro.sessionLength + ":00");
    document.getElementById("break-decrement").disabled = false;
    document.getElementById("session-decrement").disabled = false;
    document.getElementById("break-increment").disabled = false;
    document.getElementById("session-increment").disabled = false;
    }
  
  render() {
    let breakLength = this.props.pomodoro.breakLength;
    let sessionLength = this.props.pomodoro.sessionLength;
    if(this.props.pomodoro.breakLength < 10) {breakLength = "0"+breakLength;}
    if(this.props.pomodoro.sessionLength < 10) {sessionLength = "0"+sessionLength;}
    return (
      <div id="pomodoro-clock">
        <div id="Break">
          <div id="break-label" className="label">Break Length</div>
          <div id="button-wrapper">
            <button id="break-increment" className="increment" onClick={this.handleClickBi}><i className="fa fa-chevron-up" aria-hidden="true"></i></button>     
            <div id="break-length" className="length digitalfont">{this.props.pomodoro.breakLength}</div>
            <button id="break-decrement" className="increment" onClick={this.handleClickBd}><i className="fa fa-chevron-down" aria-hidden="true"></i></button>    
          </div>         
      </div>
        
        <div id="Session">
          <div id="session-label" className="label">Session Length</div>
          <div id="button-wrapper">
            <button id="session-increment" className="increment" onClick={this.handleClickSi}><i className="fa fa-chevron-up" aria-hidden="true"></i></button>            
            <div id="session-length" className="length digitalfont">{this.props.pomodoro.sessionLength}</div>
            <button id="session-decrement" className="increment" onClick={this.handleClickSd}><i className="fa fa-chevron-down" aria-hidden="true"></i></button>
            
          </div>          
        </div>
        
        <div id="Timer">
          <div id="timer-label" className="label">{this.props.pomodoro.isSession ? "Session Time": "Break Time"}</div>
          <div id="time-left" className="digitalfont">{ this.props.pomodoro.isSession ? sessionLength+":00": breakLength+":00"}</div>
        </div>
        
        <div id="Controls">
          <button id="start_stop" onClick={this.handleClickPs}><i className="fa fa-pause"></i> <i className="fa fa-play"></i></button>
          <button id="reset" onClick={this.handleClickR}><i className="fa fa-undo"></i></button>    
        </div>
        <audio id="beep" style={{display: "hidden"}} src="http://www.cooperfulleon.com/sites/cooperfulleon.com/files/sounder_tones/standard/cooper_fulleon_sounder_tone_17.wav" type="audio/wav"></audio>
      </div>
    );
  }
};

//Redux

//action types
const BREAK_INCREMENT = 'BREAK_INCREMENT';
const SESSION_INCREMENT = 'SESSION_INCREMENT';
const BREAK_DECREMENT = 'BREAK_DECREMENT';
const SESSION_DECREMENT = 'SESSION_DECREMENT';
const RESET = 'RESET';
const ISSESSION = 'ISSESSION';

//action reducers
const incrementBreak = () => {
  return {
    type: BREAK_INCREMENT
  };
}

const decrementBreak = () => {
  return {
    type: BREAK_DECREMENT
  };
}

const incrementSession = () => {
  return {
    type: SESSION_INCREMENT
  };
}

const decrementSession = () => {
  return {
    type: SESSION_DECREMENT
  };
}

const reset = () => {
  return {
    type: RESET
  };
}

const isSessionSwitch = () => {
  return {
    type: ISSESSION
  };
}

//defining default state
const defaultState = {
  breakLength: 5,
  sessionLength: 25,
  isSession: true
};

//multiply 60000 to time to get milliseconds

//reducer for store creation
const pomodoroReducer = (state = defaultState, action) => {
  let currentState = Object.assign({}, state);
  switch(action.type){
    case BREAK_INCREMENT:
      if(state.breakLength >= 60){
        return currentState;
      } else {
        currentState.breakLength += 1;
        return currentState;
      }      
    case BREAK_DECREMENT:
      if(state.breakLength <= 1){
        return currentState;
      } else {
        currentState.breakLength -= 1;
        return currentState;
      }   
    case SESSION_INCREMENT:
      if(state.sessionLength >= 60){
        return currentState;
      } else {
        currentState.sessionLength += 1;
        return currentState;
      }   
    case SESSION_DECREMENT:
      if(state.sessionLength <= 1){
        return currentState;
      } else {
        currentState.sessionLength -= 1;
        return currentState;
      }
    case RESET:
      return defaultState;
    case ISSESSION:
      currentState.isSession = !currentState.isSession;
      return currentState;
    default:
      return state;
  }
}

//creating store
const store = Redux.createStore(pomodoroReducer);

//const Provider = ReactRedux.Provider;
//const connect = ReactRedux.connect;
const { Provider, connect } = ReactRedux;

//mapping to props
const mapStateToProps = (state) => {
  return {pomodoro: state}
};
//dispatching ation reducers
const mapDispatchToProps = (dispatch) => {
  return {
    incrementBreak: () => {
      dispatch(incrementBreak())
    },
    decrementBreak: () => {
      dispatch(decrementBreak())
    },
    incrementSession: () => {
      dispatch(incrementSession())
    },
    decrementSession: () => {
      dispatch(decrementSession())
    },
    reset: () => {
      dispatch(reset())
    },
    isSessionSwitch: () => {
      dispatch(isSessionSwitch())
    }
  };
};

//creating app container
const Container = connect(mapStateToProps, mapDispatchToProps)(Application);

//creating app wrapper
class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
};

//placing react-redux app in DOM
ReactDOM.render(<AppWrapper />, document.getElementById('App'));
