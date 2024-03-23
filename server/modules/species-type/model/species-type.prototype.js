// const { TolfaSpecies } = require("./species-type.model");

// // Method to update
// TolfaSpecies.prototype.updateTolfaSpecies = async function (id, newData) {
//   try {
//     const tolfaSpecies = await TolfaSpecies.findByPk(id);
//     if (!tolfaSpecies) {
//       throw new Error("Tolfa species not found");
//     }

//     // Iterate over the keys of newData and update fields accordingly
//     Object.keys(newData).forEach((key) => {
//       if (tolfaSpecies[key] !== undefined) {
//         tolfaSpecies[key] = newData[key];
//       }
//     });

//     await tolfaSpecies.save();

//     return tolfaSpecies;
//   } catch (error) {
//     throw error;
//   }
// };
