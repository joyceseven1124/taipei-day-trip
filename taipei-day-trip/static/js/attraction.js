let dataNet = window.location.href
let dataNetArray = dataNet.split("/")
let idNumber = parseInt(dataNetArray[4])
let img_number = 0

getAttraction(idNumber)

function getAttraction(id){
        url="/api/attraction/"+id
        fetch(url)
        .then(function(response){
            return response.json();})
        .then(function(data){
            let result = data.data[0]
            img_number = result.images.length
            let imgPlace = document.querySelector(".attraction_information_images_main")
            let imgCircle = document.querySelector(".attraction_information_images_circle")
            for(let i=0; i < result.images.length; i++){
                let img = document.createElement("img")
                img.setAttribute("class","image")
                img.src = result.images[i]
                imgPlace.appendChild(img)

                let circle = document.createElement("span")
                circle.setAttribute("class","circle")
                circle.setAttribute("num",i)
                if(i===0){
                    circle.classList.add("checked")
                }
                imgCircle .appendChild(circle)
            }
            let title = document.querySelector("title")
            title.textContent = result.name

            let attractionName = document.querySelector(".attraction_information_booking_name_title")
            attractionName.textContent = result.name

            let attractionCategory = document.querySelector(".attraction_information_booking_name_category")
            attractionCategory.textContent = result.category

            let attractionDescription = document.querySelector("#description")
            attractionDescription.textContent = result.description

            let attractionAddress = document.querySelector("#address")
            attractionAddress.textContent = result.address

            let attractionTransport = document.querySelector("#transport")
            attractionTransport.textContent = result.transport

        })
}




let circleIndex=0;
let previous = document.getElementsByClassName("previous")
previous[0].onclick = function () {
    circleIndex--;
    if(circleIndex == -1){
        circleIndex = img_number-1
    }
    slideTo(circleIndex)
}

let next = document.getElementsByClassName("next");
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
    let images = document.getElementsByClassName('image');
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



let price = document.querySelector("#price")
let morningTime = document.querySelector("#morning_time")
let afternoonTime = document.querySelector("#afternoon_time")

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

let home =  document.querySelector(".navigation_name")
home.addEventListener("click",goHome)