class TimerLengthControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>{this.props.title}</div>
        <button
          id={this.props.minID}
          className="btn-level"
          value="-"
          onClick={this.props.onClick}
        >
          <i className="fa fa-arrow-down fa-2x" />
        </button>
        <div id={this.props.lengthID} className="btn-level">
          {this.props.length}
        </div>
        <button
          id={this.props.addID}
          className="btn-level"
          value="+"
          onClick={this.props.onClick}
        >
          <i className="fa fa-arrow-up fa-2x" />
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.audioBeep = React.createRef();

    this.state = {
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    };
  }

  setBrkLength = (e) => {
    this.lengthControl(
      "brkLength",
      e.currentTarget.value,
      this.state.brkLength,
      "Session"
    );
  };

  setSeshLength = (e) => {
    this.lengthControl(
      "seshLength",
      e.currentTarget.value,
      this.state.seshLength,
      "Break"
    );
  };

  lengthControl = (stateToChange, sign, currentLength, timerType) => {
    if (this.state.timerState === "running") return;
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else {
      if (sign === "-" && currentLength !== 1) {
        this.setState({
          [stateToChange]: currentLength - 1,
          timer: currentLength * 60 - 60,
        });
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({
          [stateToChange]: currentLength + 1,
          timer: currentLength * 60 + 60,
        });
      }
    }
  };

  timerControl = () => {
    if (this.state.timerState === "stopped") {
      this.beginCountDown();
      this.setState({ timerState: "running" });
    } else {
      this.setState({ timerState: "stopped" });
      clearInterval(this.state.intervalID);
    }
  };

  beginCountDown = () => {
    this.setState({
      intervalID: setInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000),
    });
  };

  decrementTimer = () => {
    this.setState((prevState) => ({ timer: prevState.timer - 1 }));
  };

  phaseControl = () => {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.timerType === "Session") {
        clearInterval(this.state.intervalID);
        this.beginCountDown();
        this.switchTimer(this.state.brkLength * 60, "Break");
      } else {
        clearInterval(this.state.intervalID);
        this.beginCountDown();
        this.switchTimer(this.state.seshLength * 60, "Session");
      }
    }
  };

  warning = (timer) => {
    let warning =
      timer < 61
        ? this.setState({ alarmColor: { color: "#a50d0d" } })
        : this.setState({ alarmColor: { color: "white" } });
  };

  buzzer = (timer) => {
    if (timer === 0) {
      this.audioBeep.current.play();
    }
  };

  switchTimer = (num, str) => {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: "white" },
    });
  };

  clockify = () => {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  };

  reset = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    });
    this.audioBeep.current.pause();
    this.audioBeep.current.currentTime = 0;
  };

  render() {
    return (
      <div>
        <div className="main-title">Pomodoro Clock</div>
        <TimerLengthControl
          titleID="break-label"
          minID="break-decrement"
          addID="break-increment"
          lengthID="break-length"
          title="Break Length"
          onClick={this.setBrkLength}
          length={this.state.brkLength}
        />
        <TimerLengthControl
          titleID="session-label"
          minID="session-decrement"
          addID="session-increment"
          lengthID="session-length"
          title="Session Length"
          onClick={this.setSeshLength}
          length={this.state.seshLength}
        />
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.clockify()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x" />
            <i className="fa fa-pause fa-2x" />
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x" />
          </button>
        </div>
        <div className="author">
          Designed and Coded by <br />
          <a
            target="_blank"
            href="https://github.com/sachinStiglitz"
          >
            Sachin R Das
          </a>
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
          ref={this.audioBeep}
        />
      </div>
    );
  }
}

ReactDOM.render(<Timer />, document.getElementById("app"));
