
# Rooftop Segmentation using Google Earth (GE)

![Rooftop Segmentation](https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fv2%2Fresize%3Afit%3A1400%2F0*vuHNrs-aEbGxWXd5&tbnid=5aT-LfS1zzIhDM&vet=12ahUKEwjZnfuShvuAAxXcz6ACHWE8BCgQMygHegQIARBk..i&imgrefurl=https%3A%2F%2Ftowardsdatascience.com%2Fusing-image-segmentation-to-identify-rooftops-in-low-resolution-satellite-images-c791975d91cc&docid=ZSSWnSZHnFJIrM&w=1400&h=525&q=rooftop%20segmentation%20using%20Google%20Earth&client=safari&ved=2ahUKEwjZnfuShvuAAxXcz6ACHWE8BCgQMygHegQIARBk)

This project focuses on rooftop segmentation using Google Earth (GE) imagery. Leveraging geo-spatial data, Tensorflow, and Google Cloud Platform (GCP), the project aims to facilitate advanced drone delivery methodologies and conduct comprehensive data analysis research.

## Features

- Utilizes Google Cloud Platform (GCP) for scalable processing.
- Applies geo-spatial data and Tensorflow for advanced segmentation.
- Dataset sourced from LandStat resources.
- Employes the UNet architecture for robust rooftop segmentation.


## Installation Procedure

    git clone https://github.com/sujaykumarmag/object_detection_ge.git
    cd object_detection_ge
    
### Configuring Server
    
    cd flask-server
    python3 -m venv venv
    source venv/bin/activate
    pip3 install --upgrade -r requirements.txt
    
    
### Starting Server
    
    python3 server.py
    
### Configuring Client

    cd client
    npm install

### Starting Client

    npm start
    
- `requirements.txt is added`

## Results

[![Watch the video](results.png)](results.mp4)

To install the packages

    pip install -r requirements.txt

