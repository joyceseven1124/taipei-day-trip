//拿到網址上的資訊
const dataNet = window.location.href
const dataNetArray = dataNet.split("/")
const idNumber = parseInt(dataNetArray[4])
let img_number = 0

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
            for(let i=0; i < result.images.length; i++){
                const img = document.createElement("img")
                img.setAttribute("class","image")
                img.src = result.images[i]
                imgPlace.appendChild(img)

                const circle = document.createElement("span")
                circle.setAttribute("class","circle")
                circle.setAttribute("num",i)
                if(i===0){
                    circle.classList.add("checked")
                }
                imgCircle .appendChild(circle)
            }
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



const price = document.querySelector("#price")
const morningTime = document.querySelector("#morning_time")
const afternoonTime = document.querySelector("#afternoon_time")

morningTime.addEventListener('change',(e)=>{
    if(e.target.checked){
        price.textContent="2000"
    }else{
        price.textContent="2500"
    }
})

afternoonTime.addEventListener("change",(e)=>{
    if(e.target.checked){
        price.textContent="2500"
    }
})


function goHome(){
    window.location.href = "/"
}

const home =  document.querySelector(".navigation_name")
home.addEventListener("click",goHome)