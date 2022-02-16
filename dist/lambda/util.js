"use strict";
/**
 * Lambda util module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambra_multipart_parse = exports.map_lambda_query_params = void 0;
const lambda_multipart_parser_1 = __importDefault(require("lambda-multipart-parser"));
function map_lambda_query_params(json) {
    return parse_param(json);
}
exports.map_lambda_query_params = map_lambda_query_params;
function recursively_check_if_array(parentObj) {
    if (Object.prototype.toString.call(parentObj) != '[object Object]') {
        return parentObj;
    }
    Object.keys(parentObj).map((parentKey) => {
        const childObj = parentObj[parentKey];
        if (Object.prototype.toString.call(childObj) != '[object Object]') {
            return;
        }
        const keys = Object.keys(childObj);
        const every = keys.every((childKey) => {
            return /^(\d+)$/g.test(childKey);
        });
        if (every) {
            parentObj[parentKey] = keys.map((key) => {
                return childObj[key];
            });
        }
        recursively_check_if_array(childObj);
    });
    return parentObj;
}
function parse_param(json) {
    Object.keys(json).map((param_name) => {
        // eslint-disable-next-line no-useless-escape
        const segments = param_name.match(/([^\[\]]+)/g);
        if (!segments) {
            return;
        }
        let step = json;
        // No nested params found
        if (segments.length <= 1) {
            return;
        }
        segments.map((segment, k) => {
            if (k >= segments.length - 1) {
                step[segment] = json[param_name];
                return;
            }
            if (!step[segment]) {
                step[segment] = {};
            }
            step = step[segment];
        });
        delete json[param_name];
    });
    return recursively_check_if_array(json);
}
async function lambra_multipart_parse(event) {
    const parse_resp = await lambda_multipart_parser_1.default.parse(event);
    return parse_resp;
}
exports.lambra_multipart_parse = lambra_multipart_parse;
// type FormattedPart = {
//   filename?: string
//   type?: string
//   data?: Buffer
// }
// type Part = {
//   header: string
//   info: string
//   part: string
// }
/**
 * Multipart parser
 *
 * Must be reviewed and imporved.
 */
// export function parse_multipart(multipart_buffer:Buffer, boundary:string)
//     :FormattedPart[]{
//   const process_part = function(part:Part)
//       :FormattedPart{
//     /*
//      * It will transform this object:
//      * {
//      *   header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
//      *   info: 'Content-Type: text/plain',
//      *   part: 'AAAABBBB'
//      *  }
//      * into this one:
//      * {
//      *  filename: 'A.txt',
//      *  type: 'text/plain',
//      *  data: <Buffer 41 41 41 41 42 42 42 42>
//      * }
//      **/
//     const obj = function(str:string){
//       const k = str.split('=');
//       const a = k[0]?.trim() || '';
//       const b = JSON.parse(k[1]?.trim() || '{}');
//       const o = {};
//       Object.defineProperty(o, a, {value: b, writable: true, enumerable: true, configurable: true });
//       return o;
//     };
//     const header = part.header.split(';');
//     const file = obj(header[2]) as FormattedPart;
//     const contentType = part.info.split(':')[1]?.trim() || '';
//     Object.defineProperty(file, 'type', { value: contentType, writable: true, enumerable: true, configurable: true });
//     Object.defineProperty(file, 'data', { value: Buffer.from(part.part), writable: true, enumerable: true, configurable: true });
//     return file;
//   };
//   let lastline = '';
//   let header = '';
//   let state = 0;
//   let info = '';
//   let buffer = [];
//   const allParts = [];
//   for(let i = 0; i < multipart_buffer.length; i++){
//     const oneByte = multipart_buffer[i];
//     const prevByte = i > 0 ? multipart_buffer[i-1] : null;
//     const newLineDetected = ((oneByte == 0x0a) && (prevByte == 0x0d)) ? true : false;
//     const newLineChar = ((oneByte == 0x0a) || (oneByte == 0x0d)) ? true : false;
//     if(!newLineChar)
//       lastline += String.fromCharCode(oneByte);
//     if((0 == state) && newLineDetected){
//       if(("--"+boundary) == lastline){
//         state = 1;
//       }
//       lastline = '';
//     }else
//     if((1 == state) && newLineDetected){
//       header = lastline + ';;';
//       state = 2;
//       lastline='';
//     }else
//     if((2 == state) && newLineDetected){
//       info = lastline;
//       state = 3;
//       lastline='';
//     }else
//     if((3 == state) && newLineDetected){
//       state = 4;
//       buffer = [];
//       lastline='';
//     }else
//     if(4 == state){
//       if(lastline.length > (boundary.length+4)) lastline=''; // mem save
//       if(((("--"+boundary) == lastline))){
//         const j = buffer.length - lastline.length;
//         const part = buffer.slice(0,j-1);
//         const p = {
//           header: header,
//           info: info,
//           part: part as unknown as string
//         };
//         allParts.push(process_part(p));
//         buffer = [];
//         lastline = '';
//         state = 5;
//         header = ';;';
//         info = '';
//       }else{
//         buffer.push(oneByte);
//       }
//       if(newLineDetected){
//         lastline='';
//       }
//     }else
//     if(5 == state){
//       if(newLineDetected)
//         state = 1;
//     }
//   }
//   return allParts;
// }
//  read the boundary from the content-type header sent by the http client
//  this value may be similar to:
//  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
// exports.getBoundary = function(header){
//   const items = header.split(';');
//   if(items)
//     for(i=0;i<items.length;i++){
//       const item = (new String(items[i])).trim();
//       if(item.indexOf('boundary') >= 0){
//         const k = item.split('=');
//         return (new String(k[1])).trim();
//       }
//     }
//   return "";
// }
// exports.DemoData = function(){
//   body = "trash1\r\n"
//   body += "------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n";
//   body += "Content-Disposition: form-data; name=\"uploads[]\"; filename=\"A.txt\"\r\n";
//   body += "Content-Type: text/plain\r\n",
//   body += "\r\n\r\n";
//   body += "@11X";
//   body += "111Y\r\n";
//   body += "111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n";
//   body += "------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n";
//   body += "Content-Disposition: form-data; name=\"uploads[]\"; filename=\"B.txt\"\r\n";
//   body += "Content-Type: text/plain\r\n",
//   body += "\r\n\r\n";
//   body += "@22X";
//   body += "222Y\r\n";
//   body += "222Z\r222W\n2220\r\n666@\r\n";
//   body += "------WebKitFormBoundaryvef1fLxmoUdYZWXp--\r\n";
//   return (new Buffer(body,'utf-8')); 
//   // returns a Buffered payload, so the it will be treated as a binary content.
// };
//# sourceMappingURL=util.js.map