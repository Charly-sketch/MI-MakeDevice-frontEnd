import { ADC1_IN, GPIO } from "./Constants";
import { SERVICE_INITIALISORS } from "./ServiceInitialisors";
import { STM23_PinMap } from "./STM32_PinTypes";

let setup = {
  "device.c": `#include "jdprofile.h"\n`,

  "board.h": `#define PIN_LED NO_PIN
#define PIN_LED_GND -1

#define PIN_PWR NO_PIN
#define PIN_P0 NO_PIN
#define PIN_P1 NO_PIN

#define UART_PIN PB_6
#define UART_PIN_AF LL_GPIO_AF_0  // set alternate function AF0 for USART1_TX
#define USART_IDX 1

#define PIN_LED_R PB_0
#define PIN_LED_G PA_7
#define PIN_LED_B PA_6

// these values calibrate to ~60lux for each of ff0000, 00ff00, 0000ff
// taken from accelerometer module (34), which is designed for the HSMF-C114 RGB LED
// with 150 ohm (red), 30 ohm (green), 30 ohm (blue) resistors.
#define LED_R_MULT 250
#define LED_G_MULT 150
#define LED_B_MULT 42
#define RGB_LED_PERIOD 600

#define PIN_BL_LED PIN_LED_B
#define PIN_BL_PERIOD 300`,
};

const formatPinAllocationTable = (requiredServices) => {
  console.log("pinoutsizew");
  console.log(STM23_PinMap.pinout);
  const pinout = STM23_PinMap.pinout;
  let pinAllocationTable: {
    pin: string;
    pinPosition: number;
    service: { name: string; serviceInstance?: string };
  }[] = [];

  // push power
  pinAllocationTable.push({
    pin: "VBAT",
    pinPosition: 4,
    service: { name: "Power" },
  });

  // push power
  pinAllocationTable.push({
    pin: "VSS/VSSA",
    pinPosition: 5,
    service: { name: "Ground" },
  });

  // push jacdac data
  pinAllocationTable.push({
    pin: "PB3",
    pinPosition: 20,
    service: { name: "JD_DATA_MCU" },
  });

  // push jacdac status
  pinAllocationTable.push({
    pin: "PC14-OSC32_IN (PC14)",
    pinPosition: 2,
    service: { name: "JD_STATUS" },
  });

  // RGB
  // R
  pinAllocationTable.push({
    pin: "PA8",
    pinPosition: 15,
    service: { name: "RGB_R" },
  });
  pinAllocationTable.push({
    pin: "PA7",
    pinPosition: 14,
    service: { name: "RGB_G" },
  });
  pinAllocationTable.push({
    pin: "PB7",
    pinPosition: 1,
    service: { name: "RGB_B" },
  });
  let candidatePins: any[] = [];
  requiredServices.forEach((service) => {
    console.log("service", service);

    console.log("SERVICE_INITIALISORS", SERVICE_INITIALISORS);

    const args =
      SERVICE_INITIALISORS[`${service.name.toLowerCase().replace(/\s/g, "_")}`]
        .args;

    args.forEach((arg) => {
      arg.forEach((cse) => {
        switch (cse) {
          case GPIO:
            candidatePins.push(findPin(GPIO, pinout, pinAllocationTable));
          case ADC1_IN:
            candidatePins.push(findPin(ADC1_IN, pinout, pinAllocationTable));
        }

        pinAllocationTable.concat(candidatePins);
        candidatePins = [];
      });
    });

    //console.log("candi pins: ", candidatePins);
  });
  pinAllocationTable.concat(candidatePins);
  console.log("final PAT: ", pinAllocationTable);
};

const findPin = (PinType: string, pinout, pinAllocationTable: any) => {
  for (let p = 0; p < pinout.length; p++) {
    const pin = pinout[p];
    const pinNumber: number = Number(pin.position);
    let pinClash = false;
    for (let s = 0; s < pin.signals.length; s++) {
      const pinSignal = pin.signals[s];

      if (pinSignal === PinType || pinSignal.includes(PinType)) {
        console.log("found cnadidate pin");
        console.log(pin);

        // found candidate pin, check if already allocated.

        for (let pe = 0; pe < pinAllocationTable.length; pe++) {
          const pinEntry = pinAllocationTable[pe];

          if (Number(pinEntry.pinPosition) === pinNumber) {
            console.log("clash", pinEntry);
            console.log(pin);

            pinClash = true;
          }
        }

        if (pinClash) {
          console.log("breaking withi clash");
          //break;
        } else {
          console.log("no clash!!");
          return {
            pin: pin.name,
            pinPosition: Number(pin.position),
            service: PinType,
          };
        }
      }
    }
  }
};

export const generateFirmware = (
  deviceName,
  requiredServices,
  STM23_PinMap,
) => {
  formatPinAllocationTable(requiredServices);

  let output = setup;

  const idenfifier = `\nFIRMWARE_IDENTIFIER(0x${333333}, "${deviceName}")\n\n`;
  output["device.c"] += idenfifier;

  const initServicesPrefix = `void app_init_services() {\n`;
  output["device.c"] += initServicesPrefix;

  requiredServices.forEach((service) => {
    output["device.c"] += `    ${service.name
      .toLowerCase()
      .replace(/\s/g, "")}_init();\n`;
  });

  output["device.c"] += `}\n`;

  // format for html
  output["device.c"] = output["device.c"].replace(/\n/g, "<br />");
  output["board.h"] = output["board.h"].replace(/\n/g, "<br />");

  return output;
};
