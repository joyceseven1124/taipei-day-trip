import conn
import math
from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

Flask(__name__,static_folder="static",static_url_path="/static")


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


@app.route("/api/attractions",methods=["GET"])
def search_data():
    data_keyword = request.args.get("keyword",None)
    data_page = request.args.get("page",0)
    result = conn.search_keyword(data_keyword,data_page)   
    return jsonify(result)
    


@app.route("/api/attraction/<attractionId>",methods=["GET"])
def search_id(attractionId):
    result = conn.search_id(attractionId)
    return jsonify(result)


@app.route("/api/categories",methods=["GET"])
def search_categories():
    result = conn.search_categories()
    return jsonify(result)
    


app.run(port=3000)