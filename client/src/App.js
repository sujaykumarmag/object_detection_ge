import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./components/Home";
import Connect from './components/Connect';
import Results from './components/Results';


class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<div>
						<Route exact path="/" component={Home} />
					</div>
					<div>
						<Route exact path="/connect" component={Connect} />
					</div>
					<div>
						<Route exact path="/image" component={Results} />
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
