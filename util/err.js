export function err(msg, o){
	const err= new Error( msg)
	Object.assign( err, o)
	return err
}
export default err
