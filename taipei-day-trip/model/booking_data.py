import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
from flask_bcrypt import Bcrypt
import jwt
import time
import model.base_data as base
import model.attraction_data as attraction
import re

connection_pool = pooling.MySQLConnectionPool(pool_name = "booking_pool",
    pool_size = 3,
    pool_reset_session = True,
    **base.dbconfig
)

def save_booking(member,booking_data):
    try:
        
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        add_sql = '''
                    INSERT INTO booking(
                        attractions_id,
                        booking_date,
                        booking_time,
                        booking_price,
                        member_id)
                    VALUE(%s,%s,%s,%s,%s)'''

        add_value = (booking_data['attractionId'],
                    booking_data['date'],
                    booking_data['time'],
                    booking_data['price'],
                    member
                    )

        cursor.execute(add_sql,add_value)
        connection_object.commit()
        result = "ok"

    except TypeError:
        result = "建立失敗，輸入不正確或其他原因"

    except mysql.connector.Error as err:
        result = err

    except:
        result = "伺服器內部錯誤"

    finally:
        cursor.close()
        connection_object.close()
        return result




def search_booking(member_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(buffered=True, dictionary=True)

        search_booking_sql = '''
        SELECT
                imags.attractions_id,
                name,
                address,
                imags.file,
                booking_date,
                booking_time,
                booking_price 
            FROM (
                SELECT
                    attractions.id,
                    attractions.name,
                    attractions.address, 
                    booking.booking_date,
                    booking.booking_time,
                    booking.booking_price 
                FROM (
                    attractions INNER JOIN booking  
                    ON attractions.id = booking.attractions_id
                )WHERE booking.member_id=%s)
            AS data INNER JOIN (
                SELECT * FROM imags  GROUP BY attractions_id)
            As imags 
            ON imags.attractions_id = data.id '''
        search_booking_value = (member_id,)
        cursor.execute(search_booking_sql,search_booking_value)
        search_booking_result = cursor.fetchall()
        
        if len(search_booking_result) != 0:
            result = []
            for i in search_booking_result:
                data = {
                    "attraction": {
                    "id": i["attractions_id"],
                    "name": i["name"],
                    "address": i["address"],
                    "image": i["file"]
                    },
                    "date": i["booking_date"],
                    "time": i["booking_time"],
                    "price": i["booking_price"]
                    }
                result.append(data)
        else:
            result = None
    except:
        result = "伺服器內部錯誤"

    finally:
        cursor.close()
        connection_object.close()
        return result


def delete_booking(member,booking_data):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        delete_sql = '''
                DELETE 
                FROM booking 
                WHERE(
                    attractions_id = %s
                AND
                    booking_date = %s
                AND
                    booking_time = %s
                AND
                    booking_price = %s
                AND
                    member_id = %s)
                LIMIT 1
                '''
        delete_value = (booking_data['attractionId'],
                    booking_data['date'],
                    booking_data['time'],
                    booking_data['price'],
                    member
                    )
        cursor.execute(delete_sql,delete_value)
        connection_object.commit()
        result = "ok"

    except TypeError:
        result = "建立失敗，輸入不正確或其他原因"

    except:
        result = "伺服器內部錯誤"

    finally:
        cursor.close()
        connection_object.close()
        return result
