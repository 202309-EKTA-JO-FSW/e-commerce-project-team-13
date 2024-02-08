// // const bcrypt = require('bcrypt');
// // const { model } = require('mongoose');

// // const hashData = async(data , saltRounds = 10)=>{
// //     try{
// //         const hashdData = await bcrypt.hash(data , saltRounds);
// //         return hashdData ; 
// //     }
// //     catch(error){
// //         throw error;
// //     };
// // }

// // module.exports ={hashData};

// // const { createHash } = require('crypto');

// const hashData = (data) => {
//     const hash = createHash('sha256'); // You can choose other hashing algorithms such as 'sha512' as well
//     hash.update(data);
//     return hash.digest('hex');
// // }

// module.exports = { hashData };