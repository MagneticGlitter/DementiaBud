from flask import Flask, jsonify, render_template, Response, request
import tensorflow as tf
from tensorflow import keras
import numpy as np
import cv2
from keras.models import load_model
import numpy as np
import sqlite3


app = Flask(__name__)


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.after_request(add_cors_headers)
    app.run(port=4000, debug=True)