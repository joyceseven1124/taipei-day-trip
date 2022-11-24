let nextPage= 0
let keyword = ""
const checkInput =  /^[a-zA-Z\d\u4e00-\u9fa5]{1,}$/

const options = {
    root:null,
    threshold: 1,
}
const callback = (entries,observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            nextPage = nextPage+1
            getData(nextPage,keyword)
        }
    })
}
const observer = new IntersectionObserver(callback, options)


function getData(page,string){
    return new Promise(resolve => {
        url="/api/attractions?page="+page+"&keyword="+string
        fetch(url)
    .then(function(response){
        return response.json();})
    .then(function(jsonData){
        let result =jsonData
        if(result["data"].length !== 0){
            let attractions = document.querySelector('.attractions');
            for(let x = 0; x < result["data"].length; x++){
                let attractionCard =document.createElement("div")
                attractionCard.setAttribute("class","attractions_container")
                attractions.appendChild(attractionCard)
            }

            let attractionCardPlace = document.querySelectorAll('.attractions_container')
            for(let i = 0; i <result["data"].length ; i++){
                let picture = result["data"][i]["images"][0]
                let attractionName = result["data"][i]["name"]

                let attractionImg =document.createElement("img")
                attractionImg.setAttribute("class","attractions_container_img")
                attractionImg.src = picture
                attractionCardPlace[(page*12)+i].appendChild(attractionImg)

                let attractionWord =document.createElement("div")
                attractionWord.setAttribute("class","attractions_container_word")
                attractionWord.setAttribute("index",attractionName)
                attractionCardPlace[(page*12)+i].appendChild(attractionWord)
            }

            let attractionWordPlace = document.querySelectorAll('.attractions_container_word');
            for(let y = 0; y < result["data"].length; y++){
                let category = result["data"][y]["category"]
                let mrt = result["data"][y]["mrt"]
                let attractionMRT = document.createElement("div")
                let attractionMRTName = document.createTextNode(mrt)
                attractionMRT.appendChild(attractionMRTName)

                let attractionCategory = document.createElement("div")
                let attractionCategoryName = document.createTextNode(category)
                attractionCategory.appendChild(attractionCategoryName)

                attractionWordPlace[(page*12)+y].appendChild(attractionMRT)
                attractionWordPlace[(page*12)+y].appendChild(attractionCategory)
            }
        }else{
            let noResult = document.querySelector('.attractions_no_result')
            noResult.textContent = "查無此資料"
        }
        return result["nextPage"]
    })
    .then(function(nextPage){
        if(nextPage !== null){
            const target =document.querySelector(".attractions_container:nth-last-child(1)")
            observer.observe(target)
        }else{
            observer.disconnect()
        }
    })
    .catch(function(err){console.log(err)})
    })
}

function categorySelect(){
    fetch("/api/categories")
    .then(function(response){
        return response.json();})
    .then(function(category){
        let menuPlace = document.querySelector(".home_word_search_select.hide")
        for(let i = 0; i < category["data"].length; i++){
            item = category["data"][i]
            let menuItem = document.createElement("li")
            let menuText = document.createTextNode(item)
            menuItem.appendChild(menuText)
            menuPlace.appendChild(menuItem)
        }
    }).catch(function(err){console.log(err)})
}

getData(0,"")
categorySelect()


function keywordLoad(page,string){
        let hint = document.querySelector(".home_word_search_hint")
        hint.textContent = ""
        let noResult = document.querySelector(".attractions_no_result")
        noResult.textContent = ""
        let cleanDom = document.querySelector(".attractions")
        let cleanDomChild = document.querySelectorAll(".attractions_container")
        for(let i = 0; i<cleanDomChild.length; i++){
            cleanDom.removeChild(cleanDomChild[i])
        }
        getData(page,string)
}

function clickEffect(e){
    clickWhere = e.target.nodeName
    console.log(clickWhere)
    if(clickWhere === "INPUT"){
        let menu = document.querySelector("#menu").classList
        if(menu.contains("hide")){
            menu.remove("hide")
        }
    }else if(clickWhere === "LI"){
        let inputPlace = document.querySelector(".home_word_search_input")
        inputPlace.value = e.target.textContent
        menu.classList.add("hide")
    }else if(clickWhere === "IMG"){
        menu.classList.add("hide")
        console.log(e.target.parentNode.nodeName)
        if(e.target.parentNode.nodeName === "BUTTON"){
            let menu = document.querySelector("#menu").classList.add("hide")
            let inputPlace = document.querySelector(".home_word_search_input")
            resultInput =checkInput.test(inputPlace.value)
            if(resultInput){
                nextPage = 0
                keyword = inputPlace.value
                keywordLoad(0,keyword)
            }else{
                let hint = document.querySelector(".home_word_search_hint")
                hint.textContent = "請輸入想查詢的地方"
            }
        }
    }else if(clickWhere === "BUTTON"){
        if(e.target.classList.contains("navigation_name")){
            let menu = document.querySelector("#menu").classList.add("hide")
            let inputPlace = document.querySelector(".home_word_search_input")
            inputPlace.value =""
            keyword = ""
            nextPage = 0
            keywordLoad(0,"")}
    }else{
        menu.classList.add("hide")}
    }
const all = document.querySelector("body")
all.addEventListener("click",clickEffect)
