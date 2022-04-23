function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const API = "https://mock-api.driven.com.br/api/v6/buzzquizz";

let quizz = [];

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

const createQuizz = object => axios.post(URL + "/quizzes", object);

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


function createQuizzHandler() {
    const activeStep = qs(".step.active");
    const formData = activeStep.querySelectorAll(".form-content input");
    const next = Number(activeStep.id) + 1;
    const validForm = [...formData].map(formValidation);
    console.log(validForm)
    if (isEmpty(validForm)) {
        for (let x = 0; x < validForm.length; x++) {
            quizz.push(validForm[x]);
        }
        nextStep(next);
        return
    }
    alert("Algo deu errado! Tente novamente!");
}
