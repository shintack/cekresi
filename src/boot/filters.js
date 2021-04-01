import sanitizeHtml from "sanitize-html";
import numeral from "numeral";
import moment from "moment";
import { dateFormat, timestampFormat, timeFromNow } from "../lib/helper";

moment.locale("id");

numeral.register("locale", "id", {
  delimiters: {
    thousands: ".",
    decimal: ","
  },
  abbreviations: {
    thousand: "rb",
    million: "jt",
    billion: "mil",
    trillion: "t"
  },
  // ordinal: function(number) {
  //   return number === 1 ? "er" : "ème";
  // },
  currency: {
    symbol: "Rp"
  }
});

numeral.locale("id");

export default ({ Vue }) => {
  Vue.filter("sanitize", value => {
    return sanitizeHtml(value, {
      allowedAttributes: {
        "*": ["align", "center"]
      }
    });
  });

  Vue.filter("dateFormat", dateFormat);

  Vue.filter("timestampFormat", timestampFormat);

  Vue.filter("timestampFromNow", timeFromNow);

  Vue.filter("rupiahFormat", value => {
    return numeral(value).format("$ 0,0[.]00");
  });

  Vue.filter("rupiahFormatRound", value => {
    return numeral(value).format("$ 0,0[.]");
  });

  Vue.filter("numberFormatPercen", value => {
    let val = (value / 1).toFixed(2).replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "%";
  });

  Vue.filter("numberFormatFix", value => {
    let val = (value / 1).toFixed(0).replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });

  Vue.filter("humanCurrency", value => {
    return numeral(value).format("0.0a");
  });

  Vue.filter("textToList", value => {
    const payload = value || "[]";

    const result = JSON.parse(payload);

    return result || [];
  });

  // Vue.filter("timestampFormat", timestampFormat);
};
