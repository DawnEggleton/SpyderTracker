function getMonthName(monthNum) {
    switch(monthNum) {
        case 0:
            return 'january';
            break;
        case 1:
            return 'february';
            break;
        case 2:
            return 'march';
            break;
        case 3:
            return 'april';
            break;
        case 4:
            return 'may';
            break;
        case 5:
            return 'june';
            break;
        case 6:
            return 'july';
            break;
        case 7:
            return 'august';
            break;
        case 8:
            return 'september';
            break;
        case 9:
            return 'october';
            break;
        case 10:
            return 'november';
            break;
        case 11:
            return 'december';
            break;
        default:
            break;
    }
}
function getDelay(date) {
    let elapsed = (new Date() - Date.parse(date)) / (1000*60*60*24);
    let delayClass;
    if(elapsed > 365) {
        delayClass = 'year';
    } else if (elapsed > 180) {
        delayClass = 'half';
    } else if (elapsed > 90) {
        delayClass = 'quarter';
    } else if (elapsed > 30) {
        delayClass = 'month';
    } else if (elapsed > 7) {
        delayClass = 'week';
    } else {
        delayClass = 'okay';
    }
    return delayClass;
}
function formatThread(site, siteURL, status, character, feature, title, threadID, icDate, partnerObjects, type, lastPost, delayClass, directoryString) {
    //set writing partners
    let partners = ``;
    let partnerClasses = ``;
    partnerObjects.forEach((partner, i) => {
        if(partnerObjects.length === (i + 1) && partnerObjects.length !== 1) {
            partners += ` and `;
        } else if(i !== 0) {
            partners += ` `;
            partnerClasses += ` `;
        }
        partners += `<a href="${siteURL}/${directoryString}${partner.id.toLowerCase().trim()}">${partner.partner.toLowerCase().trim()}</a>`;
        partnerClasses += `partner--${partner.partner.toLowerCase().trim().replaceAll(' ', '')}`;
        if(partnerObjects.length !== (i + 1)) {
            partnerClasses += ` `;
            if(partnerObjects.length !== 2) {
                partners += `,`;
            }
        }
    });

    //set featured characters
    let featuring = ``;
    let ftObjects = feature.split('+').map(character => JSON.parse(character));
    ftObjects.forEach((character, i) => {
        if(ftObjects.length === (i + 1) && ftObjects.length !== 1) {
            featuring += ` and `;
        } else if(i !== 0) {
            featuring += ` `;
        }
        featuring += `<a href="${siteURL}/?showuser=${character.id.toLowerCase().trim()}">${character.character.toLowerCase().trim()}</a>`;
        if(ftObjects.length !== (i + 1) && ftObjects.length !== 2) {
            featuring += `,`;
        }
    });
    console.log(featuring);
    let html = `<div class="thread lux-track grid-item status--${status} ${character.split(' ')[0]} delay--${delayClass} type--${type.split(' ')[0]} ${partnerClasses} grid-item"><div class="thread--wrap">
        <a class="thread--character" href="${siteURL}/?showuser=${character.split('#')[1]}">${character.split('#')[0]}</a>
        <a href="${siteURL}/?showtopic=${threadID}&view=getnewpost" target="_blank" class="thread--title">${title}</a>
        <span class="thread--feature">ft. ${featuring}</span>
        <span class="thread--partners">Writing with ${partners}</span>
        <span class="thread--ic-date">Set <span>${icDate}</span></span>
        <span class="thread--last-post">Last Active <span>${lastPost}</span></span>
        <div class="thread--buttons">
            <button onClick="changeStatus(this)" data-status="${status}" data-id="${threadID}" data-site="${site}">Change Turn</button>
            <button onClick="markComplete(this)" data-id="${threadID}" data-site="${site}">Mark Complete</button>
        </div>
    </div></div>`;

    return html;
}
function sendAjax(data, form = null) {
    console.log('send ajax');
    $.ajax({
        url: `https://script.google.com/macros/s/AKfycbyhWkeLS1VlAMFP5mS9Omqax8BHjcUTkvWGdpQIHNy8iQsIKx59usD2KVrjy_JOTfi3/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        },
        complete: function () {
            console.log('complete');
            if(form) {
                form.originalTarget.querySelector('button[type="submit"]').innerText = 'Submit';
            } else if(data.Status === 'Theirs') {
                thread.classList.remove('status--mine');
                thread.classList.remove('status--start');
                thread.classList.add('status--theirs');
                thread.querySelector('[data-status]').innerText = 'Change Status';
            } else if(data.Status === 'Mine') {
                thread.classList.remove('status--theirs');
                thread.classList.remove('status--expecting');
                thread.classList.add('status--mine');
                thread.querySelector('[data-status]').innerText = 'Change Status';
            }
        }
    });
}
function changeStatus(e) {
    if(e.dataset.status === 'mine' || e.dataset.status === 'start') {
        e.dataset.status = 'theirs';
        let thread = e.parentNode.parentNode.parentNode;
        thread.querySelector('[data-status]').innerText = 'Changing...';
        sendAjax({
            'SubmissionType': 'edit-thread',
            'ThreadID': e.dataset.id,
            'Site': e.dataset.site,
            'Status': 'Theirs'
        }, thread);
    } else if(e.dataset.status === 'theirs' || e.dataset.status === 'planned') {
        e.dataset.status = 'mine';
        let thread = e.parentNode.parentNode.parentNode;
        thread.querySelector('[data-status]').innerText = 'Changing...';
        sendAjax({
            'SubmissionType': 'edit-thread',
            'ThreadID': e.dataset.id,
            'Site': e.dataset.site,
            'Status': 'Mine'
        }, thread);
    }
}
function markComplete(e) {
    e.dataset.status = 'complete';
    let thread = e.parentNode.parentNode.parentNode;
    thread.classList.remove('status--mine');
    thread.classList.remove('status--start');
    thread.classList.remove('status--theirs');
    thread.classList.remove('status--expecting');
    thread.classList.add('status--complete');
    sendAjax({
        'SubmissionType': 'edit-thread',
        'ThreadID': e.dataset.id,
        'Site': e.dataset.site,
        'Status': 'Complete'
    });
}
function addThread(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value.toLowerCase().trim(),
        status = e.currentTarget.querySelector('#status').options[e.currentTarget.querySelector('#status').selectedIndex].innerText.toLowerCase().trim(),
        character = `${e.currentTarget.querySelector('#character').options[e.currentTarget.querySelector('#character').selectedIndex].innerText.toLowerCase().trim()}#${e.currentTarget.querySelector('#character').options[e.currentTarget.querySelector('#character').selectedIndex].value.toLowerCase().trim()}`,
        title = e.currentTarget.querySelector('#title').value.toLowerCase().trim(),
        threadID = e.currentTarget.querySelector('#id').value,
        icDate = e.currentTarget.querySelector('#date').value,
        type = e.currentTarget.querySelector('#type').options[e.currentTarget.querySelector('#type').selectedIndex].innerText.toLowerCase().trim(),
        year = new Date().getFullYear(),
        month = getMonthName(new Date().getMonth()),
        day = new Date().getDate(),
        update = `${month} ${day}, ${year}`;

        let partners = document.querySelectorAll('.partner select');
        let partnerObjects = [];
        partners.forEach(partnerObj => {
            let partner = {
                partner: partnerObj.options[partnerObj.selectedIndex].innerText.toLowerCase().trim(),
                id: partnerObj.options[partnerObj.selectedIndex].value.toLowerCase().trim()
            }
            partnerObjects.push(JSON.stringify(partner));
        });
        let partner = partnerObjects.join('+');

        let featured = document.querySelectorAll('.featuring select');
        let ftObjects = [];
        featured.forEach(ftObj => {
            let feature = {
                character: ftObj.options[ftObj.selectedIndex].innerText.toLowerCase().trim(),
                id: ftObj.options[ftObj.selectedIndex].value.toLowerCase().trim()
            }
            ftObjects.push(JSON.stringify(feature));
        });
        let featuring = ftObjects.join('+');

    sendAjax({
        'SubmissionType': 'new-thread',
        'Site': site,
        'Status': status,
        'Character': character,
        'Featuring': featuring,
        'Title': title,
        'ThreadID': threadID,
        'ICDate': icDate,
        'Partner': partner,
        'Type': type,
        'LastUpdated': update
    }, e);
}
function populatePage(array, siteObject) {
    let html = ``;
    let characters = [], partners = [];

    for (let i = 0; i < array.length; i++) {
        //Make Character Array
        let character = array[i].Character.toLowerCase();
        let partnerObjects = array[i].Partner.split('+').map(partner => JSON.parse(partner));

        if(jQuery.inArray(character, characters) == -1 && character != '') {
            characters.push(character);
        }
        partnerObjects.forEach(partner => {
            if(jQuery.inArray(partner.partner, partners) == -1 && partner.partner != '') {
                partners.push(partner.partner);
            }
        });

        html += formatThread(siteObject.Site,
                            siteObject.URL,
                            array[i].Status.toLowerCase(),
                            array[i].Character.toLowerCase(),
                            array[i].Featuring.toLowerCase(),
                            array[i].Title.toLowerCase(),
                            array[i].ThreadID,
                            array[i].ICDate.toLowerCase(),
                            partnerObjects,
                            array[i].Type.toLowerCase(),
                            array[i].LastUpdated.toLowerCase(),
                            getDelay(array[i].LastUpdated),
                            siteObject.Directory);
    }
    document.querySelector('#tracker--rows').insertAdjacentHTML('beforeend', html);

    //sort appendable filters
    characters.sort();
    partners.sort();

    //Append filters
    characters.forEach(character => {
        document.querySelector('.tracker--characters').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${character.split(' ')[0]}"/>${character.split(' ')[0]}</label>`);
    });
    partners.forEach(partner => {
        document.querySelector('.tracker--partners').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".partner--${partner.split('#')[0].replaceAll(' ', '')}"/>${partner.split('#')[0]}</label>`);
    });
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}
function setCustomFilter() {
    const hideUnless = document.querySelector('.completed-label');

    //get search value
    qsRegex = document.querySelector(typeSearch).value;
    elements = document.querySelectorAll(gridItem);
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(threadTitle).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    if(hideUnless.classList.contains('is-checked')) {
        filter = filter.join(', ');
    } else {
        filter = filter.map(item => `${item}${defaultShow}`);
        if(filter.length === 0) {
            filter = [defaultShow];
        }
        filter = filter.join(', ');
    }
    
    //render isotope
    $container.isotope({
        filter: filter
    });
}
function initIsotope() {
    //use value of input select to filter
    let checkboxes = document.querySelectorAll(filterOptions);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            if(e.currentTarget.classList.contains('all')) {
                e.currentTarget.checked = true;
                e.currentTarget.parentElement.classList.add('is-checked');
                e.currentTarget.parentElement.parentElement.querySelectorAll('input:not(.all)').forEach(input => {
                    input.checked = false;
                    input.parentElement.classList.remove('is-checked');
                });
            } else {
                if(e.currentTarget.parentElement.classList.contains('is-checked')) {
                    e.currentTarget.checked = false;
                    e.currentTarget.parentElement.classList.remove('is-checked');
                } else {
                    e.currentTarget.checked = true;
                    e.currentTarget.parentElement.classList.add('is-checked');
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = false;
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.remove('is-checked');
                }
            }
            let labels = e.currentTarget.parentElement.parentElement.querySelectorAll('label');
            let checked = 0;
            labels.forEach(label => {
                if(label.classList.contains('is-checked')) {
                    checked++;
                }
            });
            if(checked === 0) {
                e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = true;
                e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.add('is-checked');
            }
            //set filters
            setCustomFilter();
        });
    });

    // use value of search field to filter
    document.querySelector(typeSearch).addEventListener('keyup', e => {
        setCustomFilter();
    });

    // bind sort button click
    let sortButtons = document.querySelectorAll(sorts);
    sortButtons.forEach(button => {
        button.addEventListener('click', e => {
            let sortValue = e.currentTarget.dataset.sort;
            $container.isotope({ sortBy: sortValue });
            sortButtons.forEach(button => {
                button.classList.remove('is-checked');
            });
            e.currentTarget.classList.add('is-checked');
        });
    });
}
function prepThreads(data, site) {
    let threads = data.filter(item => item.Site.toLowerCase().trim() === site.toLowerCase().trim());
    threads.sort((a, b) => {
        let aStatus = a.Status.toLowerCase() === 'complete' ? 1 : 0;
        let bStatus = b.Status.toLowerCase() === 'complete' ? 1 : 0;
        if(a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else if(aStatus < bStatus) {
            return -1;
        } else if (aStatus > bStatus) {
            return 1;
        } else if(new Date(a.ICDate) < new Date(b.ICDate)) {
            return -1;
        } else if (new Date(a.ICDate) > new Date(b.ICDate)) {
            return 1;
        } else if(new Date(a.LastUpdate) < new Date(b.LastUpdate)) {
            return -1;
        } else if (new Date(a.LastUpdate) > new Date(b.LastUpdate)) {
            return 1;
        } else {
            return 0;
        }
    });
    return threads;
}
function fillThreadForm(siteData, characterData, featureData, form) {
    let siteList = form.querySelector('#site');
    fillSiteSelect(siteData, form);
    let characterList = document.querySelector('#character');
    let partnerLists = document.querySelectorAll('.partner select');
    localStorage.setItem('partnerList', '');
    localStorage.setItem('siteName', '');
    localStorage.setItem('featureData', '');

    siteList.addEventListener('change', e => {
        let siteName = e.currentTarget.options[e.currentTarget.selectedIndex].value.toLowerCase().trim();
        let characters = characterData.filter(item => item.Site.toLowerCase().trim() === siteName);
        let partners = featureData.filter(item => item.Site.toLowerCase().trim() === siteName);
        let uniquePartners = [];
        partners.forEach(partner => {
            let partnerObject = {
                'partner': partner.Writer.toLowerCase().trim(),
                'partnerID': partner.WriterID
            };
            let inArray = false;
            uniquePartners.forEach(unique => {
                if(unique.partner === partnerObject.partner) {
                    inArray = true;
                }
            });
            if (!inArray) {
                uniquePartners.push(partnerObject);
            }
        });

        characters.sort((a, b) => {
            if (a.Character < b.Character) {
                return -1;
            } else if (a.Character > b.Character) {
                return 1;
            } else {
                return 0;
            }
        });
        uniquePartners.sort((a, b) => {
            if (a.Character < b.Character) {
                return -1;
            } else if (a.Character > b.Character) {
                return 1;
            } else {
                return 0;
            }
        });

        let characterHTML = `<option value="">(select)</option>`;
        let partnerHTML = `<option value="">(select)</option>`;
        characterHTML += characters.map(item => `<option value="${item.CharacterID}">${capitalize(item.Character)}</option>`);
        characterList.innerHTML = characterHTML;
        partnerHTML += uniquePartners.map(item => `<option value="${item.partnerID}">${capitalize(item.partner)}</option>`);
        partnerLists = document.querySelectorAll('.partner select');
        partnerLists.forEach(partnerList => partnerList.innerHTML = partnerHTML);
        localStorage.setItem('partnerList', partnerHTML);
        localStorage.setItem('siteName', siteName);
        localStorage.setItem('featureData', JSON.stringify(featureData.map(data => JSON.stringify(data))));
    });

    partnerLists.forEach(partnerList => {
        partnerList.addEventListener('change', e => {
            let siteName = siteList.options[siteList.selectedIndex].value.toLowerCase().trim();
            let partnerName = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase().trim();
            let featureOptions = featureData.filter(item => item.Site.toLowerCase().trim() === siteName && item.Writer.toLowerCase().trim() === partnerName);
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
}
function fillSiteSelect(siteData, form) {
    let siteList = form.querySelector('#site');
    siteData.sort((a, b) => {
        if (a.Site < b.Site) {
            return -1;
        } else if (a.Site > b.Site) {
            return 1;
        } else {
            return 0;
        }
    })

    let siteHTML = `<option value="">(select)</option>`;
    siteHTML += siteData.map(item => `<option value="${item.Site}">${capitalize(item.Site)}</option>`);
    siteList.innerHTML = siteHTML;
}
function addCharacter(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value.toLowerCase().trim(),
        character = e.currentTarget.querySelector('#character').value.toLowerCase().trim(),
        characterID = e.currentTarget.querySelector('#id').value;

    sendAjax({
        'SubmissionType': 'new-character',
        'Site': site,
        'Character': character,
        'CharacterID': characterID
    }, e);
}
function addSite(e) {
    let directory = e.currentTarget.querySelector('#directory').options[e.currentTarget.querySelector('#directory').selectedIndex].value.trim(),
        url = e.currentTarget.querySelector('#url').value.trim(),
        site = e.currentTarget.querySelector('#name').value.toLowerCase().trim();

    sendAjax({
        'SubmissionType': 'new-site',
        'Site': site,
        'URL': url,
        'Directory': directory
    }, e);
}
function partnerCheck(featureData, form) {
    let partnerField = form.querySelector('#writer');
    partnerField.addEventListener('keyup', e => {
        let siteName = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].value.toLowerCase().trim();
        let activePartner = partnerField.value.toLowerCase().trim();
        let partner = featureData.filter(item => item.Site.toLowerCase().trim() === siteName && item.Writer.toLowerCase() === activePartner.toLowerCase())[0];
        if(partner) {
            form.querySelector('#writerID').value = partner.WriterID;
        } else {
            form.querySelector('#writerID').value = '';
        }
    });

}
function addPartner(e) {
    let site = e.currentTarget.querySelector('#site').options[e.currentTarget.querySelector('#site').selectedIndex].value.toLowerCase().trim(),
        character = e.currentTarget.querySelector('#character').value.toLowerCase().trim(),
        characterID = e.currentTarget.querySelector('#characterID').value,
        writerID = e.currentTarget.querySelector('#writerID').value,
        writer = e.currentTarget.querySelector('#writer').value.toLowerCase().trim();

    sendAjax({
        'SubmissionType': 'new-partner',
        'Site': site,
        'Character': character,
        'CharacterID': characterID,
        'Writer': writer,
        'WriterID': writerID
    }, e);
}
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}
function addPartnerFields(i) {
    let html = `<label class="partner">
        <b>Partner</b>
        <select required id="partner-${i}">
            <option value="">(select)</option>
        </select>
    </label>
    <label class="featuring">
        <b>Featuring</b>
        <select required id="featuring-${i}">
            <option value="">(select)</option>
        </select>
    </label>`;
    return html;
}
function loadPartnerFields() {
    let active = document.querySelector(`#clip-partners`);
    let count = document.querySelector(`#partner-count`).value;
    for(let i = 0; i < count; i++) {
        active.insertAdjacentHTML('beforeend', addPartnerFields(i));
    }
}