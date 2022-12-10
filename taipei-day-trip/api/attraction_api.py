from flask import *
import model.attraction_data as attractionData
import json

attraction_api_blueprint = Blueprint("attraction_api_blueprint", __name__)

@attraction_api_blueprint.route("/api/attractions",methods=["GET"])
def search_data():
    data_keyword = request.args.get("keyword",None)
    data_page = request.args.get("page",0)
    result = attractionData.search_keyword(data_keyword,data_page)
    if type(result) == tuple:
        data_result = {
            "nextPage":result[0],
            "data": result[1]
            }

        return jsonify(data_result),200

    else:
        data_result ={
            "error": True,
            "message": result
            }
        return jsonify(data_result),500


@attraction_api_blueprint.route("/api/attraction/<attractionId>",methods=["GET"])
def search_id(attractionId):
    result = attractionData.search_id(attractionId)
    if type(result) != str:
        data_result = {"data": result}
        return jsonify(data_result),200

    elif result == "伺服器內部錯誤":
        data_result ={
            "error": True,
            "message": result
            }
        return jsonify(data_result),500

    else:
        data_result ={
            "error": True,
            "message": result
            }
        return jsonify(data_result),400


@attraction_api_blueprint.route("/api/categories",methods=["GET"])
def search_categories():
    result = attractionData.search_categories()
    if type(result) != str:
        data_result = {"data":result}
        return jsonify(data_result),200
    
    else:
        data_result ={
            "error": True,
            "message": "Please input /api/categories"
        }
        return jsonify(data_result),500