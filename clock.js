/**
 * Class which represent digital clock, displayed as a circles.
 * Author: Lukáš Ratkovský
 */
class Clock {

  /**
   * Create new clock.
   * 
   * @param {canvas} canvas html canvas
   * @param {color} color html color for example (gray, blue, '#3385ff', ....)
   */
  constructor(canvas, color) {
    this.height = canvas.scrollHeight;
    this.width = canvas.scrollWidth;
    this.ctx = canvas.getContext('2d');
    this.ctx.textAlign = "center";
    this.clock = { xh: 0, xm: 0, xs: 0, yhms: 0, r: 0, fs4: 0, space: 0 };
    this.interval = null;
    this.color = color;
  }

  /**
   * Method which calc clock size to fit to canvas.
   */
  calcClockSize() {
    var rh = this.height / 3;
    var rw = Clock.per80() * this.width / 6;
    this.clock.r = Math.floor(Math.min(rh, rw));
    this.clock.space = this.clock.r / 3;
    var fonSize = Clock.per80() * (this.clock.r - this.clock.space);
    var coil = this.clock.r / 32;
    var wCenter = this.width / 2;
    var d = 2 * this.clock.r;

    this.clock.xh = wCenter - d - this.clock.space - coil;
    this.clock.xm = wCenter;
    this.clock.xs = wCenter + d + this.clock.space + coil;
    this.clock.yhms = this.height / 2;
    this.clock.dy = this.clock.yhms + this.clock.r + coil + Clock.per66() * this.clock.fs;
    this.clock.fs4 = fonSize / 3.5;

    this.ctx.lineWidth = coil;
    this.ctx.font = fonSize + "px Monospace";
  }

  /**
   * Method which define and draw one clock segment.
   * 
   * @param {number} x x position on 2D canvas
   * @param {number} y y position on 2D canvas
   * @param {number} r circle radius
   * @param {number} space
   * @param {number} part
   */
  drawClockCircle(x, y, r, space, part) {
    const PId90 = 1.57;
    const PId270 = 4.7099;
    const PIm2 = 6.28;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, PId270, (part) - PId90);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(x, y, r - space / 2, PId270, (part) - PId90);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(x, y, r - space / 4, PId270, (part) - PId90);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(x, y, r - space, 0, PIm2);
    this.ctx.fill();
  }

  /**
   *  Method which draw whole clock.
   */
  drawClock(dateTime) {
    const now = dateTime;
    const PId30 = 0.5233;
    const PId6 = 0.1046;
    const PId = 0.0174;

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    // Circles Time
    this.drawClockCircle(this.clock.xh, this.clock.yhms, this.clock.r, this.clock.space, 
      ((now.h + now.m / 60) * PId30));
    this.drawClockCircle(this.clock.xm, this.clock.yhms, this.clock.r, this.clock.space, 
      ((now.m + now.s / 60) * PId6));
    this.drawClockCircle(this.clock.xs, this.clock.yhms, this.clock.r, this.clock.space, 
      (PId * (now.s) * 6));
    // Text
    this.ctx.font = this.clock.fs + "px Monospace";
    this.ctx.fillStyle = "white"
    this.ctx.fillText(now.h, this.clock.xh, this.clock.yhms + this.clock.fs4);
    this.ctx.fillText(now.m, this.clock.xm, this.clock.yhms + this.clock.fs4);
    this.ctx.fillText(now.s, this.clock.xs, this.clock.yhms + this.clock.fs4);
  }

  /**
   * Method which clear whole canvas.
   */
  clearClock() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Method which clear whole canvas and next draw clock.
   */
  repaint() {
    this.clearClock();
    this.drawClock(Clock.getTime());
  };
  
  /**
   * Method which start this clock. Timer 1s.
   */
  start() {
    this.calcClockSize();
    this.repaint();
    this.interval = setInterval(this.repaint.bind(this), 1000);
  }

  /**
   * Method which stop this clock.
   */
  stop() {
    clearInterval(this.interval);
  }
 
  /**
   * Static method which return actual date and time as a structure.
   * 
   * @return {struct} dateTime 
   */
  static getTime() {
    var now = new Date();
    return {
      Y: now.getFullYear(), M: now.getMonth() + 1, D: now.getDate(),
      h: now.getHours(), m: now.getMinutes(), s: now.getSeconds()
    };
  }

  static per33() { return 0.33; }
  static per66() { return 0.66; }
  static per80() { return 0.80; }
}