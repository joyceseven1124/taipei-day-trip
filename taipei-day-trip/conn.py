# -*- coding: utf-8 -*-
"""
Created on Tue Nov 15 21:13:19 2022

@author: 劉佳怡
"""
import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling

dbconfig = { 
    "host":"localhost",
    "port":3307,
    "database":"taipei",
    "user":"root",
    "password":"xu.6ru8u6"}

connection_pool = pooling.MySQLConnectionPool(pool_name = "test_pool",
    pool_size = 3,
    pool_reset_session = True,
    **dbconfig
    )

def catalog_id(text):
    if text == 1:
        return "親子共遊"
    elif text == 2:
        return "養生溫泉"
    elif text == 3:
        return "宗教信仰"
    elif text == 4:
        return "單車遊蹤"
    elif text == 5:
        return "歷史建築"
    elif text == 6:
        return "藍色公路"
    elif text == 7:
        return "戶外踏青"
    elif text == 8:
        return "藝文館所"
    else:
        return "其他"

def clean_data(page,total_pages,myresult):
    try:
        result = []
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        
        if page+1 <= total_pages:
            next_page = page+1
        else:
            next_page = "null"
        
        
        for i in myresult:           
            per_data = i
            CAT = per_data[12]
            CAT = catalog_id(CAT)
            
            id = per_data[0]
            find_file= "SELECT * FROM imags where attractions_id = %s "
            find_value = (id,)
            cursor.execute(find_file,find_value)
            myfile = cursor.fetchall()
            imgs=[]
            for f in myfile:
                per_file = f
                img = per_file[2]
                imgs.append(img)
            
            data = {
            "id" : id ,
            "name" : per_data[1],
            "category" : CAT,
            "description" : per_data[17],
            "address": per_data[19],
            "transport" :  per_data[3],
            "mrt" : per_data[9],
            "lat": per_data[16],
            "lng" : per_data[5],
            "images": imgs
            }
            
            result.append(data)
    except:
        print("Unexpected Error")
    finally:
        cursor.close()
        connection_object.close()        
        data_result = {"nextPage":next_page,"data": result}
        return data_result

def search_keyword(keyword,page):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        keyword_catalogs = ['親子共遊','養生溫泉','宗教信仰','單車遊蹤','歷史建築','藍色公路','戶外踏青','藝文館所','其他']
        if keyword in keyword_catalogs:
            page = int(page)    
            catalog_count = "SELECT count( catalog.name ) FROM attractions INNER JOIN catalog ON attractions.catalog_id = catalog.id WHERE catalog.name =%s"
            catalog_count_value = (keyword,)
            cursor.execute(catalog_count,catalog_count_value)
            count = cursor.fetchall()
            total_pages = math.ceil(int(count[0][0])/12)-1
            if page <= total_pages:
                data_start = page*12
                catalog_search = "SELECT * FROM attractions INNER JOIN catalog ON attractions.catalog_id = catalog.id WHERE catalog.name =%s ORDER BY attractions.id LIMIT %s,%s" 
                catalog_value = (keyword,data_start,12)
                cursor.execute(catalog_search,catalog_value)
                myresult = cursor.fetchall()
                data_result = clean_data(page,total_pages,myresult)
            else:
                data_result = {
                    "nextPage":"null",
                    "data": []
                }
           
            
            
        elif keyword == None :
            page = int(page)    
            cursor.execute("SELECT count( name ) FROM attractions")
            count = cursor.fetchall()
            total_pages = math.ceil(int(count[0][0])/12)-1
            myresult = cursor.fetchall()
            if page <= total_pages:
                data_start = page*12
                cursor.execute("SELECT * FROM attractions  ORDER BY attractions.id LIMIT %s,%s",(data_start,12))
                myresult = cursor.fetchall()
                data_result = clean_data(page,total_pages,myresult)
            
            else:
                data_result = {
                    "nextPage":"null",
                    "data": []
                } 

                
                        
        else:
            page = int(page)
            cursor.execute("SELECT count( name ) FROM attractions where name lIKE %s ORDER BY id",('%'+keyword+ '%',))
            count = cursor.fetchall()
            total_pages = math.ceil(int(count[0][0])/12)-1
            myresult = cursor.fetchall()
            if page <= total_pages:
                data_start = page*12
                search_input= "SELECT * FROM attractions where name lIKE %s ORDER BY id LIMIT %s,%s"
                search_value=('%'+keyword+ '%',data_start,12)
                cursor.execute(search_input,search_value)
                myresult = cursor.fetchall()
                data_result = clean_data(page,total_pages,myresult)
            else:
                data_result = {
                    "nextPage":"null",
                    "data": []
                }
                
    except:
        data_result ={
                "error": True,
                "message": "Use positive integer to look up page"
                }
    finally:
        cursor.close()
        connection_object.close()       
        return data_result




def search_id(id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        id = int(id)
        cursor.execute("SELECT count( id ) FROM attractions")
        count = cursor.fetchall()
        count = int(count[0][0])
        if id > count:
            raise IndexError()
        
        cursor.execute("SELECT * FROM attractions where id = %s ",(id,))
        id_result = cursor.fetchone()
        
        
        CAT = id_result[12]
        CAT = catalog_id(CAT)

        find_file= "SELECT * FROM imags where attractions_id = %s "
        find_value = (id,)
        cursor.execute(find_file,find_value)
        myfile = cursor.fetchall()
        imgs=[]
        for f in myfile:
            per_file = f
            img = per_file[2]
            imgs.append(img)
        
        data = {
          "id" : id ,
          "name" : id_result[1],
          "category" : CAT,
          "description" : id_result[17],
          "address": id_result[19],
          "transport" :  id_result[3],
          "mrt" : id_result[9],
          "lat": id_result[16],
          "lng" : id_result[5],
          "images": imgs
          }
        
        data_result = {"data": data }
        
    except IndexError :
        data_result ={
            "error": True,
            "message": 'Number out of range'
            }
        
    except ValueError:
          data_result ={
            "error": True,
            "message": "Please use a positive integere "
            }
    except:
          data_result ={
            "error": True,
            "message": "Please try again"
            }
    
         
    finally:
        cursor.close()
        connection_object.close()
        return data_result



def search_categories():    
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        cursor.execute("SELECT * FROM catalog")
        categories_result = cursor.fetchall()
        
        catalog_name_all = []
        for i in categories_result:
            catalog_per =  i
            catalog_name = catalog_per[1]         
            catalog_name_all.append(catalog_name)
        data_result = {"data":catalog_name_all}                      
    except:
        data_result ={
            "error": True,
            "message": "Please input /api/categories"
        }
    finally:
        cursor.close()
        connection_object.close()

        return data_result
    
search_id(80)