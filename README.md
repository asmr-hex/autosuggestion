<p align="center" style="margin-bottom:0px;">
    <img src="https://raw.githubusercontent.com/asmr-hex/autosuggestion/main/logo.svg"
        height="130">
</p>
<h1 align="center" style="margin-top:0px;letter-spacing:0.2em;color:dimgrey">
    autosuggestion
</h1>
<p align="center">
    <a href="https://github.com/asmr-hex/autosuggestion/actions/workflows/tests.yml" alt="tests">
        <img src="https://github.com/asmr-hex/autosuggestion/actions/workflows/tests.yml/badge.svg"/>
    </a>
    <a href="https://badge.fury.io/js/autosuggestion">
        <img src="https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/437c1f94/coverage" alt="test coverage">
    </a>
    <a href="https://github.com/badges/shields/graphs/contributors" alt="documentation">
        <img src="https://img.shields.io/static/v1?label=typedoc&message=docs&color=informational" />
    </a>
    <a href="https://badge.fury.io/js/autosuggestion">
        <img src="https://badge.fury.io/js/autosuggestion.svg" alt="npm version">
    </a>
</p>

Generates suggestions for text completion.

## Install
`autosuggestion` can be used in Node.js and browsers.
``` shell
npm install autosuggestion
```

## Import
``` javascript
// ES Module (ESM)
import { Dictionary } from 'autosuggestion'
```
``` javascript
// CommonJS (CJS)
const autosuggestion = require('autosuggestion')
```
``` html
<!-- HTML Script Tag  -->
<script type='text/javascript' src='https://unpkg.com/autosuggestion'></script>
```

## Examples
list of live example pages
brief section descriptions of each feature


## Todo
#### General
- [x] automate test coverage reporting
- [ ] get 100% test coverage
- [ ] clean up and restructure code
- [ ] setup ci for coverage report + doc generation + npm publishing (look into tags as a mechanism for publishing)
- [x] generate badges with [shields.io](https://github.com/badges/shields)
- [ ] include doc comments for typedoc
- [ ] fill out readme
- [ ] update package.json
- [x] update github
- [ ] update package (use latest package from unpkg.org in browser examples)
- [ ] host documentation
#### Features
- [ ] suggestion token annotations (context, etc.)
- [ ] configuration (lookup brackets, etc.)
#### Examples
- [ ] examples landing page (browser) (or link in docs)
- [ ] simple, dynamic dictionary (browser)
- [ ] complex, dynamic CFG (browser)
- [ ] lookahead configuration (browser)
- [ ] large dictionary (browser)
- [ ] deeply nested contexts (browser)
- [ ] basic (nodejs)
