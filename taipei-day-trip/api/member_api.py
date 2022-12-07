from flask import *
import model.member_data as member
import json
import time


member_api_blueprint = Blueprint("member_api_blueprint", __name__)

@member_api_blueprint.route("/api/user",methods=["POST"])
def build_account():
    new_member_data = json.loads(request.data)
    result = member.add_member(new_member_data)

    if result == "ok" :
        response = {"ok": True}
        return jsonify(response),200

    elif result == "fail":
        response ={
        "error": True,
        "message": "email已註冊過"
        }
        return jsonify(response),400

    else:
        response ={
        "error": True,
        "message": "系統異常"
        }
        return jsonify(response),500



@member_api_blueprint.route("/api/user/auth",methods=["PUT"])
def enter_account():
    if request.method == "PUT":
        member_data = json.loads(request.data)
        result = member.enter_account(member_data)

        if type(result) == tuple :
            token = member.make_token(result)
            response = {"ok": True}
            res = make_response(jsonify(response))
            cookie_time = 7*24*60*60
            #res.set_cookie(key = token,expires=time.time()+6*60,httponly=True,secure=True)
            res.set_cookie("token_value", token,expires=time.time()+cookie_time)
            return res,200

        elif result == "password error":
            response ={
            "error": True,
            "message": "密碼輸入錯誤"
            }
            return jsonify(response),400

        elif result == "email error":
            response ={
            "error": True,
            "message": "信箱輸入錯誤"
            }
            return jsonify(response),400

        else:
            response ={
            "error": True,
            "message": "系統異常"
            }
            return jsonify(response),500


@member_api_blueprint.route("/api/user/auth",methods=["GET","DELETE"])
def stillIn_account():
    value = request.cookies.get('token_value')
    if request.method == "GET":
        result = member.check_token(value)
        if type(result) == list:
            response ={
            "data": {
                "id": result[0],
                "name": result[1],
                "email": result[2]
                }
            }

            return jsonify(response),200
        else:
            response = {"data": None}
            return jsonify(response),200

    elif request.method == "DELETE":
            response = {"ok": True}
            res = make_response(jsonify(response))
            res.set_cookie("token_value", value="",expires=0)
            return res,200
