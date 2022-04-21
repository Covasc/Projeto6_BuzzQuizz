function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const screenChange = screen => {
    qs('.active').classList.remove('active'); 
    qs(`.${screen}`).classList.add('active');
}
