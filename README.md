<p align="center" style="margin-bottom:0px;">
    <img src="https://raw.githubusercontent.com/asmr-hex/autosuggestion/main/logo.svg"
        height="130">
</p>
<h1 align="center" style="margin-top:0px;letter-spacing:0.2em;color:dimgrey">
    autosuggestion
</h1>
<p align="center">
    <!-- test badge -->
    <a href="https://github.com/asmr-hex/autosuggestion/actions/workflows/tests.yml" alt="tests">
        <img src="https://github.com/asmr-hex/autosuggestion/actions/workflows/tests.yml/badge.svg"/>
    </a>
    <!-- coverage badge -->
    <a href="https://asmr-hex.github.io/autosuggestion/coverage">
        <img src="https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/437c1f94/coverage" alt="test coverage">
    </a>
    <!-- docs badge -->
    <a href="https://asmr-hex.github.io/autosuggestion" alt="documentation">
        <img src="https://img.shields.io/static/v1?label=typedoc&message=docs&color=informational" />
    </a>
    <!-- npm version badge -->
    <a href="https://badge.fury.io/js/autosuggestion">
        <img src="https://badge.fury.io/js/autosuggestion.svg" alt="npm version">
    </a>
</p>

Generate dynamic, composable suggestions for text completion.
* suggest words/phrases by scope.
* define phrase-based suggestions.
* define lookup-based suggestions (recursive).
* dynamically add/remove suggestion patterns.

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

## Getting Started
For more details, see [documentation](https://asmr-hex.github.io/autosuggestion).

###### Creating a `Dictionary`
``` javascript
const dictionary = new Dictionary()
```

## Examples
* [basic](https://asmr-hex.github.com/autosuggestion/examples/browser/basic.html)
* [dynamic](https://asmr-hex.github.com/autosuggestion/examples/browser/dynamic.html)
* [context-free grammar](https://asmr-hex.github.io/autosuggestion/examples/browser/basic-cfg.html)
* [dynamic context-free grammar](https://asmr-hex.github.io/autosuggestion/examples/browser/dynamic-cfg.html)

list of live example pages
brief section descriptions of each feature

## Releasing
1. run `npm version major|minor|patch`
2. create release on github manually (triggers a github workflow to publish tp npm)

eventually, consider using [semantic-release](https://github.com/semantic-release/semantic-release)

## Todo
#### General
- [x] automate test coverage reporting
- [ ] get 100% test coverage
- [ ] clean up and restructure code
- [x] setup ci for coverage report + doc generation + npm publishing (look into tags as a mechanism for publishing)
- [x] generate badges with [shields.io](https://github.com/badges/shields)
- [ ] include doc comments for typedoc
- [x] fill out readme
- [x] update package.json
- [x] update github
- [x] update package (use latest package from unpkg.org in browser examples)
- [x] host documentation
#### Documentation
- [x] Dictionary
- [x] Scope
- [ ] Suggestion
- [ ] Node
- [x] types
#### Features
- [ ] make Dictionary API handle multiple input data shapes
- [ ] suggestion token annotations (context, etc.)
- [ ] configuration (lookup brackets, etc.)
#### Examples
- [x] examples landing page (browser) (or link in docs)
- [x] simple, dynamic dictionary (browser)
- [x] complex, dynamic CFG (browser)
- [ ] lookahead configuration (browser)
- [ ] large dictionary (browser)
- [ ] basic (nodejs)
