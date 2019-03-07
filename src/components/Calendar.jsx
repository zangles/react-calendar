import React from "react";
import dateFns from "date-fns";
import './Calendar.css';
import data from './data';

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    todayEvents: []
  };

  formatEvents(events) {
    let formatedEvents = {}

    events.map((event) => {
      let date = dateFns.format(event.date, 'YYYY-MM-DD')
      if (formatedEvents[date] === undefined) {
        formatedEvents[date] = [event]
      }else{
        formatedEvents[date].push(
          event
        )
      }
    })

    return formatedEvents
  }

  getEvents(start, end) {
    return this.formatEvents(data);
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderEvents(events, date) {

    let todayEvents = [];
    if (events[date] !== undefined) {

      events[date].map((event) => {
        todayEvents.push(
          (
            <div
              className={ 'event event-' + event.turn_type }
              title={ event.contact.name }>
            </div>
          )
        )
      })
    }

    return (
      <div className="events">
        {todayEvents}
      </div>
    )
  }

  renderResumen(events) {

    let formatedSelectedDate = (dateFns.format(this.state.selectedDate, 'YYYY-MM-DD'))

    let resumen = (
      <div> no events today</div>
    )

    if (events[formatedSelectedDate] !== undefined) {
      let todayEvent = events[formatedSelectedDate]

      resumen = (
        <div>
          {
            todayEvent.map((event) => {
              return (
                <div>
                  {dateFns.format(event.date, 'HH:mm:ss')} - {event.contact.name}, {event.turn_type}
                </div>
              )
            })
          }
        </div>
      )
    }

    this.setState({
      todayEvents: resumen
    })

  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    const events = this.getEvents(startDate, endDate)

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        const formatedDate = dateFns.format(cloneDay, 'YYYY-MM-DD')
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
              }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay), events)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {this.renderEvents(events, formatedDate)}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = (day, events) => {

    this.setState({
      selectedDate: day
    }, () => {
      this.renderResumen(events);
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div>
        <div className="calendar">
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
        <div className="dayResumen">
          <h2>Resumen dia {(dateFns.format(this.state.selectedDate, 'DD-MM-YYYY'))}</h2>
          {this.state.todayEvents}
        </div>
      </div>
    );
  }
}

export default Calendar;