const equipmentClasses = ['w', 't', 'm', 's']

const slotParam = 'slot'

const sortParam = 'sort'

const isCacheSupported = 'caches' in window
if (isCacheSupported)
    caches.open('orna-codex').then(cache => {
        cache.add('styles/MerriweatherSans-Light.ttf')
    })

window.onload = (event) => {
    var slotValue = new URLSearchParams(window.location.search).get(slotParam) || ''
    if (slotValue == '') {
        const params = new URLSearchParams(window.location.search.slice(1))
        params.set(slotParam, 'weapons')
        const redirect = `${window.location.pathname}?${params}${window.location.hash}`
        window.location.href = redirect
        return
    }
    loadPage(slotValue)
}

function loadPage(slotValue) {
    const page = document.createElement('div')
    page.classList = 'page'
    document.body.appendChild(page)

    const filters = getFilters(slotValue)
    const sortOptions = getSortOptions(slotValue)

    loadSlotSelect(page, slotValue)
    loadFilters(page, filters || [])
    loadSort(page, sortOptions)
    loadTable(page, slotValue, filters, sortOptions)
}

function getFilters(slotValue) {
    const filters = []
    filters.push({
        name: 'tierMin',
        f: (codexEntry, filterValue) => filterValue <= codexEntry.tier,
        label: 'Tier ',
        component: () => tierFilter(),
        omitSeparator: true,
    })
    filters.push({
        name: 'tierMax',
        f: (codexEntry, filterValue) => filterValue >= codexEntry.tier,
        label: ' to ',
        component: () => tierFilter(),
    })
    if (slotValue != 'accessories') filters.push({
        name: 'canEquip',
        f: (codexEntry, filterValue) => (filterValue.includes('w') && codexEntry.warrior) ||
            (filterValue.includes('m') && codexEntry.mage) ||
            (filterValue.includes('t') && codexEntry.thief) ||
            (filterValue.includes('s') && codexEntry.summoner),
        label: 'W/T/M/S',
        component: () => canEquipChecks(),
        getComponentValue: getCanEquipChecks,
        setComponentValue: setCanEquipChecks,
    })
    if (slotValue == 'weapons') filters.push({
        name: 'twoHanded',
        f: (codexEntry, filterValue) => filterValue == codexEntry.twoHanded,
        label: '2H ',
        component: () => booleanFilter(),
    })
    return filters
}

function getSortOptions(slotValue) {
    const sortOptions = []
    sortOptions.push({
        name: 'power',
        f: (x, y) => power(y) - power(x) || x.name.localeCompare(y.city),
    })
    sortOptions.push({
        name: 'attack',
        f: (x, y) => (y.attack | 0) - (x.attack | 0) || x.name.localeCompare(y.city),
    })
    sortOptions.push({
        name: 'defense',
        f: (x, y) => (y.defense | 0) - (x.defense | 0) || x.name.localeCompare(y.city),
    })
    sortOptions.push({
        name: 'magic',
        f: (x, y) => (y.magic | 0) - (x.magic | 0) || x.name.localeCompare(y.city),
    })
    sortOptions.push({
        name: 'resistance',
        f: (x, y) => (y.resistance | 0) - (x.resistance | 0) || x.name.localeCompare(y.city),
    })
    sortOptions.push({
        name: 'resistance',
        f: (x, y) => (y.resistance | 0) - (x.resistance | 0) || x.name.localeCompare(y.city),
    })
    return sortOptions
}

function loadSlotSelect(page, slotValue) {
const slotDiv = document.createElement('div')
    slotDiv.classList = slotParam

    var slotId = 'slot'

    const label = document.createElement('label')
    label.innerHTML = 'Slot'
    label.htmlFor = slotId
    slotDiv.appendChild(label)

    var equipmentType = mapSelect(new Map()
        .set('weapons', "Weapons")
        .set('off-hands', "Off-hand")
        .set('heads', "Head")
        .set('armors', "Armor")
        .set('legs', "Legs")
        .set('accessories', "Accessories"))
    equipmentType.id = slotId
    equipmentType.removeChild(equipmentType.childNodes[0])
    slotDiv.appendChild(equipmentType)

    equipmentType.value = slotValue
    equipmentType.addEventListener('change', function() {
        const value = equipmentType.value
        const params = new URLSearchParams(window.location.search.slice(1))
        if (value == '')
            params.delete(slotParam)
        else
            params.set(slotParam, value)
        const redirect = `${window.location.pathname}?${params}${window.location.hash}`
        window.location.href = redirect
    })

    page.appendChild(slotDiv)}

function loadFilters(page, filters) {
    if (filters.size == 0) return

    const div = document.createElement('div')
    div.classList = 'filters'

    filters.forEach(filter => {
        const filterDiv = document.createElement('div')
        filterDiv.classList = 'filter'

        const label = document.createElement('label')
        label.innerHTML = filter.label
        label.htmlFor = filter.name
        filterDiv.appendChild(label)

        const component = filter.component()
        component.id = filter.name
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

        if (!filter.omitSeparator)
            div.appendChild(verticalSeparator())
    })

    page.appendChild(div)
}

async function loadSort(page, sortOptions) {
    if (sortOptions.size == 0) return

    const div = document.createElement('div')
    div.classList = sortParam

    const label = document.createElement('label')
    label.innerHTML = 'Sort by '
    label.htmlFor = sortParam
    div.appendChild(label)

    const select = listSelect(sortOptions.map(sortOption => sortOption.name))
    select.id = sortParam
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

async function loadTable(page, slotValue, filters, sortOptions) {
    const columns = getColumns(slotValue)
    const div = document.createElement('div')
    div.classList = 'table'
    const table = document.createElement('table')
    createHeaderRow(table, columns)
    const tableBody = document.createElement('tbody')
    table.appendChild(tableBody)
    div.appendChild(table)
    page.appendChild(div)
    var codex = await loadCodex(getUrl(slotValue))
    codex = filterCodex(codex, filters)
    codex = sortCodex(codex, sortOptions)
    codex.forEach(codexEntry => createBodyRow(tableBody, codexEntry, columns))
}

function getColumns(slotValue) {
    var columns = []
    columns.push({
        name: 'Name',
        f: (codexEntry, tableCell) => link(tableCell, codexEntry.name, codexEntry.url),
    })
    columns.push({
        name: 'Tier',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.tier),
    })
    if (slotValue != 'accessories') columns.push({
        name: 'W/T/M/S',
        f: (codexEntry, tableCell) => checks(tableCell,
            [codexEntry.warrior, codexEntry.thief, codexEntry.mage, codexEntry.summoner]),
    })
    columns.push({
        name: 'Power',
        f: (codexEntry, tableCell) => number(tableCell, power(codexEntry, slotValue)),
    })
    columns.push({
        name: 'Attack',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.attack),
    })
    columns.push({
        name: 'Defense',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.defense),
    })
    columns.push({
        name: 'Magic',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.magic),
    })
    columns.push({
        name: 'Resistance',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.resistance),
    })
    if (slotValue != 'accessories') columns.push({
        name: 'Adornments',
        f: (codexEntry, tableCell) => number(tableCell, codexEntry.adornmentSlots),
    })
    return columns
}

function getUrl(slotValue) {
    return `/orna-codex/data/${slotValue}.json`
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

function mapSelect(map) {
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

function listSelect(list) {
    const map = new Map()
    list.forEach(element => map.set(element, element))
    return mapSelect(map)
}

function tierFilter() {
    return listSelect([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
}

function canEquipChecks() {
    const div = document.createElement('div')
    for (e in equipmentClasses) {
        const label = document.createElement('label')
        const checkId = getCheckId(equipmentClasses[e])
        label.innerHTML = getFullName(equipmentClasses[e])
        label.htmlFor = checkId
        label.classList = 'hide'
        div.appendChild(label)
        const check = document.createElement('input')
        check.setAttribute('type', 'checkbox')
        check.id = checkId
        check.classList = 'canEquip'
        div.appendChild(check)
    }
    return div
}

function getCheckId(equipmentClass) {
    switch (equipmentClass) {
        case 'w': return 'warrior'
        case 't': return 'thief'
        case 'm': return 'mage'
        case 's': return 'summoner'
        default: return null
    }
}

function getFullName(equipmentClass) {
    switch (equipmentClass) {
        case 'w': return 'Warrior'
        case 't': return 'Thief'
        case 'm': return 'Mage'
        case 's': return 'Summoner / Valhallan'
        default: return null
    }
}

function getCanEquipChecks(component) {
    var value = ''
    for (var i = 0; i < equipmentClasses.length; i++) {
        const check = component.children[i * 2 + 1]
        const canEquip = equipmentClasses[i];
        if (check.checked)
            value += canEquip
    }
    return value
}

function setCanEquipChecks(component, filterValue) {
    filterValue = filterValue || ''
    for (var i = 0; i < equipmentClasses.length; i++) {
        const check = component.children[i * 2 + 1]
        const canEquip = equipmentClasses[i];
        const value = filterValue.indexOf(canEquip) >= 0
        check.checked = value
    }
}

function booleanFilter() {
    return mapSelect(new Map()
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

function power(codexEntry) {
    return (codexEntry.attack | 0) + (codexEntry.defense | 0) + (codexEntry.magic | 0) + (codexEntry.resistance | 0)
}