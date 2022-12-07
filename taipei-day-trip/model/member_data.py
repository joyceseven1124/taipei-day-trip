import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
import model.base_data as dbconfig
from flask_bcrypt import Bcrypt
import jwt
import time


connection_pool = pooling.MySQLConnectionPool(pool_name = "member_pool",
    pool_size = 3,
    pool_reset_session = True,
    **dbconfig.database()
    )

bcrypt = Bcrypt()


def add_member(data):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        password = data["password"]
        hashed_password = bcrypt.generate_password_hash(password=password)

        check_sql = '''SELECT email FROM member WHERE email = %s'''
        check_value = (data["email"],)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()

        if check_result == None:
            add_sql = '''
                    INSERT INTO member(username,email,password)
                    VALUE(%s,%s,%s)'''
            add_value = (data["name"],data["email"],hashed_password)
            cursor.execute(add_sql,add_value)
            connection_object.commit()

            result = "ok"
        else:
            result = "fail"
    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result



def enter_account(data):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        check_sql = '''SELECT * FROM member WHERE email = %s'''
        check_value = (data["email"],)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()

        if check_result != None :
            password = check_result[3]
            input_password = data["password"]
            check_password = bcrypt.check_password_hash(password,input_password)
            if check_password :
                result = check_result
            else:
                result = "password error"
        else:
            result = "email error"
    except:
        result = "Unexpected Error"

    finally:
        cursor.close()
        connection_object.close()
        return result


def make_token(data):
    key = "96935DC58442A0C21C86529DA8B84251719307EABD9F8A3B3FB4B515E728BEF3"
    now = time.time()
    expiretime = 7*24*60*60

    payload = {
        "id": data[0],
        "name": data[1],
        "email": data[2],
        "expire": now + expiretime
    }

    return jwt.encode(payload,key,algorithm = 'HS256')

def check_token(token_value):
    token = token_value
    if token == None:
        return "no token"
    try:
        key = "96935DC58442A0C21C86529DA8B84251719307EABD9F8A3B3FB4B515E728BEF3"
        result = jwt.decode(token, key, algorithms=['HS256'])
        data = [result["id"],result["name"],result["email"]]
        return data
    except jwt.ExpiredSignatureError:
        return "login again"
    except:
        return "Unexpected Error"


