const equipmentClasses = ['w', 't', 'm', 's']
const sortParam = 'sort'

async function loadPage(config) {
    const page = document.createElement('div')
    page.classList = 'page'
    document.body.appendChild(page)

    loadFilters(page, config.filters || [])
    loadSort(page, config.sortOptions || [])
    loadTable(page, config)
}

async function loadFilters(page, filters) {
    if (filters.size == 0) return

    const div = document.createElement('div')
    div.classList = 'filters'

    filters.forEach(filter => {
        const filterDiv = document.createElement('div')
        filterDiv.classList = 'filter'

        const label = document.createElement('label')
        label.innerHTML = filter.label
        filterDiv.appendChild(label)

        const component = filter.component()
        var setComponentValue = filter.setComponentValue
        if (!setComponentValue)
            setComponentValue = (component, filterValue) => component.value = filterValue
        setComponentValue(component, new URLSearchParams(window.location.search).get(filter.name))
        component.addEventListener('change', function() {
            var getComponentValue = filter.getComponentValue
            if (!getComponentValue)
                getComponentValue = (component) => component.value
            const value = getComponentValue(this)
            const params = new URLSearchParams(window.location.search.slice(1))
            if (value == '')
                params.delete(filter.name)
            else
                params.set(filter.name, value)
            const redirect = `${window.location.pathname}?${params}${window.location.hash}`
            window.location.href = redirect
        })
        filterDiv.appendChild(component)

        div.appendChild(filterDiv)

        if (filter.addSeparator)
            div.appendChild(verticalSeparator())
    })

    page.appendChild(div)
}

async function loadSort(page, sortOptions) {
    if (sortOptions.size == 0) return

    const div = document.createElement('div')
    div.classList = 'sort'

    const label = document.createElement('label')
    label.innerHTML = 'Sort by '
    div.appendChild(label)

    const select = listFilter(sortOptions.map(sortOption => sortOption.name))
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

    page.appendChild(div)
}

async function loadTable(page, config) {
    const div = document.createElement('div')
    div.classList = 'table'
    const table = document.createElement('table')
    createHeaderRow(table, config.columns)
    const tableBody = document.createElement('tbody')
    table.appendChild(tableBody)
    div.appendChild(table)
    page.appendChild(div)
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

function mapFilter(map) {
    const select = document.createElement('select')
    const option = document.createElement('option')
    option.value = ''
    option.innerHTML = ''
    select.appendChild(option)
    map.forEach((value, key, m) => {
        const option = document.createElement('option')
        option.value = key
        option.innerHTML = value
        select.appendChild(option)
    })
    return select
}

function listFilter(list) {
    const map = new Map()
    list.forEach(element => map.set(element, element))
    return mapFilter(map)
}

function objectFilter(filter) {
    const map = new Map()
    filter.forEach(element => map.set(element.value, element.name))
    return mapFilter(new Map(Object.entries(filter)))
}

function tierFilter() {
    return listFilter([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
}

function canEquipChecks() {
    const div = document.createElement('div')
    div.classList = 'canEquip'
    for (e in equipmentClasses) {
        const check = document.createElement('input')
        check.setAttribute('type', 'checkbox')
        div.appendChild(check)
    }
    return div
}

function getCanEquipChecks(component) {
    var value = ''
    for (var i = 0; i < component.children.length; i++) {
        const check = component.children[i]
        const canEquip = equipmentClasses[i];
        if (check.checked)
            value += canEquip
    }
    return value
}

function setCanEquipChecks(component, filterValue) {
    filterValue = filterValue || ''
    for (var i = 0; i < component.children.length; i++) {
        const check = component.children[i]
        const canEquip = equipmentClasses[i];
        const value = filterValue.indexOf(canEquip) >= 0
        check.checked = value
    }
}

function booleanFilter() {
    return mapFilter(new Map()
                .set(0, 'N')
                .set(1, 'Y'))
}

function verticalSeparator() {
    var separator = document.createElement('div')
    separator.classList = 'vl'
    return separator
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