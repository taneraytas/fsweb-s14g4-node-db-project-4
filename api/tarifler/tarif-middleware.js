const tarifModel = require("./tarif-model");

const checkTarifId = async function (req, res, next) {
  try {
    const isExist = await tarifModel.idyeGoreGetir(req.params.id);
    if (!isExist.length===0) {
        res.status(404).message({})
    }
  } catch (error) {
    next(error);
  }
};
