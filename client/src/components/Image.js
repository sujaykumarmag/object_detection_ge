import React from 'react';
import ReactDOM from 'react-dom';
var listOfImages = [];

class Image extends React.Component {
    importAll(r) {
        return r.keys().map(r);
    }
    componentWillMount() {
        listOfImages = this.importAll(require.context('/Users/sujay/Desktop/flask-react-ge/flask-server/assets/private/original', false, /\.(png|jpe?g|svg)$/));
    }
    render() {
        return (
            <div style={{ display: "grid", grid: "150px / auto auto auto" }}>
                {
                    listOfImages.map(
                        (image, index) =>
                            <div style={{padding:"10px"}}>
                                <img key={index} src={image} alt="info"></img>
                                </div>
                    )
                }
            </div>
        )
    }
}

export default Image;