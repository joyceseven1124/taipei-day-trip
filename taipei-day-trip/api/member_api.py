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
    member_data = json.loads(request.data)
    result = member.enter_account(member_data)
    if type(result) == dict :
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


@member_api_blueprint.route("/api/user/auth",methods=["GET"])
def get_information_from_account():
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


@member_api_blueprint.route("/api/user/auth",methods=["DELETE"])
def delete_account():
    value = request.cookies.get('token_value')
    response = {"ok": True}
    res = make_response(jsonify(response))
    res.set_cookie("token_value", value="",expires=0)
    return res,200



@member_api_blueprint.route("/api/member/information",methods=["POST"])
def add_basic_information():
    member_information = json.loads(request.data)
    member_re_value = request.cookies.get('token_value')
    #解讀token裏頭的東西
    member_token_result = member.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        #確認此人是否真的在資料庫中
        member_check_result = member.check_member(member_token_result)
        if member_check_result == "correct":
            member_id = member_token_result[0]
            member_name = member_token_result[1]
            result = member.save_member_information(member_id,member_name,member_information)
            if result == "ok":
                response = {"ok": True}
                return jsonify(response),200
            else:
                response ={
                "error": True,
                "message": "系統異常"
                }
                return jsonify(response),500
        else:
            response ={
                "error": True,
                "message": "未有存取權"
                }
            return jsonify(response),403


@member_api_blueprint.route("/api/member/information/pic",methods=["POST"])
def add_basic_information_pic():
    member_image = request.files['file']
    image = member_image.stream.read()
    member_re_value = request.cookies.get('token_value')
    member_token_result = member.check_token(member_re_value)

    if(len(image) == 0):
        return redirect("/member")
    with open(f"static/pic/member/{member_token_result[0]}.png","wb") as file:
        file.write(image)
    member.save_member_img(member_token_result[0],f"static/pic/member/{member_token_result[0]}.png")
    response = {"ok": True}
    return jsonify(response),200


@member_api_blueprint.route("/api/member/information",methods=["GET"])
def search_basic_information():
    member_re_value = request.cookies.get('token_value')
    #解讀token裏頭的東西
    member_token_result = member.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        #確認此人是否真的在資料庫中
        member_check_result = member.check_member(member_token_result)
        if member_check_result == "correct":
            result = member.search_member_page_information(member_token_result[0])
            if type(result) == str:
                response ={
                "error": True,
                "message": "系統有異常"
                }
                return jsonify(response),500
            else:
                response ={
                "data":result
                }
                return jsonify(response),200
        else:
            response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
            return jsonify(response),403