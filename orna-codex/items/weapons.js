window.onload = loadTable({
    url: '/orna-codex/data/weapons.json',
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
            name: 'W/T/M',
            f: (codexEntry, tableCell) => checks(tableCell, [codexEntry.warrior, codexEntry.mage, codexEntry.thief]),
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
            name: '2H',
            f: (codexEntry, tableCell) => check(tableCell, codexEntry.twoHanded),
        },
        {
            name: 'Element',
            f: (codexEntry, tableCell) => text(tableCell, codexEntry.element),
        },
    ],
    filters : [
        {
            name: 'tierMin',
            f: (codexEntry, filterValue) => filterValue <= codexEntry.tier,
        },
        {
            name: 'tierMax',
            f: (codexEntry, filterValue) => filterValue >= codexEntry.tier,
        },
        {
            name: 'canEquip',
            f: (codexEntry, filterValue) => (filterValue.includes('w') && codexEntry.warrior) ||
                (filterValue.includes('m') && codexEntry.mage) ||
                (filterValue.includes('t') && codexEntry.thief),
        },
        {
            name: 'twoHanded',
            f: (codexEntry, filterValue) => filterValue == codexEntry.twoHanded,
        },
    ],
    sortOptions : [
        {
            name: 'power',
            f: (x, y) => power(y) - power(x) || x.name.localeCompare(y.city),
        },
        {
            name: 'attack',
            f: (x, y) => y.attack - x.attack || x.name.localeCompare(y.city),
        },
        {
            name: 'magic',
            f: (x, y) => y.magic - x.magic || x.name.localeCompare(y.city),
        },
    ],
})

function power(codexEntry) {
    return (codexEntry.attack | 0) + (codexEntry.magic | 0)
}