
---
## JSON to CSV
___

`normalizeJSONKeys`
- Loop _(forEach)_ on Json Array
    - Extract keys _(Object.keys)_
    - Loop through keys _(for of)_
    - Conditionally _(if)_ add to set 
- Spread Json Array
- Loop through keys set _(forEach)_
    - Loop through Json Array Clone _(forEach)_
    - Add key if needed

`main`
- Loop through Json Array _(basic for)_

    `normalizeJSONValues`
    - Extract entries _(Object.entries)_
    - Loop through entries _(for of)_
    - Four conditional _(if)_ for each entry. If array loop through it, two conditional _(if)_
      Early break if object found
      
`main`
- Extract keys from normalized Json Object _(Object.keys)_
- Join normalized keys
- Loop through Json Array _(for of)_
    - Extract normalized entries _(Object.entries)_
    - Loop through normalized keys _(for of)_
        - Execute find on entries to match the current key
        - Push value to ordered array
    - Extract values from ordered array _(Object.values)_
    - Join values
---
## CSV to JSON
___
`main`
- Split array at line break

`checkEmbeddedLineTerminators`
- Clone array
- Loop through row array clone _(for of)_

    `countCharInString`
    - Index of char inside field record string
    - Loop until no more char are found _(while)_

`checkEmbeddedLineTerminators`
- Conditional error _(if)_
- Loop until no more uncomplete records are found _(do while)_
    - Loop through Array _(basic for)_

       `countCharInString`
        - Index of char inside string
        - Loop until no more char are found _(while)_

`validateCSV`
- Split row  at delimiter
- Loop through array _(basic for)_
    - Split row at delimiter
    - Conditional _(if)_ contains conditional _(if)_
- Conditional _(if)_

`main`
- Conditional _(if else)_
    - Clone array / Loop through keys _(map)_
- Loop through values _(for of)_
    - Loop through fields
        -Regex replace
