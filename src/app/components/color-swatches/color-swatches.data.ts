export interface ColorPalette {
  name: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Material',
    colors: [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
      '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B',
      '#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9',
      '#80DEEA', '#80CBC4', '#A5D6A7', '#FFE082', '#FFAB91', '#BCAAA4',
    ],
  },
  {
    name: 'Pastel',
    colors: [
      '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4',
      '#FEC8D8', '#D4F0F0', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA',
      '#F3C4FB', '#F1E0B0', '#C9E4DE', '#FAD2E1', '#DBE7E4', '#FCF6BD',
      '#D0F4DE', '#A9DEF9', '#E4C1F9', '#FFC6FF', '#BDB2FF', '#A0C4FF',
      '#9BF6FF', '#CAFFBF', '#FDFFB6', '#FFD6A5', '#FFADAD', '#D7E3FC',
    ],
  },
  {
    name: 'Vibrant',
    colors: [
      '#FF0000', '#FF4D00', '#FF9900', '#FFE600', '#CCFF00', '#66FF00',
      '#00FF00', '#00FF99', '#00FFE6', '#00CCFF', '#0066FF', '#0000FF',
      '#6600FF', '#CC00FF', '#FF00E6', '#FF0099', '#FF0044', '#FF1744',
      '#F50057', '#D500F9', '#651FFF', '#2979FF', '#00B0FF', '#00E5FF',
      '#1DE9B6', '#00E676', '#76FF03', '#C6FF00', '#FFEA00', '#FF9100',
    ],
  },
  {
    name: 'Earth & Neutrals',
    colors: [
      '#5D4037', '#795548', '#8D6E63', '#A1887F', '#6D4C41', '#4E342E',
      '#827717', '#9E9D24', '#AFB42B', '#7CB342', '#558B2F', '#33691E',
      '#BF360C', '#D84315', '#E65100', '#EF6C00', '#F57F17', '#FF8F00',
      '#000000', '#212121', '#424242', '#616161', '#757575', '#9E9E9E',
      '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA', '#FFFFFF',
    ],
  },
];
