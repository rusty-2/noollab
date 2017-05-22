define([], function() {
    function TextBuilder(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.text = "";
        this.style = {
          fontSize: '32px',
          fill: '#000'
        };
    }

    TextBuilder.prototype.setFontSize = function(fontSize) {
        this.style.fontSize = fontSize;
        return this;
    };

    TextBuilder.prototype.setX = function(x) {
        this.x = x;
        return this;
    };

    TextBuilder.prototype.setY = function(y) {
        this.y = y;
        return this;
    };

    TextBuilder.prototype.setText = function(text) {
        this.text = text;
        return this;
    };

    TextBuilder.prototype.middle = function () {
      this.setX(this.game.world.width / 2 - this.text.length*6);
      this.setY(this.game.world.height / 2 - 1);
      return this;
    };

    TextBuilder.prototype.bottom = function () {
      this.setX(10);
      this.setY(this.game.world.height - 60);
      return this;
    };

    TextBuilder.prototype.setColor = function(color) {
        this.style.fill = color;
        return this;
    };

    TextBuilder.prototype.build = function() {
        return this.game.add.text(this.x, this.y, this.text, this.style);
    };

    return TextBuilder;
});
