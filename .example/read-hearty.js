import { readFile as ReadFile} from "fs"
import { promisify} from "util"
import HeartyPatch from "../heartypatch"

const readFile= promisify( ReadFile)

export async function main( file= process.env.HEARTY_INPUT_FILE|| process.argv[ 2]|| "hearty.data"){
	console.log({file})
	const
	  buffer= await readFile( file),
	  packet= HeartyPatch.parsePacket( buffer)
	console.log( JSON.stringify(packet))
	console.log( buffer.length)
	return packet
}
export default main

if( typeof require!== "unknown"&& typeof module!== "unknown"&& require.main=== module){
	main()
}
