/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const db = require("../../data/db-config");

const icindekileriGetir = async function (adim_id) {
  const icindekiler = await db("icindekiler adimlar as ia")
    .leftJoin("icindekiler as i", "ia.icindekiler_id", "i.icindekiler_id")
    .select("i.*")
    .where("ia.adim_id", adim_id);
  return icindekiler;
};

const idyeGoreGetir = async function (tarif_id) {
  const tarifler = await db("tarifler as t")
    .leftJoin("adimlar as a", "t.tarif_id", "a.tarf_id")
    .leftJoin("icindekiler_adimlar as ia", "ia.adim_id", "a.adim_id")
    .leftJoin("icindekiler as i", "ia.icindekiler_id", "i.icindekiler_id")
    .select(
      "t.*",
      "a.adim_miktari",
      "a.adim_talimati",
      "i.icindekiler_id",
      "i.icindekiler_adi",
      "miktar"
    )
    .where("t.tarif_id", tarif_id);
  if (!tarifler || tarifler.length == 0) {
    return [];
  }
  const tarifModel = {
    tarif_id: parseInt(tarif_id),
    tarif_adi: tarifler[0].tarif_adi,
    kayit_tarihi: tarifler[0].kayit_tarihi,
    adimlar: [],
  };
  for (let i = 0; i < tarifler.length; i++) {
    const currentRow = tarifler[i];
    let isExistAdim = tarifModel.adimlar.find(
      (x) => x.adim_id == currentRow.adim_id
    );
    if (!isExistAdim) {
      const adimModel = {
        adim_id: currentRow.adim_id,
        adim_sirasi: currentRow.adim_sirasi,
        adim_talimati: currentRow.adim_talimati,
        icindekiler: [],
      };
      adimModel.icindekiler = await icindekileriGetir(currentRow.adim_id);
      tarifModel.adimlar.push(adimModel);
    }
  }
  return tarifModel;
};

module.exports = { idyeGoreGetir };
