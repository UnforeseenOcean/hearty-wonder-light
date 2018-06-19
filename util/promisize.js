import { promisify} from "util"

export function promisize( fns, o){
	for( const fn of fns){
		// indeed promisified methods still pass through `this`:
		// https://mobile.twitter.com/rektide/status/1008862753535164416
		obj[ fn]= promisify( obj[ fn])
	}
}
export default promisize

