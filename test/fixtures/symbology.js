import MapSymbology from './../../src/Leaflet.TOC.MapSymbology';
import MapSymbol from './../../src/Leaflet.TOC.MapSymbol';

export const height = 20;
export const width = 20;

export const contentType = 'image/png';

export const label = [
  'Symbol 1',
  'Symbol 2',
  'Symbol 3',
  'Symbol 4'
];
export const imageData = [
  'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mP8z/C/noGKgHHUwFEDRw0cNXDUwJFqIAAwuzHZ9CUUhAAAAABJRU5ErkJggg==',
  'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAF0lEQVR42mP8X89AFGAcVTiqcFQhCAAAL7wd7UcuV3gAAAAASUVORK5CYII=',
  'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNk+M9Qz0BFwDhq4KiBowaOGjhq4Eg1EAAlJx3tIbLVagAAAABJRU5ErkJggg==',
  'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNkYPhfz0BFwDhq4KiBowaOGjhq4Eg1EAAROx3tVhgyzAAAAABJRU5ErkJggg=='

];
export const relativeURL = [
  'a',
  'b',
  'c',
  'd'
];

export const symbol0 = new MapSymbol({
  label: label[0],
  height,
  width,
  contentType,
  imageData: imageData[0],
  relativeURL: relativeURL[0]
});
export const symbol1 = new MapSymbol({
  label: label[1],
  height,
  width,
  contentType,
  imageData: imageData[1],
  relativeURL: relativeURL[1]
});
export const symbol2 = new MapSymbol({
  label: label[2],
  height,
  width,
  contentType,
  imageData: imageData[2],
  relativeURL: relativeURL[2]
});
export const symbol3 = new MapSymbol({
  label: label[3],
  height,
  width,
  contentType,
  imageData: imageData[3],
  relativeURL: relativeURL[3]
});

export const symbols = [symbol0, symbol1, symbol2, symbol3];

const symbology = new MapSymbology(symbols);
export default symbology;