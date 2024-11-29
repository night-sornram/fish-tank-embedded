from flask import Flask, request, jsonify, render_template
import numpy as np
import cv2 as cv
from PIL import Image
from io import BytesIO
import base64
import urllib.parse

app = Flask(__name__)

class AreaSegmentor:
    def __init__(self, image):
        self.image = image
        self.gray_image = cv.cvtColor(self.image, cv.COLOR_BGR2GRAY)
        self.coordinates = [(81, 15), (214, 15), (273, 235), (36, 234)]

    def segment_road(self) -> np.ndarray:
        """Segments the road area based on the predefined coordinates."""
        if self.coordinates:
            points = np.array(self.coordinates, dtype=np.int32)
            points = points.reshape((-1, 1, 2)) 
            mask = np.zeros_like(self.gray_image)
            cv.fillPoly(mask, [points], 255)

            segment = cv.bitwise_and(self.image, self.image, mask=mask)
            return segment
        else:
            raise ValueError("No coordinates selected for segmentation.")

def count_circles(image) -> int:
    """Counts the number of circles detected in the image."""
    circles = cv.HoughCircles(
        image,
        cv.HOUGH_GRADIENT,
        dp=1.2,
        minDist=30,
        param1=32,
        param2=30,
        minRadius=10,
        maxRadius=50
    )

    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        return len(circles)
    else:
        return 0

def image_from_base64(base64_string: str) -> Image:
    """Converts a base64 string to a PIL Image."""
    base64_string = urllib.parse.unquote(base64_string)

    missing_padding = len(base64_string) % 4
    if missing_padding:
        base64_string += '=' * (4 - missing_padding)

    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))

    return image

@app.route('/process_image', methods=['POST'])
def process_image():
    """Receives an image in base64 format, processes it, and returns the number of detected circles."""
    data = request.json
    image_string = data.get("image")

    if not image_string:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Convert the base64 string to an image
        image = image_from_base64(image_string.strip().split(',')[1])

        # Segment the road area
        segment = cv.cvtColor(AreaSegmentor(np.array(image)).segment_road(), cv.COLOR_BGR2GRAY)

        # Count the circles
        count = count_circles(segment)

        return jsonify({"circle_count": count})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)