const dataNet = window.location.href
const dataNetArray = dataNet.split("?")
const orderNumber = parseInt(dataNetArray[1].split("=")[1])
window.addEventListener("DOMContentLoaded",getOrderData)

const member = document.querySelector("#order-from")
const orderingStatus = document.querySelector("#order-status")
const orderingNumber = document.querySelector("#order-number")
const orderingItem = document.querySelector(".order-items")
const orderingItemPlace = document.querySelector(".order-items-title")
const orderGoHomeButton = document.querySelector("#go-home-button")
orderGoHomeButton.addEventListener("click",goHome)

async function getOrderData(){
    const response = await fetch("/api/order?number="+orderNumber)
    const responseResult = await response.json()
    if ((typeof responseResult) === "string"){
        goHome()
    }

    if(responseResult.data === null){
        resultMessagePrint("沒有此筆訂單","fail","messageCard")
        setTimeout("goHome()",3000)
    }

    if(responseResult.data.status === 0){
        orderingStatus.textContent = "交易成功"
        orderingStatus.style.color = "green"
    }else{
        orderingStatus.textContent = "交易失敗"
        orderingStatus.style.color = "red"
    }
    const orderItemsResult = responseResult.data.trip
    let i = 0
    orderItemsResult.forEach(element => {
        let itemName =  element[0].attraction.name
        if(i===0){
            orderingItem.textContent = itemName
        }else{
            const itemNamePlace = document.createElement("div")
            const itemNameWord = document.createTextNode(itemName)
            itemNamePlace.appendChild(itemNameWord)
            orderingItemPlace.appendChild(itemNamePlace)
        }
        i++
    });
    orderingNumber.textContent = responseResult.data.number
    member.textContent = responseResult.data.contact.name
}

//http://127.0.0.1:3000/thankyou?number=2022122110433921
//http://127.0.0.1:3000/thankyou?number=2022122117121314