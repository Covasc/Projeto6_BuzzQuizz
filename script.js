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

function createQuizzQuestionsInput(numberInput) {
    inputQuizzData = document.querySelector(".addhere");
    inputQuizzData.innerHTML = "";
    for (let i = 0; i < numberInput; i++) {
        let questionNumber = i + 1;
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
    openQuestionInput(document.querySelector(".questionNumber1"));
    console.log("foi");
}

function openQuestionInput(object) {
    let allTextAreas = document.querySelectorAll(".textAreaInput");
    for (let i = 0; i < allTextAreas.length; i++) {
        allTextAreas[i].classList.add("hide");
    }
    let textAreaInput = object.querySelector(".textAreaInput");
    textAreaInput.classList.remove("hide");
    object.querySelector(".question-top").scrollIntoView({ block: "center", behavior: "smooth" });
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

let numberQuestionsQuizzChosen = 0;
let userLevel = 0;
let idSolving = 0;

let numbers = [1,12,15,22,18,75,64,89,33,54,5,12,84];
numbers.sort((a,b) => a - b);
console.log(numbers);

function renderQuizzFinalization (userScore) {
    console.log(userScore);
    let levelsOfQuizz = listOfQuizzes[idSolving].levels;
    let levelRange = []
    let levelAchieved = 0;
    for (let i=0;i<levelsOfQuizz.length;i++){
        levelRange[i] = levelsOfQuizz[i].minValue
    }
    levelRange.sort((a,b) => a - b);
    for (let i=0;i<levelRange.length;i++){
        if (userScore>levelRange[i]){
        } else {
            levelAchieved = levelRange[i];
        }
    }
    if (userScore == 100) {
        levelAchieved = levelRange[levelRange.length-1];
    }
    for (let i=0;i<levelsOfQuizz.length;i++) {
        if (levelsOfQuizz[i].minValue==levelAchieved){
            document.querySelector(".content").innerHTML += `
                <div class="question-area win-content">
                    <li class="questions">
                        <div>
                            <span>Você marcou ${levelAchieved}%. ${levelsOfQuizz[i].title}</span>
                        </div>
                        <div class="answers">
                            <div class="top-answer final-answer">
                                <div class="correct">
                                    <img src="${levelsOfQuizz[i].image}" alt="">
                                </div>
                                <div>
                                    <span>${levelsOfQuizz[i].text}</span>
                                </div>
                            </div>                
                        </div>
                    </li> 
                </div>    
            `;
            return;
        }
    }
}

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
        let allDone = document.querySelectorAll(".content ul>div .done").length;
        if (allDone == numberQuestionsQuizzChosen) {
            userLevel = score/numberQuestionsQuizzChosen*100;
            renderQuizzFinalization (userLevel);
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

//abrindo o quizz

function quizzListToAdd () {
    const quizzPlace = document.querySelector(".completeList").querySelector("ul");
    quizzPlace.innerHTML = "";
    for (let i=0;i<listOfQuizzes.length;i++){
        quizzPlace.innerHTML += `
            <li id="${listOfQuizzes[i].id}" class="quizz" onclick="solvingQuizz(${listOfQuizzes[i].id})">
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
    score = 0;
    for (let i=0;i<listOfQuizzes.length;i++) {
        if (listOfQuizzes[i].id == quizzId) {
            console.log(quizzId);
            idSolving = i;
            let quizzChosen = document.querySelector(".quizz-done")
            quizzChosen.innerHTML = "";
            quizzChosen.innerHTML = `
            <div class="introduction">
                <div class="gradient-overlay">
                    <img src="${listOfQuizzes[i].image}" alt="imagem">
                </div>
                <div class="intro-name">
                    <span>${listOfQuizzes[i].title}</span>
                </div>
            </div>
            <div class="content">
                <ul>
                </ul>
            </div>
            `;
            numberQuestionsQuizzChosen = listOfQuizzes[i].questions.length;
            const renderQuestions = quizzChosen.querySelector("ul");
            renderQuestions.innerHTML = "";
            for (let j=0;j<listOfQuizzes[i].questions.length;j++) {
                renderQuestions.innerHTML += `
                    <div class="question-area">
                        <li class="questions">
                            <div>
                                <span>${listOfQuizzes[i].questions[j].title}</span>
                            </div>
                            <div class="answers answers${j}">
                            </div>
                        </li> 
                    </div>
                `;
                let renderAnswers = renderQuestions.querySelector(`.answers${j}`);
                renderAnswers.innerHTML = "";
                if (listOfQuizzes[i].questions[j].answers.length == 2) {
                    renderAnswers.innerHTML += `
                    <div class="top-answer">
                        <div onclick="selectingOption(this)" class="correct">
                            <img src="${listOfQuizzes[i].questions[j].answers[0].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[0].text}</span>
                        </div>
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[1].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[1].text}</span>
                        </div>
                    </div>
                `;
                }
                if (listOfQuizzes[i].questions[j].answers.length == 3) {
                    renderAnswers.innerHTML += `
                    <div class="top-answer">
                        <div onclick="selectingOption(this)" class="correct">
                            <img src="${listOfQuizzes[i].questions[j].answers[0].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[0].text}</span>
                        </div>
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[1].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[1].text}</span>
                        </div>
                    </div>
                    <div class="bottom-answer">
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[2].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[2].text}</span>
                        </div>
                    </div>
                `;
                }
                if (listOfQuizzes[i].questions[j].answers.length == 4) {
                    renderAnswers.innerHTML += `
                    <div class="top-answer">
                        <div onclick="selectingOption(this)" class="correct">
                            <img src="${listOfQuizzes[i].questions[j].answers[0].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[0].text}</span>
                        </div>
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[1].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[1].text}</span>
                        </div>
                    </div>
                    <div class="bottom-answer">
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[2].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[2].text}</span>
                        </div>
                        <div onclick="selectingOption(this)">
                            <img src="${listOfQuizzes[i].questions[j].answers[3].image}" alt="">
                            <span>${listOfQuizzes[i].questions[j].answers[3].text}</span>
                        </div>
                    </div>
                `;
                }
            }
        }
    }
    screenChange('quizz-done');
}
