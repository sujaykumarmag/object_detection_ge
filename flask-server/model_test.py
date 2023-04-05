import matplotlib.pyplot as plt
import numpy as np 
import os
from patchify import patchify
import cv2
import xarray as xr
#import tensorflow as tf
from keras.models import load_model
import random
from PIL import Image
from skimage.io._plugins.pil_plugin import ndarray_to_pil, pil_to_ndarray
import xarray as xr
import numpy as np




def model_test_load():
    img = cv2.imread("assets/images/image.png")
    raww=[]
    patch_size = 256
    patches_image = patchify(img, (patch_size, patch_size, 3), step=patch_size)
    for i in range(patches_image.shape[0]):
        for j in range(patches_image.shape[1]):
            patch_img = patches_image[i, j, :, :]
            patch_img=patch_img[0]
            raww.append(patch_img)

    raww=np.array(raww)
    raww.shape
    # Mean IOU
    def jacard_coef(y_true, y_pred):
        y_true_f=K.flatten(y_true)
        y_pred_f=K.flatten(y_pred)
        intersection=K.sum(y_true_f*y_pred_f)
        return (intersection*1.0)/(K.sum(y_true_f)+K.sum(y_pred_f)-(intersection*1.0))

    def jacard_loss(y_true, y_pred):
        return 1-jacard_coef(y_true, y_pred)

    model=load_model("models/my_model.d5",custom_objects={
    'jacard_coef':jacard_coef,
    'jacard_loss':jacard_loss})
    y_pred=model.predict(raww)
    y_pred.shape    
    print(y_pred.shape)
    y_pred_thresh=y_pred>0.5
    img_num_start = random.randint(0, len(raww)//2)
    img_num_end = random.randint(img_num_start, len(raww)-1)

    for i in range(img_num_start, img_num_end):
        im2 = Image.fromarray(raww[i])
        im2.save("assets/private/original/org"+str(i)+".png")
        size = y_pred_thresh[i].shape[::-1]
        print(size)
        databytes = np.packbits(y_pred_thresh[i], axis=1)
        im4 = Image.frombytes(mode='1', size=(255,255), data=databytes)
        im4.save("assets/private/detected/detect"+str(i)+".png")


