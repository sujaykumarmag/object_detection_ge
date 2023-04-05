from flask import Flask,request,Response
import ee
from PIL import Image
import PIL
import os
import cv2
from pathlib import Path
from pprint import pprint
import json
import io
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account
from IPython.display import Image
import model_test
import folium
from IPython.display import display

app = Flask(__name__)

SERVICE_ACCOUNT='sujay-164@objectdet0.iam.gserviceaccount.com'
creds = ee.ServiceAccountCredentials(SERVICE_ACCOUNT,'key.json')

done_process = False

# Members api route
@app.route("/members")
def members():
    return {"members":["mem1","mem2","mem3"]}





@app.route("/results")
def results():
    return {"members":["mem1","mem2","mem3"]}
    
def data_vis(lat,lng):
    ee.Initialize(creds)
    credentials = service_account.Credentials.from_service_account_file('key.json')
    scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/cloud-platform'])
    session = AuthorizedSession(scoped_credentials)
    url = 'https://earthengine.googleapis.com/v1beta/projects/earthengine-public/assets/LANDSAT'
    response = session.get(url)
    # Load an image.
    image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

    # Define a method for displaying Earth Engine image tiles on a folium map.
    def add_ee_layer(self, ee_object, vis_params, name):
        try:    
            if isinstance(ee_object, ee.image.Image):    
                map_id_dict = ee.Image(ee_object).getMapId(vis_params)
                folium.raster_layers.TileLayer(
                tiles = map_id_dict['tile_fetcher'].url_format,
                attr = 'Google Earth Engine',
                name = name,
                overlay = True,
                control = True
            ).add_to(self)
        except:
            print("Could not display {}".format(name))
        


    # Add EE drawing method to folium.
    
    
    folium.Map.add_ee_layer = add_ee_layer
    # Define the visualization parameters.
    image_viz_params = {
        'bands': ['B5', 'B4', 'B3'],
        'min': 0,
        'max': 0.5,
        'gamma': [0.95, 1.1, 1]
    }
    map_l8 = folium.Map(location=[lat, lng], zoom_start=10)

    # Add the image layer to the map and display it.
    map_l18 = folium.Map(location=[lat, lng], zoom_start=10)
    map_l8.add_ee_layer(image, image_viz_params, 'false color composite')
    img_data = map_l8._to_png(5)
    img = PIL.Image.open(io.BytesIO(img_data))
    img.save('vis1.png')
    print(map_l8)
    # Load an image.
    image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

    # Create an NDWI image, define visualization parameters and display.
    ndwi = image.normalizedDifference(['B3', 'B5'])
    ndwi_viz = {'min': 0.5, 'max': 1, 'palette': ['00FFFF', '0000FF']}

    # Define a map centered on San Francisco Bay.
    map_ndwi = folium.Map(location=[lat, lng], zoom_start=10)

    # Add the image layer to the map and display it.
    #map_ndwi.add_ee_layer(ndwi, ndwi_viz, 'NDWI')
    display(map_ndwi)
    map_ndwi.save("vis2.png")




@app.route('/send', methods=['POST','GET'])
def get_data():
    print(request)
    print('Recieved from client: {}'.format(request.data))
    print (request.is_json)
    content = request.get_json()
    print (content)
    #model_test.model_test_load()
    #print(float(content['latitudes'][0])+" "+content["longitudes"][0])
    #data_vis(float(content['latitudes'][0]), float(content['longitudes'][0]))
    # Initialize the library.
    ee.Initialize(creds)
    credentials = service_account.Credentials.from_service_account_file('key.json')
    scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/cloud-platform'])
    session = AuthorizedSession(scoped_credentials)
    url = 'https://earthengine.googleapis.com/v1beta/projects/earthengine-public/assets/LANDSAT'
    response = session.get(url)
    pprint(json.loads(response.content))
    
    coords = [float(content['latitudes'][0]), float(content['longitudes'][0]),]
    region = ee.Geometry.Point(coords)
    collection = ee.ImageCollection('COPERNICUS/S2')
    collection = collection.filterBounds(region)
    collection = collection.filterDate('2020-04-01', '2020-09-01')
    image = collection.median()
    serialized = ee.serializer.encode(image)
    # Make a projection to discover the scale in degrees.
    proj = ee.Projection('EPSG:4326').atScale(10).getInfo()

    # Get scales out of the transform.
    scale_x = proj['transform'][0]
    scale_y = -proj['transform'][4]
    url = 'https://earthengine.googleapis.com/v1beta/projects/{}/image:computePixels'
    url = url.format('objectdet0')
    response = session.post(url=url,
    data=json.dumps({
        'expression': serialized,
        'fileFormat': 'PNG',
        'bandIds': ['B4','B3','B2'],
        'grid': {
        'dimensions': {
            'width': 640,
            'height': 640
        },
        'affineTransform': {
        'scaleX': scale_x,
        'shearX': 0,
        'translateX': coords[0],
        'shearY': 0,
        'scaleY': scale_y,
        'translateY': coords[1]
      },
      'crsCode': 'EPSG:4326',
    },
    'visualizationOptions': {'ranges': [{'min': 0, 'max': 3000}]},
  })
    
  )
    image_content = response.content
    # Import the Image function from the IPython.display module. 
    data_vis(float(content['latitudes'][0]), float(content['longitudes'][0]))
    print(Image(image_content))
    # with open("assets/images/image.png", "wb") as img:
    #     img.write(image_content)
    print("We have sent")
    model_test.model_test_load()
    done_process = True
    return Response('We recieved something…')


if __name__ == "__main__":
    app.run(debug=True)

