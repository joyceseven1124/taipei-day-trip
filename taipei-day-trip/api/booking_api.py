from flask import *
import model.booking_data as bookingData
import model.member_data as memberData
import json

booking_api_blueprint = Blueprint("booking_api_blueprint", __name__)

@booking_api_blueprint.route("/api/booking",methods=["POST"])
def save_booking_data():
    member_re_value = request.cookies.get('token_value')
    booking_value = json.loads(request.data)
    member_token_result = memberData.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        member_check_result = memberData.check_member(member_token_result)
        if member_check_result == "correct":
            result = bookingData.save_booking(member_token_result[0],booking_value)
            if result == "ok":
                response ={
                "ok": True
                }
                return jsonify(response),200

            elif result == "伺服器內部錯誤":
                response ={
                    "error": True,
                    "message": result
                    }
                return jsonify(response),500
            else:
                response ={
                    "error": True,
                    "message": result
                    }
                return jsonify(response),400
        else:
            response ={
                    "error": True,
                    "message": "未登入系統，拒絕存取"
                    }
            return jsonify(response),403



@booking_api_blueprint.route("/api/booking",methods=["GET"])
def search_booking_data():
    member_re_value = request.cookies.get('token_value')
    member_token_result = memberData.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403

    member_Id = member_token_result[0]
    searchResult = bookingData.search_booking(member_Id)

    if type(searchResult) != str:
        response = {
            "data": searchResult
            }

        return jsonify(response),200
    else:
        response = {
            "error": True,
            "message": searchResult
            }
        return jsonify(response),500


@booking_api_blueprint.route("/api/booking",methods=["DELETE"])
def delete_booking_data():
    member_re_value = request.cookies.get('token_value')
    booking_value = json.loads(request.data)
    member_token_result = memberData.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        member_check_result = memberData.check_member(member_token_result)
        if member_check_result == "correct":
            result = bookingData.delete_booking(member_token_result[0],booking_value)
            if result == "ok":
                response ={
                "ok": True
                }
                return jsonify(response),200

            elif result == "伺服器內部錯誤":
                response ={
                    "error": True,
                    "message": result
                    }
                return jsonify(response),500
            else:
                response ={
                    "error": True,
                    "message": result
                    }
                return jsonify(response),400
        else:
            response ={
                    "error": True,
                    "message": "未登入系統，拒絕存取"
                    }
            return jsonify(response),403
