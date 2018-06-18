import shield from "."

/**
* A relatively modest, low current first demo on an 8 second loop.
* 
*/
async function main(){
	shield.begin()
	shield.setCurrent( 200, 200, 200)
	shield.setFreq( 600)
	//shield.eepromWrite()
	await delay( 100)

	while( true){
		console.log( "low")
		shield.goToRGB( 50, 0, 0)
		await delay( 3000)
		console.log( "high")
		shield.goToRGB( 150, 0, 0)
		await delay( 1000)
		shield.goToRGB( 50, 0, 0)
		await.delay( 3000)
		shield.goToRGB( 150, 0, 0)
		await delay( 1000)
	}	
}

const current = Number.parseInt( process.env["SHIELD_CURRENT"]|| 200)
main( current);
