from flask import *
import model.attraction_data as attractionData
import json

attraction_api_blueprint = Blueprint("attraction_api_blueprint", __name__)

@attraction_api_blueprint.route("/api/attractions",methods=["GET"])
def search_data():
    data_keyword = request.args.get("keyword",None)
    data_page = request.args.get("page",0)
    result = attractionData.search_keyword(data_keyword,data_page)
    return jsonify(result)


@attraction_api_blueprint.route("/api/attraction/<attractionId>",methods=["GET"])
def search_id(attractionId):
    result = attractionData.search_id(attractionId)
    return jsonify(result)


@attraction_api_blueprint.route("/api/categories",methods=["GET"])
def search_categories():
    result = attractionData.search_categories()
    return jsonify(result)