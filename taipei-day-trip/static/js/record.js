window.addEventListener("DOMContentLoaded",getOrderData)
const orderCardPlace = document.querySelector(".order-content")
const orderNullPlace = document.querySelector(".order-wrapper")
let i = 0
let x =0


async function getOrderData(){
    const response = await fetch("/api/order")
    const responseResult = await response.json()
    if(responseResult.data === null){
        orderNullPlace.textContent = "查無資料"
    }else{
        responseResult.forEach(element => {
            const contentWrapper = document.createElement("div")
            contentWrapper.setAttribute("class","order-content-wrapper")
            orderCardPlace.appendChild(contentWrapper)
        });
    
        const informationDataPlace = document.querySelectorAll(".order-content-wrapper")
        informationDataPlace.forEach(element => {
            let orderingStatus = ""
            if(responseResult[i][0].data.status === 0){
                orderingStatus = "購買成功"
            }else{
                orderingStatus = "購買失敗"
            }
            
            const informationData = `
                                <div class="member-information">
                                    <div>
                                        <div>
                                            <span class="item-name">訂單編號:</span>
                                            <span>${responseResult[i][0].data.number}</span>
                                        </div>
                                        <div >
                                            <span class="item-name">購買狀態:</span>
                                            <span class="ordering-status">${orderingStatus}</span>
                                        </div>
                                        <div class="item-name">
                                            <span class="item-name">購買時間:</span>
                                            <span>${responseResult[i][0].data.record_time}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2>--------------購買人資訊-------------</h2>
                                        <div>
                                            <span class="item-name">名字:</span>
                                            <span>${responseResult[i][0].data.contact.name}</span>
                                        </div>
                                        <div>
                                            <span class="item-name">電話:</span>
                                            <span>${responseResult[i][0].data.contact.phone}</span>
                                        </div>
                                        <div>
                                            <span class="item-name">信箱:</span>
                                            <span>${responseResult[i][0].data.contact.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-item-information-content"></div>`
            element.innerHTML = informationData
            tripAdd(i)
            i++
        })
        
        function tripAdd(number){
            const orderAttractionContentPlace = document.querySelectorAll(".order-item-information-content")
            const allTrip = responseResult[number][0].data.trip
            let allTripList = " "
            let orderAttractionContent = ""
            allTrip.forEach(element => {
                orderAttractionContent =`
                <div class="order-item-information">
                    <img class="item-pic" src="${element[0].attraction.image}">
                    <div class="item-introduction">
                        <div class="item-name information">
                            <span class="item-name">景點名稱:</span>
                            <span>${element[0].attraction.name}</span>
                        </div>
                        <div class="item-date information">
                            <span class="item-name">日期:</span>
                            <span>${element[0].date}</span>
                        </div>
                        <div class="item-time information">
                            <span class="item-name">時間:</span>
                            <span>${element[0].time}</span>
                        </div>
        
                        <div class="item-price information">
                            <span class="item-name">價格:</span>
                            <span>${element[0].price}</span>
                        </div>
                    </div>
                </div>`
                allTripList = allTripList + orderAttractionContent+" "
                x++
            })
            orderAttractionContentPlace[number].innerHTML = allTripList
        }
    
        const orderStatusPlace = document.querySelectorAll(".ordering-status")
        orderStatusPlace.forEach(element => {
            let statusColor =  (element.textContent === "購買成功") ? "green" : "red"
            element.style.color = statusColor
        })
    }
    
}

