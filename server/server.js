function logger(status, results) {
	console.log(`${status}: ${results}`)
}

Meteor.startup(function () {

	Services.initialize(function() {

		Services.on('storeSample', function (args) {
			console.log(`   Heater: ${args.heater.raw}   ${args.heater.temperature}\nPreheater: ${args.preheater.raw}   ${args.preheater.temperature}`)
		})

		Services.call('startSampling', { samplingTime: 1000 }, function(status) {
			if (status == 'busy') console.log('Was sampling before')
		})

		/*
		setInterval(function() {
			Services.call('configureLocks', [ 
				{ id: 2, value: 0 } // Unlock heaters
			], logger)		
		}, 1000)
		
		Services.call('configureHeaters', [ 
			{ id: 2, value: 100 }, 
			{ id: 3, value: 110 } 
		], logger)


		Services.call('selectSensor', { id: 2 })


		Services.call('configureValves', [ 
			{ id: 0, value: 0 },
			{ id: 1, value: 1 },
			{ id: 2, value: 0 },	
			{ id: 3, value: 1 },
			{ id: 4, value: 1 } 
		], logger)

		*/
	})
})