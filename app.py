from flask import *

app = Flask(__name__)

app.static_folder = 'src'


@app.route('/')
def index():
    return send_from_directory("src", "index.html")