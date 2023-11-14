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
        {
            name: 'HP',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.hp),
        },
        {
            name: 'Mana',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.mana),
        },
        {
            name: 'Ward (%)',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.wardPercentage),
        },
        {
            name: 'Defense',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.defense),
        },
        {
            name: 'Resistance',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.resistance),
        },
        {
            name: 'Dexterity',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.dexterity),
        },
        {
            name: 'Foresight',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.foresight),
        },
        {
            name: 'Crit %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.criticalHitChance),
        },
        {
            name: 'Adornments',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.adornmentSlots),
        },
        {
            name: 'Exp Bonus %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.expBonusPercentage),
        },
        {
            name: 'Orn Bonus %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.ornBonusPercentage),
        },
        {
            name: 'Luck Bonus %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.luckBonusPercentage),
        },
        {
            name: 'Follower Act %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.followerActPercentage),
        },
        {
            name: 'Follower Stats %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.followerStatsPercentage),
        },
        {
            name: 'Summon Stats %',
            f: (codexEntry, tableCell) => number(tableCell, codexEntry.summonStatsPercentage),
        },
    ],
    filters : [
        {
            name: 'tierMin',
            f: (codexEntry, filterValue) => codexEntry.tier >= filterValue,
        },
        {
            name: 'tierMax',
            f: (codexEntry, filterValue) => codexEntry.tier <= filterValue,
        },
        {
            name: 'canEquip',
            f: (codexEntry, filterValue) => (filterValue.includes('w') && codexEntry.warrior) ||
                (filterValue.includes('m') && codexEntry.mage) ||
                (filterValue.includes('t') && codexEntry.thief),
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
        {
            name: 'adornments',
            f: (x, y) => y.adornmentSlots - x.adornmentSlots || x.name.localeCompare(y.city),
        },
    ],
})

function power(codexEntry) {
    return codexEntry.attack + codexEntry.magic
}