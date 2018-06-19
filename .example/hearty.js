import { promisify} from "util"
import HeartyPatch from "../heartypatch"
import log from "../util/log"

process.on( "unhandledRejection", console.error)

export async function main( file= process.env.HEARTY_INPUT_FILE|| process.argv[ 2]|| "hearty.data"){
	const hearty= HeartyPatch()
	hearty.connect()
	for await( const packet of hearty){
		log(()=> packet)
	}
}
export default main

if( typeof require!== "unknown"&& typeof module!== "unknown"&& require.main=== module){
	main()
}
