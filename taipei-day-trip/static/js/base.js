const nameRule =  /^[a-zA-Z\d\u4e00-\u9fa5]{1,}$/
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

//document.addEventListener('load', checkIsState())
document.addEventListener('DOMContentLoaded',checkIsState)
//document.addEventListener('DOMContentLoaded',memberHave)

const signIn = document.querySelector(".navigation_button_sign")
signIn.addEventListener("click",signInView)

const signOut = document.querySelector(".navigation_button_sign_out")
signOut.addEventListener("click",signOutState)

const registerButton = document.querySelector(".register_button")
registerButton.addEventListener("click",registerView)

const loginButton = document.querySelector(".logIn_button")
loginButton.addEventListener("click",signInView)

const cancelButton = document.querySelectorAll(".cancel_button")
cancelButton[0].addEventListener("click",closeView)
cancelButton[1].addEventListener("click",closeView)

const logIn = document.querySelector(".login")
const alertBackground = document.querySelector(".background")
const register = document.querySelector(".register")

const scroll = document.querySelector("body")

const buildAccount = document.querySelector("#build")
buildAccount.addEventListener("click",buildReq)

const logInAccount = document.querySelector("#enter")
logInAccount.addEventListener("click",EnterReq)

const registerResultMessage = document.querySelector(".register_result")
const loginResultMessage = document.querySelector(".logIn_result")

let memberState = false

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
    alertBackground.classList.add("hide")
    scroll.style.overflowY = "scroll"
    if(register.classList.contains("hide")){
        logIn.classList.add("hide")
    }else{
        register.classList.add("hide")
    }
}

function cleanBuildInput(){
    registerResultMessage.textContent = " "
    document.querySelector("#newName").value = ""
    document.querySelector("#newEmail").value = ""
    document.querySelector("#newPassword").value =""
}

async function buildReq(){
    const newName = document.querySelector("#newName").value
    const newEmail = document.querySelector("#newEmail").value
    const newPassword = document.querySelector("#newPassword").value
    
    const checkName = nameRule.test(newName)
    const checkEmail = emailRule.test(newEmail)
    if (newPassword !== "" && checkName && checkEmail){
        const response = await fetch("/api/user",{
                method:"POST",
                header:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "name": newName,
                    "email": newEmail,
                    "password": newPassword
                })
            })
        const buildResult = await response.json()
        cleanBuildInput()
        if(buildResult.error){
            registerResultMessage.textContent = buildResult.message
            registerResultMessage.style.color = "red"
        }else{
            registerResultMessage.textContent = "註冊成功"
            registerResultMessage.style.color = "green"
        }


    }else{
        registerResultMessage.textContent = "請檢查資料是否有誤"
        registerResultMessage.style.color = "red"
    }
}


async function EnterReq(){
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    const checkEmail = emailRule.test(email)

    if(password !== "" && checkEmail){
        const response = await fetch("/api/user/auth",{
                method:"PUT",
                header:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "email": email,
                    "password": password
            })
        })

        const enterResult = await response.json()
        if (enterResult.error){
            loginResultMessage.textContent = enterResult.message
            loginResultMessage.style.color = "red"
        }else{
             window.location.reload()
        }
    }else{
        loginResultMessage.textContent = "請檢查是否正確輸入"
        loginResultMessage.style.color = "red"
    }
}

async function checkIsState(){
    const response = await fetch("/api/user/auth")
    const checkIsStateResult = await response.json()
    if(checkIsStateResult.data !== null){
        memberState = true
        signIn.classList.add("hide")
        signOut.classList.remove("hide")
    }
}

async function signOutState(){
    const response = await fetch("/api/user/auth",{
        method:"DELETE"
    })
    const signOutStateResult = await response.json()
    window.location.reload()
}

/*function memberHave(){
    if(memberState){
        console.log("拉拉")
        signIn.classList.add("hide")
        signOut.classList.remove("hide")
    }
}*/
