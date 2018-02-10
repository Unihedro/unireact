// Nowyou can copy/paste any of the examples into src/App.js. Here’s the basic one:import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import React, { Fragment } from "react";
import "./App.css";

// const Fragment = React.Fragment;

class ProblemListEntry extends React.Component {
  render() {
    const p = this.props.problem;
    return (
      <li key={p.id}>
        {" "}
        <Link to={`problem/${p.id}`}> {p.title} </Link>{" "}
      </li>
    );
  }
}

class ProblemPage extends React.Component {
  render() {
    return (
      <Fragment>
        <h1> {this.props.problem.title} </h1>
        <Link to="/"> Back </Link>
      </Fragment>
    );
  }
}

class ProblemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const list = this.props.plist.map(el => <ProblemListEntry problem={el} />);
    return <ol> {list} </ol>;
    // console.log(this.props);
    // return ""+this.props.plist;
  }
}

class HomePage extends React.Component {
  render() {
    console.log(this.props);
    return (
      <Fragment>
        <h1> Problems: </h1>
        <ProblemList plist={this.props.plist} />
      </Fragment>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problemList: []
    };
  }

  componentDidMount() {
    fetch("api/problemlist")
      .then(resp => resp.json())
      .then(json => {
        this.setState({ problemList: json });
      });
  }

  render() {
    return (
      <Fragment>
        <Route
          exact
          path="/"
          render={() => <HomePage plist={this.state.problemList} />}
        />
        <Route
          path="/problem/:pid"
          render={({ match }) => (
            <ProblemPage problem={this.state.problemList[match.params.pid - 1]} />
          )}
        />
      </Fragment>
    );
  }
}

export default App;
