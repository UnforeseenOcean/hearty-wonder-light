import Shield from "./shield.js"

/**
* A relatively modest, low current first demo on an 8 second loop.
*/
export async function main( current= 200){
	var shield = new Shield()
	shield.begin()
	shield.setCurrent( current, current, current)
	shield.setFreq( 600)
	//shield.eepromWrite()
	await delay( 100)

	while( true){
		console.log( "dim")
		shield.goToRGB( 1/5, 0, 0)
		await delay( 3000)
		console.log( "mid")
		shield.goToRGB( 3/5, 0, 0)
		await delay( 1000)
		console.log( "dim")
		shield.goToRGB( 1/5, 0, 0)
		await.delay( 3000)
		console.log( "low")
		shield.goToRGB( 1/9, 0, 0)
		await delay( 1000)
	}	
}

const current = Number.parseInt( process.env["SHIELD_CURRENT"]|| 200)
main( current);
