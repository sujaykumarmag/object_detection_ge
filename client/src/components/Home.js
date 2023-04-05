import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {

	render() {
		return(
			<div style={{ margin: '100px' }}>
				<Map
					google={this.props.google}
					center={{ lat: 12.9692, lng: 79.1559 }}
					height='600px'
					zoom={15}
				/>
			</div>
		);
	}
}

export default Home;
