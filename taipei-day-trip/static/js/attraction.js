//拿到網址上的資訊
const dataNet = window.location.href
const dataNetArray = dataNet.split("/")
const idNumber = parseInt(dataNetArray[4])
let img_number = 0

//window.addEventListener('load',loginBookingStateCheck)

getAttraction(idNumber)

function getAttraction(id){
    url="/api/attraction/"+id
    fetch(url)
    .then(function(response){
        return response.json();})
    .then(function(data){
        const result = data.data[0]
        img_number = result.images.length
        const imgPlace = document.querySelector(".attraction_information_images_main")
        const imgCircle = document.querySelector(".attraction_information_images_circle")
        imgPlace.style.opacity = "0"
        imgCircle.style.opacity = "0"
        let loadImgNumber = 0 
        result.images.forEach(element => {
            const img = new Image()
            img.setAttribute("class","image")
            img.src = element
            imgPlace.appendChild(img)

            const circle = document.createElement("span")
            circle.setAttribute("class","circle")
            circle.setAttribute("num",loadImgNumber+1)
           
            imgCircle .appendChild(circle)
            
            let loadingStatus = document.querySelector('.loading_word')
            img.onload = () => {
                if(loadImgNumber===0){
                    circle.classList.add("checked")
                }
                loadImgNumber++
                if(loadImgNumber === img_number){
                    imgPlace.style.opacity = "100%"
                    imgCircle.style.opacity = "100%"
                    document.getElementById('load-wrapper').style.display="none"
                }else{
                    loadingStatus.textContent = `載入中...${Math.round((loadImgNumber/img_number)*100)}%`
                }
            }
        });

        const title = document.querySelector("title")
        title.textContent = result.name

        const attractionName = document.querySelector(".attraction_information_booking_name_title")
        attractionName.textContent = result.name

        const attractionCategory = document.querySelector(".attraction_information_booking_name_category")
        attractionCategory.textContent = result.category

        const attractionDescription = document.querySelector("#description")
        attractionDescription.textContent = result.description

        const attractionAddress = document.querySelector("#address")
        attractionAddress.textContent = result.address

        const attractionTransport = document.querySelector("#transport")
        attractionTransport.textContent = result.transport

    })
}

let circleIndex=0;
const previous = document.getElementsByClassName("previous")
previous[0].onclick = function () {
    circleIndex--;
    if(circleIndex == -1){
        circleIndex = img_number-1
    }
    slideTo(circleIndex)
}

const next = document.getElementsByClassName("next");
next[0].onclick = function () {
    circleIndex++;
    if(circleIndex  < img_number){
        slideTo(circleIndex)
    }else if(circleIndex == img_number){
        circleIndex = 0
        slideTo(circleIndex)
    }
}

function slideTo(index){
    const images = document.getElementsByClassName('image');
    for(let i=0;i<images.length;i++){
        if( i == index ){
            images[i].style.display = 'inline'
            images[i].style.animation = "fadein 1s ease"
        }else{
            images[i].style.display = 'none'
        }
    }

    let circle = document.getElementsByClassName("circle");
    for(let j=0;j<circle.length;j++){
        if( j == index ){
            circle[j].classList.add("checked")
            circleIndex=j
        }else{
            circle[j].classList.remove("checked")
        }
    }
}

const date = document.querySelector("#date")
const price = document.querySelector("#price")
const morningTime = document.querySelector("#morning_time")
const afternoonTime = document.querySelector("#afternoon_time")
const booking_attractions = document.querySelector("#go_to_checkout_button")
const cart_button = document.querySelector("#cart_button")



async function saveBookingData(e){
    let result = loginBookingStateCheck(e)
    if(!result){
        signInView()
    }else{
        if(date.value === ""){
            messageCard.classList.remove("hide")
            alertBackground.classList.remove("hide")
            resultMessagePrint("請檢查填寫是否有遺漏","fail","messageCard")
        }else{
            let time = (price.textContent == "2000") ? "morning" : "afternoon"
            const response = await fetch("/api/booking",{
            method:"POST",
            header:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "attractionId": idNumber,
                "date": date.value,
                "time": time,
                "price": price.textContent
                })
            })
            const saveResult = await response.json()
            if(saveResult.ok && e.target.id == "go_to_checkout_button"){
                window.location.href = "/booking"
            }else{
                alertBackground.classList.remove("hide")
                if(saveResult.ok){
                    resultMessagePrint("加入成功","success","messageCard")
                }else{
                    resultMessagePrint("加入失敗","fail","messageCard")
                }
            }
        }
    }
}

morningTime.addEventListener('change',(e)=>{
    price.textContent = (morningTime.checked) ? "2000" : "2500"
})

afternoonTime.addEventListener("change",(e)=>{
    if(e.target.checked){
        price.textContent="2500"
    }
})


booking_attractions.addEventListener("click",saveBookingData)
cart_button.addEventListener("click",saveBookingData)



