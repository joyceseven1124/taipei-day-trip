let nextPage= 0
let keyword = ""
let state = true
const count = 12
const checkInput =  /^[a-zA-Z\d\u4e00-\u9fa5]{1,}$/

const target  =document.querySelector(".footer")

const options = {
    root:null,
    threshold: 0.1,
}

const callback = (entries,observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting && nextPage !== 0){
            getData(nextPage,keyword)
        }
    })
}

const observer = new IntersectionObserver(callback, options)

function getData(page,string){
    if(state){
        state = false
        url="/api/attractions?page="+page+"&keyword="+string
        fetch(url)
        .then(function(response){
            return response.json();})
        .then(function(jsonData){
            const result =jsonData
            if(result.data.length !== 0){
                const attractions = document.querySelector('.attractions')

                for(let x = 0; x < result.data.length; x++){
                    const attractionCard =document.createElement("div")
                    attractionCard.setAttribute("class","attractions_container")
                    attractionCard.setAttribute("id",result["data"][x]["id"])
                    attractions.appendChild(attractionCard)
                }

                const attractionCardPlace = document.querySelectorAll('.attractions_container')
                for(let i = 0; i< result.data.length; i++){
                    const attractionCard_content = `
                        <img class="attractions_container_img" src=${result.data[i].images[0]}>
                        <div class="attractions_container_word" index=${result.data[i].name}>
                            <div>${result.data[i].mrt}</div>
                            <div>${result.data[i].category}</div>
                        </div>`
                    attractionCardPlace[(page*count)+i].innerHTML=attractionCard_content
                }
                
            }else{
                const noResult = document.querySelector('.attractions_no_result')
                noResult.textContent = "查無此資料"}
            state = true
            nextPage = result["nextPage"]
            return nextPage
        })
        .then(function(nextPage){
            if(nextPage !== null && state){
                state = true
                observer.observe(target)
            }else{
                observer.disconnect()
                nextPage = null}
        })
        .catch(function(err){console.log(err)})
        }
    }

function categorySelect(){
    fetch("/api/categories")
    .then(function(response){
        return response.json();})
    .then(function(category){
        let menuPlace = document.querySelector(".home_word_search_select.hide")
        for(let i = 0; i < category.data.length; i++){
            item = category.data[i]
            const menuItem = document.createElement("li")
            const menuText = document.createTextNode(item)
            menuItem.appendChild(menuText)
            menuPlace.appendChild(menuItem)
        }
    }).catch(function(err){console.log(err)})
}


function keywordLoad(page,string){
        const hint = document.querySelector(".home_word_search_hint")
        hint.textContent = ""
        const noResult = document.querySelector(".attractions_no_result")
        noResult.textContent = ""
        const cleanDom = document.querySelector(".attractions")
        const cleanDomChild = document.querySelectorAll(".attractions_container")
        for(let i = 0; i<cleanDomChild.length; i++){
            cleanDom.removeChild(cleanDomChild[i])}
        getData(page,string)
}



function clickEffect(e){
    let menu = document.querySelector("#menu").classList
    const inputPlace = document.querySelector(".home_word_search_input")
    const hint = document.querySelector(".home_word_search_hint")
    let clickWhere = e.target.nodeName
    let clickWhereParent = e.target.parentNode.classList
    if(clickWhere === "INPUT" && e.target.classList.contains("home_word_search_input")){
        menu.remove("hide")
    }else if(clickWhere === "LI"){
        inputPlace.value = e.target.textContent
        menu.add("hide")
    }else if(clickWhere === "IMG" && clickWhereParent.contains("home_word_search_icon")){
        menu.add("hide")
        let resultInput =checkInput.test(inputPlace.value)
        if(resultInput){
            nextPage = 0
            keyword = inputPlace.value
            keywordLoad(0,keyword)
        }else{
            hint.textContent = "請輸入想查詢的地方"
        }
    }else{
        menu.add("hide")}
    }

function directNewPlace(e){
    const attractionCardNumber = e.target.parentNode.attributes["id"].value
    window.location.href = "/attraction/"+attractionCardNumber
}

const all = document.querySelector("body")
all.addEventListener("click",clickEffect)

const attractionNet = document.querySelector(".attractions")
attractionNet.addEventListener("click", directNewPlace)

window.addEventListener('load', getData(0,""))
window.addEventListener('load', categorySelect())