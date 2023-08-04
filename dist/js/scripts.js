const sheet = `https://opensheet.elk.sh/1rblIWd8uyKP0sX1fLCBodSMzw09hwdD-_vdXZm53fwA`;
let threads = [];
var filters = {};
const typeSearch = `#quicksearch`;
const threadTitle = `.thread--title`;
const visible = `is-visible`;
const filterGroup = `.tracker--filter-group`;
const filterOptions = `.tracker--filter-group input`;
const sorts = `.tracker--header button`;
const gridItem = `.grid-item`;
const defaultShow = `:not(.status--complete)`;
if(document.querySelectorAll('#add-thread').length > 0) {
    loadPartnerFields();
}

let threadForm = document.querySelector('#add-thread');
if(threadForm) {
    fetch(`${sheet}/Sites`)
    .then((response) => response.json())
    .then((siteData) => {
        fetch(`${sheet}/Characters`)
        .then((response) => response.json())
        .then((characterData) => {
            fetch(`${sheet}/Featured`)
            .then((response) => response.json())
            .then((featureData) => {
                fillThreadForm(siteData, characterData, featureData, threadForm);

                threadForm.addEventListener('submit', e => {
                    e.preventDefault();
                    e.currentTarget.querySelector('button[type="submit"]').innerText = 'Submitting...';
                    addThread(e);
                });
            });
        });
    });
}

let characterForm = document.querySelector('#add-character');
if(characterForm) {
    fetch(`${sheet}/Sites`)
    .then((response) => response.json())
    .then((siteData) => {
        fillSiteSelect(siteData, characterForm);

        characterForm.addEventListener('submit', e => {
            e.preventDefault();
            e.currentTarget.querySelector('button[type="submit"]').innerText = 'Submitting...';
            addCharacter(e);
        });
    });
}

let siteForm = document.querySelector('#add-site');
if(siteForm) {
    siteForm.addEventListener('submit', e => {
        e.preventDefault();
        e.currentTarget.querySelector('button[type="submit"]').innerText = 'Submitting...';
        addSite(e);
    });
}

let partnerForm = document.querySelector('#add-partner');
if(partnerForm) {
    fetch(`${sheet}/Sites`)
    .then((response) => response.json())
    .then((siteData) => {
        fetch(`${sheet}/Featured`)
        .then((response) => response.json())
        .then((featureData) => {
            fillSiteSelect(siteData, partnerForm);
            partnerCheck(featureData, partnerForm);

            partnerForm.addEventListener('submit', e => {
                e.preventDefault();
                e.currentTarget.querySelector('button[type="submit"]').innerText = 'Submitting...';
                addPartner(e);
            });
        });
    });
}

if(document.querySelectorAll('#partner-count').length > 0) {
    document.querySelector('#partner-count').addEventListener('change', e => {
        let active = document.querySelector('#clip-partners');
        let currentCount = active.querySelectorAll('.partner').length;
        let newCount = parseInt(e.currentTarget.value);
        if (newCount > currentCount) {
            for(let i = currentCount; i < newCount; i++) {
                active.insertAdjacentHTML('beforeend', addPartnerFields(i));
            }
        } else if (currentCount > newCount) {
            let difference = currentCount - newCount;
            for(let i = 0; i < difference; i++) {
                active.querySelectorAll('.partner')[currentCount - i - 1].remove();
                active.querySelectorAll('.featuring')[currentCount - i - 1].remove();
            }
        }
        let partnerLists = document.querySelectorAll('.partner select');
        partnerLists.forEach(partnerList => partnerList.innerHTML = localStorage.getItem('partnerList'));

        partnerLists.forEach(partnerList => {
            partnerList.addEventListener('change', e => {
                let siteName = localStorage.getItem('siteName');
                let partnerName = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase().trim();
                let featureOptions = JSON.parse(localStorage.getItem('featureData')).map(item => JSON.parse(item)).filter(item => item.Site.toLowerCase().trim() === siteName && item.Writer.toLowerCase().trim() === partnerName);
                featureOptions.sort((a, b) => {
                    if (a.Character < b.Character) {
                        return -1;
                    } else if (a.Character > b.Character) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
        
                let featureHTML = `<option value="">(select)</option>`;
                featureHTML += featureOptions.map(item => `<option value="${item.CharacterID}">${capitalize(item.Character)}</option>`);
                let featureList = partnerList.parentNode.nextElementSibling.querySelector('select');
                featureList.innerHTML = featureHTML;
            });
        });
    });
}