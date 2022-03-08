/**
 * Api dev module
 *
 * @packageDocumentation
 */

import uranio from './server';
uranio.init();

const service = uranio.service.create();
service.listen(async () => {
	// const error_bll = uranio.core.bll.basic.create(`error`);
	// console.log(error_bll);
	// const res = await error_bll.find({});
	// console.log(res);
});
// const error_bll = uranio.core.bll.basic.create(`error`);
// console.log(error_bll);
// error_bll.find({}).then((res) => {
//   console.log(res);
// }).catch(err => console.error(err));
