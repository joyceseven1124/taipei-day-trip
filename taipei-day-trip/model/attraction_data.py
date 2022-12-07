# -*- coding: utf-8 -*-
"""
Created on Tue Nov 15 21:13:19 2022

@author: 劉佳怡
"""
import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling

import os
from dotenv import load_dotenv
load_dotenv()
host = os.getenv("mysqlhost")
port = os.getenv("mysqlport")
database = os.getenv("mysqldatabase")
user = os.getenv("mysqluser")
password = os.getenv("mysqlpassword")

dbconfig = {
"host":host,
"port":port,
"database":database,
"user":user,
"password":password}

connection_pool = pooling.MySQLConnectionPool(pool_name = "attraction_pool",
    pool_size = 3,
    pool_reset_session = True,
    **dbconfig
    )

count =12

def catalog_id(text):
    int(text)
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

def clean_data(myresult):
    imgs = []
    alldata = []
    for i in range(len(myresult)):
        
        if i+1<len(myresult) and myresult[i][1] == myresult[i+1][1]:
            img = myresult[i][9]
            imgs.append(img)
        else:
            img = myresult[i][9]
            imgs.append(img)
            data = {
                "id" :  myresult[i][0] ,
                "name" : myresult[i][1],
                "category" : catalog_id(myresult[i][8]),
                "description" : myresult[i][2],
                "address": myresult[i][3],
                "transport" :  myresult[i][4],
                "mrt" : myresult[i][5],
                "lat": myresult[i][6],
                "lng" : myresult[i][7],
                "images": imgs
                }
            alldata.append(data)
            
            imgs = []
        
    return alldata

    
def search_keyword(keyword,page):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        keyword_catalogs = ['親子共遊','養生溫泉','宗教信仰','單車遊蹤','歷史建築','藍色公路','戶外踏青','藝文館所','其他']
        if keyword in keyword_catalogs:
            page = int(page)
            data_start = page*12
            
            catalog_search = '''
            SELECT
                imags.attractions_id,name,description, address,direction,
                MRT,latitude,longitude, catalog_id, imags.file
            FROM (
                SELECT
                    attractions.name,attractions.description, attractions.address, attractions.direction,attractions.MRT,
                    attractions.latitude,attractions.longitude, attractions.catalog_id,attractions.id

                FROM (
                    attractions INNER JOIN catalog  ON attractions.catalog_id = catalog.id
                )where catalog.catalog_name=%s  limit %s,%s )
            AS data inner join imags ON imags.attractions_id = data.id'''
            catalog_value = (keyword,data_start,count)
            cursor.execute(catalog_search,catalog_value)
            myresult = cursor.fetchall()


            next_page_star = (page+1)*12
            next_page_search = '''
            SELECT * FROM attractions
            INNER JOIN catalog ON attractions.catalog_id = catalog.id
            WHERE catalog.catalog_name =%s  LIMIT %s,%s'''
            next_page_value = (keyword,next_page_star,1)
            cursor.execute(next_page_search,next_page_value)
            next_result = cursor.fetchall()
            if len(next_result) != 0:
                next_page = page+1
            else:
                next_page = None
            result = clean_data(myresult)
            
            data_result = {
                            "nextPage":next_page,
                            "data": result
                           }
        
        elif keyword == None :
            page = int(page)    
            data_start = page*12
            pages_search = '''
            SELECT 
                imags.attractions_id, name,description, address,
                direction, MRT,latitude,longitude, catalog_id,imags.file 
            FROM (
                SELECT * FROM attractions  LIMIT %s,%s )as DATA 
            INNER JOIN imags ON DATA.id  = imags.attractions_id;'''


            pages_search_value = (data_start,count)
            cursor.execute(pages_search,pages_search_value)
            myresult = cursor.fetchall()
            
            
            next_page_star = (page+1)*12
            next_page_search = '''SELECT * FROM attractions  LIMIT %s,%s'''
            next_page_value = (next_page_star,1)
            cursor.execute(next_page_search,next_page_value)
            next_result = cursor.fetchall()
            if len(next_result) != 0:
                next_page = page+1
            else:
                next_page = None
                
            result = clean_data(myresult)
            
            data_result = {
                            "nextPage":next_page,
                            "data": result
                           }
        else:
            page = int(page)    
            data_start = page*12
            keyword_search = '''
            SELECT 
                imags.attractions_id, name,description, address,
                direction, MRT,latitude,longitude, catalog_id,imags.file 
            FROM ( SELECT * FROM attractions WHERE name lIKE %s   LIMIT %s,%s )as DATA 
            INNER JOIN imags ON DATA.id  = imags.attractions_id;'''
            keyword_search_value = ('%'+keyword+ '%',data_start,count)
            cursor.execute(keyword_search,keyword_search_value)
            myresult = cursor.fetchall()
            
            next_page_star = (page+1)*12
            next_page_search = '''SELECT * FROM attractions WHERE name lIKE %s  LIMIT %s,%s'''
            next_page_value = ('%'+keyword+ '%',next_page_star,1)
            cursor.execute(next_page_search,next_page_value)
            next_result = cursor.fetchall()
            if len(next_result) != 0:
                next_page = page+1
            else:
                next_page = None
                
            result = clean_data(myresult)
            
            data_result = {
                            "nextPage":next_page,
                            "data": result
                           }

    except ValueError:
          data_result ={
            "error": True,
            "message": "Please use a positive integere "
            }

        
    finally:
            cursor.close()
            connection_object.close()
            return data_result
        
           
def search_id(id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        id_search = '''
        SELECT 
            imags.attractions_id, name,description, address,
            direction, MRT,latitude,longitude, catalog_id,imags.file 
        FROM ( SELECT * FROM attractions WHERE id =%s )as DATA 
        INNER JOIN imags ON DATA.id  = imags.attractions_id;'''
        id_search_value = (id,)
        cursor.execute(id_search,id_search_value)
        myresult = cursor.fetchall()
        result = clean_data(myresult)
        
        if len(myresult) != 0:
            data_result = {"data": result}
        
        else:
            raise IndexError()

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
        

