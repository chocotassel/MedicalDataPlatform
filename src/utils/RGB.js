/**
 * RGB类
 * @param {number} r - 红色值
 * @param {number} g - 绿色值
 * @param {number} b - 蓝色值
 * @constructor
 * @example
 * let rgb = new RGB(255, 255, 255);
 * let hex = rgb.toHex();
 * let rgb2 = rgb.toRGB();
 * let rgb3 = RGB.createWithHex('#ffffff');
 * let rgb4 = RGB.hsv2rgb(0, 0, 0);
 * let rgb5 = RGB.mapIntegerToColor(0, 'rainbow');
 *  */ 

export class RGB {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  
  static createWithHex(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return new RGB(r, g, b);
  }
  toHex() {
    let r = this.r.toString(16);
    let g = this.g.toString(16);
    let b = this.b.toString(16);
    if (r.length < 2) {
      r = '0' + r;
    }
    if (g.length < 2) {
      g = '0' + g;
    }
    if (b.length < 2) {
      b = '0' + b;
    }
    return '#' + r + g + b;
  }

  toRGB() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }  
  
  
  // 将HSV转换为RGB
  static hsv2rgb(h, s, v) {
    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;
    let r_, g_, b_;

    if (h < 60) {
      r_ = c;
      g_ = x;
      b_ = 0;
    } else if (h < 120) {
      r_ = x;
      g_ = c;
      b_ = 0;
    } else if (h < 180) {
      r_ = 0;
      g_ = c;
      b_ = x;
    } else if (h < 240) {
      r_ = 0;
      g_ = x;
      b_ = c;
    } else if (h < 300) {
      r_ = x;
      g_ = 0;
      b_ = c;
    } else {
      r_ = c;
      g_ = 0;
      b_ = x;
    }

    let r = Math.round((r_ + m) * 255);
    let g = Math.round((g_ + m) * 255);
    let b = Math.round((b_ + m) * 255);

    return new RGB(r, g, b);
  }
  
  // 将16映射到RGB
  static mapIntegerToColor(i, colorSeries) {
    i = Math.round(i % 16);
    if (i === 0) {
      return { r: 0, g: 0, b: 0 };
    }
    
    let series = {
      'rainbow': [0, 360],
      'cool': [180, 300],
      'warm': [0, 60, 300, 360],
      'spring': [330, 120],
      'summer': [60, 180],
      'autumn': [15, 45, 75, 105, 135, 165],
      'winter': [195, 225, 255, 285, 315, 345]
    };

    if (colorSeries === 'gray') {
      return RGB.mapIntegerToGray(i);
    }
    else if (!(colorSeries in series)) {
      colorSeries = 'rainbow';
    }

    let hues = series[colorSeries];
    let hue;
    if (hues.length == 2) {
      let range = hues[1] - hues[0];
      hue = ((i * (range / 15)) + hues[0]) % 360;
    } else {
      hue = hues[i % hues.length];
    }

    let saturation = 0.5;
    let value = 0.8;

    let rgb = RGB.hsv2rgb(hue, saturation, value);
    return rgb;
  }

  // 将16映射到灰度
  static mapIntegerToGray(i) {
    i = Math.round(i % 16);
    if (i === 0) {
      return { r: 0, g: 0, b: 0 };
    }
    let gray = i * 16;
    return { r: gray, g: gray, b: gray };
  }
}