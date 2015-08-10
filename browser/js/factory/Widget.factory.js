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

  CircleWidget.prototype = { //300 X 300
      show : function(note, info1, info2,percentage) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'transparent';//this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Arc
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        //arc (x,y,r,sangle,eangle,counterclockwise)
        //100% = 2PIR
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, - Math.PI / 2.0, 2 * percentage * Math.PI - Math.PI/2);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillStyle = this.deltaColor;
        this.ctx.fill();
        this.ctx.closePath();

        //in arc USES DELTA
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, (4 * this.canvas.width) / 10, 0, 2*Math.PI);
        this.ctx.fillStyle = percentage > 0 ?this.okColor : this.bgColor;
        this.ctx.fill();
        this.ctx.closePath();

        //Show Note
        this.ctx.font =  Math.round(this.canvas.width/300*70) + 'pt Arial'; // x / 300 *70
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(note, this.canvas.width / 2, this.canvas.height / 2 + Math.round(this.canvas.width/300*15) );

        //Show info
        this.ctx.font = Math.round(this.canvas.width/300*20) + 'pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(info1, this.canvas.width / 2, this.canvas.height / 2 + Math.round(this.canvas.width/300*55) );

        //Show frequency
        this.ctx.font = Math.round(this.canvas.width/300*15) + 'pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(info2, this.canvas.width / 2, this.canvas.height / 2 + Math.round(this.canvas.width/300*85) );

      }
  };

  //Namespace declaration
  return CircleWidget;

});