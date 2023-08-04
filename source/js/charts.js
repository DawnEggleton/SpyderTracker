function loadThreads(data) {
    let threads = [];
    data.forEach(item => {
        let delayClass = getDelay(item.LastUpdated);
        let thread = {
            status: item.Status ? item.Status.toLowerCase().trim() : '',
            partners: item.Partner ? item.Partner.split('#')[0] : '',
            type: item.Type ? item.Type.toLowerCase().trim() : '',
            delay: delayClass,
        }
        threads = [...threads, thread];
    });

    return threads;
}

function loadCharts(threads) {
    let timeChart = new ApexCharts(document.querySelector(".chart--time"), configTime(threads));
    timeChart.render();
    let statusChart = new ApexCharts(document.querySelector(".chart--status"), configStatus(threads));
    statusChart.render();
    let typeChart = new ApexCharts(document.querySelector(".chart--type"), configType(threads));
    typeChart.render();
    let partnerChart = new ApexCharts(document.querySelector(".chart--partner"), configPartners(threads));
    partnerChart.render();
}

function configTime(threads) {
    let activeThreads = threads.filter(item => item.status !== 'complete');
    let recent = activeThreads.filter(thread => thread.delay === 'okay').length;
    let week = activeThreads.filter(thread => thread.delay === 'week').length;
    let month = activeThreads.filter(thread => thread.delay === 'month').length;
    let quarter = activeThreads.filter(thread => thread.delay === 'quarter').length;
    let half = activeThreads.filter(thread => thread.delay === 'half').length;
    let year = activeThreads.filter(thread => thread.delay === 'year').length;
    let timeConfig = {
        series: [recent, week, month, quarter, half, year],
        labels: ['Recent', 'Over a week', 'Over a month', 'Over 3 months', 'Over 6 months', 'Over a year'],
        colors: ['rgb(146, 172, 125)', 'rgb(174, 176, 121)', 'rgb(196, 179, 131)', 'rgb(193, 160, 135)', 'rgb(193, 138, 135)', 'rgb(189, 112, 112)'],
        chart: {
            type: 'donut',
            height: '400px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return w.config.series[seriesIndex]
            },
            style: {
                fontSize: '20px',
                fontFamily: 'var(--font-accent)',
                fontWeight: '400'
            },
            dropShadow: {
                enabled: false,
            }
        }, 
        legend: {
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            markers: {
                width: '10px',
                height: '10px',
                offsetX: '-2px',
            },
        },
        stroke: {
            show: true,
            colors: 'var(--bg-body)',
        },
        tooltip: {
            enabled: false,
        },
        theme: {
            palette: 'palette4',
        },
        responsive: [{
            breakpoint: 560,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return timeConfig;
}

function configStatus(threads) {
    let owing = threads.filter(thread => thread.status === 'mine' || thread.status === 'start').length;
    let active = threads.filter(thread => thread.status === 'theirs' || thread.status === 'upcoming').length;
    let complete = threads.filter(thread => thread.status === 'done').length;
    let statusConfig = {
        series: [owing, active, complete],
        labels: ['Mine', 'Theirs', 'Completed'],
        colors: ['rgba(162, 129, 119, 1)', 'rgba(125, 159, 129, 1)', 'rgb(141, 165, 176)'],
        chart: {
            type: 'donut',
            height: '400px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return w.config.series[seriesIndex]
            },
            style: {
                fontSize: '20px',
                fontFamily: 'var(--font-accent)',
                fontWeight: '400'
            },
            dropShadow: {
                enabled: false,
            }
        }, 
        legend: {
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            markers: {
                width: '10px',
                height: '10px',
                offsetX: '-2px',
            },
        },
        stroke: {
            show: true,
            colors: 'var(--bg-body)',
        },
        tooltip: {
            enabled: false,
        },
        theme: {
            palette: 'palette4',
        },
        responsive: [{
            breakpoint: 560,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return statusConfig;
}

function configType(threads) {
    let threadCount = threads.filter(thread => thread.type === 'thread').length;
    let comms = threads.filter(thread => thread.type === 'comm').length;
    let oneshots = threads.filter(thread => thread.type === 'oneshot').length;
    let typeConfig = {
        series: [threadCount, comms, oneshots],
        labels: ['Threads', 'Comms', 'One-shots'],
        colors: ['rgb(141, 165, 176)', 'rgb(174, 140, 161)', 'rgba(189, 173, 133, 1)'],
        chart: {
            type: 'donut',
            height: '400px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return w.config.series[seriesIndex]
            },
            style: {
                fontSize: '20px',
                fontFamily: 'var(--font-accent)',
                fontWeight: '400'
            },
            dropShadow: {
                enabled: false,
            }
        }, 
        legend: {
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            markers: {
                width: '10px',
                height: '10px',
                offsetX: '-2px',
            },
        },
        stroke: {
            show: true,
            colors: 'var(--bg-body)',
        },
        tooltip: {
            enabled: false,
        },
        theme: {
            palette: 'palette4',
        },
        responsive: [{
            breakpoint: 560,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return typeConfig;
}

function configPartners(threads) {
    let threadPartners = threads.map(thread => thread.partners.split('+').map(item => JSON.parse(item)))[0];
    let partnerNames = threadPartners.map(item => item.partner);
    let consolidatedPartners = [...new Set(partnerNames)];
    let partnerCounts = consolidatedPartners.reduce((accumulator, value) => {
        return {...accumulator, [value]: 0};
    }, {});
    threads.forEach(thread => {
        let thisPartners = thread.partners.split('+').map(item => JSON.parse(item)).map(item => item.partner);
        thisPartners.forEach(partner => {
            partnerCounts[partner]++;
        });
    });
    let partners = [], counts = [];
    for (const partnerName in partnerCounts) {
        partners.push(capitalize(partnerName, [`'`, `-`]));
        counts.push(partnerCounts[partnerName]);
    }
    let partnerConfig = {
        series: counts,
        labels: partners,
        colors: ['rgba(189, 173, 133, 1)', 'rgb(134, 123, 155)', 'rgb(174, 140, 161)', 'rgb(141, 165, 176)', 'rgb(152, 159, 125)', 'rgba(125, 159, 129, 1)', 'rgba(162, 129, 119, 1)'],
        chart: {
            type: 'donut',
            height: '400px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return w.config.series[seriesIndex]
            },
            style: {
                fontSize: '20px',
                fontFamily: 'var(--font-accent)',
                fontWeight: '400'
            },
            dropShadow: {
                enabled: false,
            }
        }, 
        legend: {
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            markers: {
                width: '10px',
                height: '10px',
                offsetX: '-2px',
            },
        },
        stroke: {
            show: true,
            colors: 'var(--bg-body)',
        },
        tooltip: {
            enabled: false,
        },
        theme: {
            palette: 'palette4',
        },
        responsive: [{
            breakpoint: 560,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return partnerConfig;
}