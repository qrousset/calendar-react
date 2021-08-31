import "./App.css";

import React, { Component } from "react";
import { render } from "react-dom";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      week: 0
    };
    this.url =
      "http://slack-server-production.us-west-2.elasticbeanstalk.com/calendar/NY/28";
    this.calData = [];
    this.moveWeeks = this.moveWeeks.bind(this);
    this.previousWeek = this.previousWeek.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
  }

  // async componentDidMount() {
  //   //fetch calendar data
  //   const response = await fetch(this.url);
  //   const data = await response.json();
  //   const preData = [];
  //   for (const key in data) {
  //     preData.push(data[key]);
  //     // console.log(data[key]);
  //   }
  //   for (let index = 1; index < preData.length; index++) {
  //     this.calData.push(preData[index]);
  //   }
  //   this.setState({ loading: false });
  // }

  componentDidMount() {
    //fetch calendar data
    const preData = [];
    fetch(this.url)
      .then(data => data.json())
      .then(data => {
        for (const key in data) {
          preData.push(data[key]);
        // console.log(data[key]);
        }
        for (let index = 1; index < preData.length; index++) {
          this.calData.push(preData[index]);
        }
        this.setState({ loading: false })});
  }

  moveWeeks(previous){
    let updatedWeek = this.state.week;
    if(previous) updatedWeek -= 6;
    else updatedWeek += 6;
    if(updatedWeek < 0) updatedWeek = 0;
    if(updatedWeek >= this.calData.length-7) updatedWeek = this.calData.length-7;
    this.setState({week: updatedWeek});
  }
  
  previousWeek(){
    console.log('previous')
    this.moveWeeks(true);
  }
  nextWeek(){
    console.log('next')
    this.moveWeeks(false);
  }
  

  render() {
    const days = [];
    if (!this.state.loading) {
      for (let i = this.state.week; i < this.state.week + 6; i++) {
        days.push(<Day key={i} eventArray={this.calData[i]} />);
      }
      return (
        <div className="fuckThisHolder">
          <div className='header'>
            <button id="previousWeek" onClick={this.previousWeek}> PREVIOUS </button>
            <h1>Calendar</h1>
            <button id="nextWeek" onClick={this.nextWeek}> NEXT </button>
          </div>
          <div className="calendar">{days}</div>
        </div>
      );
    } else {
      return "loading...";
    }
  }
}

function Day(props) {
  const dayEvent = [];

  function getTime(date) {
    return date["dateTime"].substring(11, 16);
  }

  function getDate(date) {
    return date["dateTime"].substring(5, 10);
  }

  props.eventArray.forEach((element) => {
    dayEvent.push(
      <Event
        key={element.start}
        title={element.summary}
        time={getTime(element.start)}
      />
    );
  });
  return (<div className="day">{getDate(props.eventArray[0].start)} {dayEvent}</div>);
}

function Event(props) {
  return (
    <div className="eventContainer">
      <h3>
        {props.time} {props.title}{" "}
      </h3>
    </div>
  );
}

render(<Calendar />, document.querySelector("#root"));

export default Calendar;
