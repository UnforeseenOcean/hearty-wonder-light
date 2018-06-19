import { readFile as ReadFile} from "fs"
import { promisify} from "util"
import HeartyPatch from "../heartypatch"

const readFile= promisify( ReadFile)

process.on( "unhandledRejection", console.error)

export async function main( file= process.env.HEARTY_INPUT_FILE|| process.argv[ 2]|| "hearty.data"){
	console.log({file})
	const
	  buffer= await readFile( file),
	  {pos, packets}= HeartyPatch.parsePackets( buffer)
	console.log( JSON.stringify(packets))
	console.log( pos, buffer.length)
	return packets
}
export default main

if( typeof require!== "unknown"&& typeof module!== "unknown"&& require.main=== module){
	main()
}
