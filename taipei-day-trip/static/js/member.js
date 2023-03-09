window.addEventListener("DOMContentLoaded",getMemberInformation)
const birthRule = /^\d{4}[/]\d{1,2}[/]\d{1,2}$/
const genderRule = /^[男\女]{1}$/

const fileUploader = document.querySelector('#file-uploader')

const editName = document.querySelector(".change-name")
editName.addEventListener("click",editViewPop)
const editBirth = document.querySelector(".change-birth")
editBirth.addEventListener("click",editViewPop)
const editGender = document.querySelector(".change-gender")
editGender.addEventListener("click",editViewPop)
const editPasswordButton = document.querySelector(".edit_password_button")
editPasswordButton.addEventListener("click",editPassword)

const editView = document.querySelector(".edit-view-pop")
const editItem = document.querySelector(".edit-data-item")
const editValue = document.querySelector(".edit-data-input")
const editMessage = document.querySelector(".message-input")
const editConfirmationButton = document.querySelector(".edit-view-button")
editConfirmationButton.addEventListener("click",editConfirmation)
const closeEditButton = document.querySelector(".cancel-button")
closeEditButton.addEventListener("click",closeEditView)

const sendToBackButton = document.querySelector(".edit-result-send")
sendToBackButton.addEventListener("click",sendToBack)

const memberName = document.querySelector(".name-reply")
const memberBirth = document.querySelector(".birthday-reply")
const memberGender = document.querySelector(".gender-reply")

const firstPassword = document.querySelector("#first-password")
const confirmPassword = document.querySelector("#next-password")
const commonInput = document.querySelector("#common-input")
const firstPasswordItem = document.querySelector("#first-password-item")
const confirmPasswordItem = document.querySelector("#confirm-password-item")
const firstPasswordValue = document.querySelector("#first-password-value")

const confirmPasswordValue = document.querySelector("#confirm-password-value")

const editFirstEye = document.querySelector("#edit-first-password-eye")
editFirstEye.addEventListener("click",seePassword)
const editConfirmEye = document.querySelector("#edit-confirm-password-eye")
editConfirmEye.addEventListener("click",seePassword)

function editViewPop(e){
    if(e.target.classList.contains("change-gender")){
        editValue.value = memberGender.textContent
        editItem.textContent="性別"
        editValue.setAttribute("placeholder","女/男")
        editValue.setAttribute("maxlength","1")
        editConfirmationButton.classList.add("gender")
    }else if(e.target.classList.contains("change-birth")){
        editValue.value = memberBirth.textContent
        editValue.setAttribute("placeholder","ex:1999/01/01")
        editValue.setAttribute("maxlength","10")
        editItem.textContent="生日"
        editConfirmationButton.classList.add("birth")
    }else if(e.target.classList.contains("change-name")){
        editValue.setAttribute("placeholder","ex:王曉明")
        editValue.setAttribute("maxlength","20")
        editValue.value = memberName.textContent
        editItem.textContent="名字"
        editConfirmationButton.classList.add("name")
    }
    editView.classList.remove("hide")
    alertBackground.classList.remove("hide")
}

function editPassword(e){
    editView.classList.remove("hide")
    commonInput.classList.add("hide")
    firstPassword.classList.remove("hide")
    alertBackground.classList.remove("hide")
    firstPasswordItem.textContent="輸入舊密碼"
    editConfirmationButton.textContent = "下一步"
    editConfirmationButton.classList.add("old-password")
    const oldPasswordButton = document.querySelector(".old-password")
    editConfirmationButton.removeEventListener("click",editConfirmation)
    oldPasswordButton.addEventListener("click",editPasswordNextNew)
}

let oldPasswordValue = ""
let firstNewPassword = ""
let secondNewPassword = ""
function editPasswordNextNew(e){
    editMessage.textContent = ""
    oldPasswordValue = firstPasswordValue.value
    if(!passwordRule.test(oldPasswordValue)){
        editMessage.textContent = "密碼輸入格式錯誤"
        editMessage.style.color="red"
        return
    }
    firstPasswordValue.value = ""
    const oldPasswordButton = document.querySelector(".old-password")
    oldPasswordButton.removeEventListener("click",editPasswordNextNew)
    oldPasswordButton.classList.remove("old-password")

    editConfirmationButton.addEventListener("click",editConfirmation)
    editConfirmationButton.textContent = "確認"

    firstPasswordItem.textContent="輸入新密碼"
    confirmPassword.classList.remove("hide")
}



function closeEditView(){
    editView.classList.add("hide")
    alertBackground.classList.add("hide")
    editConfirmationButton.classList.remove("birth")
    editConfirmationButton.classList.remove("gender")
    editConfirmationButton.classList.remove("name")
    confirmPassword.classList.add("hide")
    firstPassword.classList.add("hide")
    commonInput.classList.remove("hide")
    editConfirmationButton.textContent = "確認"
    const oldPasswordButton = document.querySelector(".old-password")
    if(oldPasswordButton){
        oldPasswordButton.removeEventListener("click",editPasswordNextNew)
    }
    editConfirmationButton.addEventListener("click",editConfirmation)
    editValue.value = ""
    firstPasswordValue.value = ""
    confirmPasswordValue.value=""
    editMessage.textContent = ""
}



function editConfirmation(e){
    if(e.target.classList.contains("gender")){
        const genderCheck = genderRule.test(editValue.value)
        if(!genderCheck){
            editMessage.textContent = "欄位只能填男或女"
            editMessage.style.color="red"
            return
        }
        memberGender.textContent = editValue.value
    }else if(e.target.classList.contains("birth")){
        const birthCheck =birthRule.test(editValue.value)
        if(!birthCheck){
            editMessage.textContent = "出生日期格式錯誤"
            editMessage.style.color="red"
            return
        }
        
        memberBirth.textContent = editValue.value
    }else if(e.target.classList.contains("name")){
        const NameCheck =nameRule.test(editValue.value)
        if(!NameCheck){
            editMessage.textContent = "姓名欄位不能有特殊字元"
            editMessage.style.color="red"
            return
        }
        memberName.textContent = editValue.value
    }else{
        firstNewPassword = confirmPasswordValue.value
        secondNewPassword = firstPasswordValue.value
        if(firstNewPassword !== secondNewPassword){
            editMessage.textContent = "兩次輸入不一致"
            editMessage.style.color="red"
            return
        }else{
            const newPasswordCheck =passwordRule.test(firstNewPassword)
            if(!newPasswordCheck){
                editMessage.textContent = "密碼不能有特殊字元或空白且至少三碼"
                editMessage.style.color="red"
                return
            }
        }
        editConfirmationButton.textContent = "確認"
        confirmPassword.classList.add("hide")
        firstPassword.classList.add("hide")
        commonInput.classList.remove("hide")
    }
    //editValue.value = ""
    closeEditView()
}


let uploadFile = ""
fileUploader.addEventListener('change', (e) => {
 // get list of file objects
   displayImg(e.target.files)
   uploadFile = e.target.files[0]
});

function displayImg(curFiles) {
    const curFile = curFiles[0];
    const reader = new FileReader();
    // 這會在readAS後才執行
    reader.onload = function (e) {
    // base64
        document.querySelector('#preview-img').src = e.target.result;
    };

    // to data url
    reader.readAsDataURL(curFile);
}



async function sendToBack(){
    //form.append("product[photos][]",uploadFile)
    result = {data:{
        oldPassword:oldPasswordValue,
        newPassword:firstNewPassword,
        memberName:memberName.textContent,
        memberGender:memberGender.textContent,
        memberBirth:memberBirth.textContent
    }}

    const saveMemberInformation = await fetch("/api/member/information",{
        method:"POST",
        header:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(result)
        })
    const saveMemberInformationResult = await saveMemberInformation.json()

    if(saveMemberInformationResult.ok){
        resultMessagePrint("更改成功","success","messageCard")
        alertBackground.classList.remove("hide")
    }else{
        resultMessagePrint("編輯失敗，可嘗試登出後再編輯","fail","messageCard")
        alertBackground.classList.remove("hide")
    }

    if(uploadFile !== ""){
        let form = new FormData()
        form.append("file",uploadFile)
        const saveMemberInPicture = await fetch("/api/member/information/pic",{
            method:"POST",
            body:form
            })
        const saveMemberInPictureResult =await saveMemberInPicture.json()
        if(saveMemberInPictureResult.ok){
            resultMessagePrint("更改照片成功","success","messageCard")
            alertBackground.classList.remove("hide")
        }else{
            resultMessagePrint("更改照片失敗","fail","messageCard")
            alertBackground.classList.remove("hide")
        }
    }

}

async function getMemberInformation(){
    const getData = await fetch("/api/member/information",{
        method:"GET",
        header:{
            "Content-Type":"application/json"
        }})
    const getDataResult = await getData.json()
    let cleanValue = []
    Object.entries(getDataResult.data).forEach(([key, value]) => {
        if (value === null){
            value = "無"
        }
        cleanValue.push(value)
    })
    const itemValue = cleanValue
    const [birth,gender,id,picture,username] = itemValue

    
    memberName.textContent = username
    memberBirth.textContent = birth
    memberGender.textContent = gender
    
    if(picture !== "無"){
        document.querySelector('#preview-img').src = picture;
    }
    
}



