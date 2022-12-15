const nameRule =  /^[a-zA-Z\d\u4e00-\u9fa5]{1,}$/
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
const passwordRule = /^[a-zA-Z\d\u4e00-\u9fa5]{3,}$/

//document.addEventListener('load', checkIsState())
document.addEventListener('DOMContentLoaded',checkIsState)

const home =  document.querySelector(".navigation_name")
home.addEventListener("click",goHome)

const signIn = document.querySelector(".navigation_button_sign")
signIn.addEventListener("click",signInView)

const bookingIn = document.querySelector(".navigation_button_schedule")
bookingIn.addEventListener("click",loginBookingStateCheck)

const signOut = document.querySelector(".navigation_button_sign_out")
signOut.addEventListener("click",signOutState)

const registerButton = document.querySelector(".register_button")
registerButton.addEventListener("click",registerView)

const loginButton = document.querySelector(".logIn_button")
loginButton.addEventListener("click",signInView)

const cancelButton = document.querySelectorAll(".cancel_button")
cancelButton.forEach(element => {
    element.addEventListener("click",closeView)
})

const buildAccount = document.querySelector("#build")

const logInAccount = document.querySelector("#enter")

const alertBackground = document.querySelector(".background")
const logIn = document.querySelector(".login")
const register = document.querySelector(".register")
const messageCard = document.querySelector(".message")

const scroll = document.querySelector("body")

const newName = document.querySelector("#newName")
newName.addEventListener("keyup",checkRegular)
newName.addEventListener("change",regularResultPrint)

const newEmail = document.querySelector("#newEmail")
newEmail.addEventListener("keyup",checkRegular)
newEmail.addEventListener("change",regularResultPrint)

const newPassword = document.querySelector("#newPassword")
newPassword.addEventListener("keyup",checkRegular)
newPassword.addEventListener("change",regularResultPrint)

const email = document.querySelector("#email")
email.addEventListener("keyup",checkRegular)
email.addEventListener("change",regularResultPrint)

const password = document.querySelector("#password")
password.addEventListener("keyup",checkRegular)
password.addEventListener("change",regularResultPrint)

const registerResultMessage = document.querySelector(".register_result")
const loginResultMessage = document.querySelector(".logIn_result")
const messagePopResult = document.querySelector(".form_message_print")


let memberState = false
let userName =""

function signInView(e){
    logIn.classList.remove("hide")
    alertBackground.classList.remove("hide")
    scroll.style.overflowY = "hidden"
    if(register.classList.contains("hide") !== true){
        register.classList.add("hide")
    }
}

function registerView(e){
    register.classList.remove("hide")
    logIn.classList.add("hide")
}

function closeView(e){
    cleanBuildInput()
    alertBackground.classList.add("hide")
    scroll.style.overflowY = "scroll"
    loginResultMessage.classList.add("hide")
    registerResultMessage.classList.add("hide")
    logIn.classList.add("hide")
    register.classList.add("hide")
    messageCard.classList.add("hide")
}

function resultMessagePrint(message,howIs,whereIs){
    if(whereIs === "messageCard"){
        messageCard.classList.remove("hide")
        scroll.style.overflowY = "hidden"
        messagePopResult.textContent = message
        whereIs = messageCard
    }else{
        whereIs.classList.remove("hide")
        whereIs.textContent = message
    }
    let color = (howIs === "fail") ? "red" : "green"
    whereIs.style.color = color
}


function cleanBuildInput(){
    registerResultMessage.textContent = " "
    newName.value = ""
    newEmail.value = ""
    newPassword.value =""
}

function goHome(){
    window.location.href = "/"
}

function checkRegular(e){
    if(e.target.id.includes("new")){
        const checkName = nameRule.test(newName.value)
        const checkEmail = emailRule.test(newEmail.value)
        const checkPassword = passwordRule.test(newPassword.value)
        if(checkPassword && checkName && checkEmail){
            buildAccount.addEventListener("click",buildReq)
            buildAccount.style.opacity = "100%"
            registerResultMessage.textContent =" "
        }else{
            buildAccount.removeEventListener("click",buildReq)
            buildAccount.style.opacity = "30%"
        }
    }else{
        const checkEmail = emailRule.test(email.value)
        const checkPassword = passwordRule.test(password.value)
        if(checkEmail && checkPassword){
            logInAccount.addEventListener("click",EnterReq)
            logInAccount.style.opacity = "100%"
            loginResultMessage.textContent = ""
        }else{
            logInAccount.removeEventListener("click",EnterReq)
            logInAccount.style.opacity = "30%"
        }
    }
}

function regularResultPrint(e){
    if(e.target.id.includes("Name")){
        const checkName = nameRule.test(e.target.value)
        if(!checkName && e.target.id.includes("new")){
            resultMessagePrint("名稱不能含有特殊字元","fail",registerResultMessage)
        }
    }else if(e.target.id.includes("mail")){
        const checkEmail = emailRule.test(e.target.value)
        if(!checkEmail && e.target.id.includes("new")){
            resultMessagePrint("請檢查email格式","fail",registerResultMessage)
        }else if(!checkEmail){
            resultMessagePrint("請檢查email格式","fail",loginResultMessage)
        }
    }else{
        const checkPassword = passwordRule.test(e.target.value)
        if(!checkPassword && e.target.id.includes("new")){
            resultMessagePrint("密碼不能含有特殊字元","fail",registerResultMessage)
        }else if(!checkPassword){
            resultMessagePrint("密碼不能含有特殊字元","fail",loginResultMessage)
        }
    }
}

async function buildReq(e){
    const response = await fetch("/api/user",{
            method:"POST",
            header:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "name": newName.value,
                "email": newEmail.value,
                "password": newPassword.value
            })
        })
    const buildResult = await response.json()
    cleanBuildInput()
    if(buildResult.error){
        resultMessagePrint(buildResult.message,"fail",registerResultMessage)
    }else{
        resultMessagePrint("註冊成功","success",registerResultMessage)
    }
}


async function EnterReq(e){
    const response = await fetch("/api/user/auth",{
            method:"PUT",
            header:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "email": email.value,
                "password": password.value
        })
    })

    const enterResult = await response.json()
    if (enterResult.error){
        resultMessagePrint(enterResult.message,"fail",loginResultMessage)
    }else{
            window.location.reload()
    }
}

async function checkIsState(){
    const response = await fetch("/api/user/auth")
    const checkIsStateResult = await response.json()
    if(checkIsStateResult.data !== null){
        memberState = true
        userName = checkIsStateResult.data.name
        signIn.classList.add("hide")
        signOut.classList.remove("hide")
        const whoIs = document.querySelector("#username")
        if(whoIs){
            whoIs.textContent = userName
        }
    }
}

function loginBookingStateCheck(e){
    whereIs = window.location.href
    if(memberState){
        if(e.target.id == "nav_schedule" ){
            window.location.href = "/booking"
        }else{
            return true
            //saveBookingData(e)
        }
    }else if(whereIs.includes("booking") && memberState !== true){
        goHome()
    }else{
        signInView()
    }
}



async function signOutState(){
    const response = await fetch("/api/user/auth",{
        method:"DELETE"
    })
    const signOutStateResult = await response.json()
    const whereIs = window.location.href
    if(whereIs.includes("booking")){
        window.location.reload()
        goHome()
    }else{
        window.location.reload()
    }
}





