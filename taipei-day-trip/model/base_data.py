import os
from dotenv import load_dotenv
load_dotenv()
host = os.getenv("mysqlhost")
port = os.getenv("mysqlport")
database = os.getenv("mysqldatabase")
user = os.getenv("mysqluser")
password = os.getenv("mysqlpassword")
token_key = os.getenv("token_key")

dbconfig = {
"host":host,
"port":port,
"database":database,
"user":user,
"password":password}

nameRule =  "^[a-zA-Z\d\u4e00-\u9fa5]{1,}$"
emailRule = "^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$"
passwordRule = "^[a-zA-Z\d\u4e00-\u9fa5]{3,}$"