function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const API = "https://mock-api.driven.com.br/api/v6/buzzquizz";
let inputQuizzData = "";
let basicInfoQuizz = [];

const screenChange = screen => {
    qs('.page.active').classList.remove('active');
    qs(`.${screen}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

//VERIFICAR A PARTIR DAQUI
const nextStep = step => {
    qs('.step.active').classList.remove('active');
    document.getElementById(`${step}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

const createQuizz = object => axios.post(API + "/quizzes", object);

const getQuizzes = () => axios.get(API + "/quizzes");

const formValidation = (input) => {
    if (input.value !== "") {
        input.classList.remove("error");
        return input.value;
    }
    input.classList.add("error");
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
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                    <label for="question">Resposta correta</label>
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                    <label for="question">Respostas incorretas</label>
                    <input type="text" placeholder="Resposta incorreta 1">
                    <input type="text" placeholder="URL da imagem 1">
                    <input type="text" placeholder="Resposta incorreta 2">
                    <input type="text" placeholder="URL da imagem 2">
                    <input type="text" placeholder="Resposta incorreta 3">
                    <input type="text" placeholder="URL da imagem 3">       
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
        const numberQuestions = Number(basicInfoQuizz[2]);
        createQuizzQuestionsInput(numberQuestions);
        nextStep(next);
        return
    }
    alert("Algo deu errado! Tente novamente!");
}
