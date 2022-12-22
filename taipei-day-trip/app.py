import math
from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
from api.attraction_api import attraction_api_blueprint
from api.member_api import member_api_blueprint
from api.booking_api import booking_api_blueprint
from api.orders_api import orders_api_blueprint

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
@app.route("/recording")
def recording():
	return render_template("recording.html")

app.register_blueprint(attraction_api_blueprint)
app.register_blueprint(member_api_blueprint)
app.register_blueprint(booking_api_blueprint)
app.register_blueprint(orders_api_blueprint)

if __name__ == "__main__" :
    app.run(port=3000)