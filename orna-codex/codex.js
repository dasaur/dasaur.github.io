

function fill(row, obj) {
    row.appendChild(link(obj.name, obj.url))
    row.appendChild(number(obj.tier))
    row.appendChild(check(obj.warrior))
    row.appendChild(check(obj.mage))
    row.appendChild(check(obj.thief))
    row.appendChild(number(obj.attack))
    row.appendChild(number(obj.magic))
    row.appendChild(number(obj.attack + obj.magic))
}

async function loadTable(config) {
    const table = document.createElement('table')
    createHeaderRow(table, config.columns)
    const tableBody = document.createElement('tbody')
    table.appendChild(tableBody)
    document.body.appendChild(table)
    var codex = await loadCodex(config.url)
    codex = filterCodex(codex, config.filters || [])
    codex = sortCodex(codex, config.sortOptions || [])
    codex.forEach(codexEntry => createBodyRow(tableBody, codexEntry, config.columns))
}

function createHeaderRow(table, columns) {
    const tableHeaders = document.createElement('thead')
    table.appendChild(tableHeaders)
    const tableHeadersRow = document.createElement('tr')
    tableHeaders.appendChild(tableHeadersRow)
    columns.forEach(column => {
        const tableHeader = document.createElement('th')
        tableHeader.textContent = column.name
        tableHeadersRow.appendChild(tableHeader)
    })
}

async function loadCodex(url) {
    const response = await fetch(url)
    return response.json()
}

function filterCodex(codex, filters) {
    const queryParams = new URLSearchParams(window.location.search)
    filters.forEach(filter => {
        const filterValue = queryParams.get(filter.name)
        if (filterValue != null) codex = codex.filter(codexEntry => filter.f(codexEntry, filterValue))
    })
    return codex
}

function sortCodex(objects, sortOptions) {
    const queryParams = new URLSearchParams(window.location.search)
    const sort = queryParams.get('sort')
    const sortOption = sortOptions.find(sortOption => sortOption.name == sort)
    if (sortOption != null) objects.sort(sortOption.f)
    return objects
}

function createBodyRow(tableBody, codexEntry, columns) {
    const tableRow = document.createElement('tr')
    columns.forEach(column => {
        const tableCell = document.createElement('td')
        column.f(codexEntry, tableCell)
        tableRow.appendChild(tableCell)
    })
    tableBody.appendChild(tableRow)
}

function number(tableCell, number) {
    tableCell.textContent = number
    tableCell.align = "right"
}

function text(element, text) {
    element.textContent = text
}

function link(element, text, url) {
    const link = document.createElement('a')
    link.textContent = text
    link.href = url
    element.appendChild(link)
}

function number(element, number) {
    text(element, number)
    element.align = "right"
}

function check(element, boolean) {
    text(element, checkText(boolean))
    element.align = "center"
}

function checks(element, booleans) {
    const checksText = booleans.map(checkText).join('')
    text(element, checksText)
    element.align = "center"
}

function checkText(boolean) {
    return boolean ? '\u2611' : '\u2610'
}