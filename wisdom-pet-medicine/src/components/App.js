import React, { Component } from 'react';
import '../css/App.css';
import AddAppoinments from './AddAppoinments.js';
import SearchAppointments from './SearchAppoinment';
import ListAppoinments from './ListAppointments';
import { without } from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,
      displayForm: false,
      orderBy: 'petName',
      orderDir: 'asc'
    };
    this.deleteAppointments = this.deleteAppointments.bind(this);
    this.showForm = this.showForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);

    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });

  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  deleteAppointments(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({ myAppointments: tempApts });
  }

  showForm() {
    let tempDisplayForm = this.state.displayForm;
    tempDisplayForm = !tempDisplayForm;
    this.setState({ displayForm: tempDisplayForm })
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          myAppointments: apts
        });
      });
  }

  render() {


    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppoinments
                  displayForm={this.state.displayForm}
                  showForm={this.showForm}
                  addAppointment={this.addAppointment} />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder} />
                <ListAppoinments
                  appoinments={filteredApts}
                  deleteAppointments={this.deleteAppointments} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
