
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
import model.base_data as base
import model.booking_data as bookingData
import os
from dotenv import load_dotenv
load_dotenv()
merchant_id = os.getenv("merchant_id")
partner_key = os.getenv("partner_key")

connection_pool = pooling.MySQLConnectionPool(pool_name = "order_pool",
    pool_size = 5,
    pool_reset_session = True,
    **base.dbconfig
)


def save_order(data,member_id,order_number):
    try:
        connection_object = connection_pool.get_connection()
        for i in range(len(data["order"]['trip'])):
            cursor = connection_object.cursor()
            order_data = data["order"]['trip'][i][0]
            add_sql = '''
                        INSERT INTO order_table(
                            order_number,
                            booking_date,
                            booking_time,
                            booking_price,
                            attraction_image,
                            attraction_name,
                            attraction_address,
                            attraction_id,
                            member_id,
                            contact_name,
                            contact_email,
                            contact_phone)
                        VALUE(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            
            add_value = (int(order_number),
                        order_data["date"],
                        order_data["time"],
                        order_data["price"],
                        order_data["attraction"]["image"],
                        order_data["attraction"]["name"],
                        order_data["attraction"]["address"],
                        order_data["attraction"]["id"],
                        member_id,
                        data["order"]["contact"]["name"],
                        data["order"]["contact"]["email"],
                        data["order"]["contact"]["phone"],
                        )
        
            cursor.execute(add_sql,add_value)
            connection_object.commit()
            

        details = ""
        for i in range(len(data["order"]['trip'])):
            order_data = data["order"]['trip'][i][0]
            details = details+"/"+order_data["attraction"]["name"]

        for i in range(len(data["order"]['trip'])):
            order_data = data["order"]['trip'][i][0]
            delete_booking_data = {
                "attractionId": order_data["attraction"]["id"],
                "date": order_data["date"],
                "time": order_data["time"],
                "price": order_data["price"]
            }
            bookingData.delete_booking(member_id,delete_booking_data)

        result = {
                "prime": data["prime"],
                "partner_key": partner_key,
                "merchant_id": merchant_id,
                "details":details,
                "amount": data["order"]['totalPrice'],
                "order_number":order_number,
                "cardholder": {
                    "phone_number": data["order"]["contact"]["phone"],
                    "name": data["order"]["contact"]["name"],
                    "email": data["order"]["contact"]["email"],
                    },
                }

    except mysql.connector.Error as err:
        result = err

    except Exception as e:
        result = e

    finally:
        cursor.close()
        connection_object.close()
        return result



def amend_order_state(order_number,tappay_result):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        if tappay_result["status"] == 0:
            state = "已結帳"
        else:
            state = "未結帳"
        amend_sql = '''
                        UPDATE order_table SET
                            booking_state = %s,
                            rec_trade_id = %s,
                            msg = %s,
                            transaction_time_millis = %s,
                            order_status = %s
                        WHERE order_number= %s'''
            
        amend_value = ( state,
                        tappay_result["rec_trade_id"],
                        tappay_result["msg"],
                        tappay_result["transaction_time_millis"],
                        tappay_result["status"],
                        int(order_number)
                    )
    
        cursor.execute(amend_sql,amend_value)
        connection_object.commit()
        result = "ok"

    except mysql.connector.Error as err:
        result = err

    except Exception as e:
        result = e

    finally:
        cursor.close()
        connection_object.close()
        return result


def search_order(orderNumber,member_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(buffered=True, dictionary=True)
        search_sql = '''
                        SELECT 
                            order_number,
                            booking_date,
                            booking_time,
                            booking_price,
                            attraction_image,
                            attraction_name,
                            attraction_address,
                            attraction_id,
                            member_id,
                            contact_name,
                            contact_email,
                            contact_phone,
                            order_status,
                            record_time
                        FROM order_table
                        WHERE  order_number= %s
                        OR member_id = %s'''

        if  orderNumber != None:
            search_value = (orderNumber,orderNumber)
        else:
            search_value = (member_id,member_id)

        cursor.execute(search_sql,search_value)
        search_order_result = cursor.fetchall()
        
        if len(search_order_result) != 0 and search_order_result[0]["member_id"] == member_id:
            if orderNumber != None:
                trip = []
                for i in search_order_result:
                    itemData = [{
                        "attraction": {
                                "id": i["attraction_id"],
                                "name": i["attraction_name"],
                                "address": i["attraction_address"],
                                "image": i["attraction_image"]
                            },
                            "date": i["booking_date"],
                            "time": i["booking_time"],
                            "price": i["booking_price"],
                    }]
                    trip.append(itemData)

                orderItemsData ={
                    "data":{
                        "number": search_order_result[0]["order_number"],
                        "trip": trip,
                        "contact": {
                            "name": search_order_result[0]["contact_name"],
                            "email": search_order_result[0]["contact_email"],
                            "phone": search_order_result[0]["contact_phone"]
                        },
                        "status": search_order_result[0]["order_status"],
                    }
                }

                result = orderItemsData
            else:
                orderItemsData = []
                trip = []
                for x in range(len(search_order_result)):
                    i = search_order_result[x]
                    if x+1 < len(search_order_result) and i["order_number"] == search_order_result[x+1]["order_number"]:
                        itemData = [{
                        "attraction": {
                                "id": i["attraction_id"],
                                "name": i["attraction_name"],
                                "address": i["attraction_address"],
                                "image": i["attraction_image"]
                            },
                            "date": i["booking_date"],
                            "time": i["booking_time"],
                            "price": i["booking_price"],
                        }]
                        trip.append(itemData)

                    else:
                        itemData = [{
                        "attraction": {
                                "id": i["attraction_id"],
                                "name": i["attraction_name"],
                                "address": i["attraction_address"],
                                "image": i["attraction_image"]
                            },
                            "date": i["booking_date"],
                            "time": i["booking_time"],
                            "price": i["booking_price"],
                        }]
                        trip.append(itemData)
                        data =[{
                            "data":{
                                "number": search_order_result[x]["order_number"],
                                "trip": trip,
                                "contact": {
                                    "name": search_order_result[x]["contact_name"],
                                    "email": search_order_result[x]["contact_email"],
                                    "phone": search_order_result[x]["contact_phone"]
                                },
                                "status": search_order_result[x]["order_status"],
                                "record_time": search_order_result[x]["record_time"],
                            }
                        }]
                        orderItemsData.append(data)
                        trip = []
                result = orderItemsData

        elif len(search_order_result) == 0:
            result = {"data":None}

        else:
            result = "沒有此權限"

    except mysql.connector.Error as err:
        result = err

    except Exception as e:
        result = e

    finally:
        cursor.close()
        connection_object.close()
        return result


