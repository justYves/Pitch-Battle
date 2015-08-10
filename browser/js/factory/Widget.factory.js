app.factory('Widget', function() {

  //View a particular widget
  var CircleWidget = function(canvas, bgColor, deltaColor, okColor, fontColor) {
    //canvas use to draw
    this.canvas = canvas;
    //backgroud color
    this.bgColor = bgColor;
    //out circle color
    this.deltaColor = deltaColor;
    //inner circle color
    this.okColor = okColor;
    //text color
    this.fontColor = fontColor;

    //context use to draw
    this.ctx = this.canvas.getContext("2d");
  };

  CircleWidget.prototype = {
      show : function(note, info1, info2) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'transparent';//this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //out arc USES DELTA
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        // this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, - Math.PI / 2.0, - Math.PI / 2.0 + delta * Math.PI, delta <= 0);
        // this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
        // this.ctx.fillStyle = this.deltaColor;
        // this.ctx.fill();
        // this.ctx.closePath();

        //in arc USES DELTA
        // this.ctx.beginPath();
        // this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, (4 * this.canvas.width) / 10, 0, 2*Math.PI);
        // this.ctx.fillStyle = delta == 0 ?this.okColor : this.bgColor;
        // this.ctx.fill();
        // this.ctx.closePath();

        //Show Note
        this.ctx.font = '70pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(note, this.canvas.width / 2, this.canvas.height / 2 + 15);

        //Show info
        this.ctx.font = '20pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(info1, this.canvas.width / 2, this.canvas.height / 2 + 55);

        //Show frequency
        this.ctx.font = '15pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(info2, this.canvas.width / 2, this.canvas.height / 2 + 85);

      }
  };

  //Namespace declaration
  return CircleWidget;

});