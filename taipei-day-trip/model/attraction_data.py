# -*- coding: utf-8 -*-
"""
Created on Tue Nov 15 21:13:19 2022

@author: 劉佳怡
"""
import math
import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
import model.base_data as base

connection_pool = pooling.MySQLConnectionPool(pool_name = "attraction_pool",
    pool_size = 3,
    pool_reset_session = True,
    **base.dbconfig
    )


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
                "category" : myresult[i][8],
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

        count =12
        page = int(page)
        data_start = page*count
        next_page_star = (page+1)*count

        if keyword != None and keyword != "":
            keyword_search = '''
            SELECT
                imags.attractions_id,
                name,
                description, 
                address,
                direction,
                MRT,
                latitude,
                longitude, 
                catalog_name, 
                imags.file
            FROM (
                SELECT
                    attractions.name,
                    attractions.description, 
                    attractions.address, 
                    attractions.direction,
                    attractions.MRT,
                    attractions.latitude,
                    attractions.longitude, 
                    catalog.catalog_name,
                    attractions.id
                FROM (
                    attractions INNER JOIN catalog  
                    ON attractions.catalog_id = catalog.id
                )where
                     (catalog.catalog_name=%s
                     OR attractions.name LIKE %s) 
                LIMIT %s,%s )
            AS data INNER JOIN imags 
            ON imags.attractions_id = data.id
            '''

            catalogs = search_categories()
            if keyword in catalogs:
                keyword_search_value = (keyword,'%'+keyword+ '%',data_start,count)
            else:
                keyword_search_value = (keyword,'%'+keyword+ '%',data_start,count)
            cursor.execute( keyword_search,keyword_search_value)
            myresult = cursor.fetchall()

            #檢查是否有下一頁
            next_page_value = (keyword,'%'+keyword+ '%',next_page_star,1)
            cursor.execute(keyword_search,next_page_value)
            next_result = cursor.fetchall()

        else:
            pages_search = '''
            SELECT
                imags.attractions_id,
                name,
                description, 
                address,
                direction,
                MRT,
                latitude,
                longitude, 
                catalog_name, 
                imags.file
            FROM (
                SELECT
                    attractions.name,
                    attractions.description, 
                    attractions.address, 
                    attractions.direction,
                    attractions.MRT,
                    attractions.latitude,
                    attractions.longitude, 
                    catalog.catalog_name,
                    attractions.id
                FROM (
                    attractions INNER JOIN catalog  ON attractions.catalog_id = catalog.id
                )
                ORDER BY attractions.id
                LIMIT %s,%s
                )
            AS data INNER JOIN imags ON imags.attractions_id = data.id
            '''
            pages_search_value = (data_start,count)
            cursor.execute(pages_search,pages_search_value)
            myresult = cursor.fetchall()

            #檢查是否有下一頁
            next_page_value = (next_page_star,1)
            cursor.execute(pages_search,next_page_value)
            next_result = cursor.fetchall()

        #整理要回傳的資訊
        if len(next_result) != 0:
            next_page = page+1
        else:
            next_page = None
        result = clean_data(myresult)
        
        data_result = (next_page,result)


    except ValueError:
        data_result ="Please use a positive integer"

    except:
        data_result ="Please try again"

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
                imags.attractions_id,
                name,
                description, 
                address,
                direction,
                MRT,
                latitude,
                longitude, 
                catalog_name, 
                imags.file
            FROM (
                SELECT
                    attractions.name,
                    attractions.description, 
                    attractions.address, 
                    attractions.direction,
                    attractions.MRT,
                    attractions.latitude,
                    attractions.longitude, 
                    catalog.catalog_name,
                    attractions.id
                FROM (
                    attractions INNER JOIN catalog  ON attractions.catalog_id = catalog.id
                )WHERE  attractions.id =  %s )
            AS data INNER JOIN imags ON imags.attractions_id = data.id'''
        id_search_value = (id,)
        cursor.execute(id_search,id_search_value)
        myresult = cursor.fetchall()
        result = clean_data(myresult)

        if len(myresult) != 0:
            data_result = result

        else:
            raise IndexError()

    except IndexError :
        data_result ="Number out of range"

    except ValueError:
        data_result ="Please use a positive integer "

    except:
        data_result ="伺服器內部錯誤"


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
        data_result = catalog_name_all
    except:
        data_result ="Please input /api/categories"
    finally:
        cursor.close()
        connection_object.close()

        return data_result

