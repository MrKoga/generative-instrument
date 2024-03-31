# File: app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from estimate_reverb import estimate_reverb

app = Flask(__name__)
CORS(app)

# API endpoint
@app.route('/api/reverb/<int:item_id>', methods=['GET'])
def reverb(item_id):
    print("Item ID: ", item_id)
    try:
        response = estimate_reverb("../images/" + str(item_id) + ".webp")
        item = {
            "status": "success",
            "sentence": response[0],
            "reverb": response[1]
        }
        if item:
            print(response[0])
            return jsonify(item)
        else:
            return jsonify({"status": "error"}), 404
    except Exception as e:
        return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True)