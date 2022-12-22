document.addEventListener('load',loginBookingStateCheck)
window.addEventListener('load',bookingDataGet)
//window

const bookingDataPlace = document.querySelector(".booking_content_reserve")
const bookingDealPlace = document.querySelector(".member_booking_wrapper")
const dealTotal = document.querySelector(".confirm_deal_price_total")
const payButton = document.querySelector(".confirm_deal_button")


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
            <img id="attraction_image${i}" class="booking_information_pic" src=${element.attraction.image}>

            <div class="booking_information_word">

                <img    id="attraction_delete${i}"
                        class="delete_icon"
                        src="./static/pic/delete_icon.png"
                        attraction_id = ${element.attraction.id}>

                <input  class="check_to_deal"
                        type="checkbox"
                        id="attraction_checkbox${i}" 
                        attraction_id = ${element.attraction.id}
                        price=${element.price}
                        checked>

                <div id="attraction_name${i}" class="booking_information_word_title">台北一日遊：${element.attraction.name}</div>
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
    window.location.reload()
}



TPDirect.setupSDK(126917, 'app_DMuIGRVfiZ0NTlkjoGsHHfhYYIaFPQpa56YwopU8MDCnLtcHe1OUn9bICcLD', 'sandbox')
let fields = {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  };
  
  TPDirect.card.setup({
    fields: fields,
    styles: {
      // Style all elements
      input: {},
      // Styling ccv field
      "input.ccv": {
        "font-size": "16px",
      },
      // Styling expiration-date field
      "input.expiration-date": {
        "font-size": "16px",
      },
      // Styling card-number field
      "input.card-number": {
        "font-size": "16px",
      },
      // style focus state
      ":focus": {
        color: "#337788",
      },
      // style valid state
      ".valid": {
        color: "gray",
      },
      // style invalid state
      ".invalid": {
        color: "red",
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      "@media screen and (max-width: 400px)": {
        input: {
          color: "gray",
        },
      },
    },
  });

const contactName = document.querySelector(".contact_name")
const contactPhone = document.querySelector(".contact_phone")
const contactEmail = document.querySelector(".contact_email")
contactName.addEventListener("change",checkContactNameRegular)
contactPhone.addEventListener("change",checkContactPhoneRegular)
contactEmail.addEventListener("change",checkContactEmailRegular)

function checkContactPhoneRegular(e){
    const contactPhoneResult = phoneNumberRule.test(contactPhone.value)
    if(!contactPhoneResult){
        inputCheckResult("錯誤","fail",".card_phone_result")
    }else{
        inputCheckResult("✔","success",".card_phone_result")
    }
}

function checkContactEmailRegular(e){
    const contactEmailResult = emailRule.test(contactEmail.value)
    if(!contactEmailResult){
        inputCheckResult("錯誤","fail",".card_email_result")
    }else{
        inputCheckResult("✔","success",".card_email_result")
    }
}

function checkContactNameRegular(e){
    if(contactName.value !== ""){
        inputCheckResult("✔","success",".card_name_result")
    }else{
        inputCheckResult("不能空白","fail",".card_name_result")
    }
}

function inputCheckResult(message,state,whereIs){
    const resultPrint = document.querySelector(whereIs)
    resultPrint.textContent = message
    let color = (state === "fail") ? "red" : "green"
    resultPrint.style.color = color
}

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    const contactEmailResult = emailRule.test(contactEmail.value)
    const contactPhoneResult = phoneNumberRule.test(contactPhone.value)
    if (update.canGetPrime && contactPhoneResult && contactEmailResult && contactName.value !== "") {
        // Enable submit Button to get prime.
        payButton.addEventListener("click",onSubmit)
        payButton.style.opacity = "100%"
    } else {
        // Disable submit Button to get prime.
        payButton.removeEventListener("click",onSubmit)
        payButton.style.opacity = "30%"
    }
    // number 欄位是錯誤的
    if (update.status.number === 2) {
        inputCheckResult("錯誤","fail",".card_number_result")
    } else if (update.status.number === 0) {
        inputCheckResult("✔","success",".card_number_result")

    } else {
        //setNumberFormGroupToNormal(".card_number_result")
    }

    if (update.status.expiry === 2) {
        //setNumberFormGroupToError(".card_expiration_date_result")
        inputCheckResult("錯誤","fail",".card_expiration_date_result")
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
        inputCheckResult("✔","success",".card_expiration_date_result")
    } else {
        //setNumberFormGroupToNormal(".card_expiration_date_result")
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
        inputCheckResult("錯誤","fail",".card_ccv_result")
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
        inputCheckResult("✔","success",".card_ccv_result")
    } else {
        //setNumberFormGroupToNormal(".card_ccv_result")
    }
})

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        //console.log('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            //console.log('get prime error ' + result.msg)
            return
        }
        
        let orderItem = document.querySelectorAll(".check_to_deal")

        let trip = []
        const personName = contactName.value
        const phone = contactPhone.value
        const email = contactEmail.value
        const totalPrice = dealTotal.textContent

        orderItem.forEach(element => {
            if(element.checked){
                let number = element.id.substr(-1)
                const date = document.querySelector(`#attraction_date${number}`).textContent
                const price = document.querySelector(`#attraction_price${number}`).textContent
                const time = document.querySelector(`#attraction_time${number}`).getAttribute("time")
                const placeName = document.querySelector(`#attraction_name${number}`).textContent
                const image = document.querySelector(`#attraction_image${number}`).src
                const address = document.querySelector(`#attraction_address${number}`).textContent
                const attraction_id = element.getAttribute('attraction_id')

                let itemData = [{
                    "attraction": {
                        "id": attraction_id,
                        "name": placeName,
                        "address": address,
                        "image": image
                    },
                    
                    "date": date,
                    "time": time,
                    "price":  price,
                }]
                trip.push(itemData)
            }
        });

        let orderItemsData ={
            "prime": result.card.prime,
            "order": {
                "totalPrice":totalPrice,
                "trip": trip,
                "contact": {
                    "name": personName,
                    "email": email,
                    "phone": phone
                }

            }
        }
        orderReq(orderItemsData)
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}


async function orderReq(orderItemsData){
    payButton.removeEventListener("click",onSubmit)
    payButton.style.backgroundColor = "#356b78"
    const response = await fetch("/api/orders",{
            method:"POST",
            header:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(orderItemsData)
        })
    const orderResult = await response.json()
    let number =  orderResult.data.number
    window.location.href = "/thankyou?number="+number
}