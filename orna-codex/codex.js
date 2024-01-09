const sortParam = 'sort'

async function loadPage(config) {
    if (config.filters)
        loadFilters(config.filters)
    loadSort(config.sortOptions || [])
    loadTable(config)
}

async function loadFilters(filters) {
}

async function loadSort(sortOptions) {
    if (sortOptions.size == 0) return

    const div = document.createElement('div')
    div.classList = 'sort'

    const label = document.createElement('label')
    label.innerHTML = 'Sort by '
    div.appendChild(label)

    const select = document.createElement('select')
    const option = document.createElement('option')
    option.value = ''
    option.innerHTML = ''
    select.appendChild(option)
    sortOptions.forEach(sortOption => {
        const option = document.createElement('option')
        option.value = sortOption.name
        option.innerHTML = sortOption.name
        select.appendChild(option)
    })
    select.value = new URLSearchParams(window.location.search).get(sortParam) || ''
    select.addEventListener('change', function() {
        const value = this.value
        const params = new URLSearchParams(window.location.search.slice(1))
        if (value == '')
            params.delete(sortParam)
        else
            params.set(sortParam, value)
        const redirect = `${window.location.pathname}?${params}${window.location.hash}`
        window.location.href = redirect
    })
    div.appendChild(select)

    document.body.appendChild(div)
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
    const sort = queryParams.get(sortParam)
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
    tableCell.textContent = number || 0
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