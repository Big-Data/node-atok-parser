/**
    This is a rudimentary CSV parser
    In this simple version, the data must not contain any coma
    and double quotes are not processed.
 */
function ParserContent () {
	// Parser reference
	var self = this
	// Current row
	var data = []

	// Define the parser rules
	var eol = ['\n','\r\n']
	var sep = options.separator || ','
	// Handlers are used instead of events
	atok
	    // Ignore comments
	    .ignore(true) // On rule match, do not do anything, skip the token
	        .addRule('#', eol, 'comment')
	    .ignore() // Turn the ignore property off
	    // Anything else is data
	    // Rule definition:
	    // first argument: always an exact match. To match anything, use ''
	    // next arguments: array of possible matches (first match wins)
	    .addRule('', { firstOf: [ sep ].concat(eol) }, function (token, idx) {
	        // token=the matched data
	        // idx=when using array of patterns, the index of the matched pattern
	        if (token === 'error') {
	            // Build the error message using positioning
	            var err = self.trackError(new Error('Dummy message'), token)
	            self.emit('error', err)
	            return
	        }
	        // Add the data
	        data.push(token)
	        // EOL reached, the parser emits the row
	        if (idx > 0) {
	            self.emit('data', data)
	            data = []
	        }
	    })
}

// Build the CSV parser
var Parser = require('..').createParser(ParserContent, 'options')

var i = 0
var p = new Parser({ separator: '\t' })

p.on('error', console.error)
p.on('data', function (res) {
		console.log('line %d:', ++i, res)
	})
p.track(true)

// Test the parser
p.write('a\tb\naa\tbb\n')
// Simulated error
p.write('error\n')
