var modelsByBrand = {
  wuling: ["Air EV", "Binguo"],
  hyundai: ["Kona", "Ioniq 5", "Ioniq 6"],
  nissan: ["Leaf"],
  dfsk: ["Gelora EBV", "Gelora EMB"],
  kia: ["EV6", "EV9"],
  neta: ["V"],
  cherry: ["Omoda"],
  citreon: ["Ec3"],
  maxus: ["Mifa 9"],
  mg: ["MG4 EV"],
  seres: ["E1"],
  renault: ["Zoe", "Megane E-Tech", "Twizy"],
  porche: ["Taycan 4", "Taycan 4S", "Taycan GTS", "Taycan Turbo S"],
  tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  lexus: ["UX300e", "RZ450e", "NX350"],
  toyota: ["BZ4X"],
  bmw: ["i4", "i7", "iX"],
  mercedes: ["EQA", "EQB", "EQE", "EQS", "EQV"],
  volvo: ["C40"]
};

var typesByModel = {
  "Air EV": ["Std Range", "Long Range"],
  Binguo: ["Std Range", "Long Range"],
  Kona: ["0", "0", "0", "0"],
  "Ioniq 5": ["Lite", "Plus", "Max", "5N"],
  "Ioniq 6": ["Std Range 2WD", "Long Range AWD", "Long Range 2WD"],
  Leaf: ["0", "E+"],
  "Gelora EBV": ["0"],
  "Gelora EMB": ["0"],
  EV6: ["Std Range 2WD", "Long Range AWD", "Long Range 2WD", "GT"],
  EV9: ["AWD", "RWD", "AWD GT-LINE"],
  V: ["0"],
  Omoda: ["0"],
  Ec3: ["0"],
  "Mifa 9": ["0"],
  "MG4 EV": ["0"],
  E1: ["Type B", "Type L"],
  Zoe: ["0"],
  "Megane E-Tech": ["0"],
  Twizy: ["0"],
  "Taycan 4": ["0"],
  "Taycan 4S": ["0"],
  "Taycan GTS": ["0"],
  "Taycan Turbo S": ["0"],
  "Model S": ["Dual Motor", "Plaid"],
  "Model 3": ["0", "Long Range Dual Motor"],
  "Model X": ["Dual Motor"],
  "Model Y": ["Performance", "0", "Long Range Dual Motor"],
  UX300e: ["0"],
  RZ450e: [""],
  NX350: ["PHEV"],
  BZ4X: ["0"],
  i4: ["0"],
  i7: ["0"],
  iX: ["0"],
  EQA: ["250"],
  EQB: ["250+"],
  EQE: ["350+"],
  EQS: ["450+"],
  EQV: ["300 LONG"],
  C40: ["Recharge single motor"]
};

var carData = {
  "wuling": {
    "Air EV": {
      "Std Range": {"Battery Capacity": 17.30, "Charge Power (AC)": 3.5, "Charge Power (DC)": "-"},
      "Long Range": {"Battery Capacity": 26.70, "Charge Power (AC)": 6.6, "Charge Power (DC)": "-"}
    },
    "Binguo": {
      "Std Range": {"Battery Capacity": 31.90, "Charge Power (AC)": 7, "Charge Power (DC)": 0},
      "Long Range": {"Battery Capacity": 37.90, "Charge Power (AC)": 7, "Charge Power (DC)": 0}
    }
  },
  "hyundai": {
    "Kona": {
      "0": {"Battery Capacity": 42.00, "Charge Power (AC)": 7.2, "Charge Power (DC)": 44},
      "0": {"Battery Capacity": 51.00, "Charge Power (AC)": 11, "Charge Power (DC)": 75},
      "0": {"Battery Capacity": 67.50, "Charge Power (AC)": 11, "Charge Power (DC)": 77},
      "0": {"Battery Capacity": 68.50, "Charge Power (AC)": 11, "Charge Power (DC)": 100}
    },
    "Ioniq 5": {
      "Lite": {"Battery Capacity": 58.00, "Charge Power (AC)": 11, "Charge Power (DC)": 350},
      "Plus": {"Battery Capacity": 58.00, "Charge Power (AC)": 11, "Charge Power (DC)": 350},
      "Max": {"Battery Capacity": 72.60, "Charge Power (AC)": 11, "Charge Power (DC)": 350},
      "5N": {"Battery Capacity": 84.00, "Charge Power (AC)": 11, "Charge Power (DC)": 240}
    },
    "Ioniq 6": {
      "Std Range 2WD": {"Battery Capacity": 58.00, "Charge Power (AC)": 11, "Charge Power (DC)": 175},
      "Long Range AWD": {"Battery Capacity": 77.40, "Charge Power (AC)": 11, "Charge Power (DC)": 233},
      "Long Range 2WD": {"Battery Capacity": 77.40, "Charge Power (AC)": 11, "Charge Power (DC)": 233}
    }
  },
  "nissan": {
    "Leaf": {
      "0": {"Battery Capacity": 40.00, "Charge Power (AC)": 3.6, "Charge Power (DC)": 46},
      "E+": {"Battery Capacity": 62.00, "Charge Power (AC)": 6.6, "Charge Power (DC)": 46}
    }
  },
  "dfsk": {
    "Gelora EBV": {
      "0": {"Battery Capacity": 42.00, "Charge Power (AC)": 14.2, "Charge Power (DC)": 0}
    },
    "Gelora EMB": {
      "0": {"Battery Capacity": 42.00, "Charge Power (AC)": 14.2, "Charge Power (DC)": 0}
    }
  },
  "kia": {
    "EV6": {
      "Std Range 2WD": {"Battery Capacity": 77.40, "Charge Power (AC)": 11, "Charge Power (DC)": 233},
      "Long Range AWD": {"Battery Capacity": 77.40, "Charge Power (AC)": 11, "Charge Power (DC)": 233},
      "Long Range 2WD": {"Battery Capacity": 58.00, "Charge Power (AC)": 11, "Charge Power (DC)": 175},
      "GT": {"Battery Capacity": 77.40, "Charge Power (AC)": 11, "Charge Power (DC)": 233}
    },
    "EV9": {
      "AWD": {"Battery Capacity": 99.80, "Charge Power (AC)": 11, "Charge Power (DC)": 210},
      "RWD": {"Battery Capacity": 99.80, "Charge Power (AC)": 11, "Charge Power (DC)": 210},
      "AWD GT-LINE": {"Battery Capacity": 99.80, "Charge Power (AC)": 11, "Charge Power (DC)": 210}
    }
  },
  "neta": {
    "V": {
      "0": {"Battery Capacity": 40.70, "Charge Power (AC)": 6.6, "Charge Power (DC)": 100}
    }
  },
  "cherry": {
    "Omoda": {
      "0": {"Battery Capacity": 61.00, "Charge Power (AC)": 0, "Charge Power (DC)": 110}
    }
  },
  "citreon": {
    "Ec3": {
      "0": {"Battery Capacity": 29.20, "Charge Power (AC)": 3.3, "Charge Power (DC)": 0}
    }
  },
  "maxus": {
    "Mifa 9": {
      "0": {"Battery Capacity": 90.00, "Charge Power (AC)": 11, "Charge Power (DC)": 120}
    }
  },
  "mg": {
    "MG4 EV": {
      "0": {"Battery Capacity": 64.00, "Charge Power (AC)": 6.6, "Charge Power (DC)": 140}
    }
  },
  "seres": {
    "E1": {
      "Type B": {"Battery Capacity": 13.80, "Charge Power (AC)": 3.3, "Charge Power (DC)": 0},
      "Type L": {"Battery Capacity": 16.80, "Charge Power (AC)": 3.3, "Charge Power (DC)": 0}
    }
  },
  "renault": {
    "Zoe": {
      "0": {"Battery Capacity": 52.00, "Charge Power (AC)": 22, "Charge Power (DC)": 46}
    },
    "Megane E-Tech": {
      "0": {"Battery Capacity": 63.00, "Charge Power (AC)": 22, "Charge Power (DC)": 129}
    },
    "Twizy": {
      "0": {"Battery Capacity": 6.10, "Charge Power (AC)": 3.7, "Charge Power (DC)": 0}
    }
  },
  "porche": {
    "Taycan 4": {
      "0": {"Battery Capacity": 79.20, "Charge Power (AC)": 11, "Charge Power (DC)": 268}
    },
    "Taycan 4S": {
      "0": {"Battery Capacity": 79.20, "Charge Power (AC)": 11, "Charge Power (DC)": 223}
    },
    "Taycan GTS": {
      "0": {"Battery Capacity": 83.70, "Charge Power (AC)": 11, "Charge Power (DC)": 268}
    },
    "Taycan Turbo S": {
      "0": {"Battery Capacity": 83.70, "Charge Power (AC)": 11, "Charge Power (DC)": 268}
    }
  },
  "tesla": {
    "Model S": {
      "Dual Motor": {"Battery Capacity": 100.00, "Charge Power (AC)": 11, "Charge Power (DC)": 250},
      "Plaid": {"Battery Capacity": 100.00, "Charge Power (AC)": 11, "Charge Power (DC)": 250}
    },
    "Model 3": {
      "0": {"Battery Capacity": 60.00, "Charge Power (AC)": 11, "Charge Power (DC)": 250},
      "Long Range Dual Motor": {"Battery Capacity": 78.10, "Charge Power (AC)": 11, "Charge Power (DC)": 250}
    },
    "Model X": {
      "Dual Motor": {"Battery Capacity": 100.00, "Charge Power (AC)": 11, "Charge Power (DC)": 250}
    },
    "Model Y": {
      "Performance": {"Battery Capacity": 78.10, "Charge Power (AC)": 11, "Charge Power (DC)": 250},
      "0": {"Battery Capacity": 60.00, "Charge Power (AC)": 11, "Charge Power (DC)": 175},
      "Long Range Dual Motor": {"Battery Capacity": 78.10, "Charge Power (AC)": 11, "Charge Power (DC)": 250}
    }
  },
  "lexus": {
    "UX300e": {
      "0": {"Battery Capacity": 72.80, "Charge Power (AC)": 6.6, "Charge Power (DC)": 50}
    },
    "RZ450e": {
      "": {"Battery Capacity": 71.40, "Charge Power (AC)": 6.6, "Charge Power (DC)": 147}
    },
    "NX350": {
      "PHEV": {"Battery Capacity": 18.10, "Charge Power (AC)": 6.6, "Charge Power (DC)": 0}
    }
  },
  "toyota": {
    "BZ4X": {
      "0": {"Battery Capacity": 71.40, "Charge Power (AC)": 6.6, "Charge Power (DC)": 147}
    }
  },
  "bmw": {
    "i4": {
      "0": {"Battery Capacity": 83.90, "Charge Power (AC)": 11, "Charge Power (DC)": 207}
    },
    "i7": {
      "0": {"Battery Capacity": 105.70, "Charge Power (AC)": 11, "Charge Power (DC)": 200}
    },
    "iX": {
      "0": {"Battery Capacity": 76.60, "Charge Power (AC)": 11, "Charge Power (DC)": 148}
    }
  },
  "mercedes": {
    "EQA": {
      "250": {"Battery Capacity": 69.70, "Charge Power (AC)": 11, "Charge Power (DC)": 112}
    },
    "EQB": {
      "250+": {"Battery Capacity": 73.90, "Charge Power (AC)": 11, "Charge Power (DC)": 112}
    },
    "EQE": {
      "350+": {"Battery Capacity": 100.00, "Charge Power (AC)": 11, "Charge Power (DC)": 173}
    },
    "EQS": {
      "450+": {"Battery Capacity": 120.00, "Charge Power (AC)": 11, "Charge Power (DC)": 207}
    },
    "EQV": {
      "300 LONG": {"Battery Capacity": 100.00, "Charge Power (AC)": 11, "Charge Power (DC)": 110}
    }
  },
  "volvo": {
    "C40": {
      "Recharge single motor": {"Battery Capacity": 69.00, "Charge Power (AC)": 11, "Charge Power (DC)": 135}
    }
  }
};

function changeModel(vehicleBrand) {
  var modelSelect = document.getElementById("model");
  modelSelect.length = 1; // Remove all options except the first one
  if (vehicleBrand === "") return;

  var models = modelsByBrand[vehicleBrand];
  for (var i = 0; i < models.length; i++) {
    modelSelect.options[modelSelect.options.length] = new Option(models[i], models[i]);
  }

  // Reset type dropdown and clear input fields
  var typeSelect = document.getElementById("type");
  typeSelect.length = 1;
  document.getElementById("batteryCapacity").value = "";
  document.getElementById("acChargePower").value = "";
  document.getElementById("dcChargePower").value = "";
}

function changeType(model) {
  var typeSelect = document.getElementById("type");
  typeSelect.length = 1; // Remove all options except the first one
  if (model === "") return;

  var types = typesByModel[model];
  for (var i = 0; i < types.length; i++) {
    typeSelect.options[typeSelect.options.length] = new Option(types[i], types[i]);
  }

  // Clear input fields
  document.getElementById("batteryCapacity").value = "";
  document.getElementById("acChargePower").value = "";
  document.getElementById("dcChargePower").value = "";
}

function populateFields() {
  // Get the selected brand, model, and type
  var brandSelect = document.getElementById("brand");
  var brand = brandSelect.options[brandSelect.selectedIndex].value.toLowerCase();

  var modelSelect = document.getElementById("model");
  var model = modelSelect.options[modelSelect.selectedIndex].value;

  var typeSelect = document.getElementById("type");
  var type = typeSelect.options[typeSelect.selectedIndex].value;

  // Get the data for the selected brand, model, and type
  var data = carData[brand]?.[model]?.[type];

  // Populate the input boxes
  if (data) {
    document.getElementById("batteryCapacity").value = data["Battery Capacity"] || "";
    document.getElementById("acChargePower").value = data["Charge Power (AC)"] || "";
    document.getElementById("dcChargePower").value = data["Charge Power (DC)"] || "";
  } else {
    // Clear the input boxes if data is undefined
    document.getElementById("batteryCapacity").value = "";
    document.getElementById("acChargePower").value = "";
    document.getElementById("dcChargePower").value = "";
  }
}

document.getElementById('calculateBtn').addEventListener('click', function () {
  // Get input values
  const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value);
  const percentageToCharge = parseFloat(document.getElementById('percentageToCharge').value);
  const chargePowerAC = parseFloat(document.getElementById('acChargePower').value);
  const chargePowerDC = parseFloat(document.getElementById('dcChargePower').value);

  // Get Charger Maximal Output values
  const nexusMaxOutput = parseFloat(document.getElementById('nexus-ChargerMaximalOutput').value);
  const nexusProMaxOutput = parseFloat(document.getElementById('nexusPro-ChargerMaximalOutput').value);
  const nexusBizMaxOutput = parseFloat(document.getElementById('nexusBiz-ChargerMaximalOutput').value);
  const stellar30MaxOutput = parseFloat(document.getElementById('stellar30-ChargerMaximalOutput').value);
  const stellar40MaxOutput = parseFloat(document.getElementById('stellar40-ChargerMaximalOutput').value);
  const hyper80MaxOutput = parseFloat(document.getElementById('hyper80-ChargerMaximalOutput').value);
  const hyper100MaxOutput = parseFloat(document.getElementById('hyper100-ChargerMaximalOutput').value);
  const hyper140MaxOutput = parseFloat(document.getElementById('hyper140-ChargerMaximalOutput').value);
  const hyper180MaxOutput = parseFloat(document.getElementById('hyper180-ChargerMaximalOutput').value);

  // Calculate Hour To Full AC and DC
  const nexusHourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerAC, nexusMaxOutput);
  const nexusProHourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerAC, nexusProMaxOutput);
  const nexusBizHourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerAC, nexusBizMaxOutput);
  const stellar30HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, stellar30MaxOutput);
  const stellar40HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, stellar40MaxOutput);
  const hyper80HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper80MaxOutput);
  const hyper100HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper100MaxOutput);
  const hyper140HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper140MaxOutput);
  const hyper180HourToFullAC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper180MaxOutput);

  // Update Hour To Full AC inputs
  updateInputValue('nexus-HourToFull', formatTime(nexusHourToFullAC));
  updateInputValue('nexusPro-HourToFull', formatTime(nexusProHourToFullAC));
  updateInputValue('nexusBiz-HourToFull', formatTime(nexusBizHourToFullAC));
  updateInputValue('stellar30-HourToFull', formatTime(stellar30HourToFullAC));
  updateInputValue('stellar40-HourToFull', formatTime(stellar40HourToFullAC));
  updateInputValue('hyper80-HourToFull', formatTime(hyper80HourToFullAC));
  updateInputValue('hyper100-HourToFull', formatTime(hyper100HourToFullAC));
  updateInputValue('hyper140-HourToFull', formatTime(hyper140HourToFullAC));
  updateInputValue('hyper180-HourToFull', formatTime(hyper180HourToFullAC));

  // Calculate Hour To Full for DC
  const nexusHourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, nexusMaxOutput);
  const nexusProHourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, nexusProMaxOutput);
  const nexusBizHourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, nexusBizMaxOutput);
  const stellar30HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, stellar30MaxOutput);
  const stellar40HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, stellar40MaxOutput);
  const hyper80HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper80MaxOutput);
  const hyper100HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper100MaxOutput);
  const hyper140HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper140MaxOutput);
  const hyper180HourToFullDC = calculateHourToFull(batteryCapacity, percentageToCharge, chargePowerDC, hyper180MaxOutput);

  // Update Hour To Full for DC inputs
  updateInputValue('nexus-HourToFull-DC', formatTime(nexusHourToFullDC));
  updateInputValue('nexusPro-HourToFull-DC', formatTime(nexusProHourToFullDC));
  updateInputValue('nexusBiz-HourToFull-DC', formatTime(nexusBizHourToFullDC));
  updateInputValue('stellar30-HourToFull-DC', formatTime(stellar30HourToFullDC));
  updateInputValue('stellar40-HourToFull-DC', formatTime(stellar40HourToFullDC));
  updateInputValue('hyper80-HourToFull-DC', formatTime(hyper80HourToFullDC));
  updateInputValue('hyper100-HourToFull-DC', formatTime(hyper100HourToFullDC));
  updateInputValue('hyper140-HourToFull-DC', formatTime(hyper140HourToFullDC));
  updateInputValue('hyper180-HourToFull-DC', formatTime(hyper180HourToFullDC));
    
 // Calculate Estimated Price
 const nexusEstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, nexusMaxOutput);
 const nexusProEstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, nexusProMaxOutput);
 const nexusBizEstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, nexusBizMaxOutput);
 const stellar30EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, stellar30MaxOutput);
 const stellar40EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, stellar40MaxOutput);
 const hyper80EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, hyper80MaxOutput);
 const hyper100EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, hyper100MaxOutput);
 const hyper140EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, hyper140MaxOutput);
 const hyper180EstimatedPrice = calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, hyper180MaxOutput);

 // Update Estimated Price inputs
 updateInputValue('nexus-EstimatedPrice', nexusEstimatedPrice);
 updateInputValue('nexusPro-EstimatedPrice', nexusProEstimatedPrice);
 updateInputValue('nexusBiz-EstimatedPrice', nexusBizEstimatedPrice);
 updateInputValue('stellar30-EstimatedPrice', stellar30EstimatedPrice);
 updateInputValue('stellar40-EstimatedPrice', stellar40EstimatedPrice);
 updateInputValue('hyper80-EstimatedPrice', hyper80EstimatedPrice);
 updateInputValue('hyper100-EstimatedPrice', hyper100EstimatedPrice);
 updateInputValue('hyper140-EstimatedPrice', hyper140EstimatedPrice);
 updateInputValue('hyper180-EstimatedPrice', hyper180EstimatedPrice);
});

function calculateEstimatedPrice(batteryCapacity, percentageToCharge, chargePowerDC, maxOutput) {
 const chargingPower = Math.min(chargePowerDC, maxOutput);
 const serviceFee = getChargingServiceFee(chargingPower);

 const basePrice = batteryCapacity * 2466.78;
 const serviceFeeComponent = 5000 + serviceFee + (0.015 * basePrice);
 const estimatedPrice = basePrice + serviceFeeComponent + 0.11 * serviceFeeComponent;

 return estimatedPrice.toFixed(2);
}

function getChargingServiceFee(chargingPower) {
 if (chargingPower > 50) {
   return 57000; // Ultrafast Charging (>50 kW)
 } else if (chargingPower > 22) {
   return 25000; // Fast Charging (>22 - 50 kW)
 } else {
   return 0; // No service fee for lower charging powers
 }
}
function updateInputValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function calculateHourToFull(batteryCapacity, percentageToCharge, chargePower, maxOutput) {
  if (chargePower === 0 || isNaN(chargePower) || chargePower < 0) {
      return 0;
  } else {
      return parseFloat((batteryCapacity * (percentageToCharge/100) / Math.min(chargePower, maxOutput)).toFixed(2));
  }
}

function formatTime(hours) {
  const hh = Math.floor(hours).toString().padStart(2, '0');
  const mm = Math.floor((hours % 1) * 60).toString().padStart(2, '0');
  const ss = Math.floor((((hours % 1) * 60) % 1) * 60).toString().padStart(2, '0');

  // Display "00:00:00" if all values are zero
  if (hh === '00' && mm === '00' && ss === '00') {
    return '00:00:00';
  }

  return `${hh}:${mm}:${ss}`;
}

