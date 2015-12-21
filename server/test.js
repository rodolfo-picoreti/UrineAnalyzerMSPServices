function logger(status, result) {
	console.log(`${result.method} status: ${status}`)
	if (status == 'success') {
		console.log(result.args)
	}
}

Meteor.startup(function () {
	
	Services.initialize(function() {

		Services.on('storeSample', function (args) {
			console.log(args)
			if (args.counter > 3) {
				Services.call('stopSampling')
			}
		})
		
		Services.call('selectSensor', { id: 0 })

		Services.call('configureLocks', [ 
			{ id: 0, value: 0 },
			{ id: 1, value: 0 }, 
			{ id: 2, value: 0 }, 
			{ id: 3, value: 0 }  
		], logger)

		Services.call('configureHeaters', [ 
			{ id: 2, value: 100 },
			{ id: 3, value: 300 } 
		], logger)
		
		Services.call('configurePumps', [ 
			{ id: 0, value: 100 },
			{ id: 1, value: 300 } 
		], logger)

		Services.call('configureValves', [ 
			{ id: 0, value: 0 },
			{ id: 1, value: 1 },
			{ id: 2, value: 0 },
			{ id: 3, value: 1 },
			{ id: 4, value: 1 } 
		], logger)

		Services.call('startSampling', { samplingTime: 1000 })
	
	})
})