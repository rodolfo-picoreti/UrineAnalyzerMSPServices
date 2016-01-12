
Valves = new Mongo.Collection('valves')
Pumps = new Mongo.Collection('pumps')
Samples = new Mongo.Collection('samples')

let configureValve = function (id, value) {
	console.log(`configureValve ${id} : ${value}`)
	Services.call('configureValves', [{ id, value }], 
		Meteor.bindEnvironment(function (status, result) {
			if (status == 'success') {
				console.log(`configureValve ${id} : ${value} done!`)
				let selector = { id }
				let modifier = { $set: { value } }
				let options = { upsert: true }
				Valves.update(selector, modifier, options)
			}
		})
	)
}

Meteor.methods({
	configureValve
})

Meteor.startup(function () {
	if (Valves.find({}).fetch().length === 0) {
		for (let i = 0; i < 5; i++) {
			Valves.insert({ id: i, value: 0 })
		}
	}

	Services.initialize(Meteor.bindEnvironment(function() {
		
		for (let i = 0; i < 5; i++) {
			configureValve(i, 0)
		}

		Services.on('storeSample', function (args) {
			console.log(args.heater)
		})

		Services.call('startSampling', { samplingTime: 1000 })

		Services.call('configureLocks', [ 
			{ id: 0, value: 0 }, // Unlock pumps
			{ id: 1, value: 0 }  // Unlock valves
		])		

		/*
		Services.call('configureHeaters', [ 
			{ id: 3, value: 140 } 
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
	}))
})