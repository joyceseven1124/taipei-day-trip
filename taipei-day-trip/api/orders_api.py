from flask import *
import json
import requests
import datetime
import model.member_data as memberData
import model.orders_data as orderData
import os
from dotenv import load_dotenv
load_dotenv()
partner_key = os.getenv("partner_key")


orders_api_blueprint = Blueprint("orders_api_blueprint", __name__)

@orders_api_blueprint.route("/api/orders",methods=["POST"])
def add_order():
    member_re_value = request.cookies.get('token_value')
    #解讀token裏頭的東西
    member_token_result = memberData.check_token(member_re_value)
    order_request = json.loads(request.data)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        #確認此人是否真的在資料庫中
        member_check_result = memberData.check_member(member_token_result)
        if member_check_result == "correct":
            #製作訂單編號
            order_number = datetime.datetime.today().strftime('%Y%m%d%H%M%S')+str(member_token_result[0])
            result = orderData.save_order(order_request,member_token_result[0],order_number)
            #送出訂單請求
            if type(result) == dict:
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {'content-type': 'application/json', "x-api-key": partner_key}
                tappay_result = requests.post(url, headers=headers, json=result).json()
                print(tappay_result)
                #更改訂單中的付款狀態
                amend_result = orderData.amend_order_state(order_number,tappay_result)
                print("修正")
                print(amend_result)
                if tappay_result["status"] == 0:
                   orderData.ready_delete_data(order_request,member_token_result[0])
                   response = {
                    "data": {
                        "number":  int(order_number),
                        "payment": {
                        "status": 0,
                        "message": "付款成功"}
                        }
                    }
                   return jsonify(response),200
                else:
                    response = {
                            "error": True,
                            "message": tappay_result["msg"]
                    }
                    return jsonify(response),400
        else:
            response ={
                "error": True,
                "message": "伺服器出錯"
                }
            return jsonify(response),500



@orders_api_blueprint.route("/api/order",methods=["GET"])
def search_order():
    member_re_value = request.cookies.get('token_value')
    #解讀token裏頭的東西
    member_token_result = memberData.check_token(member_re_value)
    if type(member_token_result) != list:
        response ={
                "error": True,
                "message": "未登入系統，拒絕存取"
                }
        return jsonify(response),403
    else:
        #確認此人是否真的在資料庫中
        member_check_result = memberData.check_member(member_token_result)
        if member_check_result == "correct":
            orderNumber = request.args.get("number",None)
            result = orderData.search_order(orderNumber,member_token_result[0])
            return jsonify(result),200
        else:
            return jsonify(result),500