function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const screenChange = screen => {
    qs('.page.active').classList.remove('active'); 
    qs(`.${screen}`).classList.add('active');
}

const nextStep = step => {
    qs('.step.active').classList.remove('active');
    document.getElementById(`${step}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({block: "start", behavior: "smooth"});
}
