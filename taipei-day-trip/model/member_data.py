import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
from flask_bcrypt import Bcrypt
import jwt
import time
import model.base_data as base
import re


connection_pool = pooling.MySQLConnectionPool(pool_name = "member_pool",
    pool_size = 3,
    pool_reset_session = True,
    **base.dbconfig
    )

bcrypt = Bcrypt()

def add_member(data):
    try:
        nameRule_result = re.match(base.nameRule, data["name"])
        emailRule_result = re.match(base.emailRule, data["email"])
        passwordRule_result = re.match(base.passwordRule, data["password"])
        if nameRule_result == None or emailRule_result == None or passwordRule_result == None:
            result = "Account or password setting error"
            return result

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
        cursor = connection_object.cursor(buffered=True, dictionary=True)

        check_sql = '''SELECT * FROM member WHERE email = %s'''
        check_value = (data["email"],)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()
        if check_result != None :
            search_password = check_result["password"]
            input_password = data["password"]
            check_password = bcrypt.check_password_hash(search_password,input_password)
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
    key = base.token_key
    now = time.time()
    expiretime = 7*24*60*60

    payload = {
        "id": data["id"],
        "name": data["username"],
        "email": data["email"],
        "expire": now + expiretime
    }

    return jwt.encode(payload,key,algorithm = 'HS256')

def check_token(token_value):
    token = token_value
    if token == None:
        return "no token"
    try:
        key = base.token_key
        result = jwt.decode(token, key, algorithms=['HS256'])
        data = [result["id"],result["name"],result["email"]]
        return data
    except jwt.ExpiredSignatureError:
        return "login again"
    except:
        return "Unexpected Error"


def check_member(member):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(buffered=True, dictionary=True)

        check_sql = '''SELECT * FROM member WHERE email = %s'''
        check_value = (member[2],)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()
        #member[1] == check_result["username"]
        if check_result != None :
            if(member[0] == check_result["id"]):
                result = "correct"
        
        else:
            result = "查無會員資料"
    except:
        result = "伺服器內部錯誤"

    finally:
        cursor.close()
        connection_object.close()
        return result


def save_member_information(memberId,memberName,data):
    birthRule = "^\d{4}[/]\d{1,2}[/]\d{1,2}$"
    genderRule = "^[男\女\無]{1}$"
    member_birth = data["data"]["memberBirth"]
    member_gender = data["data"]["memberGender"]
    if member_birth == "無" and member_gender == "無":
        birthRule_result = True
        genderRule_result = True
    elif member_gender == "無":
        birthRule_result = re.match(birthRule, member_birth)
        if birthRule_result == None:
            result = "fail"
            return result
    elif member_birth == "無":
            genderRule_result = re.match(genderRule,member_gender)
            if genderRule_result == None:
                result = "fail"
                return result
    else:
        birthRule_result = re.match(birthRule, member_birth)
        genderRule_result = re.match(genderRule,member_gender)
        if birthRule_result == None or genderRule_result == None:
            result = "fail"
            return result

    if data["data"]["newPassword"] != "":
        result = update_member_password(memberId,data)
        if result == "Unexpected Error":
            return result

    if data["data"]["memberName"] != memberName:
        result = update_member_name(data,memberId)
        if result == "Unexpected Error":
            return result
    try:

        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        check_sql = '''SELECT member_id FROM  member_information WHERE member_id = %s'''
        check_value = (memberId,)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()
        if check_result == None:
            add_sql = '''
                INSERT INTO member_information(member_id,birth,gender)
                VALUE(%s,%s,%s)
                '''
            add_value = (memberId, member_birth,member_gender)
            cursor.execute(add_sql,add_value)
            connection_object.commit()
            result = "ok"
        else:
            update_sql = '''
                UPDATE member_information 
                SET 
                    birth = %s,
                    gender = %s
                WHERE
                    member_id = %s
                    '''

            update_value = (member_birth,member_gender,memberId)
            cursor.execute(update_sql,update_value)
            connection_object.commit()
            result = "ok"

    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result


def update_member_name(data,memberId):
    new_userName = data["data"]["memberName"]
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update_sql = '''
                UPDATE member
                SET 
                    username = %s
                WHERE
                    id = %s'''

        update_value = (new_userName,memberId)
        cursor.execute(update_sql,update_value)
        connection_object.commit()
        
        result = "ok"
    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result



def update_member_password(memberId,data):
    try:
        input_old_password = data["data"]["oldPassword"]
        input_new_password = data["data"]["newPassword"]
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(buffered=True, dictionary=True)
        search_sql='''SELECT password FROM  member WHERE id = %s'''
        search_value = (memberId,)
        cursor.execute(search_sql,search_value)
        old_password = cursor.fetchone()
        check_password_result = bcrypt.check_password_hash(old_password["password"],input_old_password)
        if check_password_result:
            hashed_password = bcrypt.generate_password_hash(password=input_new_password)
            update_sql = '''
                UPDATE member
                SET
                    password = %s
                WHERE
                    id = %s
                    '''
            update_value = (hashed_password,memberId)

            cursor.execute(update_sql,update_value)
            connection_object.commit()
            result = "ok"

        else:
            result = "password is not true"

    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result


def search_member_page_information(memberId):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(buffered=True, dictionary=True)
        search_sql=''' 
            SELECT 
                member.id, 
                birth,
                gender,
                username,
                picture
            FROM member_information 
            RIGHT JOIN member 
            ON member_information.member_id = member.id
            WHERE member.id = %s
            '''

        search_value = (memberId,)
        cursor.execute(search_sql,search_value)
        result = cursor.fetchone()
    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result



def save_member_img(memberId,img):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        check_sql = '''SELECT member_id FROM  member_information WHERE member_id = %s'''
        check_value = (memberId,)
        cursor.execute(check_sql,check_value)
        check_result = cursor.fetchone()
        if check_result == None:
            add_sql = '''
                INSERT INTO member_information(member_id,picture)
                VALUE(%s,%s)
                '''
            add_value = (memberId, img)
            cursor.execute(add_sql,add_value)
            connection_object.commit()
            result = "ok"
        else:
            update_sql = '''
                UPDATE member_information 
                SET 
                    picture = %s
                WHERE
                    member_id = %s
                    '''

            update_value = (img,memberId)
            cursor.execute(update_sql,update_value)
            connection_object.commit()
            result = "ok"
    except:
        result = "Unexpected Error"
    finally:
        cursor.close()
        connection_object.close()
        return result