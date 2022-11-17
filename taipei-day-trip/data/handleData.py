import mysql.connector
import json


with open("taipei-attractions.json","r",encoding='UTF-8') as jsonfile:
    data = json.load(jsonfile)
    # 或者這樣
    #data = json.loads(jsonfile.read())


#print(data[0]['MRT'])
#print(len(data))



mydb = mysql.connector.connect(
    host = "localhost",
    port = 3307,
    database = "taipei",
    user = "root",
    password = "xu.6ru8u6"
)

mycursor = mydb.cursor()

def filter_file(string):
    if ".jpg" in string or ".JPG" in string or ".png" in string:
        return True
    else:
        return False

def catalog_id(text):
    if text == "親子共遊":
        return "1"
    elif text == "養生溫泉":
        return "2"
    elif text == "宗教信仰":
        return "3"
    elif text == "單車遊蹤":
        return "4"
    elif text == "歷史建築":
        return "5"
    elif text == "藍色公路":
        return "6"
    elif text == "戶外踏青":
        return "7"
    elif text == "藝文館所":
        return "8"
    else:
        return "9"

data = data['result']['results']
num = len(data)
mrts_data = []
catalog = []
img_id = 0
for i in range(num):
    id  = data[i]['_id']
    name = data[i]['name']
    rate = data[i]['rate']
    direction = data[i]['direction']
    date = data[i]['date']
    longitude = data[i]['longitude']
    REF_WP = data[i]['REF_WP']
    avBegin = data[i]['avBegin']
    langinfo = data[i]['langinfo']
    SERIAL_NO = data[i]['SERIAL_NO']
    RowNumber = data[i]['RowNumber']  
    MEMO_TIME = data[i]['MEMO_TIME']
    POI = data[i]['POI']
    idpt = data[i]['idpt']
    latitude = data[i]['latitude']
    description = data[i]['description']
    avEnd = data[i]['avEnd']
    address = data[i]['address']
    MRT = data[i]['MRT']
    
    
    CAT = data[i]['CAT']
    CAT_id = catalog_id(CAT)
 
    input_attractions = "INSERT INTO attractions(id,name,rate,direction,date,longitude,REF_WP, avBegin,langinfo,MRT,SERIAL_NO,RowNumber,catalog_id,MEMO_TIME,POI,idpt,latitude,description,avEnd,address) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) "
    attractions_values = (id,name,rate,direction,date,longitude,REF_WP, avBegin,langinfo,MRT,SERIAL_NO,RowNumber,CAT_id,MEMO_TIME,POI,idpt,latitude,description,avEnd,address)
    mycursor.execute(input_attractions,attractions_values)
    mydb.commit()

    file = data[i]['file'].split('https:')
    file_result = filter(filter_file,file)
    file_list=list(file_result)
    
    for x in file_list:
        img_id = img_id + 1
        input_img = "INSERT INTO imags(id,attractions_id,file) VALUES(%s,%s,%s)"
        img_value = (img_id,id,"https"+x)
        mycursor.execute(input_img,img_value)
        mydb.commit()


mycursor.close()
    #catalog.append(CAT)
    
#print(set(mrts_data))
#print(set(catalog))
#print(data[11]['direction'])




#str = data[45]['file'].split('https:')
#testcat = data[45]['CAT']
#X=catalog_id(testcat)
#print(X)
#print(testcat)
#print(str)
#file_result = filter(filter_file, str)
#print(list(file_result))

#file_list=list(file_result)


#for i in file_list:
    #print("https"+i)
    




    
