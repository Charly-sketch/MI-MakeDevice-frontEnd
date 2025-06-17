export const SERVICE_INITIALISORS = {
  potentiometer: {
    args: [["NO_PIN"], ["ADC1_IN"], ["GPIO"]],
  },

  button: {
    args: [["ADC1_IN"], ["1"], ["-1"]],
  },

  rotary_encoder: {
    args: [["GPIO", "ADC1_IN"], ["GPIO", "ADC1_IN"], ["20"], ["0"]],
  },
};
