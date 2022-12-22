const nameRule =  /^[a-zA-Z\d\u4e00-\u9fa5]{1,}$/
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
const passwordRule = /^[a-zA-Z\d\u4e00-\u9fa5]{3,}$/

async function checkIsState(){
    const response = await fetch("/api/user/auth")
    const checkIsStateResult = await response.json()
    let whereIs = window.location.href
    if(checkIsStateResult.data !== null){
        memberState = true
        userName = checkIsStateResult.data.name
        signIn.classList.add("hide")
        signOut.classList.remove("hide")
        if(whereIs.includes("booking")){
            const whoIs = document.querySelector("#username")
            whoIs.textContent = userName
        }
    }else if(whereIs.includes("booking") && memberState !== true){
        goHome()
    }
}

function resultMessagePrint(message,howIs,whereIs){
    if(whereIs === "messageCard"){
        scroll.style.overflowY = "hidden"
    }
    whereIs.classList.remove("hide")
    whereIs.textContent = message
    let color = (howIs === "fail") ? "red" : "green"
    whereIs.style.color = color
}



let model = {
            checkIsState : checkIsState,
            resultMessagePrint : resultMessagePrint,
            nameRule : nameRule,
            emailRule : emailRule,
            passwordRule : passwordRule
            }


export default model

export {checkIsState,resultMessagePrint,
        nameRule,emailRule,passwordRule};

