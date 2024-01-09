window.onload = loadPage({
    url: '/orna-codex/data/weapons.json',
    filters : [
        {
            name: 'tierMin',
            f: (codexEntry, filterValue) => filterValue <= codexEntry.tier,
            label: 'Tier from ',
            component: () => tierFilter(),
        },
        {
            name: 'tierMax',
            f: (codexEntry, filterValue) => filterValue >= codexEntry.tier,
            label: ' to ',
            component: () => tierFilter(),
            addSeparator: true,
        },
        {
            name: 'canEquip',
            f: (codexEntry, filterValue) => (filterValue.includes('w') && codexEntry.warrior) ||
                (filterValue.includes('m') && codexEntry.mage) ||
                (filterValue.includes('t') && codexEntry.thief) ||
                (filterValue.includes('s') && codexEntry.summoner),
            label: 'W/T/M/S',
            component: () => canEquipChecks(),
            getComponentValue: getCanEquipChecks,
            setComponentValue: setCanEquipChecks,
            addSeparator: true,
        },
        {
            name: 'twoHanded',
            f: (codexEntry, filterValue) => filterValue == codexEntry.twoHanded,
            label: '2H ',
            component: () => booleanFilter(),
        },
    ],
    sortOptions : [
        {
            name: 'power',
            f: (x, y) => power(y) - power(x) || x.name.localeCompare(y.city),
        },
        {
            name: 'attack',
            f: (x, y) => (y.attack | 0) - (x.attack | 0) || x.name.localeCompare(y.city),
        },
        {
            name: 'magic',
            f: (x, y) => (y.magic | 0) - (x.magic | 0) || x.name.localeCompare(y.city),
        },
        {
            name: 'adornments',
            f: (x, y) => (y.adornmentSlots | 0) - (x.adornmentSlots | 0) || x.name.localeCompare(y.city),
        },
    ],
    columns: [
        {
            name: 'Name',
            f: (codexEntry, tableCell) => link(tableCell, codexEntry.name, codexEntry.url),
        },
        {
            name: 'Tier',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.tier),
        },
        {
            name: 'W/T/M/S',
            f: (codexEntry, tableCell) => checks(tableCell,
                [codexEntry.warrior, codexEntry.thief, codexEntry.mage, codexEntry.summoner]),
        },
        {
            name: 'Power',
            f: (codexEntry, tableCell) => number(tableCell, power(codexEntry)),
        },
        {
            name: 'Attack',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.attack),
        },
        {
            name: 'Magic',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.magic),
        },
        {
            name: 'Adornments',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.adornmentSlots),
        },
        {
            name: '2H',
            f: (codexEntry, tableCell) => check(tableCell, codexEntry.twoHanded),
        },
        {
            name: 'Element',
            f: (codexEntry, tableCell) => text(tableCell, codexEntry.element),
        },
    ],
})

function power(codexEntry) {
    return (codexEntry.attack | 0) + (codexEntry.magic | 0)
}