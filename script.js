function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const API = "https://mock-api.driven.com.br/api/v6/buzzquizz";
let inputQuizzData = "";
let inputQuizzLevel = "";
let basicInfoQuizz = [];
let score = 0;
let listOfQuizzes = []

//variáveis para criação:
let quizzToSend = {title:"",image:"",questions:[],levels:[]};
let questionsToSend = {};
let numberQuestions = 0;
let numberLevels = 0;
// ----

getQuizzList();

const screenChange = screen => {
    qs('.page.active').classList.remove('active');
    qs(`.${screen}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

const nextStep = step => {
    qs('.step.active').classList.remove('active');
    document.getElementById(`${step}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

function isEmpty(arr){
    return arr.every(element => element);
}

function createQuizzQuestionsInput (numberInput) {
    inputQuizzData = document.querySelector(".addhere");
    inputQuizzData.innerHTML = "";
    for (let i=0;i<numberInput;i++){
        let questionNumber = i+1;
        inputQuizzData.innerHTML += `
        <div onclick="openQuestionInput(this)" class="form-container questionNumber${questionNumber}">
            <div class="form-content">
                <div class="question-top">
                    <label for="question">Pergunta ${questionNumber}</label>
                    <img src="./Images/edit-icon.svg" alt="">
                </div>
                <div class="textAreaInput hide">
                    <input name="question-text" type="text" placeholder="Texto da pergunta">
                    <input name="question-color" type="text" placeholder="Cor de fundo da pergunta">
                    <label for="question">Resposta correta</label>
                    <input type="text" placeholder="Resposta correta">
                    <input name="url" type="text" placeholder="URL da imagem">
                    <label for="question">Respostas incorretas</label>
                    <input name="answer" type="text" placeholder="Resposta incorreta 1">
                    <input name="url" type="text" placeholder="URL da imagem 1">
                    <input name="answer" type="text" placeholder="Resposta incorreta 2">
                    <input name="url" type="text" placeholder="URL da imagem 2">
                    <input name="answer" type="text" placeholder="Resposta incorreta 3">
                    <input name="url" type="text" placeholder="URL da imagem 3">       
                </div>
            </div>
        </div>
        `;
    }
    openQuestionInput (document.querySelector(".questionNumber1"));
    console.log("foi");
}

function openQuestionInput (object) {
    let allTextAreas = document.querySelectorAll(".textAreaInput");
    for (let i=0;i<allTextAreas.length;i++){
        allTextAreas[i].classList.add("hide");
    }
    let textAreaInput = object.querySelector(".textAreaInput");
    textAreaInput.classList.remove("hide");
    object.querySelector(".question-top").scrollIntoView({ block: "center" , behavior: "smooth" });
}

function createQuizzLevelInput (numberLevelsInput) {
    inputQuizzLevel = document.querySelector(".addLevelsHere");
    inputQuizzData.innerHTML="";
    for (let i=0;i<numberLevels;i++){
        let levelsNumber = i+1;
        inputQuizzLevel.innerHTML += `
        <div onclick="openLevelInput(this)" class="form-container levelNumber${levelsNumber}">
            <div class="form-content">
                <div class="question-top">
                    <label for="question">Nível ${levelsNumber}</label>
                    <img src="./Images/edit-icon.svg" alt="">
                </div>
                <div class="textAreaLevelInput">
                    <input type="text" placeholder="Título do nível">
                    <input type="text" placeholder="% de acerto mínima">
                    <input type="text" placeholder="URL da imagem do nível">
                    <input type="text" placeholder="Descrição do nível">    
                </div>
            </div>
        </div>
        `;
    }
    openLevelInput (document.querySelector(".levelNumber1"));
    console.log("foi");
}

function openLevelInput (object) {
    let allLevelTextAreas = document.querySelectorAll(".textAreaLevelInput")
    for (let i=0;i<allLevelTextAreas.length;i++){
        allLevelTextAreas[i].classList.add("hide");
    }
    let textAreaLevelInput = object.querySelector(".textAreaLevelInput");
    textAreaLevelInput.classList.remove("hide");
    object.querySelector(".question-top").scrollIntoView({ block: "center" , behavior: "smooth" });
}

function isLesserThen10 (userInput) {
    if (userInput.length >= 10) {
        return false;
    } else {
        return true;
    }
}

function isLesserThen30 (userInput) {
    if (userInput.length >= 30) {
        return false;
    } else {
        return true;
    }
}

function verifyLevelInput () {
    let numberOfZeros = 0;
    for (let i=0;i<numberLevels;i++){
        let num = i+1;
        let levelToVerify = ".levelNumber" + num.toString();
        let object = document.querySelector(`${levelToVerify}`);
        let levelObject = {title:"",image:"",text:"",minValue:0}
        levelObject.title = object.querySelector(".textAreaLevelInput").children[0].value;
        if (isLesserThen10(levelObject.title)){
            alert("Dados invalidos, verifique suas entradas");
            console.log(1);
            break;
        }
        levelObject.image = object.querySelector(".textAreaLevelInput").children[2].value;
            if (isASiteAdress(levelObject.image)){
            alert("Dados invalidos, verifique suas entradas");
            console.log(2);
            break;
        }
        levelObject.text = object.querySelector(".textAreaLevelInput").children[3].value;
        if (isLesserThen30(levelObject.text)){
            alert("Dados invalidos, verifique suas entradas");
            console.log(3);
            break;
        }
        levelObject.minValue = Number(object.querySelector(".textAreaLevelInput").children[1].value);
        if (levelObject.minValue==0) {
            numberOfZeros ++;
        }
        console.log(levelObject);
        quizzToSend.levels[i] = levelObject;
    }
    if (numberOfZeros == 0) {
        alert("Dados invalidos, verifique suas entradas");
        console.log(4);
        return
    }
    const activeStep = qs(".step.active");
    const next = Number(activeStep.id) + 1;
    nextStep(next);
}

function isASiteAdress (userInput) {
    const correct = "https://";
    let validation = false;
    for (let i=0;i<correct.length;i++){
        if (userInput[i]!==correct[i]) {
            validation = true;
        } else {
        validation = false;
        }
    }
    return validation;
}

function isNotAColor (userInput) {
    if (userInput.length ==7 && userInput[0]=="#") {
        return false;
    } else {
        return true;
    }
}

function isLesserThen20 (userInput) {
    if (userInput.length >= 20) {
        return false;
    } else {
        return true;
    }
}

function verifyQuestionInput () {
    for (let i = 0;i<numberQuestions;i++){
        let num = i + 1;
        let questionToVerify = ".questionNumber" + num.toString();
        let object = document.querySelector(`${questionToVerify}`)
        let questionObject = {title:"",color:"",answers:[]};
        let questionObjectAnswers = {text:"",image:"",isCorrectAnswer: false}
        questionObject.title = object.querySelector(".textAreaInput").children[0].value;
        if (isLesserThen20(questionObject.title)) {
            alert("Dados invalidos, verifique suas entradas");
            console.log(1);
            console.log(questionObject.title.length)
            break;
        }
        let color = object.querySelector(".textAreaInput").children[1].value;
        if (isNotAColor(color)) {
            alert("Dados invalidos, verifique suas entradas");
            console.log(2);
            break;
        }
        questionObject.color = color;
        questionObjectAnswers.text = object.querySelector(".textAreaInput").children[3].value;
        if (questionObjectAnswers.text=="") {
            alert("Dados invalidos, verifique suas entradas");
            console.log(3);
            break;
        }
        questionObjectAnswers.image = object.querySelector(".textAreaInput").children[4].value;
        if (isASiteAdress(questionObjectAnswers.image)){
            alert("Dados invalidos, verifique suas entradas");
            console.log(4);
            break;
        }
        questionObjectAnswers.isCorrectAnswer = true;
        questionObject.answers[0]=questionObjectAnswers;
        let questionObjectAnswers1 = {text:"",image:"",isCorrectAnswer: false}
        questionObjectAnswers1.text = object.querySelector(".textAreaInput").children[6].value;
        if (questionObjectAnswers1.text == ""){
            alert("Dados invalidos, verifique suas entradas");
            console.log(5);
            break;
        }
        questionObjectAnswers1.image = object.querySelector(".textAreaInput").children[7].value;
        if (isASiteAdress(questionObjectAnswers1.image)) {
            alert("Dados invalidos, verifique suas entradas");
            console.log(6);
            break;
        }
        questionObject.answers[1]=questionObjectAnswers1;
        if(object.querySelector(".textAreaInput").children[8].value!=""){
            let questionObjectAnswers2 = {text:"",image:"",isCorrectAnswer: false}
            questionObjectAnswers2.text = object.querySelector(".textAreaInput").children[8].value;
            questionObjectAnswers2.image = object.querySelector(".textAreaInput").children[9].value;
            if (isASiteAdress(questionObjectAnswers2.image)) {
                alert("Dados invalidos, verifique suas entradas");
                console.log(7);
                break;
            }    
            questionObject.answers.push(questionObjectAnswers2);   
        }
        if(object.querySelector(".textAreaInput").children[10].value!=""){
            let questionObjectAnswers3 = {text:"",image:"",isCorrectAnswer: false}
            questionObjectAnswers3.text = object.querySelector(".textAreaInput").children[10].value;
            questionObjectAnswers3.image = object.querySelector(".textAreaInput").children[11].value;
            if (isASiteAdress(questionObjectAnswers3.image)) {
                alert("Dados invalidos, verifique suas entradas");
                console.log(8);
                break;
            }    
            questionObject.answers.push(questionObjectAnswers3);    
        }
        console.log(questionObject);
        quizzToSend.questions[i]=questionObject;
    }
    const activeStep = qs(".step.active");
    const next = Number(activeStep.id) + 1;
    nextStep(next);
    createQuizzLevelInput(numberLevels);
}
const formValidation = (input) => {
    if (input.value !== "") {
        input.classList.remove("error");
        return input.value;
    }
    input.classList.add("error");
}

function createQuizzHandler() {
    const activeStep = qs(".step.active");
    const formData = activeStep.querySelectorAll(".form-content input");
    const next = Number(activeStep.id) + 1;
    const validForm = [...formData].map(formValidation);
    console.log(validForm)
    if (isEmpty(validForm)) {
        for (let x = 0; x < validForm.length; x++) {
            basicInfoQuizz.push(validForm[x]);
        }
        numberQuestions = Number(basicInfoQuizz[2]);
        quizzToSend.title = basicInfoQuizz[0];
        quizzToSend.image = basicInfoQuizz[1];
        numberLevels = Number(basicInfoQuizz[3]);
        createQuizzQuestionsInput(numberQuestions);
        nextStep(next);
        return
    }
    alert("Algo deu errado! Tente novamente!");
}

//codes for quizz solving - verificando cada pergunta do quizz

function selectingOption (object) {
    const quizzSection = object.closest(".questions");
    if (quizzSection.classList.contains("done")){

    } else {
        const answers = quizzSection.querySelectorAll(".answers>div>div");
        for (let i=0; i<answers.length; i++){
            answers[i].classList.add("white");
            if (answers[i].classList.contains("correct")){
                answers[i].querySelector("span").classList.add("green");
            } else {
                answers[i].querySelector("span").classList.add("red");
            }
        }
        object.classList.remove("white");
        quizzSection.classList.add("done");
        if (object.classList.contains("correct")){
            score ++;
        }
    }
}

//buscando os quizzes do servidor 

function getQuizzList () {
    const requisicao = axios.get(`${API}/quizzes`);
    requisicao.then(mountQuizzes);
}

function mountQuizzes (response) {
    listOfQuizzes = [];
    listOfQuizzes = response.data;
    console.log(listOfQuizzes);
    quizzListToAdd();
}

function quizzListToAdd () {
    const quizzPlace = document.querySelector(".completeList").querySelector("ul");
    quizzPlace.innerHTML = "";
    for (let i=0;i<listOfQuizzes.length;i++){
        quizzPlace.innerHTML += `
            <li id="${listOfQuizzes[i].id}" class="quizz">
                <div class="gradient-overlay">
                    <img src="${listOfQuizzes[i].image}"
                        alt="">
                </div>
                <div class="quizz-title">
                    <span>${listOfQuizzes[i].title}</span>
                </div>
            </li>
        `
    }
}

function solvingQuizz (quizzId) {
    for (let i=0;i<listOfQuizzes.length;i++) {
        if (listOfQuizzes[i].id == quizzId) {

        }
    }
}
