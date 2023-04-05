import React, { Component,useState } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { GoogleMapsAPI } from '../client-config';
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();



class Map extends Component {

	constructor(props) {
		super(props);
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			sorted_lat: [],
			sorted_lng: [],
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			},
			markerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			}
		}
		this.getPosts = this.Submit.bind(this)
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	
	componentDidMount() {
		Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng).then(
			response => {
				/**
				* This is a Sorting Algorithm for Sorting only Buildings
					* Using GAPI we take in all the results and Sort it .
				* It find the Best building location to produce it to the client
				* @param response.results
				*/

				let chosen_lat = [];
				let choosen_lng = [];
				for (var i = 0; i < response.results.length; i++) {
					if (response.results[ i ].geometry.location_type === "ROOFTOP") {
						//console.log(response.results[ i ].geometry.location)
						chosen_lat.push(response.results[ i ].geometry.location.lat);
						choosen_lng.push(response.results[ i ].geometry.location.lng)
					}
					//console.log(chosen_lat)
					//console.log(choosen_lng)
				}

				const address = response.results[ 0 ].formatted_address,
					addressArray = response.results[ 0 ].address_components,
					city = this.getCity(addressArray),
					area = this.getArea(addressArray),
					state = this.getState(addressArray);
				this.setState({
					address: (address) ? address : '',
					area: (area) ? area : '',
					city: (city) ? city : '',
					state: (state) ? state : '',
					sorted_lat: chosen_lat,
					sorted_lng:choosen_lng
				})
			},
			error => {
				console.error(error);
			}
		);
	};
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			return true
		} else if (this.props.center.lat === nextProps.center.lat) {
			return false
		}
	}
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = (addressArray) => {
		let city = '';
		for (let i = 0; i < addressArray.length; i++) {
			if (addressArray[ i ].types[ 0 ] && 'administrative_area_level_2' === addressArray[ i ].types[ 0 ]) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = (addressArray) => {
		let area = '';
		for (let i = 0; i < addressArray.length; i++) {
			if (addressArray[ i ].types[ 0 ]) {
				for (let j = 0; j < addressArray[ i ].types.length; j++) {
					if ('sublocality_level_1' === addressArray[ i ].types[ j ] || 'locality' === addressArray[ i ].types[ j ]) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = (addressArray) => {
		let state = '';
		for (let i = 0; i < addressArray.length; i++) {
			for (let i = 0; i < addressArray.length; i++) {
				if (addressArray[ i ].types[ 0 ] && 'administrative_area_level_1' === addressArray[ i ].types[ 0 ]) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = (event) => {
		this.setState({ [ event.target.name ]: event.target.value });
	};



	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = (event) => {

	};

	

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */

	onMarkerDragEnd = (event) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();

		Geocode.fromLatLng(newLat, newLng).then(
			response => {
				console.log(response.results)
				/**
				* This is a Sorting Algorithm for Sorting only Buildings
	 			* Using GAPI we take in all the results and Sort it .
				* It find the Best building location to produce it to the client
				* @param response.results
				*/
				
				let chosen_lat = [];
				let choosen_lng = [];
				for (var i = 0; i < response.results.length; i++) {
					if (response.results[ i ].geometry.location_type === "ROOFTOP") {
						//console.log(response.results[ i ].geometry.location)
						chosen_lat.push(response.results[ i ].geometry.location.lat);
						choosen_lng.push(response.results[ i ].geometry.location.lng)
					}
					//console.log(chosen_lat)
					//console.log(choosen_lng)
				}
				
				const address = response.results[ 0 ].formatted_address,
					addressArray = response.results[ 0 ].address_components,
					city = this.getCity(addressArray),
					area = this.getArea(addressArray),
					state = this.getState(addressArray);
				this.setState({
					address: (address) ? address : '',
					area: (area) ? area : '',
					city: (city) ? city : '',
					state: (state) ? state : '',
					lat: chosen_lat,
					lng: choosen_lng ,
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				})
			},
			error => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = (place) => {

		const address = place.formatted_address,
			addressArray = place.address_components,
			city = this.getCity(addressArray),
			area = this.getArea(addressArray),
			state = this.getState(addressArray),
			latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
		// Set these values in the state.
		this.setState({
			address: (address) ? address : '',
			area: (area) ? area : '',
			city: (city) ? city : '',
			state: (state) ? state : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	};

	/**
		 * This function Will be Able to Send the Request to the Server
		 * We will send the co-ordinates
		 * @param None
		 */
	Submit = async () => {
		const response = await fetch("/send", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},

			body: JSON.stringify({ "latitudes": this.state.sorted_lat,"longitudes":this.state.sorted_lng,"extra_data":this.state })
		})
		if (response.ok) {
			console.log("it worked")
		}	
		
	};


	render() {
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={this.props.google}
						defaultZoom={this.props.zoom}
						defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker google={this.props.google}
							name={'Dolores park'}
							draggable={true}
							onDragEnd={this.onMarkerDragEnd}
							position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '500px'
							}}
							onPlaceSelected={this.onPlaceSelected}
							types={[ '(regions)' ]}
						/>
					</GoogleMap>
				)
			)
		);
		


		let map;
		if (this.props.center.lat !== undefined) {
			map = <div>
				<div>
					<div >
						<label htmlFor="">City</label>
						<input type="text" name="city"  onChange={this.onChange} readOnly="readOnly" value={this.state.city} />
					</div>
					<div >
						<label htmlFor="">Area</label>
						<input type="text" name="area" onChange={this.onChange} readOnly="readOnly" value={this.state.area} />
					</div>
					<div >
						<label htmlFor="">State</label>
						<input type="text" name="state"  onChange={this.onChange} readOnly="readOnly" value={this.state.state} />
					</div>
					<div >
						<label htmlFor="">Address</label>
						<input type="text" name="address" onChange={this.onChange} readOnly="readOnly" value={this.state.address} />
					</div>
				</div>
				<div  style={{ height: `100%`, bottom: `-200px` }} >
					<button onClick={this.Submit} >Connect to Google Earth</button>
				</div>

				<AsyncMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
				
			</div>
		} else {
			map = <div style={{ height: this.props.height }} />
		}
		return (map)
	}
}
export default Map
