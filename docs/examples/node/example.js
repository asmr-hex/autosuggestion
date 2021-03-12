var autocomplete = require('../../dist/auto-complete.umd.js')

var out = function() {
  process.stdout.write('does this work?...' + autocomplete.Suggest("YES, it works!"));
}

out()
