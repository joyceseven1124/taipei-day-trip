window.addEventListener('load',loginBookingStateCheck)
window.addEventListener('load',bookingDataGet)

const bookingDataPlace = document.querySelector(".booking_content_reserve")
const bookingDealPlace = document.querySelector(".member_booking_wrapper")
const dealTotal = document.querySelector(".confirm_deal_price_total")

let total = 0



async function bookingDataGet(){
    const responseBooking = await fetch("/api/booking",{
        method:"GET"})
    const renderResultBooking = await responseBooking.json()
    if(renderResultBooking.data !== null){
        bookingDataRender(renderResultBooking)
    }else{
        noRenderBooking()
    }
}

function bookingDataRender(result){
    result.data.forEach(element => {
        const bookingAttractionCard =document.createElement("section")
        bookingAttractionCard.setAttribute("class","booking_information_wrapper")
        bookingDataPlace.appendChild(bookingAttractionCard)
    });

    const bookingAttractionCardPlace = document.querySelectorAll('.booking_information_wrapper')
    let i = 0
    result.data.forEach(element => {
        let time = (element.time === "afternoon") ? "13:00-17:00" : "9:00-12:00"

        const bookingAttractionContent = `
        <div class="booking_information_article .number${i}">
            <img class="booking_information_pic" src=${element.attraction.image}>

            <div class="booking_information_word">

                <img    id="attraction_delete${i}"
                        class="delete_icon"
                        src="./static/pic/delete_icon.png"
                        attraction_id = ${element.attraction.id}>

                <input  class="check_to_deal"
                        type="checkbox"
                        attraction_id = ${element.attraction.id}
                        price=${element.price}
                        checked>

                <div class="booking_information_word_title">台北一日遊：${element.attraction.name}</div>
                <div>
                    <span>日期：</span>
                    <span id="attraction_date${i}" class="attraction_item">${element.date}</span>
                </div>

                <div>
                    <span >時間：</span>
                    <span id="attraction_time${i}" time = "${element.time}" class="attraction_item">${time}</span>
                </div>

                <div>
                    <span>費用：</span>
                    <span id="attraction_price${i}" class="attraction_item">${element.price}</span>
                </div>

                <div>
                    <span>地點：</span>
                    <span id="attraction_address${i}" class="attraction_item">${element.attraction.address}</span>
                </div>
            </div>
        </div>`
        bookingAttractionCardPlace[i].innerHTML=bookingAttractionContent
        i++
    })
    bookingDealPlace.classList.remove("hide")
    const checkBox = document.querySelectorAll(".check_to_deal")
    const deleteButton = document.querySelectorAll(".delete_icon")

    checkBox.forEach(element => {
        total = total + parseInt(element.getAttribute('price'))
        element.addEventListener("change", spendTotal)
    })
    dealTotal.textContent = total

    deleteButton.forEach(element => {
        element.addEventListener("click",deleteBooking)
    })
}

function noRenderBooking(){
    bookingDataPlace.textContent = "目前沒有任何預定行程唷"
    bookingDataPlace.style.width = "100%"
    bookingDataPlace.style.height = "300px"
    bookingDataPlace.style.lineHeight = "300px"
    bookingDataPlace.style.textAlign = "center"
}

function spendTotal(e){
    money = parseInt(e.target.getAttribute('price'))
    if(e.target.checked){
        total = total + money
    }else{
        total = total - money
    }
    dealTotal.textContent = total
}

async function deleteBooking(e){
    deleteItem = e.target.getAttribute('attraction_id')
    const number = (e.target.id.substr(-1))
    const date = document.querySelector(`#attraction_date${number}`).textContent
    const price = document.querySelector(`#attraction_price${number}`).textContent
    const time = document.querySelector(`#attraction_time${number}`).getAttribute("time")

    const deleteResponse = await fetch("/api/booking",{
        method:"DELETE",
        header:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "attractionId": deleteItem,
            "date": date,
            "time": time,
            "price": price
            })
        })
    const deleteResult = await deleteResponse.json()
    console.log(deleteResult)
    window.location.reload()
}

