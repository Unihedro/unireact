// Nowyou can copy/paste any of the examples into src/App.js. Here’s the basic one:import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import React, { Fragment } from "react";
import "./App.css";
import auth from "./auth.js";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      username: "",
      password: "",
      redirectToReferrer: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleInputChange(evt) {
    const name = evt.target.name;
    this.setState({
      [name]: evt.target.value
    });
  }

  login(cb) {
    auth.authenticate(() => {
      this.setState({
        redirectToReferrer: true
      });
    });
  }

  render() {
    if (this.state.redirectToReferrer === true) {
      if (this.props.location.state)
        return <Redirect to={this.props.location.state.from} />;
      else return <Redirect to="/" />;
    }

    return (
      <Fragment>
        <div> Login to uni's website: </div>
        <input
          name="username"
          placeholder="Username"
          onChange={this.handleInputChange}
        />
        <input
          name="password"
          placeholder="Password"
          onChange={this.handleInputChange}
        />
        <button onClick={this.login}> Login </button>
      </Fragment>
    );
  }
}

class ProblemListEntry extends React.Component {
  render() {
    const p = this.props.problem;
    return (
      <li key={p.id}>
        <Link to={`problem/${p.id}`}> {p.title} </Link>
      </li>
    );
  }
}

class ProblemPage extends React.Component {
  validate() {}

  render() {
    console.log(this.props.match);
    return (
      <Fragment>
        <h1> Problem Title: {this.props.problem.title} </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p className="testcase">Your input is {this.props.problem.testcase}</p>

        <p>
          {auth.isAuthenticated ? (
            <Fragment>
              <input type="text" placeholder="Submit solution" />
              <button onClick={this.validate}> Submit </button>
            </Fragment>
          ) : (
            <Link
              to={{
                pathname: "/login",
                state: { from: this.props.match.url }
              }}
            >
              Login to submit a solution
            </Link>
          )}
        </p>

        <p>
          <Link to="/"> Back </Link>
        </p>
      </Fragment>
    );
  }
}

class ProblemList extends React.Component {
  render() {
    const list = this.props.plist.map(el => <ProblemListEntry problem={el} />);
    return <ol> {list} </ol>;
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
    fetch("/api/problemlist")
      .then(resp => resp.json())
      .then(json => {
        this.setState({ problemList: json });
        console.log("mounted");
      });
  }

  render() {
    let title = (
      <h1 className="websiteTitle">
        Uni's Website{" "}
        <small className="small">
          {auth.isAuthenticated ? "Authenticated" : "Not Authenticated"}{" "}
        </small>{" "}
      </h1>
    );

    if (this.state.problemList.length == 0) {
      return (
        <Fragment>
          {title}
          <p> Loading </p>
        </Fragment>
      );
    } else {
      console.log(this.state.problemList);
      return (
        <Fragment>
          {title}

          <Route
            exact
            path="/"
            render={() => <HomePage plist={this.state.problemList} />}
          />

          <Route
            path="/problem/:pid"
            render={({ match }) => (
              <ProblemPage
                problem={this.state.problemList[match.params.pid - 1]}
                match={match}
              />
            )}
          />
          <Route path="/login" component={Login} />
        </Fragment>
      );
    }
  }
}

export default App;
